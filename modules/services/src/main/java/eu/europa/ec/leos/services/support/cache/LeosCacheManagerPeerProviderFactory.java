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
package eu.europa.ec.leos.services.support.cache;

import java.net.URL;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.distribution.CacheManagerPeerProvider;
import net.sf.ehcache.distribution.CacheManagerPeerProviderFactory;
import net.sf.ehcache.distribution.jgroups.JGroupsCacheManagerPeerProvider;
import net.sf.ehcache.util.PropertyUtil;

public class LeosCacheManagerPeerProviderFactory extends CacheManagerPeerProviderFactory {
    /*
        Based on JGroupsCacheManagerPeerProviderFactory implementation to fix
        'ClassLoaderUtil.getStandardClassLoader()' call that has been removed in Ehcache 2.8.3+
    */
    private static final Logger LOG = LoggerFactory.getLogger(LeosCacheManagerPeerProviderFactory.class.getName());
    private static final String CHANNEL_NAME = "channelName";
    private static final String CONNECT = "connect";
    private static final String FILE = "file";

    public LeosCacheManagerPeerProviderFactory() {
    }

    public CacheManagerPeerProvider createCachePeerProvider(CacheManager cacheManager, Properties properties) {
        LOG.trace("Creating JGroups CacheManagerPeerProvider for {} with properties:\n{}", cacheManager.getName(), properties);
        final String connect = this.getProperty(CONNECT, properties);
        final String file = this.getProperty(FILE, properties);
        final String channelName = this.getProperty(CHANNEL_NAME, properties);
        final JGroupsCacheManagerPeerProvider peerProvider;
        if (file != null) {
            if (connect != null) {
                LOG.warn("Both '" + CONNECT + "' and '" + FILE + "' properties set. '" + CONNECT + "' will be ignored");
            }

            // Ehcache ClassLoaderUtil.getStandardClassLoader() function has been removed in Ehcache 2.8.3+
            //final ClassLoader contextClassLoader = ClassLoaderUtil.getStandardClassLoader();
            final ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
            URL configUrl = contextClassLoader.getResource(file);
            LOG.debug("Creating JGroups CacheManagerPeerProvider for {} with configuration file: {}", cacheManager.getName(), configUrl);
            peerProvider = new JGroupsCacheManagerPeerProvider(cacheManager, configUrl);
        } else {
            LOG.debug("Creating JGroups CacheManagerPeerProvider for {} with configuration:\n{}", cacheManager.getName(), connect);
            peerProvider = new JGroupsCacheManagerPeerProvider(cacheManager, connect);
        }

        peerProvider.setChannelName(channelName);
        return peerProvider;
    }

    private String getProperty(String name, Properties properties) {
        String property = PropertyUtil.extractAndLogProperty(name, properties);
        if (property != null) {
            property = property.trim();
            property = property.replaceAll(" ", "");
            if (property.equals("")) {
                property = null;
            }
        }

        return property;
    }
}
