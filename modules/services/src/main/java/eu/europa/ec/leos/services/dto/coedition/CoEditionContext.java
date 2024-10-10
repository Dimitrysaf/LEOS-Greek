package eu.europa.ec.leos.services.dto.coedition;

import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.vo.coedition.InfoType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.ArrayList;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

@Component
@RequestScope
public class CoEditionContext {
    public static final String TOPIC_DOCUMENT_SLASH = "/topic/document/";
    @Autowired
    private SecurityContext securityContext;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private List<Element> updatedElements = new ArrayList<Element>();

    public void sendUpdatedElements(String documentRef, String presenterId, SaveElementResponse updatedElement, String alternateElementId) {
        final String presenterIdFinal = encodeParam(presenterId);
        final String documentRefFinal = encodeParam(documentRef);
        new Thread(() -> {
            User user = securityContext.getUser();
            addUpdatedElement(updatedElement.getElementId(), updatedElement.getElementTagName(),
                    updatedElement.getElementFragment(), alternateElementId);

            if(updatedElement.getElementsMoved()!=null){
                updatedElement.getElementsMoved()
                        .forEach(e -> addUpdatedElement(e.getElementId(),e.getElementTagName(), e.getElementFragment(), alternateElementId));
            }
            simpMessagingTemplate.convertAndSend(CoEditionContext.TOPIC_DOCUMENT_SLASH + documentRef,
                    new UpdateCoEditionResponse(user, presenterIdFinal, documentRefFinal, InfoType.DOCUMENT_UPDATED,
                            getUpdatedElements()));
        }).start();
    }

    public void addUpdatedElement(String elementId, String elementTagName, String elementFragment, String alternateElementId) {
        Element newElement = new Element(elementId, elementTagName, elementFragment, alternateElementId);
        updatedElements.remove(newElement);
        updatedElements.add(newElement);
    }

    public List<Element> getUpdatedElements() {
        return updatedElements;
    }

    public void setUpdatedElements(List<Element> updatedElements) {
        this.updatedElements = updatedElements;
    }
}
