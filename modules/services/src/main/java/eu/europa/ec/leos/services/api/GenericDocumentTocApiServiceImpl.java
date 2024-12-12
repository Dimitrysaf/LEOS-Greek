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
package eu.europa.ec.leos.services.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.rendition.RenderedDocument;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.dto.response.LeosRenditionOutputResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.processor.content.TableOfContentHelper;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.rendition.HtmlRenditionProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.vo.toc.TableOfContentItemHtmlVO;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.inject.Provider;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static eu.europa.ec.leos.services.support.XmlHelper.BILL;
import static eu.europa.ec.leos.services.support.XmlHelper.COVERPAGE;
import static eu.europa.ec.leos.services.support.XmlHelper.DOC;
import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class GenericDocumentTocApiServiceImpl implements GenericDocumentTocApiService {
    private static final Logger LOG = LoggerFactory.getLogger(GenericDocumentTocApiServiceImpl.class);

    private static final Map<LeosCategory, String> DOCUMENT_TOC_STARTING_NODE = new HashMap<LeosCategory, String>() {{
        this.put(LeosCategory.BILL, "bill");
        this.put(LeosCategory.MEMORANDUM, "doc");
        this.put(LeosCategory.ANNEX, "doc");
        this.put(LeosCategory.PROPOSAL, "doc");
        this.put(LeosCategory.STAT_DIGIT_FINANC_LEGIS, "doc");
        this.put(LeosCategory.COUNCIL_EXPLANATORY, "doc");
        this.put(LeosCategory.COVERPAGE, "coverPage");
    }};
    private final LeosRepository leosRepository;
    private final TableOfContentProcessor tableOfContentProcessor;
    private final Provider<StructureContext> structureContextProvider;
    private final DocumentLanguageContext documentLanguageContext;
    private final LanguageGroupService languageGroupService;
    private final MessageHelper messageHelper;
    private final HtmlRenditionProcessor htmlRenditionProcessor;
    private final XmlContentProcessor xmlContentProcessor;
    private final XPathCatalog xPathCatalog;

    private static final String HTML_RENDITION = "renditions/html/";
    private static final String JS_DEST_DIR = "renditions/html/js/";
    private static final String STYLE_SHEET_EXT = ".css";
    private static final String annexStyleSheet = LeosCategory.ANNEX.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String memoStyleSheet = LeosCategory.MEMORANDUM.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String billStyleSheet = LeosCategory.BILL.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String coverPageStyleSheet = LeosCategory.COVERPAGE.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String financialStatementStyleSheet = LeosCategory.STAT_DIGIT_FINANC_LEGIS.name().toLowerCase() + STYLE_SHEET_EXT;

    @Autowired
    public GenericDocumentTocApiServiceImpl(@NotNull LeosRepository leosRepository,
                                            @NotNull TableOfContentProcessor tableOfContentProcessor,
                                            @NotNull Provider<StructureContext> structureContextProvider,
                                            @NotNull DocumentLanguageContext documentLanguageContext, LanguageGroupService languageGroupService,
                                            @NotNull MessageHelper messageHelper,
                                            @NotNull HtmlRenditionProcessor htmlRenditionProcessor, XmlContentProcessor xmlContentProcessor, XPathCatalog xPathCatalog) {
        this.leosRepository = Objects.requireNonNull(leosRepository);
        this.tableOfContentProcessor = Objects.requireNonNull(tableOfContentProcessor);
        this.structureContextProvider = Objects.requireNonNull(structureContextProvider);
        this.documentLanguageContext = documentLanguageContext;
        this.languageGroupService = languageGroupService;
        this.messageHelper = Objects.requireNonNull(messageHelper);
        this.htmlRenditionProcessor = htmlRenditionProcessor;
        this.xmlContentProcessor = xmlContentProcessor;
        this.xPathCatalog = xPathCatalog;
    }

    @Override
    public List<TableOfContentItemVO> getTableOfContent(@NotNull String docRef,
                                                        @NotNull TocMode mode) throws NotFoundException {
        XmlDocument document = this.findDocumentByRef(docRef);
        String docTemplate = LeosXercesUtils.getDocTemplate(document);
        byte[] content = LeosXercesUtils.getDocumentContent(document);
        String startingNode = Optional.ofNullable(DOCUMENT_TOC_STARTING_NODE.get(document.getCategory()))
                .orElseThrow(
                        () -> new RuntimeException(String.format("Starting node not found for document %s", docRef)));
        documentLanguageContext.setDocumentLanguage(document.getMetadata().get().getLanguage());
        this.getStructureContext().useDocumentTemplate(docTemplate);
        List<TableOfContentItemVO> toc = this.tableOfContentProcessor.buildTableOfContent(startingNode, content, mode);
        return toc;
    }

    @Override
    public String getTocAsJson(String fileName, byte[] content, TocMode mode) {
        String startingNode = getStartingNode(fileName);
        String docTemplate = xmlContentProcessor.getElementValue(content, xPathCatalog.getXPathDocTemplate(), true);
        String language = xmlContentProcessor.getElementValue(content, xPathCatalog.getXPathDocLanguage(), true);
        languageGroupService.getLanguageMap();
        documentLanguageContext.setDocumentLanguage(language);
        this.getStructureContext().useDocumentTemplate(docTemplate);
        List<TableOfContentItemVO> toc = this.tableOfContentProcessor.buildTableOfContent(startingNode, content, mode);
        String tocJson = getTocAsJson(toc);
        return tocJson;
    }

    private String getTocAsJson(List<TableOfContentItemVO> tableOfContent) {
        final String json;
        try {
            List<TableOfContentItemHtmlVO> tocHtml = buildTocHtml(tableOfContent);
            json = new ObjectMapper().writeValueAsString(tocHtml);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Exception while converting 'tableOfContent' in json format.", e);
        } catch (Exception e) {
            throw new RuntimeException("Exception while converting 'tableOfContent' in json format.", e);
        }
        return json;
    }

    private List<TableOfContentItemHtmlVO> buildTocHtml(List<TableOfContentItemVO> tableOfContents) {
        List<TableOfContentItemHtmlVO> tocHtml = new ArrayList<>();
        for (TableOfContentItemVO item : tableOfContents) {
            String name = TableOfContentHelper.buildItemCaption(item, TableOfContentHelper.DEFAULT_CAPTION_MAX_SIZE,
                    messageHelper, documentLanguageContext.getDocumentLanguage());
            TableOfContentItemHtmlVO itemHtml = new TableOfContentItemHtmlVO(name, "#" + item.getId());
            if (item.getChildItems().size() > 0) {
                itemHtml.setChildren(buildTocHtml(item.getChildItems()));
            }
            tocHtml.add(itemHtml);
        }
        return tocHtml;
    }

    @Override
    public LeosRenditionOutputResponse addHtmlRendition(String xmlDocumentName, byte[] xmlContent, String tocJson) {
        String startingNode = getStartingNode(xmlDocumentName);
        LeosRenditionOutputResponse renditionOutputResponse;
        if(COVERPAGE.equalsIgnoreCase(startingNode)) {
            renditionOutputResponse = addCoverPageHtmlRendition(xmlContent, getStyleSheetName(xmlDocumentName), tocJson);
        } else {
            RenderedDocument htmlDocument = new RenderedDocument();
            String styleSheetName = getStyleSheetName(xmlDocumentName);
            htmlDocument.setStyleSheetName(styleSheetName);
            String htmlName = HTML_RENDITION + xmlDocumentName.replaceAll(".xml", ".html");
            //build html_docName_toc.html
            RenderedDocument tocHtmlDocument = new RenderedDocument();
            // Build toc_docName.js file
            RenderedDocument tocHtmlDocumentJS = new RenderedDocument();

            if (xmlDocumentName.startsWith(XmlHelper.STAT_DIGIT_FINANC_LEGIS)) {
                Document document = XercesUtils.createXercesDocument(xmlContent);
                byte[] htmlRenditionContent = LeosXercesUtils.wrapWithPageOrientationDivs(document);
                htmlDocument.setContent(new ByteArrayInputStream(htmlRenditionContent));
                tocHtmlDocument.setContent(new ByteArrayInputStream(htmlRenditionContent));
                tocHtmlDocumentJS.setContent(new ByteArrayInputStream(htmlRenditionContent));
            } else {
                htmlDocument.setContent(new ByteArrayInputStream(xmlContent));
                tocHtmlDocument.setContent(new ByteArrayInputStream(xmlContent));
                tocHtmlDocumentJS.setContent(new ByteArrayInputStream(xmlContent));
            }

            tocHtmlDocumentJS.setStyleSheetName(styleSheetName);
            final String tocJsName = xmlDocumentName.substring(0, xmlDocumentName.indexOf(".xml")) + "_toc" + ".js";
            final String tocJsFile = JS_DEST_DIR + tocJsName;

            tocHtmlDocument.setStyleSheetName(styleSheetName);
            String tocHtmlFile = HTML_RENDITION + xmlDocumentName;
            tocHtmlFile = tocHtmlFile.substring(0, tocHtmlFile.indexOf(".xml")) + "_toc" + ".html";

            renditionOutputResponse = LeosRenditionOutputResponse.builder()
                    .htmlRenditionFilename(htmlName)
                    .htmlRendition(htmlRenditionProcessor.processTemplate(htmlDocument, "").getBytes(UTF_8))
                    .htmlTocJSFilename(tocJsFile)
                    .htmlTocJS(htmlRenditionProcessor.processJsTemplate(tocJson).getBytes(UTF_8))
                    .htmlTocRenditionFilename(tocHtmlFile)
                    .htmlTocRendition(htmlRenditionProcessor.processTocTemplate(tocHtmlDocument, tocJsName,
                            "").getBytes(UTF_8))
                    .build();
        }
        return renditionOutputResponse;
    }

    private LeosRenditionOutputResponse addCoverPageHtmlRendition(byte[] proposalContent, String styleSheetName, String coverPageTocJson) {
        byte[] coverPageContent = xmlContentProcessor.getCoverPageContentForRendition(proposalContent);
        RenderedDocument htmlDocument = new RenderedDocument();
        htmlDocument.setContent(new ByteArrayInputStream(coverPageContent));
        htmlDocument.setStyleSheetName(styleSheetName);
        String htmlName = HTML_RENDITION + XmlNodeConfigProcessor.DOC_REF_COVER + ".html";
        String xmlDocumentName = XmlNodeConfigProcessor.DOC_REF_COVER + ".xml";

        // Build toc_docName.js file
        RenderedDocument tocHtmlDocument = new RenderedDocument();
        tocHtmlDocument.setContent(new ByteArrayInputStream(coverPageContent));
        tocHtmlDocument.setStyleSheetName(styleSheetName);
        final String tocJsName = xmlDocumentName.substring(0, xmlDocumentName.indexOf(".xml")) + "_toc" + ".js";
        final String tocJsFile = JS_DEST_DIR + tocJsName;

        String tocHtmlFile = HTML_RENDITION + xmlDocumentName;
        tocHtmlFile = tocHtmlFile.substring(0, tocHtmlFile.indexOf(".xml")) + "_toc" + ".html";
        LeosRenditionOutputResponse renditionOutputResponse = LeosRenditionOutputResponse.builder()
                .htmlRenditionFilename(htmlName)
                .htmlRendition(htmlRenditionProcessor.processCoverPage(htmlDocument, "").getBytes(UTF_8))
                .htmlTocJSFilename(tocJsFile)
                .htmlTocJS(htmlRenditionProcessor.processJsTemplate(coverPageTocJson).getBytes(UTF_8))
                .htmlTocRenditionFilename(tocHtmlFile)
                .htmlTocRendition(htmlRenditionProcessor.processCoverPageTocTemplate(tocHtmlDocument, tocJsName).getBytes(UTF_8))
                .build();

        return renditionOutputResponse;
    }

    private String getStartingNode(String xmlDocumentName) {
        String startingNode = "";
        if(xmlDocumentName.startsWith(XmlHelper.PROPOSAL_FILE)) {
            startingNode = COVERPAGE;
        } else if (xmlDocumentName.startsWith(XmlHelper.REG_FILE_PREFIX) || xmlDocumentName.startsWith(XmlHelper.DIR_FILE_PREFIX)
                || xmlDocumentName.startsWith(XmlHelper.DEC_FILE_PREFIX)) {
            startingNode = BILL;
        } else {
            startingNode = DOC;
        }
        return startingNode;
    }

    private String getStyleSheetName(String xmlDocumentName) {
        String styleSheetName = "";
        if(xmlDocumentName.startsWith(XmlHelper.STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX)) {
            styleSheetName = financialStatementStyleSheet;
        } else if(xmlDocumentName.startsWith(XmlHelper.MEMORANDUM_FILE_PREFIX)) {
            styleSheetName = memoStyleSheet;
        } else if (xmlDocumentName.startsWith(XmlHelper.REG_FILE_PREFIX) || xmlDocumentName.startsWith(XmlHelper.DIR_FILE_PREFIX)
        || xmlDocumentName.startsWith(XmlHelper.DEC_FILE_PREFIX)) {
            styleSheetName = billStyleSheet;
        } else if (xmlDocumentName.startsWith(XmlHelper.ANNEX_FILE_PREFIX)) {
            styleSheetName = annexStyleSheet;
        } else if (xmlDocumentName.startsWith(XmlHelper.PROPOSAL_FILE)) {
            styleSheetName = coverPageStyleSheet;
        }
        return styleSheetName;
    }

    private StructureContext getStructureContext() {
        return this.structureContextProvider.get();
    }
    private <T extends XmlDocument> T findDocumentByRef(@NotNull Class<T> docClass,
                                                        @NotNull String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, docClass))
                .orElseThrow(
                        () -> new NotFoundException(String.format("Not found document with %s reference", docRef)));
    }

    private XmlDocument findDocumentByRef(@NotNull String docRef) throws NotFoundException {
        return this.findDocumentByRef(XmlDocument.class, docRef);
    }

}
