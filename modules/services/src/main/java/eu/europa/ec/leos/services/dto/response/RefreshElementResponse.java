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
package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.model.xml.Element;

public class RefreshElementResponse {

    private final String elementId;
    private final String elementTagName;
    private final String elementFragment;
    private final Element elementToEditAfterClose;
    private final Boolean splittedContentIsEmpty;

    public RefreshElementResponse(String elementId, String elementTagName, String elementFragment, Element elementToEditAfterClose, Boolean splittedContentIsEmpty) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.elementFragment = elementFragment;
        this.elementToEditAfterClose = elementToEditAfterClose;
        this.splittedContentIsEmpty = splittedContentIsEmpty;
    }

    public RefreshElementResponse(String elementId, String elementTagName, String elementFragment) {
        this.elementId = elementId;
        this.elementTagName = elementTagName;
        this.elementFragment = elementFragment;
        this.elementToEditAfterClose = null;
        this.splittedContentIsEmpty = null;
    }
    
    public String getElementId() {
        return elementId;
    }

    public String getElementTagName() {
        return elementTagName;
    }

    public String getElementFragment() {
        return elementFragment;
    }

    public Element getElementToEditAfterClose() {
        return elementToEditAfterClose;
    }

    public Boolean getSplittedContentIsEmpty() {
        return splittedContentIsEmpty;
    }
}