package eu.europa.ec.leos.services.dto.coedition;

import com.hazelcast.core.EntryEvent;
import com.hazelcast.map.listener.EntryAddedListener;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.support.cache.SpringContext;
import eu.europa.ec.leos.vo.coedition.InfoType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

public class UpdateElementsListener implements EntryAddedListener<String, UpdateElementsEvent> {
    
    private static final Logger LOG = LoggerFactory.getLogger(UpdateElementsListener.class);
    private SimpMessagingTemplate simpMessagingTemplate = null;
    
    @Override
    public void entryAdded(EntryEvent<String, UpdateElementsEvent> event) {
        if (getSimpMessagingTemplate() == null) {
            return;
        }

        LOG.info("CoEdition Element ADDED - Key: {}, Value: {}, Member: {}",
                event.getKey(), event.getValue(), event.getMember());
        
        try {
            UpdateElementsEvent evt = event.getValue();
            String documentRef = evt.getDocumentRef();
            String presenterIdFinal = encodeParam(evt.getPresenterId());
            String documentRefFinal = encodeParam(documentRef);
            
            List<Element> updatedElements = new ArrayList<>();
            updatedElements.add(new Element(evt.getUpdatedElement().getElementId(), 
                                           evt.getUpdatedElement().getElementTagName(),
                                           evt.getUpdatedElement().getElementFragment(), 
                                           evt.getAlternateElementId()));
            
            if (evt.getUpdatedElement().getElementsMoved() != null) {
                evt.getUpdatedElement().getElementsMoved().forEach(e -> 
                    updatedElements.add(new Element(e.getElementId(), e.getElementTagName(), 
                                                   e.getElementFragment(), evt.getAlternateElementId())));
            }
            
            simpMessagingTemplate.convertAndSend(CoEditionContext.TOPIC_DOCUMENT_SLASH + documentRef,
                new UpdateCoEditionResponse(null, presenterIdFinal, documentRefFinal, 
                                          InfoType.DOCUMENT_UPDATED, updatedElements));
        } catch (Exception e) {
            LOG.error("Error processing update elements event", e);
        }
    }
    
    private SimpMessagingTemplate getSimpMessagingTemplate() {
        if (this.simpMessagingTemplate == null) {
            try {
                simpMessagingTemplate = SpringContext.getBean(SimpMessagingTemplate.class);
            } catch (Exception e) {
                LOG.warn("Could not retrieve SimpMessagingTemplate from Spring context", e);
            }
        }
        return simpMessagingTemplate;
    }
}
