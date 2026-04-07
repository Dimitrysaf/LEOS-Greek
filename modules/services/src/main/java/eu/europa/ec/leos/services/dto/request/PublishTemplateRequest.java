package eu.europa.ec.leos.services.dto.request;

import java.util.List;

public class PublishTemplateRequest {
    private String templateName;
    private List<String> dgCodes;

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

