package eu.europa.ec.leos.services.dto.response;

import java.util.List;

public class CustomTemplateInfoResponse {
    private String templateName;
    private List<String> templateVisibility;

    public CustomTemplateInfoResponse(String templateName, List<String> templateVisibility) {
        this.templateName = templateName;
        this.templateVisibility = templateVisibility;
    }

    public String getTemplateName() {
        return templateName;
    }

    public List<String> getTemplateVisibility() {
        return templateVisibility;
    }
}