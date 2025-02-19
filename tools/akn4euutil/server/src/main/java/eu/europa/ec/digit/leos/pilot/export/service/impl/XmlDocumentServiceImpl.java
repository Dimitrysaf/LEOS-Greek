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
package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.exception.TemplateEngineException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlDocumentException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.service.TemplateEngineService;
import eu.europa.ec.digit.leos.pilot.export.service.XmlDocumentService;
import eu.europa.ec.digit.leos.pilot.export.util.ConvertUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ExportOptions;
import eu.europa.ec.digit.leos.pilot.export.util.ExportResource;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Node;

import javax.xml.transform.TransformerException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class XmlDocumentServiceImpl implements XmlDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(XmlDocumentServiceImpl.class);

    private final TemplateEngineService templateEngineService;

    private final String CSS_EXT = ".css";
    private final String CSS_PATH = "css/";
    private final String REF_NODE = "leos:ref";

    public static final String ANNEX_FILE_PREFIX = "ANNEX";
    public static final String REG_FILE_PREFIX = "REG";
    public static final String DIR_FILE_PREFIX = "DIR";
    public static final String DEC_FILE_PREFIX = "DEC";
    public static final String MEMORANDUM_FILE_PREFIX = "EXPL_MEMORANDUM";
    public static final String PROP_ACT_PREFIX = "PROP_ACT";
    public static final String STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX = "STAT_DIGIT_FINANC_LEGIS";

    public XmlDocumentServiceImpl(TemplateEngineService templateEngineService) {
        this.templateEngineService = templateEngineService;
    }

    @Override
    public ByteArrayOutputStream createContentFile(ExportOptions exportOptions, ExportResource exportRootNode) throws Exception {
        return templateEngineService.createContentFile(exportOptions, exportRootNode);
    }

    @Override
    public byte[] xmlToHtmlPackage(LeosConvertDocumentInput convertDocumentInput) {
        try {
            Map<String, Object> contentToZip = new HashMap<String, Object>();
            String coverPage = prepareCoverPage(convertDocumentInput);

            String styleSheetFileName =  getStyleSheetName(convertDocumentInput);
            String cssFileName = getCssFileName(styleSheetFileName);
            String styleSheet = CSS_PATH + cssFileName;
            InputStream styleSheetInputStream = new ClassPathResource(styleSheet).getInputStream();
            byte[] styleSheetOutput = StreamUtils.copyToByteArray(styleSheetInputStream);
            byte[] htmlOutput = templateEngineService.xmlToHtml(convertDocumentInput, cssFileName, coverPage);
            addCoverPageStyleSheet(contentToZip);
            contentToZip.put(ConvertUtil.getFilename(convertDocumentInput.getInputFile(), "html"), htmlOutput);
            contentToZip.put(styleSheet, styleSheetOutput);
            return ZipUtil.zipByteArray(contentToZip);
        } catch (IOException e) {
            LOG.error("Failed getting stylesheet or generating zip file", e);
            throw new XmlDocumentException("Failed getting stylesheet or generating zip file", e);
        } catch (TemplateEngineException e) {
            LOG.error("Error calling template engine", e);
            throw new XmlDocumentException("Error calling template engine", e);
        } catch (XmlUtilException e) {
            LOG.error("Error parsing XML", e);
            throw new XmlDocumentException("Error parsing XML", e);
        } catch (TransformerException e) {
            LOG.error("Error parsing Node", e);
            throw new XmlDocumentException("Error parsing Node", e);
        }
    }

    private String getCssFileName(String styleSheetFileName) {
        String cssFileName = null;
        if (styleSheetFileName.startsWith(MEMORANDUM_FILE_PREFIX)) {
            cssFileName = "memorandum.css";
        } else if (styleSheetFileName.startsWith(REG_FILE_PREFIX) || styleSheetFileName.startsWith(DEC_FILE_PREFIX)
                || styleSheetFileName.startsWith(DIR_FILE_PREFIX)) {
            cssFileName = "bill.css";
        } else if (styleSheetFileName.startsWith(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX)) {
            cssFileName = "stat_digit_financ_legis.css";
        } else if (styleSheetFileName.startsWith(ANNEX_FILE_PREFIX)) {
            cssFileName = "annex.css";
        } else if (styleSheetFileName.startsWith(ConvertUtil.PROPOSAL_FILE_PREFIX)) {
            cssFileName = "coverpage.css";
        }
        return cssFileName;
    }

    private String prepareCoverPage(LeosConvertDocumentInput convertDocumentInput) throws IOException, XmlUtilException,
            TransformerException {
        MultipartFile main = convertDocumentInput.getMain();
        if(main != null && !main.isEmpty()){
            InputStream inputStream = main.getInputStream();
            Node node = XmlUtil.parseXml(inputStream).getElementByName(ConvertUtil.COVER_PAGE);
            XmlUtil.setNodeAttributeValue(node, "xmlns:leos", "urn:eu:europa:ec:leos");
            String coverPageContent = XmlUtil.XmlFile.parseNode(node);
            return coverPageContent;
        }
        return null;
    }

    private void addCoverPageStyleSheet(Map<String, Object> contentToZip) throws IOException {
        String coverPageStyleSheet = CSS_PATH + ConvertUtil.COVER_PAGE.toLowerCase() + CSS_EXT;
        InputStream coverPageCSSInputStream = new ClassPathResource(coverPageStyleSheet).getInputStream();
        byte[] coverPageCSSOutput = StreamUtils.copyToByteArray(coverPageCSSInputStream);
        contentToZip.put(coverPageStyleSheet, coverPageCSSOutput);
    }

    public byte[] xmlToPdfPackage(LeosConvertDocumentInput convertDocumentInput) {
        return "test".getBytes();
    }

    private String getStyleSheetName(LeosConvertDocumentInput convertDocumentInput) {
        XmlUtil.XmlFile xmlFile = null;
        try {
            xmlFile = XmlUtil.parseXml(convertDocumentInput.getInputFile().getInputStream());
        } catch (XmlUtilException e) {
            LOG.error("Error getting style sheet name", e);
            throw new XmlDocumentException("Error getting style sheet name", e);
        } catch (IOException e) {
            LOG.error("Error reading input file", e);
            throw new XmlDocumentException("IO exception Error reading input file", e);
        }
        Node refNode = xmlFile.getElementByName(REF_NODE);
        String refValue = refNode.getTextContent();
        return refValue + CSS_EXT;
    }
}
