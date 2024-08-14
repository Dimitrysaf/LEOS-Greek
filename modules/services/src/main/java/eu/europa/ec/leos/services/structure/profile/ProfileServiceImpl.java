package eu.europa.ec.leos.services.structure.profile;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.vo.light.Container;
import eu.europa.ec.leos.vo.light.ObjectFactory;
import eu.europa.ec.leos.vo.light.Profile;
import eu.europa.ec.leos.vo.light.Profiles;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ProfileServiceImpl implements ProfileService {
    
    protected static final Logger LOG = LoggerFactory.getLogger(ProfileServiceImpl.class);
    
    @Value("${leos.templates.profile.schema.path}")
    private String profileSchema;

    @Value("${leos.templates.path}")
    private String profilePath;

    @Value("${leos.light.profile.name}")
    private String profileName;

    @Autowired
    ConfigurationRepository configurationRepository;

    protected Map<String, Profile> profileDetailsMap = new HashMap<>();

    @Override
    @Cacheable(value = "lightProfile")
    public Profile getProfile(String systemName, String language) {
        loadProfile(systemName, language);
        return profileDetailsMap.get(systemName);
    }

    private void loadProfile(String systemName, String language) {
        byte[] profileXmlFile = this.getProfileDocument();
        final Container container = loadProfileContainerFromFile(profileXmlFile);

        ProfileDetails profileDetails = new ProfileDetails();
        profileDetails.setProfileName(container.getName());
        profileDetails.setProfileDescription(container.getDescription());
        profileDetails.setProfileVersion(container.getVersion());
        Profiles profiles = container.getProfileList();

        Optional<Profile> profile = profiles.getProfiles().stream()
                .filter(system -> {
                  if(systemName.equalsIgnoreCase(system.getName().value())
                          && (language.equalsIgnoreCase(system.getLanguage()) ||
                          system.getLanguage().equalsIgnoreCase("default"))) {
                      return true;
                  }
                  return false;
                }).findFirst();

        profileDetailsMap.put(systemName, profile.get()); //cache it for the next call
    }

    @Override
    public byte[] getProfileDocument() {
        XmlDocument profileDocument = configurationRepository.findTemplate(profilePath, profileName);
        return profileDocument.getContent().get().getSource().getBytes();
    }
    
    private Container loadProfileContainerFromFile(byte[] fileBytes) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(ObjectFactory.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            
            SchemaFactory sf = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema profileSchema = sf.newSchema(new StreamSource(loadSchema()));
            jaxbUnmarshaller.setSchema(profileSchema);

            Container container = (Container) jaxbUnmarshaller.unmarshal(new ByteArrayInputStream(fileBytes));
            return container;
        } catch (Exception e) {
            LOG.debug("Error loadProfileContainerFromFile", e);
            throw new IllegalStateException("Error loading profile configurations", e);
        }
    }
    
    private InputStream loadSchema() {
        return ProfileServiceImpl.class.getClassLoader().getResourceAsStream(profileSchema);
    }
}
