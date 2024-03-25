package eu.europa.ec.leos.vo.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class FavouritePackageResponse {

    private String creationDate;
    private BigDecimal packageId;
    private BigDecimal documentId;
    private String ref;
    private String title;
    private Boolean favourite;

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

    @JsonAlias("favorite")
    @JsonProperty("isFavourite")
    public Boolean isFavourite() {
        return favourite;
    }

}
