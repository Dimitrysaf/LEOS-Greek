package eu.europa.ec.leos.services.dto.coedition;

import com.hazelcast.core.EntryEvent;
import com.hazelcast.map.listener.EntryAddedListener;
import eu.europa.ec.leos.services.support.cache.SpringContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

public class UpdateDocumentListener implements EntryAddedListener<String, UpdateCoEditionResponse> {
    
    private static final Logger LOG = LoggerFactory.getLogger(UpdateDocumentListener.class);
    private static final String TOPIC_DOCUMENT_SLASH = "/topic/document/";
    private SimpMessagingTemplate simpMessagingTemplate = null;
    
    @Override
    public void entryAdded(EntryEvent<String, UpdateCoEditionResponse> event) {
        if (getSimpMessagingTemplate() == null) {
            return;
        }

        LOG.info("CoEdition TOC ADDED - Key: {}, Value: {}, Member: {}",
                event.getKey(), event.getValue(), event.getMember());
        
        try {
            UpdateCoEditionResponse response = event.getValue();
            String destination = encodeParam(TOPIC_DOCUMENT_SLASH + response.getDocumentId());
            simpMessagingTemplate.convertAndSend(destination, response);
        } catch (Exception e) {
            LOG.error("Error processing update document event", e);
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