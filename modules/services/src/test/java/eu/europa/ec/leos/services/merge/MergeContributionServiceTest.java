package eu.europa.ec.leos.services.merge;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.i18n.MandateMessageHelper;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.MergeContributionService;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ContributionServiceProposalImpl;
import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandler;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandlerProposal;
import eu.europa.ec.leos.services.numbering.NumberServiceProposal;
import eu.europa.ec.leos.services.numbering.NumberServiceTest;
import eu.europa.ec.leos.services.numbering.config.NumberConfigFactory;
import eu.europa.ec.leos.services.numbering.depthBased.ParentChildConverter;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessor;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorArticle;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDefault;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDepthBased;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDepthBasedDefault;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorParagraphAndPoint;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorProposal;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.model.ModelHelper;
import io.atlassian.fugue.Option;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndDummyDate;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndDummyDateWithoutOrigin;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndOriginAndDummyDate;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlRemoveNumValue;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlWithoutIdsAndDummyDate;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

public class MergeContributionServiceTest extends NumberServiceTest {
    @Mock
    protected CloneContext cloneContext;

    @Mock
    private ProposalService proposalService;

    @Mock
    private PackageService packageService;

    @Mock
    private BillService billService;

    @Mock
    private AnnexService annexService;

    @Mock
    private MemorandumService memorandumService;

    @Mock
    private LegService legService;

    @Mock
    private LeosRepository leosRepository;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    protected MessageHelper messageHelper = Mockito.spy(getMessageHelper());

    @Mock
    private RepositoryPropertiesMapper repositoryPropertiesMapper;

    @InjectMocks
    protected XPathCatalog xPathCatalog = spy(new XPathCatalog());

    @InjectMocks
    protected XmlContentProcessorProposal xmlContentProcessor = spy(new XmlContentProcessorProposal());

    protected ParentChildConverter parentChildConverter = new ParentChildConverter();

    @InjectMocks
    protected NumberConfigFactory numberConfigFactory = Mockito.spy(new NumberConfigFactory());

    @InjectMocks
    protected NumberProcessorHandler numberProcessorHandler = new NumberProcessorHandlerProposal();

    private TrackChangesContext trackChangesContext = new TrackChangesContext();
    private NumberProcessor numberProcessorArticle = new NumberProcessorArticle(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);
    private NumberProcessor numberProcessorPoint = new NumberProcessorParagraphAndPoint(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);
    private NumberProcessor numberProcessorDefault = new NumberProcessorDefault(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);
    private NumberProcessorDepthBased numberProcessorDepthBasedDefault = new NumberProcessorDepthBasedDefault(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);
    private NumberProcessorDepthBased numberProcessorLevel = new eu.europa.ec.leos.services.numbering.processor.NumberProcessorLevel(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);

    @InjectMocks
    protected List<NumberProcessor> numberProcessors = Mockito.spy(Stream.of(numberProcessorArticle,
            numberProcessorPoint,
            numberProcessorDefault).collect(Collectors.toList()));
    @InjectMocks
    protected List<NumberProcessorDepthBased> numberProcessorsDepthBased = Mockito.spy(Stream.of(numberProcessorDepthBasedDefault, numberProcessorLevel)
            .collect(Collectors.toList()));

    @InjectMocks
    NumberServiceProposal numberService;

    @InjectMocks
    eu.europa.ec.leos.services.document.ContributionService contributionService = new ContributionServiceProposalImpl<Bill>(
            leosRepository, messageHelper,
            proposalService, packageService,
            billService, annexService,
            memorandumService, legService, xmlContentProcessor, repositoryPropertiesMapper);

    @InjectMocks
    MergeContributionService mergeContributionService;

