package eu.europa.ec.leos.services.config;

import com.hazelcast.config.*;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.spring.cache.HazelcastCacheManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.hazelcast.config.annotation.web.http.EnableHazelcastHttpSession;

@Configuration
@EnableCaching
@EnableHazelcastHttpSession
@RequiredArgsConstructor
public class HazelcastCacheConfig {

    @Value("${leos.hazelcast.kubernetes.enabled:true}")
    private Boolean kubernetesEnabled;

    @Value("${leos.hazelcast.k8s.namespace:legiswrite2-acceptance-cloud-tc-00}")
    private String k8sNamespace;

    @Value("${leos.hazelcast.instance.name:leos-hazelcast-instance}")
    private String instanceName;

    @Value("${leos.hazelcast.port:5701}")
    private int hazelcastPort;

    private final AppProperties properties;

    @Bean
    public Config hazelcastConfig() {
        Config config = new Config();
        config.setInstanceName(instanceName);

        // Network configuration for clustering (replaces JGroups)
        NetworkConfig networkConfig = config.getNetworkConfig();

        // Join configuration
        JoinConfig joinConfig = networkConfig.getJoin();
        joinConfig.getMulticastConfig().setEnabled(false);
        joinConfig.getTcpIpConfig().setEnabled(false);
        joinConfig.getAwsConfig().setEnabled(false);

        if (Boolean.TRUE.equals(kubernetesEnabled)) {
            networkConfig.setPort(hazelcastPort);
            networkConfig.setPortAutoIncrement(true);
            joinConfig.getKubernetesConfig()
                    .setEnabled(true)
                    .setProperty("namespace", k8sNamespace);
        } else {
            joinConfig.getAutoDetectionConfig().setEnabled(false);
            networkConfig.setPort(0);
            networkConfig.setPortAutoIncrement(false);
            joinConfig.getKubernetesConfig().setEnabled(false);
        }

        // Configure individual caches based on old EhCache configuration
        configureUserCaches(config);
        configureTocCaches(config);
        configureDocumentCaches(config);
        configureSearchCaches(config);
        configureRepositoryCaches(config);
        configureCoEditionCache(config);
        configureSessionCache(config);

        return config;
    }

    @Bean
    public HazelcastInstance hazelcastInstance() {
        return Hazelcast.newHazelcastInstance(hazelcastConfig());
    }

    @Bean
    public CacheManager cacheManager() {
        return new HazelcastCacheManager(hazelcastInstance());
    }

    // Helper method to create standard cache configuration
    private MapConfig createCacheConfig(String name, int defaultMaxSize, int defaultTtlSeconds, int defaultMaxIdleSeconds) {
        int maxSize = properties.getProperty("leos.cache.%s.maxSize".formatted(name), Integer::parseInt, defaultMaxSize);
        int ttlSeconds = properties.getProperty("leos.cache.%s.ttlSeconds".formatted(name), Integer::parseInt, defaultTtlSeconds);
        int maxIdleSeconds = properties.getProperty("leos.cache.%s.maxIdleSeconds".formatted(name), Integer::parseInt, defaultMaxIdleSeconds);

        MapConfig mapConfig = new MapConfig(name);
        mapConfig.setInMemoryFormat(InMemoryFormat.OBJECT);

        // Create and set eviction config (includes size configuration in Hazelcast 5.x)
        EvictionConfig evictionConfig = new EvictionConfig();
        evictionConfig.setEvictionPolicy(EvictionPolicy.LFU);
        mapConfig.setEvictionConfig(evictionConfig);

        if (name.equals("coEditionCache")) {
            evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_PARTITION);
            evictionConfig.setSize(maxSize);
        } else {
            evictionConfig.setMaxSizePolicy(MaxSizePolicy.PER_NODE);
            evictionConfig.setSize(Math.max(maxSize, 300));
        }

        // Time-based expiration
        if (ttlSeconds > 0) {
            mapConfig.setTimeToLiveSeconds(ttlSeconds);
        }

        if (maxIdleSeconds > 0) {
            mapConfig.setMaxIdleSeconds(maxIdleSeconds);
        }

