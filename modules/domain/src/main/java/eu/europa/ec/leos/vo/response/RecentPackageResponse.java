package eu.europa.ec.leos.vo.response;

import java.math.BigDecimal;

public class RecentPackageResponse {

    private String rank;
    private BigDecimal packageId;
    private String greatestLastDate;
    private BigDecimal documentId;
    private String ref;
    private String title;

    public String getRank() {
        return rank;
    }

    public BigDecimal getPackageId() {
        return packageId;
    }

    public String getGreatestLastDate() {
        return greatestLastDate;
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

}
