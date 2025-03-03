package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.model.DocumentVO;
import eu.europa.ec.digit.leos.pilot.export.model.LeosCategory;
import eu.europa.ec.digit.leos.pilot.export.service.LegPackage;
import eu.europa.ec.digit.leos.pilot.export.service.LegService;
import eu.europa.ec.digit.leos.pilot.export.service.processor.content.AttachmentProcessor;
import eu.europa.ec.digit.leos.pilot.export.service.processor.content.XmlContentProcessor;
import eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfig;
import eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeProcessor;
import eu.europa.ec.digit.leos.pilot.export.util.ExportOptions;
import eu.europa.ec.digit.leos.pilot.export.util.ExportResource;
import eu.europa.ec.digit.leos.pilot.export.util.XPathCatalog;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XML_DOC_EXT;

@Service
public class LegServiceImpl implements LegService {
    private static final Logger LOG = LoggerFactory.getLogger(LegServiceImpl.class);


    private final AttachmentProcessor attachmentProcessor;
    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;
    private final ProposalConverterService proposalConverterService;
    private final XmlContentProcessor xmlContentProcessor;
    private final XPathCatalog xPathCatalog;

    private static final String MEDIA_DIR = "media/";
    private static final String ANNOT_FILE_EXT = ".json";
    private static final String ANNOT_FILE_PREFIX = "annot_";
    private static final String LEG_FILE_PREFIX = "leg_";
    private static final String LEG_FILE_EXTENSION = ".leg";

    private static final String STYLE_SHEET_EXT = ".css";
    private static final String JS_EXT = ".js";
    private static final String STYLE_DEST_DIR = "renditions/html/css/";
    private static final String JS_DEST_DIR = "renditions/html/js/";
    private static final String STYLES_SOURCE_PATH = "META-INF/resources/assets/css/";
    private static final String JS_SOURCE_PATH = "META-INF/resources/js/";
    private static final String JQUERY_SOURCE_PATH = "META-INF/resources/lib/jquery_3.2.1/";
    private static final String JQTREE_SOURCE_PATH = "META-INF/resources/lib/jqTree_1.4.9/";
    private static final String HTML_RENDITION = "renditions/html/";
    private static final String PDF_RENDITION = "renditions/pdf/";
    private static final String WORD_RENDITION = "renditions/word/";
    private static final String REVISION_PREFIX = "revision-";
    public static final String DOC_FILE_NAME_SEPARATOR = "-";

    private static final String annexStyleSheet = LeosCategory.ANNEX.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String memoStyleSheet = LeosCategory.MEMORANDUM.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String billStyleSheet = LeosCategory.BILL.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String coverPageStyleSheet = LeosCategory.COVERPAGE.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String financialStatementStyleSheet = LeosCategory.STAT_DIGIT_FINANC_LEGIS.name().toLowerCase() + STYLE_SHEET_EXT;
    private static final String explanatoryStyleSheet = "explanatory" + STYLE_SHEET_EXT;
    private static final String RESOURCE_NOT_FOUND_MSG = "404 NOT_FOUND";

    @Autowired
    public LegServiceImpl(AttachmentProcessor attachmentProcessor,
                          XmlNodeProcessor xmlNodeProcessor,
                          XmlNodeConfigProcessor xmlNodeConfigProcessor,
                          ProposalConverterService proposalConverterService,
                          XmlContentProcessor xmlContentProcessor, XPathCatalog xPathCatalog) {
        this.attachmentProcessor = attachmentProcessor;
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xmlNodeConfigProcessor = xmlNodeConfigProcessor;
        this.proposalConverterService = proposalConverterService;
        this.xmlContentProcessor = xmlContentProcessor;
        this.xPathCatalog = xPathCatalog;
    }

