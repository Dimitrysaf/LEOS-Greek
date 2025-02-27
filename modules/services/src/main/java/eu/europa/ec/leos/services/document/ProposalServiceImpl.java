/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.document;

import com.google.common.base.Stopwatch;
import cool.graph.cuid.Cuid;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.ExternalSystemACLService;
import eu.europa.ec.leos.integration.dto.AccessDTO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.document.ProposalRepository;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.dto.collaborator.WorkflowCollaboratorDTO;
import eu.europa.ec.leos.services.exception.CollaboratorException;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import io.atlassian.fugue.Option;
import lombok.AllArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.support.ScopeNotActiveException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.context.request.RequestContextHolder;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor.createValueMap;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.getChildren;
import static eu.europa.ec.leos.services.support.XmlHelper.CLONED_CREATION_DATE;
import static eu.europa.ec.leos.services.support.XmlHelper.CLONED_PROPOSAL_REF;
import static eu.europa.ec.leos.services.support.XmlHelper.CLONED_STATUS;
import static eu.europa.ec.leos.services.support.XmlHelper.CLONED_TARGET_USER;
import static eu.europa.ec.leos.services.support.XmlHelper.COVERPAGE;
import static eu.europa.ec.leos.services.support.XmlHelper.XML_DOC_EXT;
import static eu.europa.ec.leos.services.utils.LanguageMapUtils.getTranslatedProposalReference;
import static eu.europa.ec.leos.util.LeosDomainUtil.CMIS_PROPERTY_SPLITTER;
import static eu.europa.ec.leos.util.LeosDomainUtil.getLeosDateFromString;

@AllArgsConstructor
public abstract class ProposalServiceImpl implements ProposalService {

    private static final Logger LOG = LoggerFactory.getLogger(ProposalServiceImpl.class);

    protected final ProposalRepository proposalRepository;
    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlContentProcessor xmlContentProcessor;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;
    private final PackageRepository packageRepository;
    private final XPathCatalog xPathCatalog;
    private final TableOfContentProcessor tableOfContentProcessor;
    private final MessageHelper messageHelper;
    protected final TrackChangesContext trackChangesContext;
    protected DocumentLanguageContext documentLanguageContext;
    protected SecurityContext securityContext;
    protected WorkflowCollaboratorService workflowCollaboratorService;
    protected ExternalSystemACLService externalSystemACLService;
    protected PackageService packageService;

    protected static final String PROPOSAL_NAME_PREFIX = "main";

    @Override
    public Proposal findProposal(String id) {
        LOG.trace("Finding Proposal... [id={}]", id);
        Proposal proposal = proposalRepository.findProposalById(id, true);
        try{
            if (RequestContextHolder.getRequestAttributes() != null) {
                trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
            }
        }catch(ScopeNotActiveException ex){
            LOG.error("Request scoped bean accessed in async call");
        }

        return proposal;
    }

