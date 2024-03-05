package eu.europa.ec.leos.services.dto.request;

public class ExportDocumentRequest {
    private String documentUrl;
    private String outputDescriptor;
    private String callbackAddress;

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public String getOutputDescriptor() {
        return outputDescriptor;
    }

    public void setOutputDescriptor(String outputDescriptor) {
        this.outputDescriptor = outputDescriptor;
    }

    public String getCallbackAddress() {
        return callbackAddress;
    }

    public void setCallbackAddress(String callbackAddress) {
        this.callbackAddress = callbackAddress;
    }
}
