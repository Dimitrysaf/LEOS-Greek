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
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.AnnexStructureType;
import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.compare.ContentComparatorContext;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.request.Position;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.processor.AnnexProcessor;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.response.EditElementResponse;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Collections;
import java.util.List;

import static eu.europa.ec.leos.services.compare.ContentComparatorService.ATTR_NAME;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_ADDED_CLASS;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_REMOVED_CLASS;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;

@Service("annex")
public class AnnexApiServiceImpl implements AnnexApiService {
    private static final Logger LOG = LoggerFactory.getLogger(ApiServiceImpl.class);
    private Provider<StructureContext> structureContext;
    @Autowired
    AnnexService annexService;
    @Autowired
    AnnexProcessor annexProcessor;
    @Autowired
    ElementProcessor<Annex> elementProcessor;
    @Autowired
    SearchService searchService;
    @Autowired
    MessageHelper messageHelper;
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    ContentComparatorService compareService;
    @Autowired
    DocumentViewService<Annex> documentViewService;


    AnnexApiServiceImpl(Provider<StructureContext> structureContext) {
        this.structureContext = structureContext;
    }

    @Override
    public String getElement(String documentRef, String elementName, String elementId) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        String element = this.elementProcessor.getElement(annex, elementName, elementId);
        return element;
    }

    @Override
    public DocumentViewResponse deleteBlock(String documentRef, String elementName, String elementId) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = this.annexProcessor.deleteAnnexBlock(annex, elementId, elementName);
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.deleted"));
        // TODO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.getDocumentView(annex);

    }

    @Override
    public DocumentViewResponse saveElement(String documentRef, String elementId, String elementName, String elementContent) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = annexProcessor.updateAnnexBlock(annex, elementId, elementName, elementContent);

        //TODO add splitted content functionality since
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.updated"));
        return documentViewService.getDocumentView(annex);
    }

    @Override
    public DocumentViewResponse insertElement(String documentRef, String elementName, String elementId, Position position) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        byte[] updatedXmlContent = this.annexProcessor.insertAnnexBlock(annex, elementId, elementName, position.equals(Position.BEFORE));
        annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.annex.block.inserted"));

        // TODO : to be added  DocumentUpdatedByCoEditorEvent
        return documentViewService.getDocumentView(annex);
    }

    @Override
    public DocumentViewResponse mergeElement(String documentRef, String elementContent, String elementTag, String elementId) throws Exception {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        Element mergeOnElement = annexProcessor.getMergeOnElement(annex, elementContent, elementTag, elementId);
        byte[] updatedXmlContent = null;
        if (mergeOnElement != null) {
            updatedXmlContent = annexProcessor.mergeElement(annex, elementContent, elementTag, elementId);
            annex = annexService.updateAnnex(annex, updatedXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.element.updated", org.apache.commons.lang3.StringUtils.capitalize(elementTag)));
            LOG.info("Element '{}' merged into '{}' in Annex {} id {})", elementId, mergeOnElement.getElementId(), annex.getName(), annex.getId());
        }
        return documentViewService.getDocumentView(annex);
    }

    @Override
    public List<Annex> getRecentMinorVersions(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        Integer recentCount = this.annexService.findRecentMinorVersionsCount(annex.getId(), documentRef);
        return this.annexService.findRecentMinorVersions(annex.getId(), documentRef, 0, recentCount);
    }

    @Override
    public List<VersionVO> getVersionsData(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        return this.annexService.getAllVersions(annex.getId(), documentRef);
    }

    @Override
    public List<TocItem> getTocItems(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.structureContext.get().getTocItems();
    }

    @Override
    public List<TableOfContentItemVO> getToc(String documentRef, TocMode mode) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        this.setStructureContext(annex.getMetadata().getOrError(() -> "Annex metadata is required!").getDocTemplate());
        return this.annexService.getTableOfContent(annex, mode);
    }

    @Override
    public DocumentViewResponse getDocument(String documentRef) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        return this.documentViewService.getDocumentView(annex);
    }

    @Override
    public List<VersionVO> saveDocument(String documentRef, String checkInComment, VersionType versionType) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        Annex newVersion = this.annexService.createVersion(annex.getId(), versionType, checkInComment);
        return this.annexService.getAllVersions(annex.getId(), documentRef);
    }

    @Override
    public List<SearchMatchVO> searchTextInDocument(String documentRef, String searchText, boolean matchCase, boolean completeWords) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        List<SearchMatchVO> matches = Collections.emptyList();
        try {
            matches = searchService.searchText(getContent(annex), searchText, matchCase, completeWords);
        } catch (Exception e) {
            LOG.error("couldn't fetch results");
        }
        return matches;
    }

    @Override
    public DocumentViewResponse showVersion(String versionId) {
        Annex annex = this.annexService.findAnnexVersion(versionId);
        final String versionContent = documentContentService.getDocumentAsHtml(annex,
                "",
                securityContext.getPermissions(annex));
        VersionInfoVO versionInfoVO = this.documentViewService.getVersionInfo(annex);
        return new DocumentViewResponse(null,versionContent,versionInfoVO);
    }

    @Override
    public String compare(String newVersionId, String oldVersionId) {
        Annex oldVersion = annexService.findAnnexVersion(oldVersionId);
        Annex newVersion = annexService.findAnnexVersion(newVersionId);
        return this.compareTwoVersion(oldVersion, newVersion);
    }

    @Override
    public DocumentViewResponse restoreToVersion(String documentRef, String versionId) {
        Annex version = annexService.findAnnexVersion(versionId);
        Annex annex = annexService.findAnnexByRef(documentRef);
        byte[] resultXmlContent = getContent(version);
        Annex updatedAnnex = annexService.updateAnnex(annex, resultXmlContent, VersionType.MINOR, messageHelper.getMessage("operation.restore.version", version.getVersionLabel()));
        return this.documentViewService.getDocumentView(updatedAnnex);
    }

    @Override
    public EditElementResponse editElement(String documentRef, String elementId, String elementTagName) {
        Annex annex = this.annexService.findAnnexByRef(documentRef);
        try {
            LevelItemVO levelItemVO = new LevelItemVO();
            String element = elementProcessor.getElement(annex, elementTagName, elementId);
            if (AnnexStructureType.LEVEL.getType().equalsIgnoreCase(elementTagName)
                    || NUM.equalsIgnoreCase(elementTagName)) {
                levelItemVO = annexProcessor.getLevelItemVO(annex, elementId, elementTagName);
            }
            return new EditElementResponse(elementId, elementTagName, element, levelItemVO);
        } catch (Exception ex) {
            LOG.error("Exception while edit element operation for ", ex);
            throw new RuntimeException(ex);
        }
    }

    private byte[] getContent(Annex annex) {
        final Content content = annex.getContent().getOrError(() -> "Annex content is required!");
        return content.getSource().getBytes();
    }

    private String compareTwoVersion(Annex oldVersion, Annex newVersion) {
        final String firstItemHtml = documentContentService.getDocumentAsHtml(oldVersion, "", securityContext.getPermissions(oldVersion),
                false);
        final String secondItemHtml = documentContentService.getDocumentAsHtml(newVersion, "", securityContext.getPermissions(newVersion),
                false);
        return compareService.compareContents(new ContentComparatorContext.Builder(firstItemHtml, secondItemHtml)
                .withAttrName(ATTR_NAME)
                .withRemovedValue(CONTENT_REMOVED_CLASS)
                .withAddedValue(CONTENT_ADDED_CLASS)
                .withDisplayRemovedContentAsReadOnly(Boolean.TRUE)
                .build());
    }

    private void setStructureContext(String docTemplate) {
        this.structureContext.get().useDocumentTemplate(docTemplate);
    }

}
