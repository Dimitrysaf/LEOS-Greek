package eu.europa.ec.leos.services.processor.content;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.i18n.LanguageHelper;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.security.AuthenticatedUser;
import eu.europa.ec.leos.services.processor.content.indent.IndentConversionHelper;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.services.template.TemplateStructureService;
import eu.europa.ec.leos.services.support.XmlUtils;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.StructureServiceImpl;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.services.validation.handlers.AkomantosoXsdValidator;
import eu.europa.ec.leos.test.support.LeosTest;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import jakarta.inject.Provider;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import static eu.europa.ec.leos.services.support.XmlHelper.BILL;
import static eu.europa.ec.leos.services.support.XmlHelper.CN;
import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_TRANS_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

public class TableOfContentHelperTest extends LeosTest {
    private final AkomantosoXsdValidator akomantosoXsdValidator = new AkomantosoXsdValidator();

    @Mock
    private StructureContext structureContext;
    @Mock
    private Provider<StructureContext> structureContextProvider;
    @Mock
    private TemplateStructureService templateStructureService;
    @Mock
    private eu.europa.ec.leos.security.SecurityContext leosSecurityContext;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @Mock
    private UserDetails userDetails;
    @InjectMocks
    private LanguageHelper languageHelper = Mockito.spy(new LanguageHelper());
    @InjectMocks
    private StructureServiceImpl structureServiceImpl;
    @InjectMocks
    private XmlContentProcessorMandate xmlContentProcessor = Mockito.spy(new XmlContentProcessorMandate());
    @Mock
    private ConfigurationRepository configurationRepository;
    protected LanguageMapHolder languageMapHolder;
    protected LanguageGroupService languageGroupService;
    @InjectMocks
    protected DocumentLanguageContext documentLanguageContext = Mockito.spy(new DocumentLanguageContext(languageHelper));

    private List<TocItem> tocItems;
    private List<NumberingConfig> numberingConfigs;
    private Map<TocItem, List<TocItem>> tocRules;
    private String docTemplate;

    @InjectMocks
    private TableOfContentProcessor tableOfContentProcessor = Mockito.spy(new TableOfContentProcessorImpl());
    @InjectMocks
    private IndentConversionHelper indentConversionHelper = new IndentConversionHelper();
    protected Map<String, List<String>> languageMap = new HashMap<>();
    private final static String INDENT_FOLDER = "/indent/";

