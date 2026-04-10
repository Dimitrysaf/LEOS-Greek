package eu.europa.ec.leos.repository;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

abstract class DataUploadService {
    public static final Logger LOG = LoggerFactory.getLogger(DataUploadService.class);
    private static final String FILE_NOT_TO_LOAD = "README.txt";

    @Value("${spring.profiles.active}")
    private String dbProfile;
    @Value("${repository.template.path}")
    private String configFolderPath;
    @Value("${repository.template.custom.path}")
    private String customConfigFolderPath;
    @Value("${repository.template.custom.version}")
    private String customConfigVersion;

    public JdbcTemplate jdbcTemplate;
    public ResourcePatternResolver resourcePatternResolver;

    public void loadConfigDataFromFilesInFolder(String subdirectory) {
        try {
            LOG.info("Loading resources from: classpath:{}/{}/*", configFolderPath, subdirectory);
            Resource[] resources = resourcePatternResolver.getResources("classpath*:" + configFolderPath + "/*/" + subdirectory + "/*");

            // Extracting unique version folders
            Pattern versionPattern = Pattern.compile("^[0-9]+(\\.[0-9]+)*$");
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
                    .filter(versionFolder -> versionFolder != null && versionPattern.matcher(versionFolder).matches())
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            if (versionFolders.isEmpty()) {
                LOG.warn("No version folders found in path: classpath:{}/{}/*", configFolderPath, subdirectory);
                return;
            }

            for (String versionFolder : versionFolders) {
                LOG.info("Processing version folder: {}", versionFolder);
                Resource[] fileResources = resourcePatternResolver.getResources("classpath*:" + configFolderPath + "/" + versionFolder + "/" + subdirectory + "/**/*");
                loadConfigDataFromFilesInVersionFolder(versionFolder, fileResources);
            }
        } catch (IOException e) {
            LOG.error("Unable to read files from the folder", e);
        }
    }

    public void loadConfigDataFromFilesInCustomFolder() {
        try {
            LOG.info("Loading custom resources from: classpath:{}/*", customConfigFolderPath);
            Resource[] customResources = resourcePatternResolver.getResources("classpath*:" + customConfigFolderPath + "/*");
            customResources = Arrays.stream(customResources).filter(resource -> !FILE_NOT_TO_LOAD.equals(resource.getFilename())).toArray(Resource[]::new);
            loadConfigDataFromFilesInVersionFolder(customConfigVersion, customResources);
        } catch (IOException e) {
            LOG.error("Unable to read files from the custom folder", e);
        }
    }

