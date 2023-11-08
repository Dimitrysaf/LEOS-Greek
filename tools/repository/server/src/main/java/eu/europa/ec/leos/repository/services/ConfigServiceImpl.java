package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.entities.Config;
import eu.europa.ec.leos.repository.entities.ConfigContent;
import eu.europa.ec.leos.repository.entities.ConfigVersion;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.ConfigContentRepository;
import eu.europa.ec.leos.repository.repositories.ConfigRepository;
import eu.europa.ec.leos.repository.repositories.ConfigVersionRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ConfigServiceImpl implements ConfigService {
    private static final Logger LOG = LoggerFactory.getLogger(ConfigServiceImpl.class);

    @Autowired
    private ConfigRepository configRepository;
    @Autowired
    private ConfigVersionRepository configVersionRepository;
    @Autowired
    private ConfigContentRepository configContentRepository;

    public List<LeosDocument> findConfigByName(final String name) throws RepositoryException {
        Optional<Config> hasDoc = configRepository.findConfigByName(name);
        if (hasDoc.isPresent()) {
            ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(hasDoc.get().getId());
            if (version == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigVersion.class.getName());
            }
            ConfigContent content = configContentRepository.findConfigContentByVersionId(version);
            if (content == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigContent.class.getName());
            }
            return Arrays.asList(ConversionUtils.buildConfigDocument(hasDoc.get(), content));
        } else {
            return Arrays.asList();
        }
    }

    public LeosDocument findConfigById(final String id) throws RepositoryException {
        try {
            ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(new BigDecimal(Long.parseLong(id)));
            if (version == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigVersion.class.getName());
            }
            Config doc = configRepository.findById(version.getConfigId()).orElseThrow(() -> new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND,
                    Config.class.getName()));
            ConfigContent content = configContentRepository.findConfigContentByVersionId(version);
            if (content == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigContent.class.getName());
            }
            return ConversionUtils.buildConfigDocument(doc, content);
        } catch(Exception e) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Config.class.getName());
        }

    }

    public LeosDocument findConfigByVersionId(final BigDecimal id) throws RepositoryException {
        try {
            ConfigVersion version = this.configVersionRepository.findLastConfigVersionByVersionId(id);
            if (version == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigVersion.class.getName());
            } else {
                Config doc = this.configRepository.findById(version.getConfigId()).orElseThrow(() -> {
                    return new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Config.class.getName());
                });
                ConfigContent content = this.configContentRepository.findConfigContentByVersionId(version);
                if (content == null) {
                    throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigContent.class.getName());
                } else {
                    return ConversionUtils.buildConfigDocument(doc, content);
                }
            }
        } catch (Exception var5) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, Config.class.getName());
        }
    }
}
