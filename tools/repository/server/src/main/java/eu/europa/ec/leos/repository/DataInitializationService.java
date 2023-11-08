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
        loadConfigDataFromFilesInFolder();
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

    public void loadConfigDataFromFilesInFolder() {
        try {
            // Get the physical path of the config folder on the classpath
            Resource[] resources = resourcePatternResolver.getResources("classpath:" + configFolderPath + "/*");
            for (Resource fileResource : resources) {
                if (fileResource.exists() && fileResource.isReadable()) {
                    // Read the content of each file into a string
                    String fileContent = getFileContent(fileResource);
                    String fileName = fileResource.getFilename();

                    String sql = "INSERT INTO CONFIG_CONTENT (VERSION_ID,CONTENT,CONTENT_STREAM_MIME_TYPE,CONTENT_STREAM_FILENAME,CONTENT_STREAM_ID,CONTENT_STREAM_LENGTH,AUDIT_C_BY,\n" +
                            "                            AUDIT_C_DATE,AUDIT_LAST_M_DATE,AUDIT_LAST_M_BY) VALUES ((SELECT id from CONFIG_VERSION WHERE CONFIG_ID IN (SELECT ID FROM CONFIG\n" +
                            "                            WHERE NAME =?)), ?,'application/xml', ?,'0','0','admin'," +
                            "to_timestamp('22-01-21 08:25:53.270000000','DD-MM-RR HH24:MI:SSXFF'),to_timestamp('22-01-21 08:25:54.068000000','DD-MM-RR HH24:MI:SSXFF'),'admin');";
                    int result = jdbcTemplate.update(sql, fileName.substring(0, fileName.lastIndexOf(".")), fileContent, fileName);
                    LOG.info("Result of the update is :" + result);
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
                    int result = jdbcTemplate.update(sql, fileName, category, fileContent, template);
                    LOG.info("Result of the update is :" + result);
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
