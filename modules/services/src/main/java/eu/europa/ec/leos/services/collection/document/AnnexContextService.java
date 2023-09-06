/*
 * Copyright 2017 European Commission
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
package eu.europa.ec.leos.services.collection.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.SecurityService;
import eu.europa.ec.leos.services.store.TemplateService;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Scope("prototype")
public class AnnexContextService {

    private static final Logger LOG = LoggerFactory.getLogger(AnnexContextService.class);
    private static final String ANNEX_PACKAGE_IS_REQUIRED = "Annex package is required!";
    private static final String ANNEX_PURPOSE_IS_REQUIRED = "Annex purpose is required!";
    private static final String ANNEX_TYPE_IS_REQUIRED = "Annex type is required!";
    private static final String ANNEX_NUMBER_IS_REQUIRED = "Annex number is required";
    private static final String ANNEX_METADATA_IS_REQUIRED = "Annex metadata is required!";

    private final TemplateService templateService;
    private final AnnexService annexService;
    private final ProposalService proposalService;
    private final SecurityService securityService;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;

    private LeosPackage leosPackage;
    private Annex annex = null;
    private int index;
    private String purpose = null;
    private String type = null;
    private String template = null;
    private String annexId = null;
    private List<Collaborator> collaborators = null;

    private DocumentVO annexDocument;
    private final Map<ContextActionService, String> actionMsgMap;
    private String annexNumber;
    private String versionComment;
    private String milestoneComment;
    private boolean eeaRelevance;
    private boolean cloneProposal = false;

    public AnnexContextService(
            TemplateService templateService,
            AnnexService annexService,
            ProposalService proposalService, SecurityService securityService, RepositoryPropertiesMapper repositoryPropertiesMapper) {
        this.templateService = templateService;
        this.annexService = annexService;
        this.proposalService = proposalService;
        this.securityService = securityService;
        this.actionMsgMap = new EnumMap<>(ContextActionService.class);
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
    }

    public void useTemplate(String template) {
        Validate.notNull(template, "Template name is required!");

        this.annex = (Annex) templateService.getTemplate(template);
        Validate.notNull(annex, "Template not found! [name=%s]", template);
        this.template = template;
        LOG.trace("Using {} template... [id={}, name={}]", annex.getCategory(), annex.getId(), annex.getName());
    }

    public void useActionMessageMap(Map<ContextActionService, String> messages) {
        Validate.notNull(messages, "Action message map is required!");

        actionMsgMap.putAll(messages);
    }

    public void usePackage(LeosPackage leosPackage) {
        Validate.notNull(leosPackage, ANNEX_PACKAGE_IS_REQUIRED);
        LOG.trace("Using Annex package... [id={}, path={}]", leosPackage.getId(), leosPackage.getPath());
        this.leosPackage = leosPackage;
    }

    public void usePurpose(String purpose) {
        Validate.notNull(purpose, ANNEX_PURPOSE_IS_REQUIRED);
        LOG.trace("Using Annex purpose... [purpose={}]", purpose);
        this.purpose = purpose;
    }
    
    public void useType(String type) {
        Validate.notNull(type, ANNEX_TYPE_IS_REQUIRED);
        LOG.trace("Using Annex type... [type={}]", type);
        this.type = type;
    }
    
    public void useIndex(int index) {
        Validate.notNull(index, "Annex index is required!");
        LOG.trace("Using Annex index... [index={}]", index);
        this.index = index;
    }

    public void useAnnexId(String annexId) {
        Validate.notNull(annexId, "Annex 'annexId' is required!");
        LOG.trace("Using AnnexId'... [annexId={}]", annexId);
        this.annexId = annexId;
    }

    public void useDocument(DocumentVO document) {
        Validate.notNull(document, "Annex document is required!");
        annexDocument = document;
    }

    public void useCollaborators(List<Collaborator> collaborators) {
        Validate.notNull(collaborators, "Annex 'collaborators' are required!");
        LOG.trace("Using collaborators'... [collaborators={}]", collaborators);
        this.collaborators = Collections.unmodifiableList(collaborators);
    }

    public void useAnnexNumber(String annexNumber) {
        Validate.notNull(annexNumber, "Annex Number is required!");
        this.annexNumber = annexNumber;
    }

    public void useVersionComment(String comment) {
        Validate.notNull(comment, "Version comment is required!");
        this.versionComment = comment;
    }

    public void useMilestoneComment(String milestoneComment) {
        Validate.notNull(milestoneComment, "milestoneComment is required!");
        this.milestoneComment = milestoneComment;
    }
    
    public void useActionMessage(ContextActionService action, String actionMsg) {
        Validate.notNull(actionMsg, "Action message is required!");
        Validate.notNull(action, "Context Action not found! [name=%s]", action);

        LOG.trace("Using action message... [action={}, name={}]", action, actionMsg);
        actionMsgMap.put(action, actionMsg);
    }

    public void useEeaRelevance(boolean eeaRelevance) {
        LOG.trace("Using Proposal eeaRelevance... [eeaRelevance={}]", eeaRelevance);
        this.eeaRelevance = eeaRelevance;
    }

    public void useCloneProposal(boolean cloneProposal) {
        this.cloneProposal = cloneProposal;
    }

    public Annex executeCreateAnnex() {
        LOG.trace("Executing 'Create Annex' use case...");

        Validate.notNull(leosPackage, ANNEX_PACKAGE_IS_REQUIRED);
        Validate.notNull(annex, "Annex template is required!");
        Validate.notNull(collaborators, "Annex collaborators are required!");
        Validate.notNull(annexNumber, ANNEX_NUMBER_IS_REQUIRED);

        Option<AnnexMetadata> metadataOption = annex.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), ANNEX_METADATA_IS_REQUIRED);

        Validate.notNull(purpose, ANNEX_PURPOSE_IS_REQUIRED);
        Validate.notNull(type, ANNEX_TYPE_IS_REQUIRED);
        
        AnnexMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withIndex(index)
                .withNumber(annexNumber)
                .withType(type)
                .withTemplate(template)
                .build();

        annex = annexService.createAnnex(annex.getId(), leosPackage.getPath(), metadata, actionMsgMap.get(ContextActionService.ANNEX_METADATA_UPDATED), null);
        annex = securityService.updateCollaborators(annex.getId(), collaborators, Annex.class);

        return annexService.createVersion(annex.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public Annex executeImportAnnex() {
        LOG.trace("Executing 'Import Annex' use case...");
        Validate.notNull(leosPackage, ANNEX_PACKAGE_IS_REQUIRED);
        Validate.notNull(annex, "Annex template is required!");
        Validate.notNull(collaborators, "Annex collaborators are required!");
        Validate.notNull(annexNumber, ANNEX_NUMBER_IS_REQUIRED);
        Validate.notNull(purpose, ANNEX_PURPOSE_IS_REQUIRED);
        Validate.notNull(type, ANNEX_TYPE_IS_REQUIRED);
        
        final String actionMessage = actionMsgMap.get(ContextActionService.ANNEX_BLOCK_UPDATED);
        AnnexMetadata metadataDocument = (AnnexMetadata) annexDocument.getMetadataDocument();
        metadataDocument = metadataDocument
                .builder()
                .withPurpose(purpose)
                .withEeaRelevance(eeaRelevance)
                .build();
        annex = annexService.createAnnexFromContent(leosPackage.getPath(), metadataDocument, actionMessage, annexDocument.getSource(), annexDocument.getName());
        annex = securityService.updateCollaborators(annex.getId(), collaborators, Annex.class);
        if (cloneProposal) {
            Map<String, Object> annexProperties = new HashMap<>();
            annexProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), annexDocument.getId());
            annexProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), true);
            annex = annexService.updateAnnex(annex.getId(), annexProperties, true);
        }
        return annexService.createVersion(annex.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public void executeUpdateAnnexMetadata() {
        LOG.trace("Executing 'Update annex metadata' use case...");
        Validate.notNull(purpose, ANNEX_PURPOSE_IS_REQUIRED);
        Validate.notNull(annexId, "Annex id is required!");

        annex = annexService.findAnnex(annexId, true);
        Option<AnnexMetadata> metadataOption = annex.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), ANNEX_METADATA_IS_REQUIRED);

        // Updating only purpose at this time. other metadata needs to be set, if needed
        AnnexMetadata annexMetadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withEeaRelevance(eeaRelevance)
                .build();
        annexService.updateAnnex(annex, annexMetadata, VersionType.MINOR, actionMsgMap.get(ContextActionService.METADATA_UPDATED));
    }

    public void executeUpdateAnnexIndex() {
        LOG.trace("Executing 'Update annex index' use case...");
        Validate.notNull(annexId, "Annex id is required!");
        Validate.notNull(index, "Annex index is required!");
        Validate.notNull(annexNumber, ANNEX_NUMBER_IS_REQUIRED);
        Validate.notNull(actionMsgMap, "Action Map is required");
        annex = annexService.findAnnex(annexId, true);
        Option<AnnexMetadata> metadataOption = annex.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), ANNEX_METADATA_IS_REQUIRED);
        AnnexMetadata metadata = metadataOption.get();
        AnnexMetadata annexMetadata = metadata
                .builder()
                .withIndex(index)
                .withNumber(annexNumber)
                .build();
        annex = annexService.updateAnnex(annex, annexMetadata, VersionType.MINOR, actionMsgMap.get(ContextActionService.ANNEX_METADATA_UPDATED));
    }

    public void executeUpdateAnnexStructure() {
        byte[] xmlContent = getContent(annex); //Use the content from template
        annex = annexService.findAnnex(annexId, true); //Get the existing annex document
        
        Option<AnnexMetadata> metadataOption = annex.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), ANNEX_METADATA_IS_REQUIRED);
        AnnexMetadata metadata = metadataOption.get();
        AnnexMetadata annexMetadata = metadata
                .builder()
                .withPurpose(metadata.getPurpose())
                .withType(metadata.getType())
                .withTitle(metadata.getTitle())
                .withTemplate(template)
                .withDocVersion(metadata.getDocVersion())
                .withDocTemplate(template)
                .build();
        
        annex = annexService.updateAnnex(annex, xmlContent, annexMetadata, VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.ANNEX_STRUCTURE_UPDATED));
    }
    
    private byte[] getContent(Annex annex) {
        final Content content = annex.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }

    public void executeCreateMilestone() {
        annex = annexService.findAnnex(annexId, true);
        List<String> milestoneComments = annex.getMilestoneComments();
        milestoneComments.add(milestoneComment);
        if (annex.getVersionType().equals(VersionType.MAJOR)) {
            annex = annexService.updateAnnexWithMilestoneComments(annex.getId(), milestoneComments);
            LOG.info("Major version {} already present. Updated only milestoneComment for [annex={}]", annex.getVersionLabel(), annex.getId());
        } else {
            annex = annexService.updateAnnexWithMilestoneComments(annex, milestoneComments, VersionType.MAJOR, versionComment);
            LOG.info("Created major version {} for [annex={}]", annex.getVersionLabel(), annex.getId());
        }
    }

    public String getUpdatedAnnexId() {
        return annex.getId();
    }
    
    public String getProposalId() {
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal != null ? proposal.getId() : null;
    }
}
