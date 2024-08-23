package eu.europa.ec.leos.vo.toc;

public class CheckDocumentRulesVO {

    private boolean firstElementFound;
    private boolean notAllowedElementFound;
    private boolean validStructure;
    private String messageKey;
    private TableOfContentItemVO realSourceItemVO;

    public CheckDocumentRulesVO() {
        this.firstElementFound = false;
        this.notAllowedElementFound = false;
        this.validStructure = true;
        this.messageKey = "";
    }

    public boolean isFirstElementFound() {
        return firstElementFound;
    }

    public void setFirstElementFound(boolean firstElementFound) {
        this.firstElementFound = firstElementFound;
    }

    public boolean isNotAllowedElementFound() {
        return notAllowedElementFound;
    }

    public void setNotAllowedElementFound(boolean notAllowedElementFound) {
        this.notAllowedElementFound = notAllowedElementFound;
    }

    public boolean isValidStructure() {
        return validStructure;
    }

    public void setValidStructure(boolean validStructure) {
        this.validStructure = validStructure;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public void setMessageKey(String messageKey) {
        this.messageKey = messageKey;
    }

    public TableOfContentItemVO getRealSourceItemVO() {
        return realSourceItemVO;
    }

    public void setRealSourceItemVO(TableOfContentItemVO realSourceItemVO) {
        this.realSourceItemVO = realSourceItemVO;
    }

}
