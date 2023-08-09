package eu.europa.ec.leos.repository.cache;

import org.springframework.boot.autoconfigure.cache.CacheManagerCustomizer;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CacheCustomizer implements CacheManagerCustomizer<ConcurrentMapCacheManager> {

    @Override
    public void customize(ConcurrentMapCacheManager cacheManager) {
        cacheManager.setCacheNames(Arrays.asList("findDocumentByVersion",
                "findFirstVersion",
                "findTemplateByName",
                "findConfigByName",
                "findConfigById",
                "findConfigByVersionId",
                "getPackageByName",
                "getPackageById",
                "findPackageByDocumentRef"));
    }
}