    private void loadConfigDataFromFilesInVersionFolder(String versionFolder, Resource[] fileResources) {
        for (Resource fileResource : fileResources) {
            if (fileResource.exists() && fileResource.isReadable()) {
                String fileContent = getFileContent(fileResource);
                String fileName = fileResource.getFilename();
                String categoryCode = getCategoryCode(fileName);
                //check if this config exists
                String checkConfigQuery = "SELECT COUNT(*) FROM config WHERE name = ?";
                int countConfig = jdbcTemplate.queryForObject(checkConfigQuery, new Object[]{fileName.substring(0, fileName.lastIndexOf("."))}, Integer.class);
                String fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
                int lastDash = fileNameWithoutExt.lastIndexOf('-');
                String language = "EN";

                if (lastDash != -1 && fileNameWithoutExt.length() - lastDash > 2) {
                    language = fileNameWithoutExt.substring(fileNameWithoutExt.length() - 2);
                }
                if (countConfig == 0) {
                    String insertQuery = "INSERT INTO CONFIG" +
                            "(NAME, CATEGORY_ID, OBJECT_ID, AUDIT_C_BY, AUDIT_C_DATE, LANGUAGE)\n" +
                            "VALUES(?, (select id from CONFIG_CATEGORIES where CATEGORY_CODE = ?), ?, " + ("oracle".equals(dbProfile) ? "USER" : "'admin'") +
                            ", current_timestamp, ?)";

                    jdbcTemplate.update(insertQuery, fileNameWithoutExt, categoryCode, 0, language.toUpperCase());
                }

                // Check if this version exists for this config
                String selectQuery = "SELECT COUNT(*) FROM config_version WHERE version_label = ? " +
                        "AND config_id = (SELECT id FROM config WHERE name = ?)";

                int count = jdbcTemplate.queryForObject(selectQuery, new Object[]{versionFolder, fileName.substring(0, fileName.lastIndexOf("."))},
                        Integer.class);

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

    public void setIsLastVersionAccordingToVersion(String version) {

        String updateAllIsLastVersionTo0 = "update config_version set is_latest_version = 0 where REGEXP_COUNT(version_label, '\\.') <= 3";
        jdbcTemplate.update(updateAllIsLastVersionTo0);

        String updateAllIsLastVersionAccordingToVersionStart = "update config_version v set is_latest_version = 1 " +
                "where (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 1), 0)*1000000000) + (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 2), 0)*1000000) + (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 3), 0)*1000) +NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 4), 0) = " +
                "(select max((NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 1), 0)*1000000000) + (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 2), 0)*1000000) + (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 3), 0)*1000) +NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 4), 0)) from config, config_version, config_content " +
                "where config.id = config_version.config_id and config_content.version_id = config_version.id " +
                "and config.id = v.config_id " +
                "and REGEXP_COUNT(version_label, '\\.') <= 3 ";
        String updateAllIsLastVersionAccordingToVersionEnd = "group by config.id, name)";
        if (StringUtils.isEmpty(version)) {
            String updateAllIsLastVersionAccordingToVersion =
                updateAllIsLastVersionAccordingToVersionStart +
                updateAllIsLastVersionAccordingToVersionEnd;
            jdbcTemplate.update(updateAllIsLastVersionAccordingToVersion);
        } else {
            String updateAllIsLastVersionAccordingToVersion =
                updateAllIsLastVersionAccordingToVersionStart +
                "and (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 1), 0)*1000000000) + (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 2), 0)*1000000) + (NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 3), 0)*1000) + NVL(REGEXP_SUBSTR(version_label, '[^.]+', 1, 4), 0) <= (NVL(REGEXP_SUBSTR(?, '[^.]+', 1, 1), 0)*1000000000) + (NVL(REGEXP_SUBSTR(?, '[^.]+', 1, 2), 0)*1000000) + (NVL(REGEXP_SUBSTR(?, '[^.]+', 1, 3), 0)*1000) + NVL(REGEXP_SUBSTR(?, '[^.]+', 1, 4), 0) " +
                updateAllIsLastVersionAccordingToVersionEnd;
            jdbcTemplate.update(updateAllIsLastVersionAccordingToVersion, version, version, version, version);
        }

    }

    public String getFileContent(Resource resource) {
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

    private String getCategoryCode(String fileName) {
        String categoryCode;
        if (fileName.contains("-CONF")) {
            categoryCode = "CONFIG";
        } else if (fileName.startsWith("structure")) {
            categoryCode = "STRUCTURE";
        } else if (fileName.startsWith("BL")) {
            categoryCode = "TEMPLATE_BILL";
        } else if (fileName.startsWith("EM")) {
            categoryCode = "TEMPLATE_MEMORANDUM";
        } else if (fileName.startsWith("PR")) {
            categoryCode = "TEMPLATE_PROPOSAL";
        } else if (fileName.startsWith("SG")) {
            categoryCode = "TEMPLATE_ANNEX";
        } else if (fileName.startsWith("FS")) {
            categoryCode = "TEMPLATE_STAT_DIGIT_FINANC_LEGIS";
        } else if (fileName.startsWith("CE")) {
            categoryCode = "TEMPLATE_COUNCIL_EXPLANATORY";
        } else {
            categoryCode = "CONFIG";
        }
        return categoryCode;
    }
}
