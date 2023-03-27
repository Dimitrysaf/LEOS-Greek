package eu.europa.ec.leos.services.dto.request;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class AnnotateMergeSuggestionRequest implements Serializable {
    private String origText;
    private String newText;
    private String elementId;
    private Integer startOffset;
    private Integer endOffset;

    public String getOrigText() {
        return origText;
    }

    public void setOrigText(String origText) {
        this.origText = origText;
    }

    public String getNewText() {
        return newText;
    }

    public void setNewText(String newText) {
        this.newText = newText;
    }

    public String getElementId() {
        return elementId;
    }

    public void setElementId(String elementId) {
        this.elementId = elementId;
    }

    public Integer getStartOffset() {
        return startOffset;
    }

    public void setStartOffset(Integer startOffset) {
        this.startOffset = startOffset;
    }

    public Integer getEndOffset() {
        return endOffset;
    }

    public void setEndOffset(Integer endOffset) {
        this.endOffset = endOffset;
    }

    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .appendSuper(super.toString())
                .append("origText", origText)
                .append("newText", newText)
                .append("elementId", elementId)
                .append("startOffset", startOffset)
                .toString();
    }
}
