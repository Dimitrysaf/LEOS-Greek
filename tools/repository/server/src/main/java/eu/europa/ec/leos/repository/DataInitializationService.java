package eu.europa.ec.leos.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Order
@Profile("h2")
public class DataInitializationService {
    private static final Logger LOG = LoggerFactory.getLogger(DataInitializationService.class.getName());

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;
    private final ResourcePatternResolver resourcePatternResolver;

    @Value("${repository.template.path}")
    private String configFolderPath;
    @Value("${repository.workspace.path}")
    private String documentFolderPath;
    @Value("${repository.data.script.path}")
    private String scriptPath;

    @Autowired
    public DataInitializationService(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader, ResourcePatternResolver resourcePatternResolver) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
        this.resourcePatternResolver = resourcePatternResolver;
    }

    @PostConstruct
    public void init() {
        loadDataFromScript();

        List<String> instances = Arrays.asList("os");

        for (String instance : instances) {
            loadConfigDataFromFilesInFolder(instance);
        }

        loadDocumentDataFromFilesInFolder();
    }

    public void loadDataFromScript() {
        try {
            // Load the SQL script resource
            Resource sqlScriptResource = resourceLoader.getResource("classpath:" + scriptPath);

            if (sqlScriptResource.exists() && sqlScriptResource.isReadable()) {
                // Read the content of the SQL script into a string
                try (InputStream inputStream = sqlScriptResource.getInputStream();
                        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                    StringBuilder fileContent = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        fileContent.append(line).append("\n");
                    }
                    // Execute the SQL script using JdbcTemplate
                    jdbcTemplate.execute(fileContent.toString());
                }
            }
        } catch (Exception e) {
            LOG.error("Unable to read files from the folder", e);
        }
    }

    public void loadConfigDataFromFilesInFolder(String subdirectory) {
        try {
            LOG.info("Loading resources from: classpath:{}/{}/*", configFolderPath, subdirectory);
            Resource[] resources = resourcePatternResolver.getResources("classpath*:" + configFolderPath + "/*/" + subdirectory + "/*");

            // Extracting unique version folders
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
                                    "(NAME, CATEGORY_ID, AUDIT_C_BY, AUDIT_C_DATE)" +
                                    "VALUES(?, (select id from CONFIG_CATEGORIES where CATEGORY_CODE = ?), 'admin', current_timestamp)";

                            jdbcTemplate.update(insertQuery, fileName.substring(0, fileName.lastIndexOf(".")), categoryCode);
                        }

                        // check if this version exists for this config
                        String selectQuery = "SELECT COUNT(*) FROM config_version WHERE version_label = ? " +
                                "AND config_id = (SELECT id FROM config WHERE name = ?)";

                        int count = jdbcTemplate.queryForObject(selectQuery,  new Object[]{versionFolder, fileName.substring(0, fileName.lastIndexOf("."))}, Integer.class);


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

                        String sql = "INSERT INTO CONFIG_CONTENT (VERSION_ID, CONTENT, CONTENT_STREAM_MIME_TYPE, CONTENT_STREAM_FILENAME, CONTENT_STREAM_ID, CONTENT_STREAM_LENGTH, AUDIT_C_BY, AUDIT_C_DATE, AUDIT_LAST_M_DATE, AUDIT_LAST_M_BY) " +
                                "VALUES ((SELECT id FROM CONFIG_VERSION WHERE CONFIG_ID IN (SELECT ID FROM CONFIG WHERE NAME = ?) and VERSION_LABEL = ?), ?, 'application/xml', ?, '0', '0', 'admin', " +
                                "current_timestamp, current_timestamp, 'admin');";
                        jdbcTemplate.update(sql, fileName.substring(0, fileName.lastIndexOf(".")), versionFolder, fileContent, fileName);
                    }
                }
            }
        } catch (IOException e) {
            LOG.error("Unable to read files from the folder", e);
        }
    }
    
    public void loadDocumentDataFromFilesInFolder() {
        try {
            // Get the physical path of the config folder on the classpath
            Resource[] resources = resourcePatternResolver.getResources("classpath:" + documentFolderPath + "/*");
            for (Resource fileResource : resources) {
                if (fileResource.exists() && fileResource.isReadable()) {
                    // Read the content of each file into a string
                    String fileContent = getFileContent(fileResource);
                    String fileName = fileResource.getFilename();
                    String category = null, template = null;
                    if(fileName.startsWith("annex")) {
                        category = "ANNEX";
                        template = "SG-017";
                    } else if(fileName.startsWith("bill")) {
                        category = "BILL";
                        template = "SJ-019";
                    } else if(fileName.startsWith("proposal")) {
                        category = "PROPOSAL";
                        template = "SJ-019";
                    } else if(fileName.startsWith("memorandum")) {
                        category = "MEMORANDUM";
                        template = "SJ-019";
                    }

                    String sql = "INSERT INTO DOCUMENT_CONTENT (VERSION_ID,CATEGORY_CODE,CONTENT,ACT_TYPE,DOC_PURPOSE,DOC_TYPE,EEA_RELEVANCE,TEMPLATE,TITLE,AUDIT_C_BY,AUDIT_C_DATE,AUDIT_LAST_M_BY," +
                            "AUDIT_LAST_M_DATE) VALUES ((SELECT ID FROM DOCUMENT_VERSION WHERE DOCUMENT_ID IN (SELECT ID FROM DOCUMENT WHERE NAME=?))," +
                            "?, ?,null,'on Test ...','REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL',0, ?,'REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL'," +
                            "'admin/admin',to_timestamp('28-01-23 15:07:05.687000000','DD-MM-RR HH24:MI:SSXFF'),'admin/admin',to_timestamp('28-01-23 15:07:06.082000000','DD-MM-RR HH24:MI:SSXFF'));";
                    jdbcTemplate.update(sql, fileName, category, fileContent, template);
                }
            }
        } catch (IOException e) {
            LOG.error("Unable to read files from the folder", e);
        }
    }

    private String getFileContent(Resource fileResource) {
        try (InputStream inputStream = fileResource.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            StringBuilder fileContent = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                fileContent.append(line).append("\n");
            }
            return fileContent.toString();
        } catch (IOException e) {
            LOG.error("Unable to read files from the folder", e);
        }
        return null;
    }
}
