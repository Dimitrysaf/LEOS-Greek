package eu.europa.ec.digit.leos.pilot.export.util;

import java.util.List;

public abstract class ExportOptions {
    
    public static final String PREFIX_PDF = "PDF_";
    
    protected Output exportOutput;
    protected boolean withAnnotations;
    protected boolean withFeedbackAnnotations;
    protected boolean withFilteredAnnotations;
    protected String filteredAnnotations;
    protected List<String> comments;
    protected boolean withCoverPage = true;
    protected String printStyle;
    protected boolean withSuggestions = true;
    protected boolean withAnonymization = false;
    protected boolean withTrackChangesAnonymization = false;
    protected boolean withAutoNumbering = true;
    protected boolean withRenditions = true;

    public boolean isWithCoverPage() {
        return withCoverPage;
    }

    public String getTechnicalKey(){
        return "";
    }

    public void setWithCoverPage(boolean withCoverPage) {
        this.withCoverPage = withCoverPage;
    }

    public void setPrintStyle(String printStyle) {
        this.printStyle = printStyle;
    }

    public String getPrintStyle() {
        return printStyle;
    }

    public enum Output {
        PDF,
        WORD
    }

    public void setWithAnnotations(boolean withAnnotations) {
        this.withAnnotations = withAnnotations;
    }

    public void setWithFilteredAnnotations(boolean withFilteredAnnotations) {
        this.withAnnotations = withFilteredAnnotations;
        this.withFilteredAnnotations = withFilteredAnnotations;
    }

    public void setFilteredAnnotations(String filteredAnnotations) {
        this.filteredAnnotations = filteredAnnotations;
    }

    public boolean isWithAnnotations() {
        return withAnnotations;
    }

    public boolean isWithFilteredAnnotations() {
        return withFilteredAnnotations;
    }

    public String getFilteredAnnotations() {
        return filteredAnnotations;
    }

    protected abstract String getWordPrefix();
    
    public String getFilePrefix() {
        if (exportOutput == Output.PDF) {
            return PREFIX_PDF;
        } else if (exportOutput == Output.WORD) {
            return getWordPrefix();
        } else {
            throw new IllegalStateException("Not possible!!");
        }
    }

    public abstract String getExportOutputDescription();
    
    public Output getExportOutput() {
        return exportOutput;
    }

    public List<String> getComments() { return comments; }

    public void setComments(List<String> comments) { this.comments = comments; }

    public void setWithAnonymization(boolean withAnonymization) {
        this.withAnonymization = withAnonymization;
    }

    public boolean isWithAnonymization() {
        return withAnonymization;
    }

    public void setWithTrackChangesAnonymization(boolean withTrackChangesAnonymization) {
        this.withTrackChangesAnonymization = withTrackChangesAnonymization;
    }

    public boolean isWithTrackChangesAnonymization() {
        return withTrackChangesAnonymization;
    }

    public void setWithSuggestions(boolean withSuggestions) {
        this.withSuggestions = withSuggestions;
    }

    public boolean isWithSuggestions() {
        return withSuggestions;
    }

    public boolean isWithAutoNumbering() { return withAutoNumbering; }

    public boolean isWithFeedbackAnnotations() {
        return withFeedbackAnnotations;
    }

    public void setWithFeedbackAnnotations(boolean withFeedbackAnnotations) {
        this.withFeedbackAnnotations = withFeedbackAnnotations;
    }

    public boolean isWithRenditions() {
        return withRenditions;
    }

    public void setWithRenditions(boolean withRenditions) {
        this.withRenditions = withRenditions;
    }
}
