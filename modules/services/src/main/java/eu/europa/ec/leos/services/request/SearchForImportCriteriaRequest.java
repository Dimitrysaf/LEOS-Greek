package eu.europa.ec.leos.services.request;


import eu.europa.ec.leos.services.document.models.DocType;

public class SearchForImportCriteriaRequest {
    private DocType type;
    private Integer year;
    private Integer number;

    public DocType getType() {
        return type;
    }

    public void setType(DocType type) {
        this.type = type;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }
}
