package eu.europa.ec.leos.services.response;

public class RecentPackageResponse {

    private String rank;
    private String packageId;
    private String greatestLastDate;
    private String documentId;
    private String ref;
    private String title;

    public RecentPackageResponse(String rank, String packageId, String greatestLastDate, String documentId, String ref, String title) {
        this.rank = rank;
        this.packageId = packageId;
        this.greatestLastDate = greatestLastDate;
        this.documentId = documentId;
        this.ref = ref;
        this.title = title;
    }

    public String getRank() {
        return rank;
    }

    public String getPackageId() {
        return packageId;
    }

    public String getGreatestLastDate() {
        return greatestLastDate;
    }

    public String getDocumentId() {
        return documentId;
    }

    public String getRef() {
        return ref;
    }

    public String getTitle() {
        return title;
    }

}
