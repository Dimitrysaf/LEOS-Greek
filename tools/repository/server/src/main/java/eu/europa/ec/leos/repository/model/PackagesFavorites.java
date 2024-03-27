package eu.europa.ec.leos.repository.model;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;

public class PackagesFavorites {

    private String creationDate = "";
    private BigDecimal packageId = BigDecimal.ZERO;
    private BigDecimal documentId = BigDecimal.ZERO;
    private String ref = "";
    private String title = "";
    private BigDecimal favorite = BigDecimal.ZERO;

    public PackagesFavorites() { }

    public String getCreationDate() {
        return creationDate;
    }

    public BigDecimal getPackageId() {
        return packageId;
    }

    public BigDecimal getDocumentId() {
        return documentId;
    }

    public String getRef() {
        return ref;
    }

    public String getTitle() {
        return title;
    }

    public BigDecimal getFavorite() {
        return favorite;
    }

}