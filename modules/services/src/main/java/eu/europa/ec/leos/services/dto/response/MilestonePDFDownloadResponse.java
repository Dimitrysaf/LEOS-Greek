package eu.europa.ec.leos.services.dto.response;

public class MilestonePDFDownloadResponse {

    private final byte[] content;
    private final String filename;

    public MilestonePDFDownloadResponse(byte[] content, String filename) {
        this.content = content;
        this.filename = filename;
    }

    public byte[] getContent() {
        return content;
    }

    public String getFilename() {
        return filename;
    }
}
