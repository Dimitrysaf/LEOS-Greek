/*
 * Copyright 2023 European Commission
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

package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.Content;
import eu.europa.ec.leos.domain.cmis.LeosCategory;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.event.DocumentUpdatedByCoEditorEvent;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.services.user.UserHelperAPI;
import eu.europa.ec.leos.vo.coedition.InfoType;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.http.MethodNotSupportedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service("coverPage")
public class CoverPageApiServiceImpl implements CoverPageApiService {

    @Autowired
    ProposalService proposalService;
    @Autowired
    DocumentViewService<Proposal> documentViewService;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    UserHelperAPI userHelper;
    @Autowired
    ComparisonDelegateAPI<Proposal> comparisonDelegate;
    @Autowired
    SearchService searchService;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    ElementProcessor elementProcessor;
    @Autowired
    XmlContentProcessor xmlContentProcessor;
    private static final DateTimeFormatter dateFormatter =  DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());


    private Provider<StructureContext> structureContext;

    CoverPageApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        VersionInfoVO versionInfoVO = getVersionInfo(proposal);
        String editableXml = getEditableXml(proposal);
        return new DocumentViewResponse(proposal.getOriginRef(),editableXml,versionInfoVO);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        this.setStructureContext(proposal.getMetadata().getOrError(() -> "Cover Page metadata is required!").getDocTemplate());
        return this.proposalService.getCoverPageTableOfContent(proposal, TocMode.SIMPLIFIED);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        String element = elementProcessor.getElement(proposal, elementName, elementId);
        return element;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId)  {
        throw new UnsupportedOperationException("Delete isn't supported for cover page");
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) {
        String docPurpose = proposalService.getPurposeFromXml(elementFragment.getBytes());

        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        List<Element> docPurposeElements = xmlContentProcessor.getElementsByTagName(proposalContent, Arrays.asList("docPurpose"), false);
        // Check if new doc purpose is not empty
        if (docPurpose != null && docPurpose.trim().replaceAll("(^\\h*)|(\\h*$)", "").length() > 0) {

            byte[] newXmlContent = !docPurposeElements.isEmpty() ?  xmlContentProcessor.replaceElementById(proposalContent, elementFragment,
                    docPurposeElements.get(0).getElementId()) : null;

            if (newXmlContent == null) {
                return null;
            }

            proposal = proposalService.updateProposal(proposal, newXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.docpurpose.updated"));
        }
        return this.documentViewService.getDocumentView(proposal);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        throw new UnsupportedOperationException("Delete isn't supported for cover page");
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        throw new UnsupportedOperationException("Delete isn't supported for cover page");
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        Integer recentCount = this.proposalService.findRecentMinorVersionsCount(proposal.getId(), documentRef);
        return null;
//        return this.proposalService.findRecentMinorVersions(proposal.getId(), documentRef, 0, recentCount);
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        List<VersionVO> versions = this.proposalService.getAllVersions(proposal.getId(),documentRef);
        for(VersionVO versionVO : versions) {
            Integer count = this.proposalService.findAllMinorsCountForIntermediate(documentRef,versionVO.getCmisVersionNumber());
            versionVO.setSubVersions(VersionsUtil.buildVersionVO(this.proposalService.findAllMinorsForIntermediate(documentRef,versionVO.getCmisVersionNumber(),0,count), messageHelper));
        }
        return versions;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Proposal proposal = this.proposalService.findProposalByRef(documentRef);
        this.setStructureContext(proposal.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        return null;
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        throw new MethodNotSupportedException("Save toc method not allowed for Memorandum type document");
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception  {
        Proposal coverpage = this.proposalService.getProposalByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        matches = searchService.searchText(getContent(coverpage), searchText, matchCase, completeWords);
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        final Proposal version = proposalService.findProposalVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(version, "", securityContext.getPermissions(version), true);
        final VersionInfoVO versionInfo = this.documentViewService.getVersionInfo(version);
        return new DocumentViewResponse(null,versionContent,versionInfo);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        final Proposal oldVersion = proposalService.findProposalVersion(oldVersionId);
        final Proposal newVersion = proposalService.findProposalVersion(newVersionId);
        String comparedContent = comparisonDelegate.getMarkedContent(oldVersion, newVersion, true);
        return comparedContent;
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Proposal targetVersion = proposalService.findProposalVersion(versionId);
        Proposal sourceVersion = proposalService.findProposalVersion(documentRef);
        byte[] resultXmlContent = getContent(targetVersion);
        Proposal updatedProposal = proposalService.updateProposal(sourceVersion, resultXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.restore.version", targetVersion.getVersionLabel()));
        return this.documentViewService.getDocumentView(updatedProposal);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Proposal proposal = this.proposalService.getProposalByRef(documentRef);
        String element = this.elementProcessor.getElement(proposal, elementTagName, elementId);
        String jsonAlternatives = "";
        return new EditElementResponse(
                elementId,elementTagName,element,jsonAlternatives);
    }

    private byte[] getContent(Proposal proposal) {
        final Content content = proposal.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private DocumentVO getCoverPageVO(DocumentVO proposalVO,String  proposalRef) {
        DocumentVO coverPageVO = new DocumentVO(proposalVO.getId(),
                proposalVO.getMetadata().getLanguage() != null ? proposalVO.getMetadata().getLanguage() : "EN",
                LeosCategory.COVERPAGE,
                proposalVO.getUpdatedBy(),
                proposalVO.getUpdatedOn());
        coverPageVO.getMetadata().setInternalRef(proposalRef);
        coverPageVO.setSource(documentContentService.getCoverPageContent(proposalVO.getSource()));
        return coverPageVO;
    }

    private String getEditableXml(Proposal proposal) {
        securityContext.getPermissions(proposal);
        byte[] coverPageContent = new byte[0];
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(proposalContent);
        if(isCoverPageExists) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(proposal, "", securityContext, coverPageContent);
        editableXml = XmlHelper.removeSelfClosingElements(editableXml);
        return StringEscapeUtils.unescapeXml(editableXml);
    }
    private VersionInfoVO getVersionInfo(XmlDocument document){
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName(): "",
                dateFormatter.format(document.getLastModificationInstant()),
                document.getVersionType());
    }
}
