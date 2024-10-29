package eu.europa.ec.leos.services.structure.profile;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;


@Component
@RequestScope
public class ProfileContext {

    private static final Logger LOG = LoggerFactory.getLogger(ProfileContext.class);

    private final ProfileService profileService;
    private String clientContextToken;

    ProfileContext(ProfileService profileService) {
        this.profileService = profileService;
    }

    public String getClientContextToken() {
        return clientContextToken;
    }

    public void setClientContextToken(String clientContextToken) {
        this.clientContextToken = clientContextToken;
    }
}
