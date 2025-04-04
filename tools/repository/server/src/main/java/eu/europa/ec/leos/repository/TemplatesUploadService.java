package eu.europa.ec.leos.repository;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@Profile("oracle")
public class TemplatesUploadService extends DataUploadService {

    public TemplatesUploadService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourcePatternResolver = new PathMatchingResourcePatternResolver();
    }

    public void loadConfigDataFromFilesInFolder(String subdirectory) {
        super.loadConfigDataFromFilesInFolder(subdirectory);
        loadConfigDataFromFilesInCustomFolder();
    }
}