package eu.europa.ec.leos.services.response;

import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.user.User;

public class EditElementResponse {
    String elementId;
    String elementTagName;
    String element;
    LevelItemVO levelItem;
    User user;
    String[] permissions;
    String alternatives;

    public EditElementResponse(String elementId, String elementTagName, String element, LevelItemVO levelItem) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.element = element;
        this.levelItem = levelItem;
    }

    public EditElementResponse(String elementId, String elementTagName, String element, String alternatives) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.element = element;
        this.alternatives = alternatives;
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
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String[] getPermissions() {
        return permissions;
    }

    public void setPermissions(String[] permissions) {
        this.permissions = permissions;
    }

    public String getAlternatives() {
        return alternatives;
    }

    public void setAlternatives(String alternatives) {
        this.alternatives = alternatives;
    }
}
