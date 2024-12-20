package eu.europa.ec.leos.services.processor;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorImpl;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorProposal;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.StructureServiceImpl;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.template.TemplateStructureService;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.LeosTest;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import io.atlassian.fugue.Option;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Provider;
import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndRemoveAllNS;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

public class FinancialStatementProcessorTest extends LeosTest {
    protected final static String FILE_PREFIX = "/contentProcessor";

    @Mock
    private ElementProcessor elementProcessor;

    @Mock
    private NumberService numberService;

    @Mock
    private TableOfContentProcessor tableOfContentProcessor;

    @Mock
    private Provider<StructureContext> structureContextProvider;

    @Mock
    private MessageHelper messageHelper;

    @Mock
    private StructureContext structureContext;

    @Mock
    private TemplateStructureService templateStructureService;

    @InjectMocks
    private XPathCatalog xPathCatalog = spy(new XPathCatalog());

    @InjectMocks
    XmlContentProcessorImpl xmlContentProcessor = new XmlContentProcessorProposal();

    @InjectMocks
    protected DocumentLanguageContext documentLanguageContext = Mockito.spy(new DocumentLanguageContext());

    @InjectMocks
    private StructureServiceImpl structureServiceImpl = Mockito.spy(new StructureServiceImpl());

    @InjectMocks
    private FinancialStatementProcessor fsp = new FinancialStatementProcessorImpl(xmlContentProcessor, numberService,elementProcessor,structureContextProvider,tableOfContentProcessor,messageHelper);

    private String docTemplate;
    private List<TocItem> tocItems;
    private List<NumberingConfig> numberingConfigs;

    @Before
    public void setUp(){
        docTemplate = "FS-001";
        documentLanguageContext.setDocumentLanguage("en");
        byte[] bytesFile = TestUtils.getFileContent("/structure-test-lfds-EC.xml");
        when(templateStructureService.getStructure(docTemplate)).thenReturn(bytesFile);
        ReflectionTestUtils.setField(structureServiceImpl, "structureSchema", "schema/structure/structure_1.xsd");

        tocItems = structureServiceImpl.getTocItems(docTemplate);
        numberingConfigs = structureServiceImpl.getNumberingConfigs(docTemplate);

        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(tocItems);
        when(structureContext.getNumberingConfigs()).thenReturn(numberingConfigs);
        //test_lfds_subparagraph_repeat_expected.xml
    }

    @Test
    public void test_repeatElement_when_insert_after() {
        byte[] xmlContent = TestUtils.getFileContent(FILE_PREFIX + "/test_lfds_subparagraph_repeat.xml");
        Content content = new ContentImpl(
                "test_lfds_subparagraph_repeat.xml",
                "mime type",
                23,
                new SourceImpl(new ByteArrayInputStream(xmlContent)));
        FinancialStatement fs = getMockedFinancialStatement(content);
        byte[] result = fsp.repeatElement(fs, "ecVfyzuWfoIDe22U0", false);
        byte[] docContentExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_lfds_subparagraph_repeat_expected.xml");
        String expected = squeezeXmlAndRemoveAllNS(squeezeXmlAndRemoveAllNS(new String(docContentExpected)));
        String actual = squeezeXmlAndRemoveAllNS(new String(result));
        assertEquals(expected, actual);
    }

    @Test
    public void test_repeatGroup_when_insert_before() {
        byte[] xmlContent = TestUtils.getFileContent(FILE_PREFIX + "/test_lfds_subparagraph_repeat_group.xml");
        Content content = new ContentImpl(
                "test_lfds_subparagraph_repeat_group.xml",
                "mime type",
                23,
                new SourceImpl(new ByteArrayInputStream(xmlContent)));
        FinancialStatement fs = getMockedFinancialStatement(content);
        byte[] result = fsp.repeatGroup(fs, "ecrJTWPuawRRHNysk", true);
        byte[] docContentExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_lfds_subparagraph_repeat_group_before_expected.xml");
        String expected = squeezeXmlAndRemoveAllNS(squeezeXmlAndRemoveAllNS(new String(docContentExpected)));
        String actual = squeezeXmlAndRemoveAllNS(new String(result));
        assertEquals(expected, actual);
    }

    @Test
    public void test_repeatGroup_when_insert_after() {
        byte[] xmlContent = TestUtils.getFileContent(FILE_PREFIX + "/test_lfds_subparagraph_repeat_group.xml");
        Content content = new ContentImpl(
                "test_lfds_subparagraph_repeat_group.xml",
                "mime type",
                23,
                new SourceImpl(new ByteArrayInputStream(xmlContent)));
        FinancialStatement fs = getMockedFinancialStatement(content);
        byte[] result = fsp.repeatGroup(fs, "ec5GkcFtiqW7HvfoB", false);
        byte[] docContentExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_lfds_subparagraph_repeat_group_after_expected.xml");
        String expected = squeezeXmlAndRemoveAllNS(squeezeXmlAndRemoveAllNS(new String(docContentExpected)));
        String actual = squeezeXmlAndRemoveAllNS(new String(result));
        assertEquals(expected, actual);
    }

    private FinancialStatement getMockedFinancialStatement(Content content) {
        FinancialStatementMetadata fsm = new FinancialStatementMetadata(
                "... at this stage",
                "LEGISLATIVE FINANCIAL AND DIGITAL STATEMENT",
                "on ...",
                "FS-001",
                "EN",
                "FS-001",
                "lfds",
                "LEGISLATIVE FINANCIAL AND DIGITAL STATEMENT",
                "555",
                "0.1.0",
                false);

        List<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("test", "OWNER", "SG"));

        return new FinancialStatement(
                "555",
                "STAT_FINANC_LEGIS",
                "test",
                Instant.now(),
                "test",
                Instant.now(),
               "",
                "",
                "Version 1.0.0",
                "",
                VersionType.MAJOR,
                true,
                "title",
                collaborators,
                Arrays.asList(""),
                Option.some(content),
                Option.some(fsm),
                "",
                false,
                "",
                "");
    }
}