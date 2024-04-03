package eu.europa.ec.leos.services.dto.request;

public class SendFeedbackRequest {
    private String proposalRef;
    private String documentRef;
    private String legFileName;
    private String contributionsVersionRef;

    public String getProposalRef() {
        return proposalRef;
    }

    public void setProposalRef(String proposalRef) {
        this.proposalRef = proposalRef;
    }

    public String getDocumentRef() {
        return documentRef;
    }

    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }

    public String getLegFileName() {
        return legFileName;
    }

    public void setLegFileName(String legFileName) {
        this.legFileName = legFileName;
    }

    public String getContributionsVersionRef() {
        return contributionsVersionRef;
    }

    public void setContributionsVersionRef(String contributionsVersionRef) {
        this.contributionsVersionRef = contributionsVersionRef;
    }
}
