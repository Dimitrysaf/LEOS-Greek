package eu.europa.ec.leos.services.toc;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
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

import static eu.europa.ec.leos.services.support.XmlHelper.DOC;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

public class TocApiServiceImplTest extends LeosTest {

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
        xmlContent = TestUtils.getFileContent(STORE_DIR, "annexForLevelAndParagraphs.xml");
        Content.Source source = new SourceImpl(new ByteArrayInputStream(xmlContent));
        Content content = new ContentImpl("AN-000.xml", "mime type", xmlContent.length, source);
        AnnexMetadata annexMetadata = new AnnexMetadata("", "REGULATION", "", "AN-000.xml", "EN", "AN-000.xml",
                "ANNEX-cm03pntv70000i0886z718qdc-en.xml", 1, "Annex 1", "title", "", "0.0.1", false, STORE_DIR);
        Annex annex = new Annex("27", "ANNEX-cm03pntv70000i0886z718qdc-en.xml", "jane", Instant.now(), "jane", Instant.now(),
                "0.1.0", "", "0.1.0", "", VersionType.MINOR, true,
                "title", Collections.emptyList(), Arrays.asList(""), "", false, "", "",
                Option.some(content), Option.some(annexMetadata), false, false);

        String docTemplate = "CE-001";
        languageMap.put("greek", Arrays.asList("el"));
        languageMap.put("latin", Arrays.asList("cs", "da", "de", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"));
        languageMap.put("cyrillic", Arrays.asList("bg"));
        documentLanguageContext.setDocumentLanguage("en");
        languageMapHolder = Mockito.spy(new LanguageMapHolder());
        languageGroupService = Mockito.spy(new LanguageGroupService(configurationRepository, languageMapHolder));
        languageMapHolder.loadLanguageMap(languageMap);
        byte[] bytesFile = TestUtils.getFileContent("/structure-test-annex-EC.xml");
        when(templateStructureService.getStructure(docTemplate)).thenReturn(bytesFile);
        ReflectionTestUtils.setField(structureService, "structureSchema", "schema/structure/structure_1.xsd");

        tocItems = structureService.getTocItems(docTemplate);
        Map<TocItem, List<TocItem>> tableOfContentRules = structureService.getTocRules(docTemplate);
        Map<String, DocumentRules.Rule> tableOfContentDocumentRules = structureService.getDocumentRules(docTemplate);

        when(annexService.findAnnexByRef(any())).thenReturn(annex);
        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(tocItems);
        when(structureContext.getTocRules()).thenReturn(tableOfContentRules);
        when(structureContext.getDocumentRules()).thenReturn(tableOfContentDocumentRules);

    }

    @Test
    public void testAddingParagraphBetweenLevels() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_7e3vkt6");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("PARAGRAPH");
        request.setTargetNodeId("ecN6GgTCJffKvkzd0");
        request.setTargetNodeTagName("LEVEL");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.BEFORE);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingParagraphBeforeLevels() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_tylpbc5");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("PARAGRAPH");
        request.setTargetNodeId("ecR02AW5nOdht0KW9");
        request.setTargetNodeTagName("LEVEL");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.BEFORE);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertTrue(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingParagraphAfterLevels() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("PARAGRAPH");
        request.setTargetNodeId("ecYxBUS8KG1uQo0Wt");
        request.setTargetNodeTagName("LEVEL");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertTrue(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingParagraphAfterSection() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("PARAGRAPH");
        request.setTargetNodeId("ecR8JQp3GOYu0g2J0");
        request.setTargetNodeTagName("SECTION");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingLevelThatBreaksStructure() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("LEVEL");
        request.setTargetNodeId("ecvSHbHOtVD7sj8g2");
        request.setTargetNodeTagName("PARAGRAPH");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.BEFORE);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingParagraphInsideSectionThatBreaksStructure() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("ecfcuY33QDVSdpahh");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("SECTION");
        request.setTargetNodeId("ec2jvOjaBNhKUM9hb");
        request.setTargetNodeTagName("LEVEL");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.BEFORE);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingLevelInsideSectionThatBreaksStructure() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("ec2T4Rali2vdE9oht");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("SECTION");
        request.setTargetNodeId("ecxWP5kPId3aJhP9I");
        request.setTargetNodeTagName("PARAGRAPH");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingLevelAfterParagraphInsideSection() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("LEVEL");
        request.setTargetNodeId("ecDWTOBYD2DlTy80k");
        request.setTargetNodeTagName("PARAGRAPH");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingLevelAfterSectionWithParagraphInside() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("LEVEL");
        request.setTargetNodeId("ecZOO1npqgWzLuA3G");
        request.setTargetNodeTagName("SECTION");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingLevelBeforeLastParagraph() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("LEVEL");
        request.setTargetNodeId("ecxWP5kPId3aJhP9I");
        request.setTargetNodeTagName("PARAGRAPH");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.BEFORE);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

    @Test
    public void testAddingLevelAfterLastParagraph() {

        NodeDropValidationRequest request = new NodeDropValidationRequest();
        request.setDocumentRef("ANNEX-cm02swx630004w088cwecaqqj-en");
        request.setDocumentType(LeosCategory.ANNEX);
        List<String> draggedNodeIds = new ArrayList<>();
        draggedNodeIds.add("_d4haocm");
        request.setDraggedNodeId(draggedNodeIds);
        request.setDraggedNodeTagName("LEVEL");
        request.setTargetNodeId("ecxWP5kPId3aJhP9I");
        request.setTargetNodeTagName("PARAGRAPH");
        request.setParentNodeId("eckZ8NENtFQH0IA9U");
        request.setParentNodeTagName("MAIN_BODY");
        request.setPosition(TocItemPosition.AFTER);

        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlContent, TocMode.NOT_SIMPLIFIED);
        request.setTableOfContentItemVOs(tocList);

        NodeValidationResponse nodeValidationResponse = proposalTocApiServiceImpl.nodeValidationDrop(request);
        assertFalse(nodeValidationResponse.getResult().isSuccess());

    }

}