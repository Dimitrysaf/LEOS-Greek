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
package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.coedition.CoEditionService;
import eu.europa.ec.leos.services.dto.coedition.CoEditionRequest;
import eu.europa.ec.leos.services.dto.coedition.UpdateCoEditionRequest;
import eu.europa.ec.leos.services.dto.coedition.UpdateCoEditionResponse;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.coedition.CoEditionActionInfo;
import eu.europa.ec.leos.vo.coedition.CoEditionVO;
import eu.europa.ec.leos.vo.coedition.InfoType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.List;


@Controller
public class CoEditionController {

    private static final Logger LOG = LoggerFactory.getLogger(CoEditionController.class);
    @Autowired
    CoEditionService coEditionService;
    @Autowired
    UserService userService;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @EventListener
    //sent already existing data to the channels subscribed
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        GenericMessage message = (GenericMessage) event.getMessage();
        String simpDestination = (String) message.getHeaders().get("simpDestination");


        // handle subscription for all the documents
        if (simpDestination.equals("/topic/document")) {
            simpMessagingTemplate.convertAndSend("/topic/document", this.coEditionService.getAllEditInfo());
        }
        // handle subscription for specific document
        if (simpDestination.startsWith("/topic/document/")) {
            String[] parts = simpDestination.split("/");
            String documentId = parts[3];
            simpMessagingTemplate.convertAndSend("/topic/document/" + documentId, this.coEditionService.getCurrentEditInfo(documentId));
        }
    }

    @EventListener
    //on disconnect for any reason make sure that the user is removed from the store
    public void handleSessionUnsubscribeEvent(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        List<CoEditionVO> sessionEdits = this.coEditionService.getCoEditionsFromSession(sessionId);
        this.coEditionService.removeUserEditInfo(sessionId);
        simpMessagingTemplate.convertAndSend("/topic/document", coEditionService.getAllEditInfo());
        for (CoEditionVO coEdit : sessionEdits) {
            simpMessagingTemplate.convertAndSend("/topic/document/" + coEdit.getDocumentId(), coEditionService.getCurrentEditInfo(coEdit.getDocumentId()));

        }
    }

    @MessageMapping("/join/document")
    public void joinDocumentRoom(Message<CoEditionRequest> message) {
        CoEditionRequest event = message.getPayload();
        LOG.info("Received message from user {} on documentId {} with type {}", event.getUserId(), event.getDocumentId(), event.getInfoType());
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(message);
        User user = this.userService.getUser(event.getUserId());
        CoEditionActionInfo coEditionActionInfo = this.coEditionService.storeUserEditInfo(headerAccessor.getSessionId(), event.getPresenterId(), user, event.getDocumentId(), event.getElementId(), event.getInfoType());
        simpMessagingTemplate.convertAndSend("/topic/document", this.coEditionService.getAllEditInfo());
        simpMessagingTemplate.convertAndSend("/topic/document/" + event.getDocumentId(), coEditionActionInfo);
    }

    @MessageMapping("/remove/document")
    public void removeFromDocumentRoom(Message<CoEditionRequest> message) {
        CoEditionRequest event = message.getPayload();
        LOG.info("Received message from user {} on documentId {} with type {} for remove", event.getUserId(), event.getDocumentId(), event.getInfoType());
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(message);
        User user = this.userService.getUser(event.getUserId());
        CoEditionActionInfo coEditionActionInfo = this.coEditionService.removeUserEditInfo(event.getPresenterId(), event.getDocumentId(), event.getElementId(), event.getInfoType());
        simpMessagingTemplate.convertAndSend("/topic/document", this.coEditionService.getAllEditInfo());
        simpMessagingTemplate.convertAndSend("/topic/document/" + event.getDocumentId(), coEditionActionInfo);
    }

    @MessageMapping("/update/document")
    public void updateDocumentAndSendUpdateToRoom(Message<UpdateCoEditionRequest> message) {
        UpdateCoEditionRequest event = message.getPayload();
        LOG.info("Received message from user {} on documentId {} for update ", event.getUserId(), event.getDocumentId());
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(message);
        User user = this.userService.getUser(event.getUserId());
        simpMessagingTemplate.convertAndSend("/topic/document/" + event.getDocumentId(),
                new UpdateCoEditionResponse(user, event.getPresenterId(), event.getDocumentId(), InfoType.DOCUMENT_UPDATED));
    }


    @MessageMapping("/removeSession")
    public void removeSession(Message<CoEditionRequest> message) {
        CoEditionRequest event = message.getPayload();
        LOG.info("Received message to remove session {} ", event.getSessionId());
        CoEditionActionInfo coEditionActionInfo = this.coEditionService.removeUserEditInfo(event.getSessionId());
        simpMessagingTemplate.convertAndSend("/topic/document", this.coEditionService.getAllEditInfo());
        if (coEditionActionInfo.sucesss()) {
            simpMessagingTemplate.convertAndSend("/topic/document/" + event.getDocumentId(), coEditionActionInfo.getCoEditionVos());
        }
    }
}
