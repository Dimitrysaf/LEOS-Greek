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
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.bouncycastle.util.Pack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
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

    private Provider<StructureContext> structureContext;

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
        return  this.memorandumService.getTableOfContent(memorandum, TocMode.SIMPLIFIED);
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        return null;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        return null;
    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementFragment) {
        return null;
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        return null;
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        return null;
    }

    @Override
    public List<Memorandum> getRecentMinorVersions(String documentRef) {
        return null;
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        return null;
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Memorandum memorandum = this.memorandumService.findMemorandumByRef(documentRef);
        this.setStructureContext(memorandum.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        return null;
    }

    @Override
    public List<TableOfContentItemVO> saveToC(String documentRef, List<TableOfContentItemVO> toc) {
        return null;
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) {
        return null;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        return null;
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        return null;
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        return null;
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        return null;
    }

    private byte[] getContent(Memorandum memorandum) {
        final Content content = memorandum.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }


    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

    private String getProposalRef(String documentId){
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        Proposal proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal.getMetadata().getOrNull().getRef();
    }

}
