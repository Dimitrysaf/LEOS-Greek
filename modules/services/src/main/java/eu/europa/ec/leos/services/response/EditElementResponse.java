package eu.europa.ec.leos.services.response;

import eu.europa.ec.leos.model.annex.LevelItemVO;

public class EditElementResponse {
    String elementId;
    String elementTagName;
    String element;
    LevelItemVO levelItem;


    public EditElementResponse(String elementId, String elementTagName, String element, LevelItemVO levelItem) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.element = element;
        this.levelItem = levelItem;
    }

    public String getElementId() {
        return elementId;
    }

    public void setElementId(String elementId) {
        this.elementId = elementId;
    }

    public String getElementTagName() {
        return elementTagName;
    }

    public void setElementTagName(String elementTagName) {
        this.elementTagName = elementTagName;
    }

    public String getElement() {
        return element;
    }

    public void setElement(String element) {
        this.element = element;
    }

    public LevelItemVO getLevelItem() {
        return levelItem;
    }

    public void setLevelItem(LevelItemVO levelItem) {
        this.levelItem = levelItem;
    }
}
