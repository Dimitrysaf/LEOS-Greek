package eu.europa.ec.leos.services.response;

public class FavouritePackageResponse {

    private String creationDate;
    private String packageId;
    private String documentId;
    private String ref;
    private String title;

    public FavouritePackageResponse(String creationDate, String packageId, String documentId, String ref, String title) {
        this.creationDate = creationDate;
        this.packageId = packageId;
        this.documentId = documentId;
        this.ref = ref;
        this.title = title;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public String getPackageId() {
        return packageId;
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
