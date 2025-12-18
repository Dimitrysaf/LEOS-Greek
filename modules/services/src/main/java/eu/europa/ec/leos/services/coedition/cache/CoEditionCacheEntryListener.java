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
package eu.europa.ec.leos.services.coedition.cache;

import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.hazelcast.core.EntryEvent;
import com.hazelcast.map.MapEvent;
import com.hazelcast.map.listener.EntryAddedListener;
import com.hazelcast.map.listener.EntryEvictedListener;
import com.hazelcast.map.listener.EntryExpiredListener;
import com.hazelcast.map.listener.EntryRemovedListener;
import com.hazelcast.map.listener.EntryUpdatedListener;
import com.hazelcast.map.listener.MapClearedListener;

import eu.europa.ec.leos.services.coedition.CoEditionService;
import eu.europa.ec.leos.services.coedition.CoEditionServiceImpl;
import eu.europa.ec.leos.services.support.cache.SpringContext;
import eu.europa.ec.leos.vo.coedition.CoEditionActionInfo;
import eu.europa.ec.leos.vo.coedition.CoEditionVO;

public class CoEditionCacheEntryListener implements EntryAddedListener<Object, Object>,
        EntryRemovedListener<Object, Object>,
        EntryUpdatedListener<Object, Object>,
        EntryEvictedListener<Object, Object>,
        EntryExpiredListener<Object, Object>,
        MapClearedListener {

    private static final Logger LOG = LoggerFactory.getLogger(CoEditionCacheEntryListener.class);

    private static final String TOPIC_DOCUMENT = "/topic/document";
    private static final String TOPIC_DOCUMENT_SLASH = "/topic/document/";

    private SimpMessagingTemplate simpMessagingTemplate = null;
    private CoEditionService coEditionService = null;

    @Override
    public void entryAdded(EntryEvent<Object, Object> event) {
        LOG.info("CoEdition entry ADDED - Key: {}, Value: {}, Member: {}",
                event.getKey(), event.getValue(), event.getMember());

        boolean isLocalEvent = event.getMember().localMember();
        LOG.info("Event is local: {}", isLocalEvent);

        if (this.getCoEditionService() == null){
            LOG.info("CoEdition service is NULL");
        }
        if (this.getSimpMessagingTemplate() == null){
            LOG.info("SimpMessagingTemplate is NULL");
        }

        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) {
            // On server startup (bootstrap) spring context might not be available
            CoEditionVO addedInfo = (CoEditionVO) event.getValue();
            LOG.info("CoEdition entry ADDED - Key: {}, Value: {}, Member: {}",
                    event.getKey(), event.getValue(), event.getMember());
            LOG.debug("Cache event - 'entryAdded' for " + addedInfo.getInfoType().toString() + " " +
                    addedInfo.getDocumentId() + " " + addedInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.STORE, addedInfo,
                    coEditionService.getCurrentEditInfo(addedInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + addedInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void entryRemoved(EntryEvent<Object, Object> event) {
        LOG.info("CoEdition entry REMOVED - Key: {}, Value: {}, Member: {}",
                event.getKey(), event.getOldValue(), event.getMember());
        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) {
            CoEditionVO removedInfo = (CoEditionVO) event.getOldValue();
            LOG.info("CoEdition entry REMOVED - Key: {}, Value: {}, Member: {}",
                    event.getKey(), event.getOldValue(), event.getMember());
            LOG.debug("Cache event - 'entryRemoved' for " + removedInfo.getInfoType().toString() + " " +
                    removedInfo.getDocumentId() + " " + removedInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.REMOVE, removedInfo,
                    coEditionService.getCurrentEditInfo(removedInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + removedInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void entryUpdated(EntryEvent<Object, Object> event) {
        // Updated entries are treated the same as added entries (like in the original EhCache implementation)
        LOG.info("CoEdition entry UPDATED - Key: {}, OldValue: {}, NewValue: {}, Member: {}",
                event.getKey(), event.getOldValue(), event.getValue(), event.getMember());
        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) {
            CoEditionVO updatedInfo = (CoEditionVO) event.getValue();
            LOG.info("CoEdition entry UPDATED - Key: {}, OldValue: {}, NewValue: {}, Member: {}",
                    event.getKey(), event.getOldValue(), event.getValue(), event.getMember());
            LOG.debug("Cache event - 'entryUpdated' for " + updatedInfo.getInfoType().toString() + " " +
                    updatedInfo.getDocumentId() + " " + updatedInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.STORE, updatedInfo,
                    coEditionService.getCurrentEditInfo(updatedInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + updatedInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void entryEvicted(EntryEvent<Object, Object> event) {
        LOG.info("CoEdition entry EVICTED - Key: {}, Member: {}",
                event.getKey(), event.getMember());
        // Evicted entries are treated the same as removed entries (like in the original EhCache implementation)
        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) {
            CoEditionVO evictedInfo = (CoEditionVO) event.getOldValue();
            LOG.info("CoEdition entry EVICTED - Key: {}, Member: {}",
                    event.getKey(), event.getMember());
            LOG.debug("Cache event - 'entryEvicted' for " + evictedInfo.getInfoType().toString() + " " +
                    evictedInfo.getDocumentId() + " " + evictedInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.REMOVE, evictedInfo,
                    coEditionService.getCurrentEditInfo(evictedInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + evictedInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void entryExpired(EntryEvent<Object, Object> event) {
        LOG.info("CoEdition entry EXPIRED - Key: {}, Member: {}",
                event.getKey(), event.getMember());
        // Expired entries are treated the same as removed entries (like in the original EhCache implementation)
        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) {
            CoEditionVO expiredInfo = (CoEditionVO) event.getOldValue();
            LOG.info("CoEdition entry EXPIRED - Key: {}, Member: {}",
                    event.getKey(), event.getMember());
            LOG.debug("Cache event - 'entryExpired' for " + expiredInfo.getInfoType().toString() + " " +
                    expiredInfo.getDocumentId() + " " + expiredInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.REMOVE, expiredInfo,
                    coEditionService.getCurrentEditInfo(expiredInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + expiredInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void mapCleared(MapEvent event) {
        // Map cleared is equivalent to notifyRemoveAll in EhCache
        LOG.debug("Cache event - 'mapCleared'");
        if (this.getSimpMessagingTemplate() != null) {
            this.getSimpMessagingTemplate().convertAndSend(TOPIC_DOCUMENT, new ArrayList<CoEditionVO>());
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

    private CoEditionService getCoEditionService() {
        if (this.coEditionService == null) {
            try {
                coEditionService = SpringContext.getBean(CoEditionServiceImpl.class);
            } catch (Exception e) {
                LOG.warn("Could not retrieve CoEditionService from Spring context", e);
            }
        }
        return coEditionService;
    }
}
