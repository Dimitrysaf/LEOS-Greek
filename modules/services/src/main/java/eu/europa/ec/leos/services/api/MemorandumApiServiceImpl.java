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
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.event.DocumentUpdatedByCoEditorEvent;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.coedition.InfoType;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.http.MethodNotSupportedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Collections;
import java.util.List;

@Service("memorandum")
public class MemorandumApiServiceImpl implements MemorandumApiService {

    @Autowired
    MemorandumService memorandumService;
    @Autowired
    CloneContext cloneContext;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    DocumentViewService<Memorandum> documentViewService;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    ComparisonDelegateAPI<Memorandum> comparisonDelegate;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    SearchService searchService;
    @Autowired
    ElementProcessor<Memorandum> elementProcessor;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    TemplateConfigurationService templateConfigurationService;

    private Provider<StructureContext> structureContext;

    private static final Logger LOG = LoggerFactory.getLogger(MemorandumApiServiceImpl.class);


    MemorandumApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        Memorandum memorandum = memorandumService.findMemorandumByRef(documentRef);
        return this.documentViewService.getDocumentView(memorandum);
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode tocMode) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.memorandumService.getTableOfContent(memorandum, TocMode.SIMPLIFIED);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Memorandum bill = this.memorandumService.findMemorandumByRef(documentRef);
        return this.elementProcessor.getElement(bill, elementName, elementId);
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        throw new MethodNotSupportedException("Delete isn't supported");
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        byte[] newXmlContent = elementProcessor.updateElement(memorandum, elementName, elementId, elementFragment, false);
        memorandum = memorandumService.updateMemorandum(memorandum, newXmlContent, VersionType.MINOR, messageHelper.getMessage("operation." + elementName + ".updated"));
        return this.documentViewService.getDocumentView(memorandum);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        throw new UnsupportedOperationException("Insert element isn't supported for memorandum");
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        throw new UnsupportedOperationException("Merge element isn't supported for memorandum");
    }

    @Override
    public List<VersionVO> getRecentMinorVersions(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        Integer recentCount = this.memorandumService.findRecentMinorVersionsCount(memorandum.getId(), documentRef);
        List<Memorandum> memorandums = this.memorandumService.findRecentMinorVersions(memorandum.getId(), documentRef, 0, recentCount);
        return VersionsUtil.buildVersionVO(memorandums, messageHelper);

    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        List<VersionVO> versions = this.memorandumService.getAllVersions(memorandum.getId(), documentRef);
        for (VersionVO versionVO : versions) {
            Integer count = this.memorandumService.findAllMinorsCountForIntermediate(documentRef, versionVO.getCmisVersionNumber());
            versionVO.setSubVersions(VersionsUtil.buildVersionVO(this.memorandumService.findAllMinorsForIntermediate(documentRef, versionVO.getCmisVersionNumber(), 0, count), messageHelper));
        }
        return versions;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        Memorandum newVersion = this.memorandumService.createVersion(memorandum.getId(), versionType, checkInComment);
        return this.memorandumService.getAllVersions(memorandum.getId(), documentRef);
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) throws MethodNotSupportedException {
        throw new MethodNotSupportedException("Save toc method not allowed for Memorandum type document");
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) throws Exception {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        matches = searchService.searchText(getContent(memorandum), searchText, matchCase, completeWords);
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        final Memorandum memorandum = memorandumService.findMemorandumVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(memorandum, "", securityContext.getPermissions(memorandum));
        VersionInfoVO versionInfo = this.documentViewService.getVersionInfo(memorandum);
        return new DocumentViewResponse(null, versionContent, versionInfo);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Memorandum oldVersion = memorandumService.findMemorandumVersion(oldVersionId);
        Memorandum newVersion = memorandumService.findMemorandumVersion(newVersionId);
        return comparisonDelegate.getMarkedContent(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        return null;
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Memorandum bill = this.memorandumService.findMemorandumByRef(documentRef);
        String jsonAlternatives = "";
        try {
            String element = this.elementProcessor.getElement(bill, elementTagName, elementId);
            return new EditElementResponse(
                    elementId, elementTagName, element, jsonAlternatives);
        } catch (Exception ex) {
            LOG.error("Exception while edit element operation for ", ex);
            throw new RuntimeException(ex);
        }
    }

    private byte[] getContent(Memorandum memorandum) {
        final Content content = memorandum.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private String getProposalRef(String documentId) {
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        Proposal proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal.getMetadata().getOrNull().getRef();
    }

}
