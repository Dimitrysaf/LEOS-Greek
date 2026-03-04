package eu.europa.ec.leos.services.audit.repository;

import eu.europa.ec.leos.services.audit.entity.LoggingEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;

@Repository
@ConditionalOnBean(JdbcTemplate.class)
public class LoggingEventRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Long save(LoggingEvent event) {
        String sql = "INSERT INTO logging_event (timestmp, formatted_message, logger_name, level_string, thread_name, caller_class, caller_method, arg0) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"event_id"});
            ps.setLong(1, event.getTimestamp());
            ps.setString(2, event.getFormattedMessage());
            ps.setString(3, event.getLoggerName());
            ps.setString(4, event.getLevelString());
            ps.setString(5, event.getThreadName());
            ps.setString(6, event.getCallerClass());
            ps.setString(7, event.getCallerMethod());
            ps.setString(8, event.getArg0());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public void saveProperty(Long eventId, String key, String value) {
        String sql = "INSERT INTO logging_event_property (event_id, mapped_key, mapped_value) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, eventId, key, value);
    }

    public void saveException(Long eventId, Exception exception) {
        String[] stackTrace = getStackTrace(exception);
        for (int i = 0; i < stackTrace.length; i++) {
            String sql = "INSERT INTO logging_event_exception (event_id, i, trace_line) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, eventId, i, stackTrace[i]);
        }
    }

    private String[] getStackTrace(Exception exception) {
        java.io.StringWriter sw = new java.io.StringWriter();
        java.io.PrintWriter pw = new java.io.PrintWriter(sw);
        exception.printStackTrace(pw);
        return sw.toString().split("\n");
    }
}