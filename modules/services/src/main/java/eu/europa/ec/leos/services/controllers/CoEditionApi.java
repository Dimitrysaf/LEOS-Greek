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
package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.services.dto.coedition.CoEditionRequest;
import eu.europa.ec.leos.services.dto.coedition.UpdateCoEditionRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;

public interface CoEditionApi {

    @MessageMapping("/refresh/document")
    void refreshDocumentRoom(Message<CoEditionRequest> message);

    @MessageMapping("/join/document")
    void joinDocumentRoom(Message<CoEditionRequest> message);

    @MessageMapping("/remove/document")
    void removeFromDocumentRoom(Message<CoEditionRequest> message);

    @MessageMapping("/update/document")
    void updateDocumentAndSendUpdateToRoom(Message<UpdateCoEditionRequest> message);

    @MessageMapping("/removeSession")
    void removeSession(Message<CoEditionRequest> message);
}
