/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

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
    boolean isClonedProposal;

    public EditElementResponse(User user, String[] permissions, String elementId, String elementTagName, String element, LevelItemVO levelItem, boolean isClonedProposal) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.element = element;
        this.levelItem = levelItem;
        this.user = user;
        this.permissions = permissions;
        this.isClonedProposal = isClonedProposal;
    }

    public EditElementResponse(User user, String[] permissions, String elementId, String elementTagName, String element, String alternatives, boolean isClonedProposal) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.element = element;
        this.alternatives = alternatives;
        this.user = user;
        this.permissions = permissions;
        this.isClonedProposal = isClonedProposal;
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

    public boolean isClonedProposal() {
        return isClonedProposal;
    }

    public void setClonedProposal(boolean clonedProposal) {
        isClonedProposal = clonedProposal;
    }
}
