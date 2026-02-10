package eu.europa.ec.leos.services.audit.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jndi.JndiTemplate;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
@EnableAsync
public class AuditConfig {

    @Value("${audit.db.url:}")
    private String auditDbUrl;
    
    @Value("${audit.db.username:}")
    private String auditDbUsername;
    
    @Value("${audit.db.password:}")
    private String auditDbPassword;
    
    @Value("${audit.db.driver:}")
    private String auditDbDriver;
    
    @Value("${audit.jndi.name:}")
    private String auditJndiName;


    @Bean
    public DataSource auditDataSource() throws NamingException {
        // 1. Check for JNDI first (usually preferred in Tomcat)
        if (auditJndiName != null && !auditJndiName.trim().isEmpty()) {
            System.out.println("Using JNDI DataSource: " + auditJndiName);
            return (DataSource) new JndiTemplate().lookup(auditJndiName);
        }

        // 2. Fallback to H2 if URL is provided
        if (auditDbUrl != null && !auditDbUrl.trim().isEmpty()) {
            System.out.println("Using H2 DataSource: " + auditDbUrl);
            DriverManagerDataSource dataSource = new DriverManagerDataSource();
            dataSource.setDriverClassName(auditDbDriver);
            dataSource.setUrl(auditDbUrl);
            dataSource.setUsername(auditDbUsername);
            dataSource.setPassword(auditDbPassword);
            return dataSource;
        }

        // 3. Return null or a dummy if neither exists (prevents context crash if not used)
        return null;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource auditDataSource) {
        if (auditDataSource == null) {
            throw new IllegalStateException("Neither JNDI nor H2 configuration found for Audit!");
        }
        return new JdbcTemplate(auditDataSource);
    }
}