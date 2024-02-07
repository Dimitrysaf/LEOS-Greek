/*
 * Copyright 2024 European Union
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

package eu.europa.ec.leos.services.dto.coedition;

import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.vo.coedition.InfoType;

import java.util.ArrayList;
import java.util.List;

public class UpdateCoEditionResponse {
    private User user;
    private String presenterId;
    private String documentId;
    private InfoType infoType;
    private List<Element> updatedElements;

    public UpdateCoEditionResponse(User user, String presenterId, String documentId, InfoType infoType, List<Element> updatedElements) {
        this.user = user;
        this.presenterId = presenterId;
        this.documentId = documentId;
        this.infoType = infoType;
        this.updatedElements = updatedElements;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPresenterId() {
        return presenterId;
    }

    public void setPresenterId(String presenterId) {
        this.presenterId = presenterId;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public InfoType getInfoType() {
        return infoType;
    }

    public void setInfoType(InfoType infoType) {
        this.infoType = infoType;
    }

    public List<Element> getUpdatedElements() {
        return updatedElements;
    }

    public void setUpdatedElements(List<Element> updatedElements) {
        this.updatedElements = updatedElements;
    }
}
