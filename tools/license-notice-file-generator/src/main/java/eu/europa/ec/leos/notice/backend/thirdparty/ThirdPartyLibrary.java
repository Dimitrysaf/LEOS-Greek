package eu.europa.ec.leos.notice.backend.thirdparty;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

import java.util.List;

/**
 * Library data extracted from a THIRD-PARYTY.txt file.
 */
public class ThirdPartyLibrary {
    private String name;
    private String groupId;
    private String artifactId;
    private String version;
    private String projectUrl;
    private List<String> licenseAliases;

    public void validate() {
        if (StringUtils.isEmpty(name) || name.contains("(") || name.contains(")")) {
            throw new IllegalArgumentException("name of the library is not correct: " + name);
        }
        if (StringUtils.isEmpty(groupId) || groupId.split(" ").length != 1) {
            throw new IllegalArgumentException("groupId of the library is not correct: " + groupId);
        }
        if (StringUtils.isEmpty(artifactId) || artifactId.split(" ").length != 1) {
            throw new IllegalArgumentException("artifactId of the library is not correct: " + artifactId);
        }
        if (StringUtils.isEmpty(version) || (version.length() > 1 && version.split("\\.").length == 1)) {
            throw new IllegalArgumentException("version of the library is not correct: " + version);
        }
        if (!StringUtils.isEmpty(projectUrl) && !projectUrl.equals("no url defined") && !projectUrl.startsWith("http")) {
            throw new IllegalArgumentException("projectUrl of the library is not correct: " + projectUrl);
        }
    }

    void setName(String name) {
        this.name = name;
    }

    void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }

    void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    void setArtifactId(String artifactId) {
        this.artifactId = artifactId;
    }

    void setVersion(String version) {
        this.version = version;
    }

    void setLicenseAliases(List<String> licenseAliases) {
        this.licenseAliases = licenseAliases;
    }

    public String getName() {
        return name;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getArtifactId() {
        return artifactId;
    }

    public String getVersion() {
        return version;
    }

    public List<String> getLicenseAliases() {
        return licenseAliases;
    }

    /**
     * @return A String in format groupId:artifactId
     */
    public String groupIdAndArtifactId() {
        return String.format("%s:%s", groupId, artifactId);
    }

    /**
     * @return A String in format groupId:artifactId:version
     */
    public String fullDependencyPath() {
        return String.format("%s:%s:%s", groupId, artifactId, version);
    }

    public boolean equals(final Object other) {
        if (!(other instanceof ThirdPartyLibrary))
            return false;
        ThirdPartyLibrary castOther = (ThirdPartyLibrary) other;
        return new EqualsBuilder()
                .append(groupId, castOther.groupId)
                .append(artifactId, castOther.artifactId)
                .append(version, castOther.version).isEquals();
    }

    public int hashCode() {
        return new HashCodeBuilder()
                .append(groupId)
                .append(artifactId)
                .append(version).toHashCode();
    }

    @Override
    public String toString() {
        return "ThirdPartyLibrary{" +
                "name='" + name + '\'' +
                ", groupId='" + groupId + '\'' +
                ", artifactId='" + artifactId + '\'' +
                ", version='" + version + '\'' +
                ", projectUrl='" + projectUrl + '\'' +
                ", licenseAliases=" + licenseAliases +
                '}';
    }
}