    @Override
    public LegPackage createLegPackage(Map<String, Object> contentToZip, ExportOptions exportOptions) throws Exception {

        DocumentVO proposalVO = proposalConverterService.createProposalFromLegFile(contentToZip, false);
        final byte[] proposalXmlContent = proposalVO.getSource();
        ExportResource proposalExportResource = new ExportResource(LeosCategory.PROPOSAL);
        final Map<String, String> proposalRefsMap = buildProposalExportResource(proposalExportResource, proposalVO.getName(), proposalXmlContent);
        proposalExportResource.setExportOptions(exportOptions);

        final ExportResource memorandumExportResource = buildExportResourceMemorandum(proposalRefsMap);
        proposalExportResource.addChildResource(memorandumExportResource);

        final ExportResource fsExportResource = buildExportResourceFinancialStatement(proposalRefsMap, proposalVO.getName());
        proposalExportResource.addChildResource(fsExportResource);

        final DocumentVO billVO = proposalVO.getChildDocument(LeosCategory.BILL);
        final byte[] billXmlContent = billVO.getSource();
        final ExportResource billExportResource = buildExportResourceBill(proposalRefsMap, proposalVO.getName());

        // add annexes to billExportResource
        final Map<String, String> attachmentIds = attachmentProcessor.getAttachmentsIdFromBill(billXmlContent);
        final List<DocumentVO> annexesVO = billVO.getChildDocuments(LeosCategory.ANNEX);
        annexesVO.forEach((annexVO) -> {
            final int docNumber = Integer.parseInt(annexVO.getMetadata().getIndex());
            final String resourceId = attachmentIds.entrySet()
                    .stream()
                    .filter(e -> e.getKey().equals(annexVO.getRef()))
                    .map(Map.Entry::getValue)
                    .findFirst()
                    .get();
            final ExportResource annexExportResource = buildExportResourceAnnex(docNumber, annexVO.getName(), resourceId);
            billExportResource.addChildResource(annexExportResource);
        });
        proposalExportResource.addChildResource(billExportResource);
        LegPackage legPackage = new LegPackage();
        String legPackageName = proposalRefsMap.get(XmlNodeConfigProcessor.PROPOSAL_DOC_COLLECTION).concat(LEG_FILE_EXTENSION);
        legPackage.setFile(ZipUtil.zipFiles(legPackageName, contentToZip));
        legPackage.setExportResource(proposalExportResource);
        return legPackage;
    }

    private Map<String, String> buildProposalExportResource(ExportResource exportResource, String docName, byte[] xmlContent) throws Exception {
        Map<String, XmlNodeConfig> config = new HashMap<>();
        config.putAll(xmlNodeConfigProcessor.getProposalComponentsConfig(LeosCategory.MEMORANDUM, "xml:id"));
        config.putAll(xmlNodeConfigProcessor.getProposalComponentsConfig(LeosCategory.MEMORANDUM, "href"));
        config.putAll(xmlNodeConfigProcessor.getProposalComponentsConfig(LeosCategory.BILL, "xml:id"));
        config.putAll(xmlNodeConfigProcessor.getProposalComponentsConfig(LeosCategory.BILL, "href"));
        config.putAll(xmlNodeConfigProcessor.getProposalComponentsConfig(LeosCategory.STAT_DIGIT_FINANC_LEGIS, "xml:id"));
        config.putAll(xmlNodeConfigProcessor.getProposalComponentsConfig(LeosCategory.STAT_DIGIT_FINANC_LEGIS, "href"));
        config.putAll(xmlNodeConfigProcessor.getConfig(LeosCategory.PROPOSAL));

        Map<String, String> proposalRefsMap = xmlNodeProcessor.getValuesFromXml(xmlContent,
                new String[]{XmlNodeConfigProcessor.PROPOSAL_DOC_COLLECTION, XmlNodeConfigProcessor.DOC_REF_COVER,
                        LeosCategory.MEMORANDUM.name() + "_xml:id",
                        LeosCategory.MEMORANDUM.name() + "_href",
                        LeosCategory.BILL.name() + "_xml:id",
                        LeosCategory.BILL.name() + "_href",
                        LeosCategory.STAT_DIGIT_FINANC_LEGIS.name() + "_xml:id",
                        LeosCategory.STAT_DIGIT_FINANC_LEGIS.name() + "_href"
                },
                config);

        exportResource.setResourceId(proposalRefsMap.get(XmlNodeConfigProcessor.PROPOSAL_DOC_COLLECTION));
        exportResource.setComponentsIdsMap(Collections.singletonMap(XmlNodeConfigProcessor.DOC_REF_COVER, proposalRefsMap.get(XmlNodeConfigProcessor.DOC_REF_COVER)));
        exportResource.setName(generateActFileName(docName, xmlContent));
        return proposalRefsMap;
    }

    private ExportResource buildExportResourceMemorandum(Map<String, String> proposalRefsMap) {
        ExportResource memorandumExportResource = new ExportResource(LeosCategory.MEMORANDUM);
        memorandumExportResource.setResourceId(proposalRefsMap.get(LeosCategory.MEMORANDUM.name() + "_xml:id"));
        memorandumExportResource.setHref(proposalRefsMap.get(LeosCategory.MEMORANDUM.name() + "_href"));
        //memorandumExportResource.setComponentsIdsMap(getCoverPage(LeosCategory.MEMORANDUM, xmlContent));
        return memorandumExportResource;
    }

