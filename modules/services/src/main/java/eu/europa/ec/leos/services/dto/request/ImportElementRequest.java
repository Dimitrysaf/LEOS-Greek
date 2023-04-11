package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.services.document.models.DocType;

import java.util.List;

public class ImportElementRequest {

    private List<String> elementIds;
    private DocType type;
    private String year;
    private String number;

    public List<String> getElementIds() {
        return elementIds;
    }

    public void setElementIds(List<String> elementIds) {
        this.elementIds = elementIds;
    }

    public DocType getType() {
        return type;
    }

    public void setType(DocType type) {
        this.type = type;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