    private void setTemplateAndStructureFile(String template, String structureFile) {
        languageMap.put("greek", List.of("el"));
        languageMap.put("latin", List.of("cs", "da", "de", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"));
        languageMap.put("cyrillic", List.of("bg"));
        documentLanguageContext.setDocumentLanguage("en");
        languageMapHolder = Mockito.spy(new LanguageMapHolder());
        languageGroupService = Mockito.spy(new LanguageGroupService(configurationRepository, languageMapHolder));

        //populate language map
        languageMapHolder.loadLanguageMap(languageMap);

        docTemplate = template;
        byte[] bytesFile = TestUtils.getFileContent(structureFile);
        when(templateStructureService.getStructure(docTemplate, false)).thenReturn(bytesFile);
        ReflectionTestUtils.setField(structureServiceImpl, "structureSchema", "schema/structure/structure_1.xsd");
        tocItems = structureServiceImpl.getTocItems(docTemplate);
        numberingConfigs = structureServiceImpl.getNumberingConfigs(docTemplate);
        tocRules = structureServiceImpl.getTocRules(docTemplate);

        try {
            ReflectionTestUtils.setField(akomantosoXsdValidator, "SCHEMA_PATH", "eu/europa/ec/leos/xsd");
            ReflectionTestUtils.setField(akomantosoXsdValidator, "SCHEMA_NAME", "akomantoso30.xsd");
            akomantosoXsdValidator.initXSD();
        } catch (Exception e) {
            e.printStackTrace();
        }

        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(tocItems);
        when(structureContext.getNumberingConfigs()).thenReturn(numberingConfigs);
        when(structureContext.getTocRules()).thenReturn(tocRules);

        User user = new User(3L, "demo", "demo", List.of(new Entity("7", "DGT.R.3", "DGT")), "demo@mail.com", Arrays.asList("SUPPORT", "USER"));
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(user);
        when(userDetails.getUsername()).thenReturn("demo");
        when(authentication.getPrincipal()).thenReturn(authenticatedUser);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(leosSecurityContext.getUserName()).thenReturn("demo");
        when(languageHelper.getCurrentLocale()).thenReturn(new Locale("en"));
        SecurityContextHolder.setContext(securityContext);
    }

    @BeforeEach
    public void onSetUp() {
        super.setup();
        setTemplateAndStructureFile("BL-017", "/structure-test-bill-CN.xml");
    }

    private TableOfContentItemVO getItemFromToc(String fileName, String id) {
        byte[] v0 = TestUtils.getFileContent(INDENT_FOLDER, fileName);
        List<TableOfContentItemVO> toc = tableOfContentProcessor.buildTableOfContent(BILL, v0, TocMode.NOT_SIMPLIFIED, true);
        Optional<TableOfContentItemVO> item = TableOfContentHelper.getItemFromTocById(id, toc);
        return item.orElseGet(null);
    }

    @Test
    public void test_restore_Subpoint_FromFirstSubpoint() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_firstsubpoint.xml", "transformedXart_1_6G47GHJ");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildSubElementFromFirstElement(tocItems, item, 1, true, false, false);
        Node node =convertedItem.getNode();
        assertEquals(SUBPARAGRAPH, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(3, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(0).getNodeName());
        assertEquals(EC, attributes.item(0).getNodeValue());
        assertEquals(XMLID, attributes.item(2).getNodeName());
        assertEquals("art_1_6G47GHJ", attributes.item(2).getNodeValue());
        assertEquals(1, children.size());
        assertEquals(CONTENT, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_NGHSZ", childAttributes.item(1).getNodeValue());
        assertEquals("subpoint of indent", XmlUtils.getChildren(children.getFirst()).getFirst().getTextContent());
    }

    @Test
    public void test_restore_Subpoint_FromPoint() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_8g5Tr7");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildSubElementFromElement(tocItems, item, 1, true, false, false);
        Node node = convertedItem.getNode();
        assertEquals(SUBPARAGRAPH, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(5, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(0).getNodeName());
        assertEquals(CN, attributes.item(0).getNodeValue());
        assertEquals(XMLID, attributes.item(4).getNodeName());
        assertEquals("art_1_8g5Tr7", attributes.item(4).getNodeValue());
        assertEquals(1, children.size());
        assertEquals(CONTENT, children.get(0).getNodeName());
        NamedNodeMap childAttributes = children.get(0).getAttributes();
        assertEquals(1, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(0).getNodeName());
        assertEquals("art_1_rJiXQs", childAttributes.item(0).getNodeValue());
        assertEquals("Test", XmlUtils.getChildren(children.get(0)).get(0).getTextContent());
    }

    @Test
    public void test_restore_Subpoint_FromFirstSubparagraph() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_firstsubparagraph.xml", "indented_akn_article_ebFhaW_EXRv7x");
        TableOfContentHelper.removeChildItem(item, item.getChildItems().get(1));
        TableOfContentItemVO convertedItem = indentConversionHelper.buildSubElementFromFirstElement(tocItems, item, 1, true, true, false);
        Node node = convertedItem.getNode();
        assertEquals(SUBPARAGRAPH, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(5, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(0).getNodeName());
        assertEquals(CN, attributes.item(0).getNodeValue());
        assertEquals(XMLID, attributes.item(4).getNodeName());
        assertEquals("akn_article_ebFhaW_EXRv7x", attributes.item(4).getNodeValue());
        assertEquals(1, children.size());
        assertEquals(CONTENT, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(CN, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("akn_article_ebFhaW_XCnEA2", childAttributes.item(1).getNodeValue());
        assertEquals("Second subpoint,", XmlUtils.getChildren(children.getFirst()).getFirst().getTextContent());
    }

    @Test
    public void test_restore_Subpoint_FromSubparagraph() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_firstsubparagraph.xml", "akn_article_ebFhaW_qxNs2C");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildSubElementFromSubElement(tocItems, item, 1, true, false);
        Node node = convertedItem.getNode();
        assertEquals(SUBPARAGRAPH, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(6, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(0).getNodeName());
        assertEquals(CN, attributes.item(0).getNodeValue());
        assertEquals(XMLID, attributes.item(5).getNodeName());
        assertEquals("akn_article_ebFhaW_qxNs2C", attributes.item(5).getNodeValue());
        assertEquals(1, children.size());
        assertEquals(CONTENT, children.get(0).getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(CN, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("akn_article_ebFhaW_uJ1SEb", childAttributes.item(1).getNodeValue());
        assertEquals("Third subpoint,", XmlUtils.getChildren(children.get(0)).get(0).getTextContent());
    }

    @Test
    public void test_point_FromFirstSubpoint() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "transformedXart_1_urNCcV");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildElementFromFirstElement(tocItems, item, 1, false, false, false);
        Node node = convertedItem.getNode();
        assertEquals(POINT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(7, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(5).getNodeName());
        assertEquals(EC, attributes.item(5).getNodeValue());
        assertEquals(XMLID, attributes.item(6).getNodeName());
        assertEquals("art_1_urNCcV", attributes.item(6).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(3, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_gFkBde", childAttributes.item(1).getNodeValue());
        assertEquals("(a)", children.get(0).getTextContent());
        assertEquals(CONTENT, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_Qzmsjc", childAttributes.item(1).getNodeValue());
        assertEquals("test", XmlUtils.getChildren(children.get(1)).get(0).getTextContent());
    }

    @Test
    public void test_point_FromParagraph() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_RXdbC0");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildElementFromElement(tocItems, item, 1, false, false);
        Node node = convertedItem.getNode();
        assertEquals(POINT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(7, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(5).getNodeName());
        assertEquals(EC, attributes.item(5).getNodeValue());
        assertEquals(XMLID, attributes.item(6).getNodeName());
        assertEquals("art_1_RXdbC0", attributes.item(6).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(3, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_uXQ0yL", childAttributes.item(1).getNodeValue());
        assertEquals("1.", children.get(0).getTextContent());
        assertEquals(CONTENT, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_wmf7Mf", childAttributes.item(1).getNodeValue());
        assertEquals("POINT", XmlUtils.getChildren(children.get(1)).getFirst().getTextContent());
    }

    @Test
    public void test_point_FromFirstSubparagraph() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_GqEOBU");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildElementFromFirstElement(tocItems, item, 1, false, true, false);
        Node node = convertedItem.getNode();
        assertEquals(POINT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(9, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(5).getNodeName());
        assertEquals(EC, attributes.item(5).getNodeValue());
        assertEquals(LEOS_SOFT_TRANS_FROM, attributes.item(7).getNodeName());
        assertEquals("art_1_MU1hKr", attributes.item(7).getNodeValue());
        assertEquals(XMLID, attributes.item(8).getNodeName());
        assertEquals("art_1_GqEOBU", attributes.item(8).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(3, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_Woc735", childAttributes.item(1).getNodeValue());
        assertEquals("2.", children.get(0).getTextContent());
        assertEquals(CONTENT, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_fCeC1t", childAttributes.item(1).getNodeValue());
        String content = XmlUtils.getChildren(children.get(1)).getFirst().getTextContent().replaceAll("[\\t|\\n|\\r|\\s]","");
        assertEquals("Example --Point(c)indented", content);
    }

    @Test
    public void test_point_FromSubpoint() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_ExfjFV");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildElementFromSubElement(tocItems, item, 1, false, false, false);
        Node node = convertedItem.getNode();
        assertEquals(POINT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(7, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(2).getNodeName());
        assertEquals(CN, attributes.item(2).getNodeValue());
        assertEquals(XMLID, attributes.item(6).getNodeName());
        assertEquals("art_1_ExfjFV", attributes.item(6).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(0, childAttributes.getLength());
        assertEquals("", children.get(0).getTextContent());
        assertEquals(CONTENT, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(1, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(0).getNodeName());
        assertEquals("art_1_IBPut4", childAttributes.item(0).getNodeValue());
        String content = XmlUtils.getChildren(children.get(1)).getFirst().getTextContent().replaceAll("[\\t|\\n|\\r|\\s]","");
        assertEquals("storage,comprisingcustomswarehousingandfreezones;", content);
    }

    @Test
    public void test_firstsubpoint_FromSubpoint() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_ExfjFV");
        item.addChildItem(new TableOfContentItemVO(new TocItem(), "id", CN, null, null, null, null, null, null, ""));
        TableOfContentItemVO convertedItem = indentConversionHelper.buildFirstElementFromSubElement(tocItems, item, 1, false, false, false);

        Node node = convertedItem.getNode();
        assertEquals(POINT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(7, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(2).getNodeName());
        assertEquals(CN, attributes.item(2).getNodeValue());
        assertEquals(XMLID, attributes.item(6).getNodeName());
        assertEquals("indented_art_1_ExfjFV", attributes.item(6).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(0, childAttributes.getLength());
        assertEquals("", children.get(0).getTextContent());
        assertEquals(SUBPARAGRAPH, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(6, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(5).getNodeName());
        assertEquals("art_1_ExfjFV", childAttributes.item(5).getNodeValue());
        Node content = XmlUtils.getFirstChild(children.get(1), CONTENT);
        assertNotNull(content);
        childAttributes = content.getAttributes();
        assertEquals(1, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(0).getNodeName());
        assertEquals("art_1_IBPut4", childAttributes.item(0).getNodeValue());
        String contentStr = XmlUtils.getChildren(content).get(0).getTextContent().replaceAll("[\\t|\\n|\\r|\\s]","");
        assertEquals("storage,comprisingcustomswarehousingandfreezones;", contentStr);
    }

    @Test
    public void test_firstsubpoint_FromPoint() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_8g5Tr7");
        item.addChildItem(new TableOfContentItemVO(new TocItem(), "id", CN, null, null, null, null, null, null, ""));
        TableOfContentItemVO convertedItem = indentConversionHelper.buildFirstElementFromElement(tocItems, item, 1, false, false, false);
        Node node = convertedItem.getNode();
        assertEquals(INDENT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(7, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(2).getNodeName());
        assertEquals(CN, attributes.item(2).getNodeValue());
        assertEquals(XMLID, attributes.item(6).getNodeName());
        assertEquals("indented_art_1_8g5Tr7", attributes.item(6).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.getFirst().getNodeName());
        NamedNodeMap childAttributes = children.getFirst().getAttributes();
        assertEquals(3, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("num_9yZwYq", childAttributes.item(1).getNodeValue());
        assertEquals("-", children.get(0).getTextContent());
        assertEquals(SUBPARAGRAPH, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(5, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(4).getNodeName());
        assertEquals("art_1_8g5Tr7", childAttributes.item(4).getNodeValue());
        Node content = XmlUtils.getFirstChild(children.get(1), CONTENT);
        assertNotNull(content);
        childAttributes = content.getAttributes();
        assertEquals(1, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(0).getNodeName());
        assertEquals("art_1_rJiXQs", childAttributes.item(0).getNodeValue());
        assertEquals("Test", XmlUtils.getChildren(content).getFirst().getTextContent());
    }

    @Test
    public void test_firstsubpoint_FromFirstsubparaph() {
        TableOfContentItemVO item = getItemFromToc("indent_subpoint_to_point.xml", "art_1_GqEOBU");
        TableOfContentItemVO convertedItem = indentConversionHelper.buildFirstElementFromFirstElement(tocItems, item, 1, false, false);
        Node node = convertedItem.getNode();
        assertEquals(POINT, node.getNodeName());
        NamedNodeMap attributes = node.getAttributes();
        List<Node> children = XmlUtils.getChildren(node);
        assertEquals(7, attributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, attributes.item(5).getNodeName());
        assertEquals(EC, attributes.item(5).getNodeValue());
        assertEquals(XMLID, attributes.item(6).getNodeName());
        assertEquals("art_1_GqEOBU", attributes.item(6).getNodeValue());
        assertEquals(2, children.size());
        assertEquals(NUM, children.get(0).getNodeName());
        NamedNodeMap childAttributes = children.get(0).getAttributes();
        assertEquals(3, childAttributes.getLength());
        assertEquals(LEOS_ORIGIN_ATTR, childAttributes.item(0).getNodeName());
        assertEquals(EC, childAttributes.item(0).getNodeValue());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_Woc735", childAttributes.item(1).getNodeValue());
        assertEquals("2.", children.get(0).getTextContent());
        assertEquals(SUBPARAGRAPH, children.get(1).getNodeName());
        childAttributes = children.get(1).getAttributes();
        assertEquals(3, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(2).getNodeName());
        assertEquals("art_1_MU1hKr", childAttributes.item(2).getNodeValue());
        Node content = XmlUtils.getFirstChild(children.get(1), CONTENT);
        assertNotNull(content);
        childAttributes = content.getAttributes();
        assertEquals(2, childAttributes.getLength());
        assertEquals(XMLID, childAttributes.item(1).getNodeName());
        assertEquals("art_1_fCeC1t", childAttributes.item(1).getNodeValue());
        String contentStr = XmlUtils.getChildren(content).getFirst().getTextContent().replaceAll("[\\t|\\n|\\r|\\s]","");
        assertEquals("Example --Point(c)indented", contentStr);
    }
}