        return mapConfig;
    }

    // User-related cache configurations
    private void configureUserCaches(Config config) {
        // Users cache
        MapConfig usersCache = createCacheConfig("users", 50, 3600, 600);
        config.addMapConfig(usersCache);

        // Light Profile cache
        MapConfig lightProfileCache = createCacheConfig("lightProfile", 50, 3600, 600);
        config.addMapConfig(lightProfileCache);
    }

    // TOC-related cache configurations
    private void configureTocCaches(Config config) {
        // TOC Structure List
        MapConfig tocStructureListCache = createCacheConfig("tocStructureList", 25, 3600, 600);
        config.addMapConfig(tocStructureListCache);

        // TOC Structure Rules Map
        MapConfig tocStructureTocRulesMapCache = createCacheConfig("tocStructureTocRulesMap", 25, 3600, 600);
        config.addMapConfig(tocStructureTocRulesMapCache);

        // TOC Structure Rules Orders Map
        MapConfig tocStructureTocRulesOrdersMapCache = createCacheConfig("tocStructureTocRulesOrdersMap", 25, 3600, 600);
        config.addMapConfig(tocStructureTocRulesOrdersMapCache);

        // TOC Structure Document Rules Map
        MapConfig tocStructureDocumentRulesMapCache = createCacheConfig("tocStructureDocumentRulesMap", 25, 3600, 600);
        config.addMapConfig(tocStructureDocumentRulesMapCache);

        // TOC Structure Numbering Config
        MapConfig tocStructureNumConfListCache = createCacheConfig("tocStructureNumConfList", 25, 3600, 600);
        config.addMapConfig(tocStructureNumConfListCache);

        // Reference Configurations
        MapConfig refConfigsCache = createCacheConfig("refConfigs", 25, 3600, 600);
        config.addMapConfig(refConfigsCache);

        // Alternate Config List
        MapConfig alternateConfListCache = createCacheConfig("alternateConfList", 25, 3600, 600);
        config.addMapConfig(alternateConfListCache);
    }

    // Document-related cache configurations
    private void configureDocumentCaches(Config config) {
        // Document Versions - Note: TTL=0 means eternal in EhCache
        MapConfig docVersionsCache = createCacheConfig("docVersions", 100, 0, 600);
        config.addMapConfig(docVersionsCache);

        // AKN Cache (Official Journal)
        MapConfig aknCache = createCacheConfig("aknCache", 25, 3600, 600);
        config.addMapConfig(aknCache);
    }

    // Search-related cache configurations
    private void configureSearchCaches(Config config) {
        // Search Engine Cache
        MapConfig searchEngineCache = createCacheConfig("searchEngineCache", 25, 3600, 600);
        config.addMapConfig(searchEngineCache);

        // Search Engine Cache Highlight
        MapConfig searchEngineCacheHighlight = createCacheConfig("searchEngineCacheHighlight", 25, 3600, 600);
        config.addMapConfig(searchEngineCacheHighlight);

        // Reference Label Target Document Cache (very short TTL)
        MapConfig referenceLabelTargetDocumentCache = createCacheConfig("referenceLabelTargetDocumentCache", 25, 5, 5);
        config.addMapConfig(referenceLabelTargetDocumentCache);

        // Reference Label Target Document Type Cache
        MapConfig referenceLabelTargetDocumentTypeCache = createCacheConfig("referenceLabelTargetDocumentTypeCache", 25, 5, 5);
        config.addMapConfig(referenceLabelTargetDocumentTypeCache);
    }

    // Repository-related cache configurations
    private void configureRepositoryCaches(Config config) {
        // CMIS Repository Folder Cache
        MapConfig cmisRepositoryFolderCache = createCacheConfig("cmisRepositoryFolderCache", 50, 3600, 600);
        config.addMapConfig(cmisRepositoryFolderCache);

        // Document by Version Cache
        MapConfig documentByVersionCache = createCacheConfig("documentByVersionCache", 50, 3600, 600);
        config.addMapConfig(documentByVersionCache);

        // REST Repository Folder Cache
        MapConfig restRepositoryFolderCache = createCacheConfig("restRepositoryFolderCache", 50, 3600, 600);
        config.addMapConfig(restRepositoryFolderCache);

        // Document First Version Cache
        MapConfig documentFirstVersionCache = createCacheConfig("documentFirstVersionCache", 50, 3600, 600);
        config.addMapConfig(documentFirstVersionCache);

        // Document Cache
        MapConfig documentCache = createCacheConfig("documentCache", 50, 3600, 600);
        config.addMapConfig(documentCache);

        // Config Cache
        MapConfig configCache = createCacheConfig("configCache", 50, 3600, 600);
        config.addMapConfig(configCache);

        // Document by ID Cache
        MapConfig documentByIdCache = createCacheConfig("documentByIdCache", 50, 3600, 600);
        config.addMapConfig(documentByIdCache);

        // Document by Name Cache
        MapConfig documentByNameCache = createCacheConfig("documentByNameCache", 50, 3600, 600);
        config.addMapConfig(documentByNameCache);
    }

    // CoEdition cache with clustering (replaces JGroups replication)
    private void configureCoEditionCache(Config config) {
        MapConfig coEditionCache = createCacheConfig("coEditionCache", 2, 0, 600);

        // Enable backup for distributed cache (replaces JGroups replication)
        coEditionCache.setBackupCount(1); // Number of backup copies
        coEditionCache.setAsyncBackupCount(1); // Async backup copies

        // Entry listeners for cache events (equivalent to EhCache event listeners)
        // In Hazelcast 5.x, we use constructor with local=false and includeValue=true
        EntryListenerConfig listenerConfig = new EntryListenerConfig(
                "eu.europa.ec.leos.services.coedition.cache.CoEditionCacheEntryListener",
                false,  // local = false means listen to events from all cluster members
                true    // includeValue = true means include actual values in events
        );
        coEditionCache.addEntryListenerConfig(listenerConfig);

        config.addMapConfig(coEditionCache);

        // Update elements broadcast cache
        MapConfig updateElementsCache = new MapConfig("updateElementsCache");
        updateElementsCache.setBackupCount(0);
        updateElementsCache.setTimeToLiveSeconds(5);
        EntryListenerConfig updateListener = new EntryListenerConfig(
                "eu.europa.ec.leos.services.dto.coedition.UpdateElementsListener",
                false, true
        );
        updateElementsCache.addEntryListenerConfig(updateListener);
        config.addMapConfig(updateElementsCache);

        // Update document broadcast cache
        MapConfig updateDocumentCache = new MapConfig("updateDocumentCache");
        updateDocumentCache.setBackupCount(0);
        updateDocumentCache.setTimeToLiveSeconds(5);
        EntryListenerConfig updateDocListener = new EntryListenerConfig(
                "eu.europa.ec.leos.services.dto.coedition.UpdateDocumentListener",
                false, true
        );
        updateDocumentCache.addEntryListenerConfig(updateDocListener);
        config.addMapConfig(updateDocumentCache);
    }

    // Spring Session cache configuration
    private void configureSessionCache(Config config) {
        MapConfig sessionCache = new MapConfig("spring:session:sessions");
        sessionCache.setBackupCount(1);
        sessionCache.setAsyncBackupCount(1);
        sessionCache.setMaxIdleSeconds(1800); // 30 minutes
        config.addMapConfig(sessionCache);
    }
}
