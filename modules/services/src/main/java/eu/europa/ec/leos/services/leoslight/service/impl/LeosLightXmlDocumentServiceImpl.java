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
package eu.europa.ec.leos.services.leoslight.service.impl;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.rendition.RenderedDocument;
import eu.europa.ec.leos.services.annotate.AnnotateService;
import eu.europa.ec.leos.services.api.GenericDocumentTocApiService;
import eu.europa.ec.leos.services.export.ExportHelper;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.leoslight.service.LeosLightXmlDocumentService;
import eu.europa.ec.leos.services.processor.content.TableOfContentHelper;
import eu.europa.ec.leos.services.processor.rendition.HtmlRenditionProcessor;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.vo.toc.TableOfContentItemHtmlVO;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.store.LegServiceImpl.SUGGESTION;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class LeosLightXmlDocumentServiceImpl implements LeosLightXmlDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLightXmlDocumentServiceImpl.class);
    public static final String ACCOLADE_NEW_LINE = "; }\n";

    private final XPathCatalog xPathCatalog;
    private final HtmlRenditionProcessor htmlRenditionProcessor;
    private final MessageHelper messageHelper;
    private final GenericDocumentTocApiService genericDocumentTocApiService;
    private final RestTemplate restTemplate;
    private final AnnotateService annotateService;
    private final DocumentLanguageContext documentLanguageContext;
    private final ExportHelper exportHelper;

    private static final String XML_EXT = ".xml";
    private static final String STYLE_SHEET_EXT = ".css";
    private static final String JS_EXT = ".js";
    private static final String STYLE_DEST_DIR = "renditions/html/css/";
    private static final String JS_DEST_DIR = "renditions/html/js/";
    private static final String STYLES_SOURCE_PATH = "META-INF/resources/assets/css/";
    private static final String JS_SOURCE_PATH = "META-INF/resources/js/";
    private static final String JQUERY_SOURCE_PATH = "META-INF/resources/lib/jquery_3.2.1/";
    private static final String JQTREE_SOURCE_PATH = "META-INF/resources/lib/jqTree_1.4.9/";
    private static final String HTML_RENDITION = "renditions/html/";

    @Value("#{integrationProperties['leos.akn4eu.url']}")
    private String akn4euUrl;

    @Value("#{integrationProperties['leos.akn4eu.single.doc.convert.uri']}")
    private String singleDocConvert;

    @Autowired
    public LeosLightXmlDocumentServiceImpl(XPathCatalog xPathCatalog,
                                           HtmlRenditionProcessor htmlRenditionProcessor, GenericDocumentTocApiService genericDocumentTocApiService,
                                           MessageHelper messageHelper, RestTemplate restTemplate, AnnotateService annotateService,
                                            DocumentLanguageContext documentLanguageContext, ExportHelper exportHelper) {
        this.xPathCatalog = xPathCatalog;
        this.htmlRenditionProcessor = htmlRenditionProcessor;
        this.messageHelper = messageHelper;
        this.genericDocumentTocApiService = genericDocumentTocApiService;
        this.restTemplate = restTemplate;
        this.annotateService = annotateService;
        this.documentLanguageContext = documentLanguageContext;
        this.exportHelper = exportHelper;
    }

    @Override
    public void addDocumentHtmlRendition(Map<String, Object> contentToZip, String xmlDocumentName, byte[] xmlContent,
                                         String styleSheetName) {
        RenderedDocument htmlDocument = new RenderedDocument();
        htmlDocument.setStyleSheetName(styleSheetName);
        String htmlName = HTML_RENDITION + xmlDocumentName.replaceAll(XML_EXT, ".html");
        String trackChangesCss = this.createTrackChangesCss(xmlContent, null);

        //build html_docName_toc.html
        RenderedDocument tocHtmlDocument = new RenderedDocument();

        // Build toc_docName.js file
        RenderedDocument tocHtmlDocumentJS = new RenderedDocument();

        if (xmlDocumentName.startsWith(XmlHelper.STAT_FINANC_LEGIS)) {
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
        contentToZip.put(htmlName, htmlRenditionProcessor.processTemplate(htmlDocument, trackChangesCss).getBytes(UTF_8));

        tocHtmlDocumentJS.setStyleSheetName(styleSheetName);
        final String tocJsName = xmlDocumentName.substring(0, xmlDocumentName.indexOf(XML_EXT)) + "_toc" + ".js";
        final String tocJsFile = JS_DEST_DIR + tocJsName;

        List<TableOfContentItemVO> tableOfContentItemVOList = genericDocumentTocApiService.getTableOfContent(xmlDocumentName.replace(XML_EXT, ""), TocMode.SIMPLIFIED);
        String tocJson = getTocAsJson(tableOfContentItemVOList);

        contentToZip.put(tocJsFile, htmlRenditionProcessor.processJsTemplate(tocJson).getBytes(UTF_8));

        tocHtmlDocument.setStyleSheetName(styleSheetName);
        String tocHtmlFile = HTML_RENDITION + xmlDocumentName;
        tocHtmlFile = tocHtmlFile.substring(0, tocHtmlFile.indexOf(XML_EXT)) + "_toc" + ".html";
        contentToZip.put(tocHtmlFile, htmlRenditionProcessor.processTocTemplate(tocHtmlDocument, tocJsName, trackChangesCss).getBytes(UTF_8));

        addResourceToZipContent(contentToZip, styleSheetName, STYLES_SOURCE_PATH, STYLE_DEST_DIR);
        enrichZipWithToc(contentToZip);
    }

    @Override
    public byte[] convert(byte[] documentContent, String fileName, ExportOptions exportOptions) {
        String uri = akn4euUrl + singleDocConvert;
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        Map<String, Object> contentToZip = new HashMap<>();
        contentToZip.put(fileName, documentContent);

        if(exportOptions.isWithAnnotations()) {
            addAnnotateToZipContent(contentToZip, fileName.replace(".xml", ""), fileName, exportOptions, null);
        }

        String outputDescriptor = exportHelper.createJsonOutputDescriptorFile(exportOptions, false);
        contentToZip.put("content.json", outputDescriptor.getBytes(StandardCharsets.UTF_8));
        File file = null;
        try {
            file = ZipPackageUtil.zipFiles("document.zip", contentToZip, null);
            map.add("outputDescriptor", outputDescriptor);

            ByteArrayResource bar = new ByteArrayResource(Files.readAllBytes(file.toPath())) {
                @Override
                public String getFilename() {
                    return fileName;
                }
            };
            map.add("inputFile", bar);

            ResponseEntity<byte[]> response = getResponseEntity(uri, null, map, byte[].class);
            if (response.getStatusCode().is2xxSuccessful()) {
                byte[] bytesToWrite = response.getBody();
                return bytesToWrite;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if ((file != null) && file.exists()) {
                file.delete();
            }
        }
        LOG.error("Not successful conversion using the external service Akn4EU");
        throw new IllegalStateException("Not successful conversion using the external service Akn4EU");
    }

    @Override
    public void sendFileToCallbackUrl(String fileName, byte[] content, String callbackUrl, String token) throws IOException {
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        ByteArrayResource bar = new ByteArrayResource(content) {
            @Override
            public String getFilename() {
                return fileName;
            }
        };
        map.add("file", bar);
        ResponseEntity<Object> response = getResponseEntity(callbackUrl, token, map, Object.class);
        LOG.info("Export: " + fileName + " Status: " + response.getStatusCodeValue() + " Response: " + response.getBody());
    }

    private <T> ResponseEntity<T> getResponseEntity(String uri, String token, MultiValueMap<String, Object> map, Class<T> responseType) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.ALL));
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        if(StringUtils.isNotBlank(token)) {
            headers.set("Authorization", "Bearer " + token);
        }
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(map, headers);
        return restTemplate.postForEntity(uri, requestEntity, responseType);
    }

    private void addAnnotateToZipContent(Map<String, Object> contentToZip, String ref, String docName, ExportOptions exportOptions, String proposalRef) {
        if (exportOptions.isWithAnnotations()) {
            try {
                String annotations = annotateService.getAnnotations(ref, proposalRef);
                annotations = processAnnotations(annotations, exportOptions);
                final byte[] xmlAnnotationContent = annotations.getBytes(UTF_8);
                contentToZip.put(creatAnnotationFileName(docName), xmlAnnotationContent);
            } catch (Exception e) {
                LOG.error("Exception occurred", e);
            }
        }
    }

    String MEDIA_DIR = "media/";
    String ANNOT_FILE_PREFIX = "annot_";
    String ANNOT_FILE_EXT = ".json";

    private String creatAnnotationFileName(String docName) {
        return MEDIA_DIR + ANNOT_FILE_PREFIX + docName + ANNOT_FILE_EXT;
    }

    private String processAnnotations(String annotations, ExportOptions exportOptions) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree(annotations);
        JsonNode rootNode = json.get("rows");
        Iterator<JsonNode> itr = rootNode.elements();
        List<JsonNode> modifiedList = new ArrayList<JsonNode>();
        itr.forEachRemaining(node -> {
            if (!exportOptions.isWithSuggestions() && node.findValue("tags").get(0).textValue().equalsIgnoreCase(SUGGESTION)) {
                return;
            }
            String entityText = "";
            JsonNode userInfo = node.get("user_info");
            if (userInfo != null && exportOptions.isWithAnonymization()) {
                JsonNode entityName = userInfo.get("entity_name");
                entityText = entityName.textValue();
                int firstEntitySeparator = entityText.indexOf(".");
                entityText = firstEntitySeparator >= 0 ? entityText.substring(0, firstEntitySeparator) : entityText;
                ((ObjectNode) userInfo).put("display_name", entityText);
                ((ObjectNode) userInfo).put("entity_name", entityText);
                ((ObjectNode) node).put("user", entityText);
                JsonNode permissions = node.get("permissions");
                if (permissions != null) {
                    anonymizePermission(permissions, "admin", entityText);
                    anonymizePermission(permissions, "update", entityText);
                    anonymizePermission(permissions, "delete", entityText);
                }
            }
            modifiedList.add(node);
        });
        ((ObjectNode) json).putArray("rows").removeAll().addAll(modifiedList);
        ((ObjectNode) json).put("total", modifiedList.size());
        return mapper.writeValueAsString(json);
    }

    private void anonymizePermission(JsonNode permissions, String permissionName, String entityText) {
        try {
            ArrayNode arrayNode = ((ArrayNode) (permissions.get(permissionName)));
            if (arrayNode != null) {
                arrayNode.remove(0);
                arrayNode.add(entityText);
            }
        } catch (Exception e) {
            LOG.error("Error while anonymize a permission with name" + permissionName, e);
        }
    }

    private String getTocAsJson(List<TableOfContentItemVO> tableOfContent) {
        final String json;
        try {
            List<TableOfContentItemHtmlVO> tocHtml = buildTocHtml(tableOfContent);
            json = new ObjectMapper().writeValueAsString(tocHtml);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Exception while converting 'tableOfContent' in json format.", e);
        }
        return json;
    }

    private List<TableOfContentItemHtmlVO> buildTocHtml(List<TableOfContentItemVO> tableOfContents) {
        List<TableOfContentItemHtmlVO> tocHtml = new ArrayList<>();
        String language = documentLanguageContext.getDocumentLanguage();
        for (TableOfContentItemVO item : tableOfContents) {
            String name = TableOfContentHelper.buildItemCaption(item, TableOfContentHelper.DEFAULT_CAPTION_MAX_SIZE, messageHelper, language);
            TableOfContentItemHtmlVO itemHtml = new TableOfContentItemHtmlVO(name, "#" + item.getId());
            if (item.getChildItems().size() > 0) {
                itemHtml.setChildren(buildTocHtml(item.getChildItems()));
            }
            tocHtml.add(itemHtml);
        }
        return tocHtml;
    }

    private String createTrackChangesCss(byte[] xmlContent, String proposalRef) {
        Document document = createXercesDocument(xmlContent);
        NodeList elements = XercesUtils.getElementsByXPath(document, xPathCatalog.getXPathTrackChanges());
        List<String> usersId = new ArrayList();
        for (int i = 0; i < elements.getLength(); i++) {
            Node element = elements.item(i);
            String userId = element.getAttributes().getNamedItem("leos:uid").getNodeValue();
            if (userId != null && !usersId.contains(userId)) {
                usersId.add(userId);
            }
        }
        String trackChangesCss = "<style id=\"docTcStyle\">\n";
        for (int i = 0; i < usersId.size(); i++) {
            String userId = usersId.get(i);
            String userIdColor[] = this.generateColors(String.join("", Collections.nCopies(5, userId)) + proposalRef);
            trackChangesCss += "akomantoso [leos\\:uid='" + userId + "'] { color: " + userIdColor[0] + ACCOLADE_NEW_LINE;
            trackChangesCss += "akomantoso [leos\\:uid='" + userId + "']:hover { background-color: " + userIdColor[1] + ACCOLADE_NEW_LINE;
            trackChangesCss += "akomantoso tr[leos\\:uid='" + userId + "'] { background-color: " + userIdColor[1] + ACCOLADE_NEW_LINE;
        }
        trackChangesCss += "</style>";
        return trackChangesCss;
    }

    private String[] generateColors(String valueToHash) {
        BigInteger hashCode = BigInteger.valueOf(0);
        for (int i = 0; i < valueToHash.length(); i++) {
            hashCode = BigInteger.valueOf(valueToHash.charAt(i)).add(hashCode.shiftLeft(5).subtract(hashCode));
        }
        int hue = hashCode.abs().remainder(BigInteger.valueOf(360)).intValue();
        return new String[]{"hsl(" + hue + ", 100%, 35%)", "hsl(" + hue + ", 100%, 90%)"};
    }

    private void addResourceToZipContent(Map<String, Object> contentToZip, String resourceName, String sourcePath, String destPath) {
        try {
            Resource resource = new ClassPathResource(sourcePath + resourceName);
            contentToZip.put(destPath + resourceName, IOUtils.toByteArray(resource.getInputStream()));
        } catch (IOException io) {
            LOG.error("Error occurred while getting styles ", io);
        }
    }

    private void enrichZipWithToc(final Map<String, Object> contentToZip) {
        addResourceToZipContent(contentToZip, "jquery" + JS_EXT, JQUERY_SOURCE_PATH, JS_DEST_DIR);
        addResourceToZipContent(contentToZip, "jqtree" + JS_EXT, JQTREE_SOURCE_PATH, JS_DEST_DIR);
        addResourceToZipContent(contentToZip, "jqtree" + STYLE_SHEET_EXT, JQTREE_SOURCE_PATH + "css/", STYLE_DEST_DIR);
        addResourceToZipContent(contentToZip, "leos-toc-rendition" + JS_EXT, JS_SOURCE_PATH + "rendition/", JS_DEST_DIR);
        addResourceToZipContent(contentToZip, "leos-toc-rendition" + STYLE_SHEET_EXT, STYLES_SOURCE_PATH, STYLE_DEST_DIR);
    }
}
