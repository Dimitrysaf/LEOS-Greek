package eu.europa.ec.leos.services.light;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.ConfigDocument;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.test.support.LeosTest;
import io.atlassian.fugue.Option;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class LanguageGroupServiceTest extends LeosTest {
    LanguageMapHolder languageMapHolder;
    Map<String, List<String>> languageMap = new HashMap<>();
    @Mock
    private ConfigurationRepository configurationRepository;
    @InjectMocks
    private LanguageGroupService languageGroupService;

    @Before
    public void init() {
        byte[] bytesFile = getFileContent("/light/languageGroupTest.xml");
        Content content = mock(Content.class);
        Content.Source source = mock(Content.Source.class);
        when(source.getBytes()).thenReturn(bytesFile);
        when(content.getSource()).thenReturn(source);

        languageMap.put("greek", Arrays.asList("el"));
        languageMap.put("latin", Arrays.asList("cs", "da", "de", "en", "es", "et", "fi", "fr", "ga", "hr", "hu", "it", "lt", "lv", "mt", "nl", "pl", "pt", "ro", "sk", "sl", "sv"));
        languageMap.put("cyrillic", Arrays.asList("bg"));

        languageMapHolder = Mockito.spy(new LanguageMapHolder());
        languageGroupService = Mockito.spy(new LanguageGroupService(configurationRepository, languageMapHolder));

        ConfigDocument configDocument = new ConfigDocument("555", "Config", "login", Instant.now(), "login", Instant.now(),
                "0.0.1", "", "0.0.1", "", VersionType.MINOR, true,
                Option.some(content));

        when(configurationRepository.findConfiguration(null, null)).thenReturn(configDocument);
        when(languageGroupService.getLangGroupDocument()).thenReturn(bytesFile);
        ReflectionTestUtils.setField(languageGroupService, "langGroupSchema", "schema/lang/languageGroup.xsd");
    }

    @Test
    public void test_getLanguageMap() {
        languageGroupService.getLanguageMap();
        verify(languageMapHolder).loadLanguageMap(languageMap);
        assertEquals(languageMap, LanguageMapHolder.getLanguageMap());
        assertNotNull(LanguageMapHolder.getLanguageMap());
    }

    public byte[] getFileContent(String fileName) {
        try {
            InputStream inputStream = this.getClass().getResource(fileName).openStream();
            byte[] content = new byte[inputStream.available()];
            inputStream.read(content);
            inputStream.close();
            return content;
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read bytes from file: " + fileName);
        }
    }


}
