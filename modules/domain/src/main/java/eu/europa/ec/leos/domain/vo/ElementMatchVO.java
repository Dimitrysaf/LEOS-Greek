package eu.europa.ec.leos.domain.vo;

import lombok.*;

@Getter
@Setter
@ToString(exclude = {"isEditable", "xpathprefix"})
@EqualsAndHashCode(exclude = {"isEditable", "xpathprefix"})
public class ElementMatchVO {
    private String elementId;
    private int matchStartIndex;
    private int matchEndIndex;
    private boolean isEditable;
    private String xpath;
    private String xpathprefix;

    public ElementMatchVO() {
    }

    public ElementMatchVO(String elementId, int matchStartIndex) {
        this.elementId = elementId;
        this.matchStartIndex = matchStartIndex;
    }

    public ElementMatchVO(String elementId, int matchStartIndex, int matchEndIndex) {
        this.elementId = elementId;
        this.matchStartIndex = matchStartIndex;
        this.matchEndIndex = matchEndIndex;
    }

    // Keep this if you really need a constructor with isEditable
    public ElementMatchVO(String elementId, int matchStartIndex, boolean isEditable) {
        this.elementId = elementId;
        this.matchStartIndex = matchStartIndex;
        this.isEditable = isEditable;
    }

    public ElementMatchVO(String elementId, int matchStartIndex, boolean isEditable, String xpath, String xpathprefix) {
        this.elementId = elementId;
        this.matchStartIndex = matchStartIndex;
        this.isEditable = isEditable;
        this.xpath = xpath;
        this.xpathprefix = xpathprefix;
    }

    public void setElementId(String elementId) {// method needed for vaadin reflection to create JSON
        throw new UnsupportedOperationException();
    }

    public boolean isEditable() {
        return isEditable;
    }

}
