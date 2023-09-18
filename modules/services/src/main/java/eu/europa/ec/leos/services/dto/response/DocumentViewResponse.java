package eu.europa.ec.leos.services.dto.response;

public class DocumentViewResponse {

    private String proposalRef;
    private String editableXml;
    private VersionInfoVO versionInfoVO;
    private String temporaryAnnotationsId;
    private String temporaryDataDocument;

    public DocumentViewResponse(String proposalRef, String editableXml, VersionInfoVO versionInfoVO,
            String temporaryAnnotationsId, String temporaryDataDocument) {
        this.proposalRef = proposalRef;
        this.editableXml = editableXml;
        this.versionInfoVO = versionInfoVO;
        this.temporaryAnnotationsId = temporaryAnnotationsId;
        this.temporaryDataDocument = temporaryDataDocument;
    }

    public String getProposalRef() {
        return proposalRef;
    }

    public void setProposalRef(String proposalRef) {
        this.proposalRef = proposalRef;
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

    public String getTemporaryAnnotationsId() {
        return temporaryAnnotationsId;
    }

    public void setTemporaryAnnotationsId(String temporaryAnnotationsId) {
        this.temporaryAnnotationsId = temporaryAnnotationsId;
    }

    public String getTemporaryDataDocument() {
        return temporaryDataDocument;
    }

    public void setTemporaryDataDocument(String temporaryDataDocument) {
        this.temporaryDataDocument = temporaryDataDocument;
    }
}
