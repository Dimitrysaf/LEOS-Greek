package eu.europa.ec.leos.repository.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.entities.Config;
import eu.europa.ec.leos.repository.entities.ConfigContent;
import eu.europa.ec.leos.repository.entities.ConfigVersion;
import eu.europa.ec.leos.repository.entities.Notification;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.ConfigContentRepository;
import eu.europa.ec.leos.repository.repositories.ConfigRepository;
import eu.europa.ec.leos.repository.repositories.ConfigVersionRepository;
import eu.europa.ec.leos.repository.utils.ConversionUtils;
import eu.europa.ec.leos.repository.utils.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ConfigServiceImpl implements ConfigService {
    private static final Logger LOG = LoggerFactory.getLogger(ConfigServiceImpl.class);
    public static final String NOTIFICATIONS_HOMEPAGE = "NOTIFICATIONS-HOMEPAGE";

    @Autowired
    private ConfigRepository configRepository;
    @Autowired
    private ConfigVersionRepository configVersionRepository;
    @Autowired
    private ConfigContentRepository configContentRepository;
    private Notification notification;
    @Autowired
    private ObjectMapper objectMapper;

    public List<LeosDocument> findConfigByName(final String name, final boolean withContent) throws RepositoryException {
        Optional<Config> hasDoc = configRepository.findConfigByName(name);
        if (hasDoc.isPresent() && !withContent) {
            return Arrays.asList(ConversionUtils.buildConfigDocument(hasDoc.get()));
        } else if (hasDoc.isPresent()) {
            ConfigContent content = getConfigContent(hasDoc.get());
            return Arrays.asList(ConversionUtils.buildConfigDocument(hasDoc.get(), content));
        } else {
            return Arrays.asList();
        }
    }

    private ConfigContent getConfigContent(Config config) throws RepositoryException {
        ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(config.getId());
        if (version == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigVersion.class.getName());
        }
        ConfigContent content = configContentRepository.findConfigContentByVersionId(version);
        if (content == null) {
            throw new RepositoryException(RepositoryException.RepositoryExceptionCode.DB_NOT_FOUND, ConfigContent.class.getName());
        }
        return content;
    }

    public List<LeosDocument> findConfigByName(final String name) throws RepositoryException {
        return this.findConfigByName(name, true);
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


    public void saveNotifications(String content)  throws RepositoryException {
        Optional<Config> hasDoc = configRepository.findConfigByName(NOTIFICATIONS_HOMEPAGE);
        if (hasDoc.isPresent()){
            ConfigContent configContent = this.getConfigContent(hasDoc.get());
            configContent.setContentString(content);
            configContentRepository.save(configContent);
        }
    }

    public String fetchNotifications() throws RepositoryException {
        Optional<Config> hasDoc = configRepository.findConfigByName(NOTIFICATIONS_HOMEPAGE);
        ConfigContent configContent = null;
        if (hasDoc.isPresent()){
            configContent = this.getConfigContent(hasDoc.get());
        }
        List<Notification> notifications = null;
        try {
            notifications = objectMapper.readValue(configContent.getContent(), new TypeReference<List<Notification>>() {});
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        long currentTime = System.currentTimeMillis() / 1000;

        // Filter notifications based on current time
        List<Notification> filteredNotifications = notifications.stream()
                .filter(notification -> {
                    try {
                        long startTime = DateUtils.convertToUnixTimestamp(notification.getStart());
                        long endTime = DateUtils.convertToUnixTimestamp(notification.getEnd());
                        return startTime <= currentTime && currentTime < endTime;
                    } catch (ParseException e) {
                        e.printStackTrace();
                        return false;
                    }
                })
                .collect(Collectors.toList());

        // Convert filtered notifications back to JSON string
        try {
            return objectMapper.writeValueAsString(filteredNotifications);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
