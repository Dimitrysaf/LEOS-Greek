package eu.europa.ec.leos.services.dto.request;

import java.util.List;

public class PublishTemplateRequest {
    private String legDocumentName;
    private String templateName;
    private List<String> dgCodes;


    public String getLegDocumentName() {
        return legDocumentName;
    }

    public void setLegDocumentName(String legDocumentName) {
        this.legDocumentName = legDocumentName;
    }

    public String getTemplateName() {
        return templateName;
    }
    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public List<String> getDgCodes() {
        return dgCodes;
    }
    public void setDgCodes(List<String> dgCodes) {
        this.dgCodes = dgCodes;
    }
}