    private ContributionVO contribution;
    private ContributionVO contribution2;
    private ContributionVO contribution3;
    private ContributionVO contribution4;
    private ContributionVO contribution5;
    private ContributionVO contribution6;
    private ContributionVO contribution7;
    private XmlDocument xmlDoc;
    private byte[] docContent;
    protected byte[] contributionContent;
    private byte[] docContent2;
    private XmlDocument xmlDoc2;
    protected byte[] contributionContent2;
    private byte[] docContent3;
    private XmlDocument xmlDoc3;
    protected byte[] contributionContent3;
    private byte[] docContent4;
    private XmlDocument xmlDoc4;
    protected byte[] contributionContent4;
    private byte[] docContent5;
    private XmlDocument xmlDoc5;
    protected byte[] contributionContent5;
    private byte[] docContent6;
    private XmlDocument xmlDoc6;
    protected byte[] contributionContent6;
    private byte[] docContent7;
    private XmlDocument xmlDoc7;
    protected byte[] contributionContent7;

    private final String FILE_PREFIX = "/merge";

    private XmlDocument getMockedBill(Content content) {
        BillMetadata billMetadata = new BillMetadata("", "REGULATION", "", "SJ-023", "EN","", "REG-cltmu06e80004bk281ck5uolr-en", "", "0.1.0", false);
        return new Bill("1", "REG-cltmu06e80004bk281ck5uolr-en.xml", "demo", Instant.now(), "demo", Instant.now(),
                "811868491", "1.0.393", "1.0.393", "Contribution merge action", VersionType.MAJOR,
                true, "Proposal for a REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL establishing the European Union Single Window Environment for " +
                "Customs and amending Regulation (EU) No 952/2013", null, Arrays.asList(""), "", "",
                "", Option.some(content), Option.some(billMetadata), true);
    }

    protected MessageHelper getMessageHelper() {
        try (ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("test-servicesContext.xml")) {
            MessageSource servicesMessageSource = (MessageSource) applicationContext.getBean("servicesMessageSource");
            MessageHelper messageHelper = new MandateMessageHelper(servicesMessageSource);
            return messageHelper;
        }
    }

    @Override
    protected void getStructureFile() {
        docTemplate = "BL-023";
        configFile = "/structure-test-bill-EC.xml";
    }

