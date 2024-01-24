package eu.europa.ec.leos.services.structure.profile;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;


@Component
@Scope(WebApplicationContext.SCOPE_REQUEST)
public class ProfileContext {

    private static final Logger LOG = LoggerFactory.getLogger(ProfileContext.class);

    private final ProfileService profileService;
    private String systemName;

    ProfileContext(ProfileService profileService) {
        this.profileService = profileService;
    }

    public void useSystemName(String systemName) {
        LOG.trace("Using systemName... [systemName={}]", systemName);
        this.systemName = systemName;
    }
}
