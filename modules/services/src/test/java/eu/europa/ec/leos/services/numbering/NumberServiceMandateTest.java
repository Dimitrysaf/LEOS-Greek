package eu.europa.ec.leos.services.numbering;

import eu.europa.ec.leos.services.numbering.config.NumberConfigFactory;
import eu.europa.ec.leos.services.numbering.depthBased.ParentChildConverter;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessor;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorArticle;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDepthBased;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDepthBasedDefault;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorLevel;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorParagraphAndPoint;
import eu.europa.ec.leos.services.numbering.processor.NumberProcessorDefault;
import eu.europa.ec.leos.services.structure.profile.ProfileContext;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public abstract class NumberServiceMandateTest extends NumberServiceTest {

    protected ParentChildConverter parentChildConverter = new ParentChildConverter();
    @InjectMocks
    protected NumberConfigFactory numberConfigFactory = Mockito.spy(new NumberConfigFactory());
    @InjectMocks
    protected NumberProcessorHandler numberProcessorHandler = new NumberProcessorHandlerMandate();
    @Mock
    private eu.europa.ec.leos.security.SecurityContext leosSecurityContext;
    @Mock
    private ProfileContext profileContext;

    private TrackChangesContext trackChangesContext = new TrackChangesContext();
    @InjectMocks
    private NumberProcessor numberProcessorArticle = new NumberProcessorArticle(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext, profileContext);
    private NumberProcessor numberProcessorPoint = new NumberProcessorParagraphAndPoint(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessor numberProcessorDefault = new NumberProcessorDefault(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessorDepthBased numberProcessorDepthBasedDefault = new NumberProcessorDepthBasedDefault(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    private NumberProcessorDepthBased numberProcessorLevel = new NumberProcessorLevel(messageHelper, numberProcessorHandler, leosSecurityContext, trackChangesContext);
    @InjectMocks
    protected List<NumberProcessor> numberProcessors = Mockito.spy(Stream.of(numberProcessorArticle,
            numberProcessorPoint,
            numberProcessorDefault).collect(Collectors.toList()));
    @InjectMocks
    protected List<NumberProcessorDepthBased> numberProcessorsDepthBased = Mockito.spy(Stream.of(numberProcessorDepthBasedDefault, numberProcessorLevel).collect(Collectors.toList()));

    protected NumberService numberService;

    protected final static String FILE_PREFIX = "/numbering/bill/";

    @Before
    public void setup() {
        super.setup();
        getStructureFile();
        numberService = new NumberServiceMandate(contentProcessor, structureContextProvider, numberProcessorHandler, parentChildConverter,
                documentLanguageContext);
        ReflectionTestUtils.setField(numberProcessorHandler, "numberConfigFactory", numberConfigFactory);
        ReflectionTestUtils.setField(numberProcessorHandler, "numberProcessorsDepthBased", numberProcessorsDepthBased);
        ReflectionTestUtils.setField(numberProcessorHandler, "numberProcessors", numberProcessors);
        ReflectionTestUtils.setField(numberProcessorHandler, "messageHelper", messageHelper);
    }

    @Override
    protected void getStructureFile() {
        docTemplate = "BL-023";
        configFile = "/structure-test-bill-CN.xml";
    }

}
