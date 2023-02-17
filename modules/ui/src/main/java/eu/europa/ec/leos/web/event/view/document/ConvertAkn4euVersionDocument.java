package eu.europa.ec.leos.web.event.view.document;

public class ConvertAkn4euVersionDocument {
    private byte[] xmlContent;
    private String versionLabel;

    public ConvertAkn4euVersionDocument(byte[] xmlContent, String versionLabel) {
        this.xmlContent = xmlContent;
        this.versionLabel = versionLabel;
    }

    public byte[] getXmlContent() {
        return xmlContent;
    }

    public String getVersionLabel() {
        return versionLabel;
    }
}
