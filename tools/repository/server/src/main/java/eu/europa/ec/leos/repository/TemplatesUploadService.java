package eu.europa.ec.leos.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Profile("oracle")
public class TemplatesUploadService {

    private static final Logger LOG = LoggerFactory.getLogger(TemplatesUploadService.class);

    private String configFolderPath = "/leos/templates";

    private final JdbcTemplate jdbcTemplate;
    private final PathMatchingResourcePatternResolver resourcePatternResolver;

    public TemplatesUploadService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourcePatternResolver = new PathMatchingResourcePatternResolver();
    }

    public void loadConfigDataFromFilesInFolder(String subdirectory) {
        try {

            Resource[] resources = resourcePatternResolver.getResources("classpath*:" + configFolderPath + "/*/" + subdirectory + "/*");

            List<String> versionFolders = Arrays.stream(resources)
                    .map(resource -> {
                        try {
                            String[] segments = resource.getURL().getPath().split("/");
                            return segments[segments.length - 3]; // Extract version folder name
                        } catch (IOException e) {
                            LOG.error("Error extracting version folder from resource: {}", resource, e);
                            return null;
                        }
                    })
                    .filter(versionFolder -> versionFolder != null)
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            if (versionFolders.isEmpty()) {
                LOG.warn("No version folders found in path: classpath:{}/{}/*", configFolderPath, subdirectory);
                return;
            }

            for (String versionFolder : versionFolders) {
                LOG.info("Processing version folder: {}", versionFolder);
                Resource[] fileResources = resourcePatternResolver.getResources("classpath*:" + configFolderPath + "/" + versionFolder + "/" + subdirectory + "/*");
                for (Resource fileResource : fileResources) {
                    if (fileResource.exists() && fileResource.isReadable()) {
                        String fileContent = getFileContent(fileResource);
                        String fileName = fileResource.getFilename();
                        String categoryCode = "CONFIG";  //TODO this we need to find a way to dynamically detect from directory structure the config type

                        //check if this config exists
                        String checkConfigQuery = "SELECT COUNT(*) FROM config WHERE name = ?";
                        int countConfig = jdbcTemplate.queryForObject(checkConfigQuery, new Object[]{fileName.substring(0, fileName.lastIndexOf("."))}, Integer.class);

                        if (countConfig == 0) {
                            String insertQuery = "INSERT INTO CONFIG" +
                                    "(NAME, CATEGORY_ID, OBJECT_ID, AUDIT_C_BY, AUDIT_C_DATE)\n" +
                                    "VALUES(?, (select id from CONFIG_CATEGORIES where CATEGORY_CODE = ?), ?, USER, current_timestamp)";

                            jdbcTemplate.update(insertQuery, fileName.substring(0, fileName.lastIndexOf(".")), categoryCode, 0);
                        }

                        // Check if this version exists for this config
                        String selectQuery = "SELECT COUNT(*) FROM config_version WHERE version_label = ? " +
                                "AND config_id = (SELECT id FROM config WHERE name = ?)";

                        int count = jdbcTemplate.queryForObject(selectQuery, new Object[]{versionFolder, fileName.substring(0, fileName.lastIndexOf("."))}, Integer.class);

                        if (count == 0) {
                            String insertQuery = "INSERT INTO CONFIG_VERSION (CONFIG_ID, VERSION_LABEL, VERSION_SERIES_ID, VERSION_TYPE, IS_LATEST_MAJOR_VERSION, " +
                                    "IS_LATEST_VERSION, IS_MAJOR_VERSION, IS_VERSION_SERIES_CHECKED_OUT, AUDIT_C_BY, AUDIT_C_DATE, " +
                                    "AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY, IS_IMMUTABLE) " +
                                    "VALUES ((SELECT id FROM CONFIG WHERE NAME=?), ?, '1', null, 1, 1, 1, 0, 'admin/admin', " +
                                    "current_timestamp, current_timestamp, 'admin/admin', 0)";

                            //set is_latest_version flag for other versions to false
                            String updateQuery = "UPDATE CONFIG_VERSION SET IS_LATEST_VERSION = 0 WHERE CONFIG_ID IN (SELECT ID FROM CONFIG WHERE NAME = ?) AND version_label != ?";

                            jdbcTemplate.update(insertQuery, fileName.substring(0, fileName.lastIndexOf(".")), versionFolder);
                            jdbcTemplate.update(updateQuery, fileName.substring(0, fileName.lastIndexOf(".")), versionFolder);
                        }

                        // Update CONFIG_CONTENT instead of insert
                        String updateQuery = "UPDATE CONFIG_CONTENT SET CONTENT = ?, CONTENT_STREAM_MIME_TYPE = 'application/akn+xml', " +
                                "CONTENT_STREAM_FILENAME = ?, CONTENT_STREAM_LENGTH = '0', AUDIT_LAST_M_DATE = current_timestamp, AUDIT_LAST_M_BY = 'admin/admin' " +
                                "WHERE VERSION_ID = (SELECT id FROM CONFIG_VERSION WHERE CONFIG_ID IN (SELECT ID FROM CONFIG WHERE NAME = ?) and VERSION_LABEL = ?)";

                        int rowsAffected = jdbcTemplate.update(updateQuery, fileContent, fileName, fileName.substring(0, fileName.lastIndexOf(".")), versionFolder);

                        // If no rows were affected, it means the record does not exist, so we need to insert it
                        if (rowsAffected == 0) {
                            String insertQuery = "INSERT INTO CONFIG_CONTENT (VERSION_ID, CONTENT, CONTENT_STREAM_MIME_TYPE, CONTENT_STREAM_FILENAME, CONTENT_STREAM_ID, CONTENT_STREAM_LENGTH, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY) " +
                                    "VALUES ((SELECT id FROM CONFIG_VERSION WHERE CONFIG_ID IN (SELECT ID FROM CONFIG WHERE NAME = ?) and VERSION_LABEL = ?), ?, 'application/xml', ?, '0', '0', 'admin', " +
                                    "current_timestamp, current_timestamp, 'admin')";
                            jdbcTemplate.update(insertQuery, fileName.substring(0, fileName.lastIndexOf(".")), versionFolder, fileContent, fileName);
                        }
                    }
                }
            }
        } catch (IOException e) {
            LOG.error("Unable to read files from the folder", e);
        }
    }

    private String getFileContent(Resource resource) {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (IOException e) {
            LOG.error("Error reading file content: {}", resource, e);
        }
        return content.toString();
    }
}