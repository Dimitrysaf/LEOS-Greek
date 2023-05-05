package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.services.export.RelevantElements;

public class ExportComparedVersionRequest {

    private String title;
    private RelevantElements relevantElements;
    private String originalVersion;
    private String currentVersion;
    private String intermediateVersion;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public RelevantElements getRelevantElements() {
        return relevantElements;
    }

    public void setRelevantElements(RelevantElements relevantElements) {
        this.relevantElements = relevantElements;
    }

    public String getOriginalVersion() {
        return originalVersion;
    }

    public void setOriginalVersion(String originalVersion) {
        this.originalVersion = originalVersion;
    }

    public String getCurrentVersion() {
        return currentVersion;
    }

    public void setCurrentVersion(String currentVersion) {
        this.currentVersion = currentVersion;
    }

    public String getIntermediateVersion() {
        return intermediateVersion;
    }

    public void setIntermediateVersion(String intermediateVersion) {
        this.intermediateVersion = intermediateVersion;
    }

    @Override
    public String toString() {
        return "ExportComparedVersionRequest{" +
                "title='" + title + '\'' +
                ", relevantElements=" + relevantElements +
                ", originalVersion='" + originalVersion + '\'' +
                ", currentVersion='" + currentVersion + '\'' +
                ", intermediateVersion='" + intermediateVersion + '\'' +
                '}';
    }
}
