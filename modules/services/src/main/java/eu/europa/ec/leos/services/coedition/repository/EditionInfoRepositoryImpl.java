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

import eu.europa.ec.leos.services.coedition.cache.CoEditionCacheEntryListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import com.hazelcast.map.IMap;
import eu.europa.ec.leos.vo.coedition.CoEditionVO;

@Component
public class EditionInfoRepositoryImpl implements EditionInfoRepository {

    @Autowired
    private CacheManager cacheManager;

    private Cache coEditionCache;

    private static final Logger LOG = LoggerFactory.getLogger(EditionInfoRepositoryImpl.class);

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
        IMap<Object, Object> nativeMap = (IMap<Object, Object>) coEditionCache.getNativeCache();

        // Find matching entries
        List<Object> keysToRemove = nativeMap.entrySet().stream()
                .filter(entry -> {
                    String key = (String) entry.getKey();
                    Object value = entry.getValue();
                    boolean keyMatches = key.startsWith(editionVo.getDocumentId() + "_");
                    boolean valueMatches = value.equals(editionVo);
                    return keyMatches && valueMatches;
                })
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // What method are you using for removal?
        keysToRemove.forEach(key -> {
            // Use direct Hazelcast removal instead of Spring Cache evict
            IMap<Object, Object> nativeMapRemoval = (IMap<Object, Object>) coEditionCache.getNativeCache();
            nativeMapRemoval.remove(key);
        });

        return keysToRemove.size() > 0 ? editionVo : null;
    }

    @Override
    public List<CoEditionVO> getCurrentEditInfo(String docId) {
        return this.getEditInfo(entry -> {
            String key = (String) entry.getKey();
            return key.startsWith(docId + "_");
        });
    }

    @Override
    public List<CoEditionVO> getSessionEditInfo(String sessionId) {
        return this.getEditInfo(entry -> {
            CoEditionVO value = (CoEditionVO) entry.getValue();
            return value.getSessionId() != null && value.getSessionId().equals(sessionId);
        });
    }

    @Override
    public List<CoEditionVO> getAllEditInfo() {
        return this.getEditInfo(entry -> true);
    }

    private List<CoEditionVO> getEditInfo(Predicate<Map.Entry<Object, Object>> infoFilter) {
        IMap<Object, Object> nativeMap = (IMap<Object, Object>) coEditionCache.getNativeCache();

        List<CoEditionVO> infoCoEdition = nativeMap.entrySet().stream()
                .filter(infoFilter)
                .map(entry -> (CoEditionVO) entry.getValue())
                .collect(Collectors.toList());

        return Collections.unmodifiableList(infoCoEdition);
    }
}