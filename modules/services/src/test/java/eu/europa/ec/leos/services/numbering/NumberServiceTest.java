package eu.europa.ec.leos.services.numbering;

import eu.europa.ec.leos.i18n.LanguageHelper;
import eu.europa.ec.leos.i18n.MandateMessageHelper;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.StructureServiceImpl;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupServiceImpl;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.services.template.TemplateStructureService;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.LeosTest;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.util.ReflectionTestUtils;

import javax.inject.Provider;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;

public abstract class NumberServiceTest extends LeosTest {

    protected final static String PREFIX_SAVE_TOC_CN = "/saveToc/bill/cn/";

    @Mock
    protected LanguageHelper languageHelper;
    @Mock
    protected Provider<StructureContext> structureContextProvider;
    @Mock
    protected StructureContext structureContext;
    @Mock
    protected TemplateStructureService templateStructureService;
    @Mock
    protected XmlContentProcessor contentProcessor;
    @Mock
    private ConfigurationRepository configurationRepository;
    protected LanguageMapHolder languageMapHolder;
    protected LanguageGroupServiceImpl languageGroupService;
    @InjectMocks
    protected DocumentLanguageContext documentLanguageContext = Mockito.spy(new DocumentLanguageContext());

    @InjectMocks
    protected StructureServiceImpl structureServiceImpl;
    @InjectMocks
    protected MessageHelper messageHelper = Mockito.spy(getMessageHelper());

    protected List<TocItem> tocItemList;
    protected List<NumberingConfig> numberingConfigs;
    protected String docTemplate;
    protected String configFile;

    protected Map<String, List<String>> languageMap = new HashMap<>();

    @Before
    public void setup() {
        super.setup();
        getStructureFile();

        languageMap.put("greek", Arrays.asList("el"));
        languageMap.put("latin", Arrays.asList("cs", "da", "de", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"));
        languageMap.put("cyrillic", Arrays.asList("bg"));
        documentLanguageContext.setDocumentLanguage("en");
        languageMapHolder = Mockito.spy(new LanguageMapHolder());
        languageGroupService = Mockito.spy(new LanguageGroupServiceImpl(configurationRepository, languageMapHolder));

        //populate language map
        languageMapHolder.loadLanguageMap(languageMap);

        byte[] bytesFile = TestUtils.getFileContent(configFile);
        when(templateStructureService.getStructure(docTemplate)).thenReturn(bytesFile);
        ReflectionTestUtils.setField(structureServiceImpl, "structureSchema", "schema/structure/structure_1.xsd");
        tocItemList = structureServiceImpl.getTocItems(docTemplate);
        numberingConfigs = structureServiceImpl.getNumberingConfigs(docTemplate);

        when(structureContextProvider.get()).thenReturn(structureContext);
        when(structureContext.getTocItems()).thenReturn(tocItemList);
        when(structureContext.getNumberingConfigs()).thenReturn(numberingConfigs);
    }

    protected abstract void getStructureFile();

    protected MessageHelper getMessageHelper() {
        try (ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("test-servicesContext.xml")) {
            MessageSource servicesMessageSource = (MessageSource) applicationContext.getBean("servicesMessageSource");
            MessageHelper messageHelper = new MandateMessageHelper(servicesMessageSource);
            return messageHelper;
        }
    }

}
