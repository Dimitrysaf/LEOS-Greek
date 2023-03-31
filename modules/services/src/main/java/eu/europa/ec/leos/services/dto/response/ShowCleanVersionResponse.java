package eu.europa.ec.leos.services.dto.response;

public class ShowCleanVersionResponse {

    private String contentHtml;
    private String versionInfo;

    public ShowCleanVersionResponse(String contentHtml, String versionInfo) {
        this.contentHtml = contentHtml;
        this.versionInfo = versionInfo;
    }

    public String getContentHtml() {
        return contentHtml;
    }

    public void setContentHtml(String contentHtml) {
        this.contentHtml = contentHtml;
    }

    public String getVersionInfoVO() {
        return versionInfo;
    }

    public void setVersionInfoVO(String versionInfoVO) {
        this.versionInfo = versionInfoVO;
    }
}
