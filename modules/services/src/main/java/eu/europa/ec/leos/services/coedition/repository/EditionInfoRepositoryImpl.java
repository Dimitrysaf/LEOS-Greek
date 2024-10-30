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
package eu.europa.ec.leos.services.coedition.repository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import eu.europa.ec.leos.vo.coedition.CoEditionVO;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;

@Component
public class EditionInfoRepositoryImpl implements EditionInfoRepository {

    @Autowired
    private CacheManager cacheManager;

    private Cache coEditionCache;

    @PostConstruct
    public void CoEditionCacheInit() {
        coEditionCache = cacheManager.getCache("coEditionCache");
    }

    @Override
    public CoEditionVO store(CoEditionVO editionVo) {
        coEditionCache.put(editionVo.getDocumentId() + "_" + UUID.randomUUID(), editionVo);
        return editionVo;
    }

    @Override
    public CoEditionVO removeInfo(CoEditionVO editionVo) {
        Ehcache cache = (Ehcache)coEditionCache.getNativeCache();
        Map<Object, Element> cacheElements = cache.getAll(cache.getKeys());
        List<Element> infoToRemove = cacheElements.values().stream()
                .filter(c -> ((String)c.getObjectKey()).startsWith(editionVo.getDocumentId() + "_") &&
                        c.getObjectValue().equals(editionVo)).collect(Collectors.toList());
        infoToRemove.forEach(c -> coEditionCache.evict(c.getObjectKey()));
        return infoToRemove.size() > 0 ? editionVo : null;
    }

    @Override
    public List<CoEditionVO> getCurrentEditInfo(String docId) {
        return this.getEditInfo(c -> ((String)c.getObjectKey()).startsWith(docId + "_"));
    }

    @Override
    public List<CoEditionVO> getSessionEditInfo(String sessionId) {
        return this.getEditInfo(c -> ((CoEditionVO)c.getObjectValue()).getSessionId().equals(sessionId));
    }

    @Override
    public List<CoEditionVO> getAllEditInfo() {
        return this.getEditInfo(c -> true);
    }

    private List<CoEditionVO> getEditInfo(Predicate<Element> infoFilter) {
        Ehcache cache = (Ehcache)coEditionCache.getNativeCache();
        Map<Object, Element> cacheElements = cache.getAll(cache.getKeys());
        List<CoEditionVO> infoCoEdition = cacheElements.values().stream()
                .filter(infoFilter)
                .map(c -> ((CoEditionVO)c.getObjectValue())).collect(Collectors.toList());
        return Collections.unmodifiableList(infoCoEdition);
    }

}
