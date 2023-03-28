package eu.europa.ec.leos.services.dto.response;

public class AnnotateMergeSuggestionsResponse {
    private String origText;
    private String newText;
    private String elementId;
    private Integer startOffset;
    private Integer endOffset;
    private String result;

    public AnnotateMergeSuggestionsResponse(String origText, String newText, String elementId, Integer startOffset, Integer endOffset, String result) {
        this.origText = origText;
        this.newText = newText;
        this.elementId = elementId;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.result = result;
    }

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

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
