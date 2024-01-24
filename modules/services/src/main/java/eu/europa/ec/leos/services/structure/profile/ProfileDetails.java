package eu.europa.ec.leos.services.structure.profile;

import eu.europa.ec.leos.vo.light.Profile;

/**
 * POJO to wrap java objects configured in XML.
 */
public class ProfileDetails {

    private String profileName;
    private String profileVersion;
    private String profileDescription;
    private Profile profile;

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public String getProfileVersion() {
        return profileVersion;
    }

    public void setProfileVersion(String profileVersion) {
        this.profileVersion = profileVersion;
    }

    public String getProfileDescription() {
        return profileDescription;
    }

    public void setProfileDescription(String profileDescription) {
        this.profileDescription = profileDescription;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
}
