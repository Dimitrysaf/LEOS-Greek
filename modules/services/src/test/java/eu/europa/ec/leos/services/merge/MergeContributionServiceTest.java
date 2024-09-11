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
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.api.MergeContributionService;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ContributionServiceProposalImpl;
import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.request.ApplyContributionsRequest;
import eu.europa.ec.leos.services.dto.request.MergeActionVO;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandler;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandlerProposal;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.numbering.NumberServiceProposal;
import eu.europa.ec.leos.services.numbering.config.NumberConfigFactory;
import eu.europa.ec.leos.services.numbering.depthBased.ParentChildConverter;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessor;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorArticle;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDefault;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDepthBased;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDepthBasedDefault;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorParagraphAndPoint;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorProposal;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorTest;
import eu.europa.ec.leos.services.response.MergeContributionResponse;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.util.TestUtils;
import io.atlassian.fugue.Option;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndDummyDate;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlRemoveNumValue;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlWithoutIdsAndDummyDate;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.spy;

public class MergeContributionServiceTest extends XmlContentProcessorTest {
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

    @Mock
    private eu.europa.ec.leos.security.SecurityContext leosSecurityContext;

    private TrackChangesContext trackChangesContext = new TrackChangesContext();
    private NumberProcessor numberProcessorArticle = new NumberProcessorArticle(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessor numberProcessorPoint = new NumberProcessorParagraphAndPoint(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessor numberProcessorDefault = new NumberProcessorDefault(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessorDepthBased numberProcessorDepthBasedDefault = new NumberProcessorDepthBasedDefault(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessorDepthBased numberProcessorLevel = new eu.europa.ec.leos.services.numbering.processor.NumberProcessorLevel(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);

    @InjectMocks
    protected List<NumberProcessor> numberProcessors = Mockito.spy(Stream.of(numberProcessorArticle,
            numberProcessorPoint,
            numberProcessorDefault).collect(Collectors.toList()));
    @InjectMocks
    protected List<NumberProcessorDepthBased> numberProcessorsDepthBased = Mockito.spy(Stream.of(numberProcessorDepthBasedDefault, numberProcessorLevel)
            .collect(Collectors.toList()));

    @InjectMocks
    NumberService numberService = new NumberServiceProposal(structureContextProvider, numberProcessorHandler, parentChildConverter, xmlContentProcessor,
            documentLanguageContext);

    @InjectMocks
    eu.europa.ec.leos.services.document.ContributionService contributionService = new ContributionServiceProposalImpl<Bill>(
            leosRepository, messageHelper,
            proposalService, packageService,
            billService, annexService,
            memorandumService, legService, xmlContentProcessor, repositoryPropertiesMapper);

    @InjectMocks
    MergeContributionService mergeContributionService = new MergeContributionService(xmlContentProcessor, contributionService, documentLanguageContext,
            numberService);

    private ContributionVO contribution;
    private ContributionVO contribution2;
    private XmlDocument xmlDoc;
    protected byte[] contributionContent;
    private byte[] docContent2;
    private XmlDocument xmlDoc2;
    protected byte[] contributionContent2;

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

        docContent = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml");
        docContent2 = TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest2.xml");
        contributionContent = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest.xml");
        contributionContent2 = TestUtils.getFileContent(FILE_PREFIX + "/contributionMergeTest2.xml");
        Content content = new ContentImpl("billMergeTest.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent)));
        this.xmlDoc = getMockedBill(content);
        content = new ContentImpl("billMergeTest2.xml", "mime type", 23,
                new SourceImpl(new ByteArrayInputStream(docContent2)));
        this.xmlDoc2 = getMockedBill(content);
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecital.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitationWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveCitationWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/test_moveRecitalWithoutTC.xml"));
        assertEquals(squeezeXmlAndDummyDate(expected), squeezeXmlAndDummyDate(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc2, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest2.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, this.xmlDoc2, this.tocItems, new ArrayList<>());
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
        MergeContributionResponse result = this.mergeContributionService.updateDocumentWithContributions(request, mergedBill, this.tocItems, new ArrayList<>());
        String resultStr = new String(result.getMergedContent());
        String expected = new String(TestUtils.getFileContent(FILE_PREFIX + "/billMergeTest2.xml"));
        assertEquals(squeezeXmlRemoveNumValue(expected), squeezeXmlRemoveNumValue(resultStr));
        this.contribution2.setXmlContent(contributionContent2);
    }
}
