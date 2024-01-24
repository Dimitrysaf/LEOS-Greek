package eu.europa.ec.leos.services.light;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.ProfileMetaData;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.services.structure.profile.ProfileServiceImpl;
import eu.europa.ec.leos.test.support.LeosTest;
import eu.europa.ec.leos.vo.light.Profile;
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
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ProfileServiceTest extends LeosTest {

    @Mock
    private ConfigurationRepository configurationRepository;
    @InjectMocks
    private ProfileServiceImpl profileService = Mockito.spy(new ProfileServiceImpl());

    private String systemName;
    
    @Before
    public void init() {
        systemName = "DECISION_EDIT";
        byte[] bytesFile = getFileContent("/light/lightProfileTest.xml");
        Content content = mock(Content.class);
        Content.Source source = mock(Content.Source.class);
        when(source.getBytes()).thenReturn(bytesFile);
        when(content.getSource()).thenReturn(source);

        ProfileMetaData profileMetaData =new ProfileMetaData("", "", "", "lightProfile.xml", "EN", "", "id", "", "0.0.1", false);
        List<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("login", "OWNER", "SG"));
        final XmlDocument document = new eu.europa.ec.leos.domain.repository.document.Profile("555", "Profile", "login", Instant.now(), "login", Instant.now(),
                "0.0.1", "", "0.0.1", "", VersionType.MINOR, true,
                Option.some(content), Option.some(profileMetaData));

        when(configurationRepository.findTemplate(null, null)).thenReturn(document);
        when(profileService.getProfileDocument()).thenReturn(bytesFile);
        ReflectionTestUtils.setField(profileService, "profileSchema", "schema/light/lightProfile.xsd");
    }

    @Test
    public void test_getProfile() {
        //Actual call
        Profile profile = profileService.getProfile(systemName);
        //Assertions
        assertEquals(systemName, profile.getName().value());
        assertEquals(true, profile.isBreadcrumb());
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
