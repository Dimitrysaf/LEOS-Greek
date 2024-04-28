package eu.europa.ec.leos.services.dto.request;

public class ExportDocumentRequest {
    private String documentUrl;
    private ExportDocumentOptions options;
    private String callbackAddress;

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public ExportDocumentOptions getOptions() {
        return options;
    }

    public void setOptions(ExportDocumentOptions options) {
        this.options = options;
    }

    public String getCallbackAddress() {
        return callbackAddress;
    }

    public void setCallbackAddress(String callbackAddress) {
        this.callbackAddress = callbackAddress;
    }
}