    private ExportResource buildExportResourceBill(Map<String, String> proposalRefsMap, String docName) {
        ExportResource billExportResource = new ExportResource(LeosCategory.BILL);
        billExportResource.setResourceId(proposalRefsMap.get(LeosCategory.BILL.name() + "_xml:id"));
        billExportResource.setHref(proposalRefsMap.get(LeosCategory.BILL.name() + "_href"));
        billExportResource.setName(docName.contains(XML_DOC_EXT) ? docName.substring(0, docName.lastIndexOf(XML_DOC_EXT)) : docName);
        //billExportResource.setComponentsIdsMap(getCoverPage(LeosCategory.BILL, xmlContent));
        return billExportResource;
    }

    private ExportResource buildExportResourceAnnex(int docNumber, String docName, String resourceId, String href) {
        ExportResource annexExportResource = new ExportResource(LeosCategory.ANNEX);
        annexExportResource.setResourceId(resourceId);
        annexExportResource.setHref(href);
        annexExportResource.setName(docName.contains(XML_DOC_EXT) ? docName.substring(0, docName.lastIndexOf(XML_DOC_EXT)) : docName);
        annexExportResource.setDocNumber(docNumber);
        //annexExportResource.setComponentsIdsMap(getCoverPage(LeosCategory.ANNEX, xmlContent));
        return annexExportResource;
    }

    private ExportResource buildExportResourceFinancialStatement(Map<String, String> proposalRefsMap, String docName) {
        ExportResource finStmntExportResource = new ExportResource(LeosCategory.STAT_DIGIT_FINANC_LEGIS);
        finStmntExportResource.setResourceId(proposalRefsMap.get(LeosCategory.STAT_DIGIT_FINANC_LEGIS.name() + "_xml:id"));
        finStmntExportResource.setHref(proposalRefsMap.get(LeosCategory.STAT_DIGIT_FINANC_LEGIS.name() + "_href"));
        finStmntExportResource.setName(docName.contains(XML_DOC_EXT) ? docName.substring(0, docName.lastIndexOf(XML_DOC_EXT)) : docName);
        //finStmntExportResource.setComponentsIdsMap(getCoverPage(LeosCategory.STAT_DIGIT_FINANC_LEGIS, xmlContent));
        return finStmntExportResource;
    }

    private ExportResource buildExportResourceAnnex(int docNumber, String docName, String resourceId) {
        return buildExportResourceAnnex(docNumber, docName, resourceId, null);
    }

    private  Map<String, String> getCoverPage(LeosCategory leosCategory, byte[] xmlContent) {
        Map<String, XmlNodeConfig> config = new HashMap<>();
        config.putAll(xmlNodeConfigProcessor.getConfig(leosCategory));

        Map<String, String> refsMap = xmlNodeProcessor.getValuesFromXml(xmlContent,
                new String[]{XmlNodeConfigProcessor.DOC_REF_COVER}, config);

        return Collections.singletonMap(XmlNodeConfigProcessor.DOC_REF_COVER,
                refsMap.get(XmlNodeConfigProcessor.DOC_REF_COVER));
    }

    private void addResourceToZipContent(Map<String, Object> contentToZip, String resourceName, String sourcePath, String destPath) {
        try {
            Resource resource = new ClassPathResource(sourcePath + resourceName);
            contentToZip.put(destPath + resourceName, IOUtils.toByteArray(resource.getInputStream()));
        } catch (IOException io) {
            LOG.error("Error occurred while getting styles ", io);
        }
    }

    private String generateActFileName(String documentName, byte[] xmlContent) throws Exception {
        String docCollectionXPath = xPathCatalog.getXPathProposalDocCollection();
        String docCollectionName = xmlContentProcessor.getElementValue(xmlContent, docCollectionXPath);
        if(documentName.contains(XML_DOC_EXT)) {
            documentName = documentName.substring(0, documentName.lastIndexOf(XML_DOC_EXT));
        }
        String cuidAndLang = documentName.substring(documentName.indexOf("-") + 1, documentName.length());
        return docCollectionName.concat(DOC_FILE_NAME_SEPARATOR).concat(cuidAndLang);
    }
}