    @Before
    public void setup() {
        super.setup();

        when(cloneContext.isClonedProposal()).thenReturn(false);
        docContent = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml");
        docContent2 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest2.xml");
        docContent3 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml");
        docContent4 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml");
        docContent5 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest5.xml");
        docContent6 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest6.xml");
        docContent7 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest7.xml");
        contributionContent = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest.xml");
        contributionContent2 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest2.xml");
        contributionContent3 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest3.xml");
        contributionContent4 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest4.xml");
        contributionContent5 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest5.xml");
        contributionContent6 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest6.xml");
        contributionContent7 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest7.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent)));
        this.xmlDoc = getMockedBill(content);
        content = new ContentImpl("billMergeTest2.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent2)));
        this.xmlDoc2 = getMockedBill(content);
        content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent3)));
        this.xmlDoc3 = getMockedBill(content);
        content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent4)));
        this.xmlDoc4 = getMockedBill(content);
        content = new ContentImpl("billMergeTest5.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent5)));
        this.xmlDoc5 = getMockedBill(content);
        content = new ContentImpl("billMergeTest6.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent6)));
        this.xmlDoc6 = getMockedBill(content);
        content = new ContentImpl("billMergeTest7.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent7)));
        this.xmlDoc7 = getMockedBill(content);
        this.contribution = new ContributionVO();
        this.contribution.setCollaborators(Arrays.asList());
        this.contribution.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution.setDocumentId("11684");
        this.contribution.setUpdatedDate(Instant.now());
        this.contribution.setXmlContent(contributionContent);
        this.contribution.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution.setDocumentName("REG-cltmu0ytj000cbk28i47vpokf-en.xml");
        this.contribution.setLegFileName("PROP_ACT-cltmyni0k00002w28u6zyw22b-en.leg");

        this.contribution2 = new ContributionVO();
        this.contribution2.setCollaborators(Arrays.asList());
        this.contribution2.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution2.setDocumentId("11684");
        this.contribution2.setUpdatedDate(Instant.now());
        this.contribution2.setXmlContent(contributionContent2);
        this.contribution2.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution2.setDocumentName("REG-cltmu0ytj000cbk28i47vpokf-en.xml");
        this.contribution2.setLegFileName("PROP_ACT-cltmyni0k00002w28u6zyw22b-en.leg");

        this.contribution3 = new ContributionVO();
        this.contribution3.setCollaborators(Arrays.asList());
        this.contribution3.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution3.setDocumentId("454");
        this.contribution3.setUpdatedDate(Instant.now());
        this.contribution3.setXmlContent(contributionContent3);
        this.contribution3.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution3.setDocumentName("REG-cm0z6hbqp00053k286ebc40gl-en.xml");
        this.contribution3.setLegFileName("PROP_ACT-cm0z6hben00023k28ruc0rt24-en.leg");

        this.contribution4 = new ContributionVO();
        this.contribution4.setCollaborators(Arrays.asList());
        this.contribution4.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution4.setDocumentId("454");
        this.contribution4.setUpdatedDate(Instant.now());
        this.contribution4.setXmlContent(contributionContent4);
        this.contribution4.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution4.setDocumentName("REG-cm0z6hbqp00053k286ebc40gl-en.xml");
        this.contribution4.setLegFileName("PROP_ACT-cm0z6hben00023k28ruc0rt24-en.leg");

        this.contribution5 = new ContributionVO();
        this.contribution5.setCollaborators(Arrays.asList());
        this.contribution5.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution5.setDocumentId("454");
        this.contribution5.setUpdatedDate(Instant.now());
        this.contribution5.setXmlContent(contributionContent5);
        this.contribution5.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution5.setDocumentName("REG-cm0z6hbqp00053k286ebc40gl-en.xml");
        this.contribution5.setLegFileName("PROP_ACT-cm0z6hben00023k28ruc0rt24-en.leg");

        this.contribution6 = new ContributionVO();
        this.contribution6.setCollaborators(Arrays.asList());
        this.contribution6.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution6.setDocumentId("454");
        this.contribution6.setUpdatedDate(Instant.now());
        this.contribution6.setXmlContent(contributionContent6);
        this.contribution6.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution6.setDocumentName("REG-cm0z6hbqp00053k286ebc40gl-en.xml");
        this.contribution6.setLegFileName("PROP_ACT-cm0z6hben00023k28ruc0rt24-en.leg");

        this.contribution7 = new ContributionVO();
        this.contribution7.setCollaborators(Arrays.asList());
        this.contribution7.setCheckinCommentVO(new CheckinCommentVO());
        this.contribution7.setDocumentId("454");
        this.contribution7.setUpdatedDate(Instant.now());
        this.contribution7.setXmlContent(contributionContent7);
        this.contribution7.setContributionStatus(ContributionVO.ContributionStatus.RECEIVED.getValue());
        this.contribution7.setDocumentName("REG-cm0z6hbqp00053k286ebc40gl-en.xml");
        this.contribution7.setLegFileName("PROP_ACT-cm0z6hben00023k28ruc0rt24-en.leg");
        numberService = new NumberServiceProposal(structureContextProvider, numberProcessorHandler, parentChildConverter, xmlContentProcessor,
                documentLanguageContext);
        mergeContributionService = Mockito.spy(new MergeContributionService(xmlContentProcessor, contributionService, documentLanguageContext,
                numberService));
        ReflectionTestUtils.setField(numberProcessorArticle, "securityContext", securityContext);
        ReflectionTestUtils.setField(numberProcessorPoint, "securityContext", securityContext);
        ReflectionTestUtils.setField(numberProcessorDefault, "securityContext", securityContext);
        ReflectionTestUtils.setField(numberProcessorHandler, "numberProcessorsDepthBased", numberProcessorsDepthBased);
        ReflectionTestUtils.setField(numberProcessorHandler, "numberProcessors", numberProcessors);
        List<Entity> entities = new ArrayList<Entity>();
        entities.add(new Entity("1", "DIGIT.B2", "DIGIT"));
        User user = ModelHelper.buildUser(45L, "demo", "demo", entities);
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.getUserName()).thenReturn("demo");
    }

    @Test
    public void testMergingAddChapterElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("__akn_chapter_yUautN");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addChapter.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddChapterElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addChapter.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("__akn_chapter_yUautN");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddedChapterTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveCitationElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("cit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitation.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveCitationElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitation.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("cit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedCitationTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveCitationElementPrefixTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXcit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitation.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveCitationElementPrefixTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitation.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXcit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedCitationTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveRecitalElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("rec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecital.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveRecitalElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecital.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("rec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedRecitalTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveRecitalElementPrefixTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXrec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecital.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveRecitalElementPrefixTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecital.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXrec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedRecitalTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveArticleElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("art_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticle.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveArticleElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticle.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("art_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveArticleElementPrefixTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXart_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticle.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveArticleElementPrefixTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticle.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXart_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticleElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dMHd93");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle.xml"));
        assertEquals(squeezeXmlWithoutIdsAndDummyDate(expected), squeezeXmlWithoutIdsAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticleElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dMHd93");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticle2ElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_phTLdP");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle2.xml"));
        assertEquals(squeezeXmlWithoutIdsAndDummyDate(expected), squeezeXmlWithoutIdsAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticle2ElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle2.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_phTLdP");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticle2Test.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingRemoveArticleElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("deletedXakn_art_q7XGxr");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.DELETE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_deleteArticle.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoRemoveArticleElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_deleteArticle.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("deletedXakn_art_q7XGxr");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithDeletedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.DELETE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdateHeadingElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_RT0jeA");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateHeading.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateHeadingElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateHeading.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_RT0jeA");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedHeadingTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticle3ElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dtWbDZ");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle3.xml"));
        assertEquals(squeezeXmlWithoutIdsAndDummyDate(expected), squeezeXmlWithoutIdsAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticle3ElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle3.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dtWbDZ");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticle3Test.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticle4ElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_kCjLvC");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle4.xml"));
        assertEquals(squeezeXmlWithoutIdsAndDummyDate(expected), squeezeXmlWithoutIdsAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticle4ElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle4.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_kCjLvC");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticle4Test.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingAddParagraphElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_art_1_W8BmoP");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addParagraph.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddParagraphElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addParagraph.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_art_1_W8BmoP");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddedParagraphTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingAddArticleElementTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_bill__akn_article_2kQl24");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addArticle.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddArticleElementTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addArticle.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_bill__akn_article_2kQl24");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingAddChapterElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("__akn_chapter_yUautN");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addChapterWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddChapterElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addChapterWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("__akn_chapter_yUautN");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddedChapterTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveCitationElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("cit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitationWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveCitationElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitationWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("cit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedCitationTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveCitationElementPrefixWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXcit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitationWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveCitationElementPrefixWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitationWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXcit_1");
        mergeActionVO.setElementTagName("citation");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedCitationTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveRecitalElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("rec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecitalWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveRecitalElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecitalWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("rec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedRecitalTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveRecitalElementPrefixWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXrec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecitalWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveRecitalElementPrefixWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecitalWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXrec__Epl5Gg");
        mergeActionVO.setElementTagName("recital");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedRecitalTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveArticleElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("art_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticleWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveArticleElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("art_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingMoveArticleElementPrefixWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXart_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticleWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoMoveArticleElementPrefixWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_moveArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("movedXart_1");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithMovedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.MOVE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndDummyDateWithoutOrigin(expected), squeezeXmlAndDummyDateWithoutOrigin(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticleElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dMHd93");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticleWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticleElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dMHd93");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticle2ElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_phTLdP");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle2WithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticle2ElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle2WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_phTLdP");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticle2Test.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingRemoveArticleElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("deletedXakn_art_q7XGxr");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.DELETE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_deleteArticleWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoRemoveArticleElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_deleteArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("deletedXakn_art_q7XGxr");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithDeletedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.DELETE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdateHeadingElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_RT0jeA");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateHeadingWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateHeadingElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateHeadingWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_RT0jeA");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedHeadingTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticle3ElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dtWbDZ");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle3WithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticle3ElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle3WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_dtWbDZ");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticle3Test.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdatesArticle4ElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_kCjLvC");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle4WithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticle4ElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticle4WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("akn_art_kCjLvC");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticle4Test.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingAddParagraphElementWithoutTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_art_1_W8BmoP");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addParagraphWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddParagraphElementWithoutTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addParagraphWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_art_1_W8BmoP");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddedParagraphTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }


    @Test
    public void testMergingAddArticleElement() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_bill__akn_article_2kQl24");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addArticleWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddArticleElement() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("_bill__akn_article_2kQl24");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddedArticleTest.xml");
        this.contribution.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlAndDummyDateWithoutOrigin(expected), squeezeXmlAndDummyDateWithoutOrigin(resultStr));
        this.contribution.setXmlContent(contributionContent);
    }

    @Test
    public void testMergingUpdateArticleWithDeletedListTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e29372_idXU3e");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution2);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc2, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticleWithDeletedList.xml"));
        assertEquals(squeezeXmlWithoutIdsAndDummyDate(expected), squeezeXmlWithoutIdsAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticleWithDeletedListTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticleWithDeletedList.xml");
        Content content = new ContentImpl("billMergeTest2.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e29372_idXU3e");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticleAndDeletedList.xml");
        this.contribution2.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution2);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest2.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution2.setXmlContent(contributionContent2);
    }


    @Test
    public void testMergingUpdateArticleWithDeletedList() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e29372_idXU3e");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution2);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc2, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticleWithDeletedListWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateArticleWithDeletedList() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateArticleWithDeletedListWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest2.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e29372_idXU3e");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdatedArticleAndDeletedList.xml");
        this.contribution2.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution2);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest2.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution2.setXmlContent(contributionContent2);
    }

    @Test
    public void testMergeUpdatingChapterHeadingTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecMx441KrjVTv0g4c");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateChapterHeading.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdatingChapterHeadingTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateChapterHeading.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecMx441KrjVTv0g4c");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdateChapterHeading.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeUpdatingChapterHeading() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecMx441KrjVTv0g4c");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateChapterHeadingWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdatingChapterHeading() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateChapterHeadingWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecMx441KrjVTv0g4c");
        mergeActionVO.setElementTagName("heading");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdateChapterHeading.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeAddChapterWithUpdatesAndMovesTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecSgPYRxsyHboa5U2");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addChapterWithUpdatesAndMoves.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testUndoAddChapterWithUpdatesAndMovesTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addChapterWithUpdatesAndMoves.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecSgPYRxsyHboa5U2");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddChapterWithUpdatesAndMoves.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeAddChapterWithUpdatesAndMoves() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecSgPYRxsyHboa5U2");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_addChapterWithUpdatesAndMovesWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
    }

    @Test
    public void testUndoAddChapterWithUpdatesAndMoves() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_addChapterWithUpdatesAndMovesWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecSgPYRxsyHboa5U2");
        mergeActionVO.setElementTagName("chapter");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithAddChapterWithUpdatesAndMoves.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.ADD);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeContentUpdateArticleTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("eciR7LQcISID7oGs5");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_contentUpdateArticle.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testUndoContentUpdateArticleTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_contentUpdateArticle.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("eciR7LQcISID7oGs5");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithContentUpdateArticle.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeContentUpdateArticle() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("eciR7LQcISID7oGs5");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_contentUpdateArticleWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoContentUpdateArticle() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_contentUpdateArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("eciR7LQcISID7oGs5");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithContentUpdateArticle.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeContentUpdateArticleWithPartProcessed() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_beforeContentUpdateArticleWithPartProcessed.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("eciR7LQcISID7oGs5");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithContentUpdateArticleWithPartProcessed.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_contentUpdateArticleWithPartProcessed.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeNewTable() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e2997Xec00tGmYwGEGOx6mE");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTableWithoutTC.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }


    @Test
    public void testUndoNewTable() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTableWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest3.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e2997Xec00tGmYwGEGOx6mE");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable.xml");
        this.contribution3.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest3.xml"));
        assertEquals(squeezeXmlAndDummyDateWithoutOrigin(expected), squeezeXmlAndDummyDateWithoutOrigin(resultStr));
        this.contribution3.setXmlContent(contributionContent3);
    }

    @Test
    public void testMergeNewTableTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e2997Xec00tGmYwGEGOx6mE");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution3);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc3, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testMergeSubParagraphsUpdateArticle() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecK7dPHTIz0K0hwoq");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateArticleWithoutTC.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testUndoSubParagraphsUpdateArticle() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateArticleWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecK7dPHTIz0K0hwoq");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithSubParagraphsUpdateArticle.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeSubParagraphsUpdateArticleTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecK7dPHTIz0K0hwoq");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateArticle.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testUndoSubParagraphsUpdateArticleTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateArticle.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecK7dPHTIz0K0hwoq");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithSubParagraphsUpdateArticle.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeSubParagraphsUpdateParagraph() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecbZgUmOfj5D0fTql");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateParagraphWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoSubParagraphsUpdateParagraph() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateParagraphWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecbZgUmOfj5D0fTql");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithSubParagraphsUpdateParagraph.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeSubParagraphsUpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecbZgUmOfj5D0fTql");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateParagraph.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoSubParagraphsUpdateParagraphTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_subParagraphsUpdateParagraph.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecbZgUmOfj5D0fTql");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithSubParagraphsUpdateParagraph.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTableUpdateParagraph() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecQhNs0Uw50gGK4po");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable2WithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTableUpdateParagraph() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable2WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecQhNs0Uw50gGK4po");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable2.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTableUpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecQhNs0Uw50gGK4po");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable2.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTableUpdateParagraphTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable2.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecQhNs0Uw50gGK4po");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable2.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable2UpdateParagraph() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ec2ouS615TiyBKih9");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable3WithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable2UpdateParagraph() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable3WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ec2ouS615TiyBKih9");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable3.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable2UpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ec2ouS615TiyBKih9");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable3.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable2UpdateParagraphTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable3.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ec2ouS615TiyBKih9");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable3.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable3UpdateParagraph() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecqMwZLc0IHirzKf2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable4WithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable3UpdateParagraph() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable4WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecqMwZLc0IHirzKf2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable4.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable3UpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecqMwZLc0IHirzKf2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable3UpdateParagraphTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable4.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecqMwZLc0IHirzKf2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable4.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable4UpdateArticle() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e3059Xecm1xPCOKbOF0LH0d");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable5WithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable4UpdateArticle() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable5WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e3059Xecm1xPCOKbOF0LH0d");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable5.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable4UpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e3059Xecm1xPCOKbOF0LH0d");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable5.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable4UpdateArticleTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable5.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("impXart_d1e3059Xecm1xPCOKbOF0LH0d");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable5.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable5UpdateParagraph() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecuYoelMUcLxTUlNa");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable6WithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoNewTable5UpdateParagraph() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable6WithoutTC.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecuYoelMUcLxTUlNa");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable6.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeNewTable5UpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecuYoelMUcLxTUlNa");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc4, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_newTable6.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testUndoNewTable5UpdateParagraphTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_newTable6.xml");
        Content content = new ContentImpl("billMergeTest4.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecuYoelMUcLxTUlNa");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithNewTable6.xml");
        this.contribution4.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution4);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest4.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution4.setXmlContent(contributionContent4);
    }

    @Test
    public void testMergeRemoveTableUpdateParagraph() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecVG44oNn0ymkt6i2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution5);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc5, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_removeTableWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoRemoveTableUpdateParagraph() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_removeTableWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest5.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecVG44oNn0ymkt6i2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithRemoveTable.xml");
        this.contribution5.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution5);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest5.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution5.setXmlContent(contributionContent5);
    }

    @Test
    public void testMergeRemoveTableUpdateParagraphTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecVG44oNn0ymkt6i2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution5);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc5, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_removeTable.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoRemoveTableUpdateParagraphTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_removeTable.xml");
        Content content = new ContentImpl("billMergeTest5.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecVG44oNn0ymkt6i2");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithRemoveTable.xml");
        this.contribution5.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution5);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest5.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution5.setXmlContent(contributionContent5);
    }

    @Test
    public void testMergeUpdateParagraphWithTableTC() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecYa0WQ0p0S9kDsh9");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(true);
        mergeActionVO.setContributionVO(this.contribution6);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT_TC);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc6, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateParagraphWithTable.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }

    @Test
    public void testUndoUpdateParagraphWithTableTC() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateParagraphWithTable.xml");
        Content content = new ContentImpl("billMergeTest6.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecYa0WQ0p0S9kDsh9");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdateParagraphWithTable.xml");
        this.contribution6.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution6);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest6.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
        this.contribution6.setXmlContent(contributionContent6);
    }

    @Test
    public void testMergeUpdateParagraphWithMathJax() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ec5L30syBRVW5kaTo");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution6);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc6, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateParagraphWithMathJaxWithoutTC.xml"));
        assertEquals(squeezeXmlAndOriginAndDummyDate(expected), squeezeXmlAndOriginAndDummyDate(resultStr));
    }

    @Test
    public void testUndoUpdateParagraphWithMathJax() throws Exception {
        byte[] mergedContent = TestUtils.getFileContent(FILE_PREFIX + "/test_updateParagraphWithMathJaxWithoutTC.xml");
        Content content = new ContentImpl("billMergeTest6.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(mergedContent)));
        XmlDocument mergedBill = getMockedBill(content);
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ec5L30syBRVW5kaTo");
        mergeActionVO.setElementTagName("paragraph");
        mergeActionVO.setWithTrackChanges(false);
        byte[] contributionUpdatedXml = TestUtils.getFileContent(FILE_PREFIX + "/contributionWithUpdateParagraphWithMathJax.xml");
        this.contribution6.setXmlContent(contributionUpdatedXml);
        mergeActionVO.setContributionVO(this.contribution6);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.UNDO);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItemList, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest6.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution6.setXmlContent(contributionContent6);
    }

    @Test
    public void testMergeUpdateArticleWithIndent() throws Exception {
        ApplyContributionsRequest request = new ApplyContributionsRequest();
        request.setAcceptAllContributions(false);
        MergeActionVO mergeActionVO = new MergeActionVO();
        mergeActionVO.setElementId("ecHrDJn0N0yhyAV1e");
        mergeActionVO.setElementTagName("article");
        mergeActionVO.setWithTrackChanges(false);
        mergeActionVO.setContributionVO(this.contribution7);
        mergeActionVO.setElementState(MergeActionVO.ElementState.CONTENT_CHANGE);
        mergeActionVO.setAction(MergeActionVO.MergeAction.ACCEPT);
        request.setMergeActions(Arrays.asList(mergeActionVO));
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc7, this.tocItemList,
                new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_updateMergeUpdateArticleWithIndentWithoutTC.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
    }
}
