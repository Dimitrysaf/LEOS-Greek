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

import eu.europa.ec.leos.services.coedition.CoEditionService;
import eu.europa.ec.leos.services.coedition.CoEditionServiceImpl;
import eu.europa.ec.leos.services.support.cache.SpringContext;
import eu.europa.ec.leos.vo.coedition.CoEditionActionInfo;
import eu.europa.ec.leos.vo.coedition.CoEditionVO;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.event.CacheEventListener;

public class CoEditionCacheEventListener implements CacheEventListener {

    private static final Logger LOG = LoggerFactory.getLogger(CoEditionCacheEventListener.class);

    private static final String TOPIC_DOCUMENT = "/topic/document";
    private static final String TOPIC_DOCUMENT_SLASH = "/topic/document/";

    private SimpMessagingTemplate simpMessagingTemplate = null;
    private CoEditionService coEditionService = null;

    @Override
    public void notifyElementRemoved(Ehcache ehcache, Element element) throws CacheException {
        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) {
            CoEditionVO removedInfo = (CoEditionVO)element.getObjectValue();
            LOG.debug("Cache event - 'notifyElementRemoved' for " + removedInfo.getInfoType().toString() + " " +
                    removedInfo.getDocumentId() + " " + removedInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.REMOVE, removedInfo,
                    coEditionService.getCurrentEditInfo(removedInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + removedInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void notifyElementPut(Ehcache ehcache, Element element) throws CacheException {
        if ((this.getCoEditionService() != null) && (this.getSimpMessagingTemplate() != null)) { // On server startup (bootstrapCacheLoaderFactory sync) spring context is not available
            CoEditionVO addedInfo = (CoEditionVO)element.getObjectValue();
            LOG.debug("Cache event - 'notifyElementPut' for " + addedInfo.getInfoType().toString() + " " +
                    addedInfo.getDocumentId() + " " + addedInfo.getElementId());
            CoEditionActionInfo actionInfo = new CoEditionActionInfo(true, CoEditionActionInfo.Operation.STORE, addedInfo,
                    coEditionService.getCurrentEditInfo(addedInfo.getDocumentId()));
            simpMessagingTemplate.convertAndSend(encodeParam(TOPIC_DOCUMENT_SLASH + addedInfo.getDocumentId()), actionInfo);
            simpMessagingTemplate.convertAndSend(TOPIC_DOCUMENT, coEditionService.getAllEditInfo());
        }
    }

    @Override
    public void notifyElementUpdated(Ehcache ehcache, Element element) throws CacheException {
        this.notifyElementPut(ehcache, element);
    }

    @Override
    public void notifyElementExpired(Ehcache ehcache, Element element) {
        this.notifyElementRemoved(ehcache, element);
    }

    @Override
    public void notifyElementEvicted(Ehcache ehcache, Element element) {
        this.notifyElementRemoved(ehcache, element);
    }

    @Override
    public void notifyRemoveAll(Ehcache ehcache) {
        LOG.debug("Cache event - 'notifyRemoveAll'");
        this.getSimpMessagingTemplate().convertAndSend(TOPIC_DOCUMENT, new ArrayList<CoEditionVO>());
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return null;
    }

    @Override
    public void dispose() {
    }

    private SimpMessagingTemplate getSimpMessagingTemplate() {
        if (this.simpMessagingTemplate == null) {
            simpMessagingTemplate = SpringContext.getBean(SimpMessagingTemplate.class);
        }
        return simpMessagingTemplate;
    }

    private CoEditionService getCoEditionService() {
        if (this.coEditionService == null) {
            coEditionService = SpringContext.getBean(CoEditionServiceImpl.class);
        }
        return coEditionService;
    }

}
