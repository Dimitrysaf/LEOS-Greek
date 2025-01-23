package eu.europa.ec.leos.services.toc;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.services.api.ProposalTocApiServiceImpl;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.response.NodeValidationResponse;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessorImpl;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.StructureService;
import eu.europa.ec.leos.services.structure.StructureServiceImpl;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.template.TemplateStructureService;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.LeosTest;
import eu.europa.ec.leos.vo.structure.DocumentRules;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import io.atlassian.fugue.Option;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Provider;
import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.support.XmlHelper.BILL;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

public class TocHigherDivisionValidationTest extends LeosTest {

    private final static String STORE_DIR = "/store/";
    private List<TocItem> tocItems;
    private Map<String, List<String>> languageMap = new HashMap<>();
    private LanguageMapHolder languageMapHolder;
    private LanguageGroupService languageGroupService;
    private byte[] xmlContent;

    @Mock
    private Provider<StructureContext> structureContextProvider;
    @Mock
    private BillService billService;
    @Mock
    private AnnexService annexService;
    @Mock
    private MessageHelper messageHelper;
    @Mock
    private ExplanatoryService explanatoryService;
    @Mock
    private DocumentLanguageContext documentLanguageContext;
    @Mock
    private StructureContext structureContext;
    @Mock
    private ConfigurationRepository configurationRepository;
    @Mock
    private TemplateStructureService templateStructureService;
    @Mock
    private XPathCatalog xPathCatalog;
    @Mock
    private XmlContentProcessor xmlContentProcessor;
    @InjectMocks
    private TableOfContentProcessor tableOfContentProcessor = Mockito.spy(new TableOfContentProcessorImpl());
    @InjectMocks
    private StructureService structureService = spy(new StructureServiceImpl());
    @InjectMocks
    private ProposalTocApiServiceImpl proposalTocApiServiceImpl;

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
        xmlContent = TestUtils.getFileContent(STORE_DIR, "billForTocHigherDivisionValidation.xml");
        Content.Source source = new SourceImpl(new ByteArrayInputStream(xmlContent));
        Content content = new ContentImpl("BL-000.xml", "mime type", xmlContent.length, source);
        BillMetadata billMetadata = new BillMetadata("", "REGULATION", "", "BL-000.xml", "EN", "BL-000.xml",
                "bill_ckn5qw5dr0085sv00o919q56w", "package_123", "1", "0.0.1", false);
        Bill bill = new Bill("27", "billForTocHigherDivisionValidation.xml", "jane", Instant.now(), "jane", Instant.now(),
                "0.1.0", "", "0.1.0", "", VersionType.MINOR, true,
                "title", Collections.emptyList(), Arrays.asList(""), "", "", "",
                Option.some(content), Option.some(billMetadata), false, false);

        String docTemplate = "BL-023";
        languageMap.put("greek", Arrays.asList("el"));
        languageMap.put("latin", Arrays.asList("cs", "da", "de", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"));
        languageMap.put("cyrillic", Arrays.asList("bg"));
        documentLanguageContext.setDocumentLanguage("en");
        languageMapHolder = Mockito.spy(new LanguageMapHolder());
        languageGroupService = Mockito.spy(new LanguageGroupService(configurationRepository, languageMapHolder));
        languageMapHolder.loadLanguageMap(languageMap);
        byte[] bytesFile = TestUtils.getFileContent("/structure-test-bill-EC.xml");
        when(templateStructureService.getStructure(docTemplate)).thenReturn(bytesFile);
        ReflectionTestUtils.setField(structureService, "structureSchema", "schema/structure/structure_1.xsd");

        tocItems = structureService.getTocItems(docTemplate);
        Map<TocItem, List<TocItem>> tableOfContentRules = structureService.getTocRules(docTemplate);
        Map<String, DocumentRules.Rule> tableOfContentDocumentRules = structureService.getDocumentRules(docTemplate);

        when(billService.findBillByRef(any())).thenReturn(bill);
        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(tocItems);
        when(structureContext.getTocRules()).thenReturn(tableOfContentRules);
        when(structureContext.getDocumentRules()).thenReturn(tableOfContentDocumentRules);
    }

    @Test
    public void testAddingSectionAsSibling() {
        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("bill_ckn5qw5dr0085sv00o919q56w-en");
        request.setDocumentType(LeosCategory.BILL);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_7e3vkt6");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("SECTION");
        request.setTargetNodeId("art_4");
        request.setTargetNodeTagName("ARTICLE");
        request.setParentNodeId("body");
        request.setParentNodeTagName("BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(BILL, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertTrue(nodeValidationResponse.getResult().isSuccess());
        assertTrue(nodeValidationResponse.getResult().isWarning());
        assertTrue(nodeValidationResponse.getResult().getWarningMessageKeys().
                contains("toc.higher.division.hierarchy.validation.warning.message"));
    }

    @Test
    public void testAddingArticleAsSibling() {
        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("bill_ckn5qw5dr0085sv00o919q56w-en");
        request.setDocumentType(LeosCategory.BILL);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_7e3vkt6");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("ARTICLE");
        request.setTargetNodeId("ecQs6xCVQ4pvu0L8V");
        request.setTargetNodeTagName("CHAPTER");
        request.setParentNodeId("body");
        request.setParentNodeTagName("BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(BILL, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertTrue(nodeValidationResponse.getResult().isSuccess());
        assertTrue(nodeValidationResponse.getResult().isWarning());
        assertTrue(nodeValidationResponse.getResult().getWarningMessageKeys().
                contains("toc.higher.division.structure.validation.warning.message"));
    }

    @Test
    public void testAddingEmptyHigherDivision() {
        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("bill_ckn5qw5dr0085sv00o919q56w-en");
        request.setDocumentType(LeosCategory.BILL);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_7e3vkt6");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("SECTION");
        request.setTargetNodeId("ecQs6xCVQ4pvu0L8V");
        request.setTargetNodeTagName("CHAPTER");
        request.setParentNodeId("body");
        request.setParentNodeTagName("BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(BILL, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertTrue(nodeValidationResponse.getResult().isSuccess());
        assertTrue(nodeValidationResponse.getResult().isWarning());
        assertTrue(nodeValidationResponse.getResult().getWarningMessageKeys().
                contains("toc.higher.division.empty.validation.warning.message"));
        }
}