    @Override
    public Proposal updateProposal(Proposal proposal, ProposalMetadata updatedMetadata, VersionType versionType, String comment) {
        LOG.trace("Updating Proposal... [id={}, metadata={}, versionType={}, comment={}]", proposal.getId(), updatedMetadata, versionType, comment);
        this.documentLanguageContext.setDocumentLanguage(proposal.getMetadata().get().getLanguage());
        byte[] xmlContent = getContent(proposal);
        byte[] updatedBytes = updateDataInXml(xmlContent, updatedMetadata);
        proposal = proposalRepository.updateProposal(proposal.getId(), updatedMetadata, updatedBytes, versionType, comment);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal updateProposal(Proposal proposal, ProposalMetadata metadata) {
        LOG.trace("Updating Proposal... [id={}, metadata={}]", proposal.getId(), metadata);
        proposal = proposalRepository.updateProposal(proposal.getMetadata().get().getRef(), proposal.getId(), metadata);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal updateProposal(String ref, String id, Map<String, Object> properties) {
        LOG.trace("Updating Proposal...with custom properties [id={}]", id);
        Proposal proposal = proposalRepository.updateProposal(ref, id, properties);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal updateProposal(String proposalId, byte[] updatedBytes) {
        Proposal proposal = proposalRepository.updateProposal(proposalId, updatedBytes);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal updateProposal(String proposalId, byte[] updatedBytes, Map<String, Object> properties) {
        Proposal proposal = proposalRepository.updateProposal(proposalId, updatedBytes, properties);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal updateProposalWithMilestoneComments(Proposal proposal, List<String> milestoneComments, VersionType versionType, String comment) {
        LOG.trace("Updating Proposal... [id={}, milestoneComments={}, major={}, comment={}]", proposal.getId(), milestoneComments, versionType, comment);
        final byte[] updatedBytes = getContent(proposal);
        proposal = proposalRepository.updateProposal(proposal.getId(), milestoneComments, updatedBytes, versionType, comment);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal updateProposalWithMilestoneComments(String ref, String proposalId, List<String> milestoneComments) {
        LOG.trace("Updating Proposal... [id={}, milestoneComments={}]", proposalId, milestoneComments);
        Proposal proposal = proposalRepository.updateMilestoneComments(ref, proposalId, milestoneComments);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal findProposalByPackagePath(String path) {
        LOG.trace("Finding Proposal by package path... [path={}]", path);
        // FIXME can be improved, now we dont fetch ALL docs because it's loaded later the one needed,
        List<Proposal> docs = packageRepository.findDocumentsByPackagePath(path, Proposal.class, false);
        if(!docs.isEmpty()){
            return findProposal(docs.get(0).getId());
        } else {
            return null;
        }
    }

    @Override
    @Async("delegatingSecurityContextAsyncTaskExecutor")
    public void updateProposalAsync(String documentRef, String comment) {
        LeosPackage leosPackage = packageRepository.findPackageByDocumentRef(documentRef, Proposal.class);
        Proposal proposal = this.findProposalByPackagePath(leosPackage.getPath());
        if (proposal != null) {
            Option<ProposalMetadata> metadataOption = proposal.getMetadata();
            ProposalMetadata metadata = metadataOption.get();
            if (StringUtils.isEmpty(comment)) {                                // Comment will be stored in cmis:checkinComment property.
                proposalRepository.updateProposal(proposal.getMetadata().get().getRef(), proposal.getId(), metadata); // This property only can be updated with a document checkout/checkin (creating new version).
            } else {                                                           // Then a new proposal version is created only when a comment is received.
                proposalRepository.updateProposal(proposal.getId(), metadata, getContent(proposal), VersionType.MINOR, comment);
            }
        }
    }

    protected byte[] updateDataInXml(final byte[] content, ProposalMetadata dataObject) {
        byte[] updatedBytes = xmlNodeProcessor.setValuesInXml(content, createValueMap(dataObject), xmlNodeConfigProcessor.getConfig(dataObject.getCategory()));
        return xmlContentProcessor.doXMLPostProcessing(updatedBytes);
    }

    @Override
    public Proposal addComponentRef(Proposal proposal, String href, LeosCategory leosCategory){
        LOG.trace("Add component in Proposal ... [id={}, href={}, leosCategory={}]", proposal.getId(), href, leosCategory.name());
        Stopwatch stopwatch = Stopwatch.createStarted();

        //create config
        Map<String, String> keyValueMap = new HashMap<>();
        keyValueMap.put(leosCategory.name() + "_href", href);

        this.documentLanguageContext.setDocumentLanguage(proposal.getMetadata().get().getLanguage());

        //Do the xml update
        byte[] xmlBytes = proposal.getContent().get().getSource().getBytes();
        byte[] updatedBytes = xmlNodeProcessor.setValuesInXml(xmlBytes,
                                keyValueMap,
                                xmlNodeConfigProcessor.getProposalComponentsConfig(leosCategory, "href"));
        updatedBytes = xmlContentProcessor.doXMLPostProcessing(updatedBytes);

        //save updated xml
        proposal = proposalRepository.updateProposal(proposal.getId(), updatedBytes);

        LOG.trace("Added component in Proposal ...({} milliseconds)", stopwatch.elapsed(TimeUnit.MILLISECONDS));
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal addComponent(Proposal proposal, String docId, LeosCategory leosCategory){
        LOG.trace("Add component in Proposal ... [id={}, href={}, leosCategory={}]", proposal.getId(), docId, leosCategory.name());
        Stopwatch stopwatch = Stopwatch.createStarted();

        //create config
        Map<String, String> keyValueMap = new HashMap<>();
        keyValueMap.put(leosCategory.name() + "_xml:id", docId);

        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        this.documentLanguageContext.setDocumentLanguage(proposal.getMetadata().get().getLanguage());

        //Do the xml update
        byte[] xmlBytes = proposal.getContent().get().getSource().getBytes();
        byte[] updatedBytes = xmlNodeProcessor.setValuesInXml(xmlBytes,
                keyValueMap,
                xmlNodeConfigProcessor.getProposalComponentsConfig(leosCategory, "xml:id"));
        updatedBytes = xmlContentProcessor.doXMLPostProcessing(updatedBytes);

        //save updated xml
        proposal = proposalRepository.updateProposal(proposal.getId(), updatedBytes);

        LOG.trace("Added component in Proposal ...({} milliseconds)", stopwatch.elapsed(TimeUnit.MILLISECONDS));
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal removeComponentRef(Proposal proposal, String href){
        LOG.trace("Removing component in Proposal ... [id={}, href={}]", proposal.getId(), href);
        Stopwatch stopwatch = Stopwatch.createStarted();

        byte[] xmlBytes = proposal.getContent().get().getSource().getBytes();
        byte[] updatedBytes = xmlContentProcessor.removeElements(xmlBytes, xPathCatalog.getXPathDocumentRefByHrefAttrFromProposal(href), 1);

        //save updated xml
        proposal = proposalRepository.updateProposal(proposal.getId(), updatedBytes);
        LOG.trace("Removed component in Proposal ...({} milliseconds)", stopwatch.elapsed(TimeUnit.MILLISECONDS));
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    protected byte[] getContent(Proposal proposal) {
        final Content content = proposal.getContent().getOrError(() -> "Proposal content is required!");
        return content.getSource().getBytes();
    }

    @Override
    public Proposal createVersion(String id, VersionType versionType, String comment) {
        LOG.trace("Creating Proposal version... [id={}, versionType={}, comment={}]", id, versionType, comment);
        Proposal proposal = findProposal(id);
        final ProposalMetadata metadata = proposal.getMetadata().getOrError(() -> "Proposal metadata is required!");
        final Content content = proposal.getContent().getOrError(() -> "Proposal content is required!");
        final byte[] contentBytes = content.getSource().getBytes();
        return proposalRepository.updateProposal(id, metadata, contentBytes, versionType, comment);
    }

    @Override
    public Proposal findProposalByRef(String ref) {
        LOG.trace("Finding Proposal by ref... [ref=" + ref + "]");
        Proposal proposal = proposalRepository.findProposalByRef(ref);
        if (!securityContext.hasPermission(proposal, LeosPermission.CAN_SEE_ALL_DOCUMENTS)) {
            doubleCheckPotentialWorkflowCollaborator(ref, proposal);
        }
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    private void doubleCheckPotentialWorkflowCollaborator(String ref, Proposal proposal) {
        String userName = securityContext.getUserName();
        Optional<Collaborator> collab = proposal.getCollaborators().stream()
                .filter(u -> u.getLogin().equals(userName))
                .findFirst();
        if (collab.isPresent()){
            return;//user exists naturally (not as an entity)
        }
        Optional<Collaborator> workflowCollaborator = proposal.getCollaborators().stream()
                .filter(u ->
                    u.getLeosClientId()!=null &&
                    securityContext.getUser().getEntities().stream()
                            .anyMatch(v -> v.getName().equals(u.getEntity()))
                ).findFirst();
        if (workflowCollaborator.isPresent()) { //remote call to ACL is needed
            Collaborator collaborator = workflowCollaborator.get();
            String leosClientId = collaborator.getLeosClientId();
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(ref, Proposal.class);
            Optional<WorkflowCollaboratorDTO> workflowCollaboratorDTO = workflowCollaboratorService.getCollaborators(leosPackage.getName(), leosClientId);
            if (workflowCollaboratorDTO.isPresent()) {
                WorkflowCollaboratorDTO workflowCollaboratorDTO1 = workflowCollaboratorDTO.get();
                String userCheckCallbackUrl = workflowCollaboratorDTO1.getUserCheckCallbackUrl();
                Optional<AccessDTO> accessDTO = externalSystemACLService.getAccess(userCheckCallbackUrl, userName);
                if (!accessDTO.isPresent()) {
                    throw new CollaboratorException(messageHelper.getMessage("collaborator.message.workflow-user.notPresent",
                            userName,
                            securityContext.getUser().getConnectedEntity(),
                            workflowCollaboratorDTO1.getClientSystemId(),
                            userCheckCallbackUrl));
                }
            }

        }
    }

    @Override
    public LeosDocument findConfigByName(String name) {
        LOG.trace("Finding Config by name... [name=" + name + "]");
        LeosDocument config = proposalRepository.findConfigByName(name);
        return config;
    }

    @Override
    public CloneProposalMetadataVO getClonedProposalMetadata(byte[] xmlContent) {
        CloneProposalMetadataVO cloneProposalMetadataVO = new CloneProposalMetadataVO();
        try {
            boolean isClonedProposal = xmlContentProcessor.evalXPath(xmlContent, xPathCatalog.getXPathClonedProposal(), true);
            if (isClonedProposal) {
                String clonedFromRef = xmlContentProcessor.getElementValue(xmlContent, xPathCatalog.getXPathRefOriginForCloneRefAttr(), true);
                String legFileName = xmlContentProcessor.getElementValue(xmlContent, xPathCatalog.getXPathRefOriginForCloneOriginalMilestone(), true);
                String iscRef = xmlContentProcessor.getElementValue(xmlContent, xPathCatalog.getXPathRefOriginForCloneIscRef(), true);
                String clonedFromObjectId = xmlContentProcessor.getElementValue(xmlContent, xPathCatalog.getXPathRefOriginForCloneObjectId(), true);

                cloneProposalMetadataVO.setClonedFromRef(clonedFromRef);
                cloneProposalMetadataVO.setClonedFromObjectId(clonedFromObjectId);
                cloneProposalMetadataVO.setLegFileName(legFileName);
                cloneProposalMetadataVO.setOriginRef(iscRef);
                cloneProposalMetadataVO.setClonedProposal(true);
            }
        } catch (Exception e) {
            LOG.error("Error occurred while evaluation xpath expression", e);
        }
        return cloneProposalMetadataVO;
    }

    @Override
    public void removeClonedProposalMetadata(String proposalId, String clonedProposalId, CloneProposalMetadataVO cloneProposalMetadataVO) {
        Proposal originalProposal = findProposal(proposalId);
        byte[] xmlContent = originalProposal.getContent().getOrThrow(() ->
                new IllegalArgumentException("Proposal not found")).getSource().getBytes();

        String clonedProposalsXPath = xPathCatalog.getXPathClonedProposals();
        boolean clonedProposalsPresent = xmlContentProcessor.evalXPath(xmlContent, clonedProposalsXPath, true);

        if(clonedProposalsPresent) {
            byte[] updatedProposalContent;
            String legFileName = cloneProposalMetadataVO.getLegFileName();
            String countClonedProposalXpath = xPathCatalog.getXPathCPMilestoneRefClonedProposalRefByRefAttr(legFileName, clonedProposalId) + "/../akn:clonedProposalRef";
            int clonedProposalsCount = xmlContentProcessor.getElementCountByXpath(xmlContent, countClonedProposalXpath, true);
            if(clonedProposalsCount == 1) {
                String countMilestonesXpath = xPathCatalog.getXPathCPMilestoneRef();
                int milestoneCount = xmlContentProcessor.getElementCountByXpath(xmlContent, countMilestonesXpath, true);
                if(milestoneCount == 1) {
                    updatedProposalContent = xmlContentProcessor.removeElement(xmlContent, clonedProposalsXPath, true);
                } else {
                    updatedProposalContent = xmlContentProcessor.removeElement(xmlContent, xPathCatalog.getXPathCPMilestoneRefClonedProposalRefByRefAttr(legFileName, clonedProposalId) + "/..", true);
                }
            } else {
                updatedProposalContent = xmlContentProcessor.removeElement(xmlContent, xPathCatalog.getXPathCPMilestoneRefClonedProposalRefByRefAttr(legFileName, clonedProposalId), true);
            }
            updateProposal(proposalId, updatedProposalContent);
        }
    }

    @Override
    public List<CloneProposalMetadataVO> getClonedProposalMetadataVOs(String proposalId, String legDocumentName, String docVersion) {
        Proposal proposal = findProposal(proposalId);
        List<CloneProposalMetadataVO> clonedProposalMetadataVOs = new ArrayList<>();
        byte[] xmlContent = proposal.getContent().get().getSource().getBytes();

        String xPath = xPathCatalog.getXPathCPMilestoneRefByNameAndVersionAttr(legDocumentName, docVersion);
        Document document = createXercesDocument(xmlContent);
        Node node = XercesUtils.getFirstElementByXPath(document, xPath);

        if (node != null) {
            List<Node> clonedList = getChildren(node, CLONED_PROPOSAL_REF);
            for (int i = 0; i < clonedList.size(); i++) {
                CloneProposalMetadataVO cloneProposalMetadataVO = new CloneProposalMetadataVO();
                Node cloned = clonedList.get(i);
                String clonedProposalRef = cloned.getAttributes().item(0).getNodeValue();
                // Cloned proposals with contribution marked as done are listed in the cloned milestone ids property
                boolean isContributionDone = proposal.getClonedMilestoneIds().stream().filter(c -> {
                    if(c.startsWith(clonedProposalRef)) {
                        cloneProposalMetadataVO.setRevisionStatus(messageHelper.getMessage("clone.proposal.status.contribution.done"));
                        String[] milestoneIds = c.split(CMIS_PROPERTY_SPLITTER);
                        cloneProposalMetadataVO.setLegFileName(milestoneIds[1]);
                        cloneProposalMetadataVO.setCloneProposalRef(clonedProposalRef);
                        return true;
                    } else {
                        cloneProposalMetadataVO.setRevisionStatus(XercesUtils.getChildContent(cloned, CLONED_STATUS));
                        return false;
                    }
                }).count() > 0;

                String targetUser = XercesUtils.getChildContent(cloned, CLONED_TARGET_USER);
                String creationDate = XercesUtils.getChildContent(cloned, CLONED_CREATION_DATE);
                String status = isContributionDone ?
                        messageHelper.getMessage("clone.proposal.status.contribution.done") :
                        XercesUtils.getChildContent(cloned, CLONED_STATUS);
                cloneProposalMetadataVO.setTargetUser(targetUser);
                cloneProposalMetadataVO.setCreationDate(getLeosDateFromString(creationDate));
                cloneProposalMetadataVO.setRevisionStatus(status);

                clonedProposalMetadataVOs.add(cloneProposalMetadataVO);
            }
        }
        clonedProposalMetadataVOs.sort(Comparator.comparing(CloneProposalMetadataVO::getCreationDate).reversed());
        return clonedProposalMetadataVOs;
    }
    
    @Override
	public Map<String, String> getExplanatoryDocumentRef(byte[] xmlContent) {
		Map<String, String> hrefIdMap = new HashMap<String, String>();
        List<Map<String, String>> attrsElts = xmlContentProcessor.getElementsAttributesByPath(xmlContent, xPathCatalog.getXPathDocumentRefForExplanatory());
        attrsElts.forEach(element -> {
            if (element.containsKey("xml:id") && element.containsKey("href")) {
                hrefIdMap.put(element.get("href"), element.get("xml:id"));
            }
        });
        return hrefIdMap;
    }

    @Override public Proposal findProposal(String id, boolean latest) {
        LOG.trace("Finding Memorandum... [id={}]", id);
        Proposal proposal = proposalRepository.findProposalById(id, latest);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override public Proposal findProposalVersion(String id) {
        LOG.trace("Finding Proposal version... [id={}]", id);
        Proposal proposal = proposalRepository.findProposalById(id, false);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override public Proposal updateProposal(Proposal proposal, byte[] content,  VersionType versionType, String comment) {
        LOG.trace("Updating Proposal Xml Content... [id={}]", proposal.getId());
        ProposalMetadata updatedMetadata = proposal.getMetadata().get()
                .builder()
                .withPurpose(getPurposeFromXml(content))
                .build();
        proposal = proposalRepository.updateProposal(proposal.getId(), updatedMetadata, content, versionType, comment);

        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override public Proposal updateProposal(String ref, String proposalId, ProposalMetadata metadata) {
        LOG.trace("Updating Proposal Xml Content... [id={}]", proposalId);
        Proposal proposal =  proposalRepository.updateProposal(ref, proposalId, metadata);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override public Proposal updateProposal(String ref, String id, Map<String, Object> properties, boolean latest) {
        LOG.trace("Updating Proposal metadata properties...");
        Proposal proposal = proposalRepository.updateProposal(ref, id, properties, latest);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override public Proposal updateProposal(Proposal proposal, byte[] updatedProposalContent, String comment) {
        LOG.trace("Updating Proposal Xml Content... [id={}]", proposal.getId());
        return this.updateProposal(proposal, updatedProposalContent, VersionType.MINOR, comment);
    }

    @Override public List<TableOfContentItemVO> getCoverPageTableOfContent(Proposal proposal, TocMode mode) {
        Validate.notNull(proposal, "Proposal is required");
        final Content content = proposal.getContent().getOrError(() -> "Proposal content is required!");
        final byte[] proposalContent = content.getSource().getBytes();
        return tableOfContentProcessor.buildTableOfContent(COVERPAGE, proposalContent, mode);
    }

    @Override public List<Proposal> findVersions(String id) {
        LOG.trace("Finding Memorandum versions... [id={}]", id);
        return proposalRepository.findProposalVersions(id, false);
    }

    @Override public List<VersionVO> getAllVersions(String documentId, String docRef, int pageIndex, int pageSize) {
        List<Proposal> majorVersions = findAllMajors(docRef, pageIndex, pageSize);
        LOG.trace("Found {} majorVersions for [id={}]", majorVersions.size(), documentId);

        List<VersionVO> majorVersionsVO = VersionsUtil.buildVersionVO(majorVersions, messageHelper);
        return majorVersionsVO;
    }

    @Override public List<Proposal> findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults) {
        return proposalRepository.findAllMinorsForIntermediate(docRef, currIntVersion, startIndex, maxResults);
    }

    @Override public int findAllMinorsCountForIntermediate(String docRef, String currIntVersion) {
        return proposalRepository.findAllMinorsCountForIntermediate(docRef, currIntVersion);
    }

    @Override public Integer findAllMajorsCount(String docRef) {
        return proposalRepository.findAllMajorsCount(docRef);
    }

    @Override public List<Proposal> findAllMajors(String docRef, int startIndex, int maxResults) {
        return proposalRepository.findAllMajors(docRef, startIndex, maxResults);
    }

    @Override public List<Proposal> findRecentMinorVersions(String documentId, String documentRef, int startIndex, int maxResults) {
        return proposalRepository.findRecentMinorVersions(documentId, documentRef, startIndex, maxResults);
    }

    @Override public Integer findRecentMinorVersionsCount(String documentId, String documentRef) {
        return proposalRepository.findRecentMinorVersionsCount(documentId, documentRef);
    }

    @Override public XmlDocument findFirstVersion(String ref) {
        return proposalRepository.findFirstVersion(ref);
    }

    @Override
    public String getPurposeFromXml(byte[] xml) {
        String content = new String(xml, StandardCharsets.UTF_8);
        return content.substring(content.indexOf(">", content.indexOf("<docPurpose")) + 1, content.indexOf("</docPurpose>"));
    }

    @Override
    public Proposal getProposalByRef(String ref) {
        Proposal proposal =  proposalRepository.getProposalByRef(ref);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public String getOriginalMilestoneName(String docName, byte[] xmlContent) {
        return xmlContentProcessor.getOriginalMilestoneName(docName, xmlContent);
    }

    @Override
    public Proposal createProposal(String templateId, String path, ProposalMetadata metadata, byte[] content) {
        LOG.trace("Creating Proposal... [templateId={}, path={}, metadata={}]", templateId, path, metadata);
        documentLanguageContext.setDocumentLanguage(metadata.getLanguage());
        String ref = generateProposalReference(metadata.getLanguage());
        String creationOptions = metadata.getCreationOptions();
        metadata = metadata
                .builder()
                .withRef(ref)
                .build();
        metadata.setCreationOptions(creationOptions);
        Proposal proposal = proposalRepository.createProposal(templateId, path, ref + XML_DOC_EXT, metadata);
        LOG.info("Created Proposal ref {} in path {}", ref, path);
        byte[] updatedBytes = updateDataInXml((content == null) ? getContent(proposal) : content, metadata);
        proposal = proposalRepository.updateProposal(proposal.getId(), updatedBytes);
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    @Override
    public Proposal createProposalFromContent(String path, ProposalMetadata metadata, DocumentVO proposalDocument,
            Boolean translated) {
        LOG.trace("Creating Proposal From Content... [path={}, metadata={}]", path, metadata);
        documentLanguageContext.setDocumentLanguage(metadata.getLanguage());
        String ref;
        if(translated) {
            ref = getTranslatedProposalReference(proposalDocument.getRef(), metadata.getLanguage());
        } else {
            ref = generateProposalReference(metadata.getLanguage());
        }
        String creationOptions = metadata.getCreationOptions();
        metadata = metadata
                .builder()
                .withRef(ref)
                .build();
        metadata.setCreationOptions(creationOptions);
        Proposal proposal = proposalRepository.createProposalFromContent(path, ref + XML_DOC_EXT, metadata, updateDataInXml(proposalDocument.getSource(), metadata));
        trackChangesContext.setTrackChangesEnabled(proposal.isTrackChangesEnabled());
        return proposal;
    }

    protected String generateProposalReference(String language) {
        return PROPOSAL_NAME_PREFIX + "-" + Cuid.createCuid() + "-" + language.toLowerCase();
    }
}
