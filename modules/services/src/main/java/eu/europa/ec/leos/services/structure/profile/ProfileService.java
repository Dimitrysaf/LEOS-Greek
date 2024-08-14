package eu.europa.ec.leos.services.structure.profile;

import eu.europa.ec.leos.vo.light.Profile;

public interface ProfileService {

    byte[] getProfileDocument();

    Profile getProfile(String systemName, String language);

}
