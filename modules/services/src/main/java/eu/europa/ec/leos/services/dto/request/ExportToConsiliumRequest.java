package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.services.export.RelevantElements;

public class ExportToConsiliumRequest {

    private String title;
    private RelevantElements relevantElements;
    private boolean withAnnotations;
    private String annotations;
    private boolean cleanVersion;
    private String originalVersion;
    private String currentVersion;
    private String intermediateVersion;

    public void setTitle(String title) {
        this.title = title;
    }

    public void setRelevantElements(RelevantElements relevantElements) {
        this.relevantElements = relevantElements;
    }

    public void setWithAnnotations(Boolean withAnnotations) {
        this.withAnnotations = withAnnotations;
    }

    public void setAnnotations(String annotations) {
        this.annotations = annotations;
    }

    public void setCleanVersion(boolean cleanVersion) {
        this.cleanVersion = cleanVersion;
    }

    public String getTitle() { return this.title; }

    public RelevantElements getRelevantElements() { return this.relevantElements; }

    public boolean isWithAnnotations() {
        return withAnnotations;
    }

    public String getAnnotations() {
        return annotations;
    }

    public boolean isCleanVersion() {
        return cleanVersion;
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
        return "ExportToConsiliumRequest{" +
                "title='" + title + '\'' +
                ", relevantElements=" + relevantElements +
                ", withAnnotations=" + withAnnotations +
                ", annotations='" + annotations + '\'' +
                ", cleanVersion=" + cleanVersion +
                ", originalVersion='" + originalVersion + '\'' +
                ", currentVersion='" + currentVersion + '\'' +
                ", intermediateVersion='" + intermediateVersion + '\'' +
                '}';
    }
}
