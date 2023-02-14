package eu.europa.ec.leos.services.dto.response;

public class DocumentViewResponse {

    String proposalRef;
    String editableXml;
    VersionInfoVO versionInfoVO;

    public DocumentViewResponse(String proposalRef, String editableXml, VersionInfoVO versionInfoVO) {
        this.proposalRef = proposalRef;
        this.editableXml = editableXml;
        this.versionInfoVO = versionInfoVO;
    }

    public String getEditableXml() {
        return editableXml;
    }

    public void setEditableXml(String editableXml) {
        this.editableXml = editableXml;
    }

    public VersionInfoVO getVersionInfoVO() {
        return versionInfoVO;
    }

    public void setVersionInfoVO(VersionInfoVO versionInfoVO) {
        this.versionInfoVO = versionInfoVO;
    }
}
