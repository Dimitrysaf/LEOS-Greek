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

import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
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

import java.util.ArrayList;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;


@Controller
public class CoEditionController {

    private static final Logger LOG = LoggerFactory.getLogger(CoEditionController.class);
    private static final String TOPIC_DOCUMENT = "/topic/document";
    private static final String TOPIC_DOCUMENT_SLASH = "/topic/document/";
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
        if(simpDestination == null){
            return;
        }

        // handle subscription for all the documents
        if (simpDestination.equals(TOPIC_DOCUMENT)) {
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, this.coEditionService.getAllEditInfo());
        }
        // handle subscription for specific document
        if (simpDestination.startsWith(TOPIC_DOCUMENT_SLASH)) {
            String[] parts = simpDestination.split("/");
            String documentId = parts[3];
            String destination = encodeParam(documentId);
            simpMessagingTemplate.convertAndSend(destination, this.coEditionService.getCurrentEditInfo(documentId));
        }
    }

    @EventListener
    //on disconnect for any reason make sure that the user is removed from the store
    public void handleSessionUnsubscribeEvent(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        List<CoEditionVO> sessionEdits = this.coEditionService.getCoEditionsFromSession(sessionId);
        this.coEditionService.removeUserEditInfo(sessionId);
        simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        for (CoEditionVO coEdit : sessionEdits) {
            String destination = encodeParam(TOPIC_DOCUMENT_SLASH + coEdit.getDocumentId());
            simpMessagingTemplate.convertAndSend(destination, coEditionService.getCurrentEditInfo(coEdit.getDocumentId()));

        }
    }

    @MessageMapping("/join/document")
    public void joinDocumentRoom(Message<CoEditionRequest> message) {
        CoEditionRequest event = message.getPayload();
        LOG.info("Received message from user {} on documentId {} with type {}", event.getUserId(), event.getDocumentId(), event.getInfoType());
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(message);
        User user = this.userService.getUser(event.getUserId());
        String destination = encodeParam(TOPIC_DOCUMENT_SLASH + event.getDocumentId());
        CoEditionActionInfo coEditionActionInfo = this.coEditionService.storeUserEditInfo(headerAccessor.getSessionId(), event.getPresenterId(), user, event.getDocumentId(), event.getElementId(), event.getInfoType());
        simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, this.coEditionService.getAllEditInfo());
        simpMessagingTemplate.convertAndSend(destination, coEditionActionInfo);
    }

    @MessageMapping("/remove/document")
    public void removeFromDocumentRoom(Message<CoEditionRequest> message) {
        CoEditionRequest event = message.getPayload();
        LOG.info("Received message from user {} on documentId {} with type {} for remove", event.getUserId(), event.getDocumentId(), event.getInfoType());
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(message);
        User user = this.userService.getUser(event.getUserId());
        String destination = encodeParam(TOPIC_DOCUMENT_SLASH + event.getDocumentId());
        CoEditionActionInfo coEditionActionInfo = this.coEditionService.removeUserEditInfo(event.getPresenterId(), event.getDocumentId(), event.getElementId(), event.getInfoType());
        simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, this.coEditionService.getAllEditInfo());
        simpMessagingTemplate.convertAndSend(destination, coEditionActionInfo);
    }

    @MessageMapping("/update/document")
    public void updateDocumentAndSendUpdateToRoom(Message<UpdateCoEditionRequest> message) {
        UpdateCoEditionRequest event = message.getPayload();
        LOG.info("Received message from user {} on documentId {} for update ", event.getUserId(), event.getDocumentId());
        SimpMessageHeaderAccessor.wrap(message);
        User user = this.userService.getUser(event.getUserId());
        List<Element> elements = new ArrayList<Element>();
        if(event.getElementFragment() != null) {
            elements.add(new Element(event.getElementId(), event.getElementTagName(), event.getElementFragment()));
        }
        String destination = encodeParam(TOPIC_DOCUMENT_SLASH + event.getDocumentId());
        simpMessagingTemplate.convertAndSend(destination,
                new UpdateCoEditionResponse(user, event.getPresenterId(), event.getDocumentId(), InfoType.DOCUMENT_UPDATED, elements));
    }


    @MessageMapping("/removeSession")
    public void removeSession(Message<CoEditionRequest> message) {
        CoEditionRequest event = message.getPayload();
        LOG.info("Received message to remove session {} ", event.getSessionId());
        CoEditionActionInfo coEditionActionInfo = this.coEditionService.removeUserEditInfo(event.getSessionId());
        simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, this.coEditionService.getAllEditInfo());
        if (coEditionActionInfo.sucesss()) {
            String destination = encodeParam(TOPIC_DOCUMENT_SLASH + event.getDocumentId());
            simpMessagingTemplate.convertAndSend(destination, coEditionActionInfo.getCoEditionVos());
        }
    }
}
