package eu.europa.ec.leos.services.dto.response;

public class DocumentViewResponse {

    private String proposalRef;
    private String editableXml;
    private byte[] binaryFile;
    private String originalFilename;
    private byte[] foreignRenditionSource;
    private String foreignRenditionOriginalFilename;
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

    public DocumentViewResponse(String proposalRef, String editableXml, VersionInfoVO versionInfoVO,
            String temporaryAnnotationsId, String temporaryDataDocument, byte[] binaryFile, String originalFilename,
            byte[] foreignRenditionSource, String foreignRenditionOriginalFilename) {
        this.proposalRef = proposalRef;
        this.editableXml = editableXml;
        this.versionInfoVO = versionInfoVO;
        this.temporaryAnnotationsId = temporaryAnnotationsId;
        this.temporaryDataDocument = temporaryDataDocument;
        this.binaryFile = binaryFile;
        this.originalFilename = originalFilename;
        this.foreignRenditionSource = foreignRenditionSource;
        this.foreignRenditionOriginalFilename = foreignRenditionOriginalFilename;
    }

    public DocumentViewResponse(String editableXml, VersionInfoVO versionInfoVO) {
        this.editableXml = editableXml;
        this.versionInfoVO = versionInfoVO;
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

    public byte[] getBinaryFile() {
        return binaryFile;
    }

    public void setBinaryFile(byte[] binaryFile) {
        this.binaryFile = binaryFile;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public byte[] getForeignRenditionSource() {
        return this.foreignRenditionSource;
    }

    public void setForeignRenditionSource(final byte[] foreignRenditionSource) {
        this.foreignRenditionSource = foreignRenditionSource;
    }

    public String getForeignRenditionOriginalFilename() {
        return this.foreignRenditionOriginalFilename;
    }

    public void setForeignRenditionOriginalFilename(final String foreignRenditionOriginalFilename) {
        this.foreignRenditionOriginalFilename = foreignRenditionOriginalFilename;
    }

}
