package eu.europa.ec.leos.services.audit.service;

import eu.europa.ec.leos.services.audit.entity.LoggingEvent;
import eu.europa.ec.leos.services.audit.repository.LoggingEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnBean(LoggingEventRepository.class)
public class AuditService {

    @Autowired
    private LoggingEventRepository loggingEventRepository;

    @Async
    public void logSecurityEvent(String message, String level, String className, String methodName, String user) {
        logSecurityEvent(message, level, className, methodName, user, null);
    }

    @Async
    public void logSecurityEvent(String message, String level, String className, String methodName, String user, Exception exception) {
        LoggingEvent event = new LoggingEvent(
            message,
            "eu.europa.ec.leos.services.aspect.aspect.SecurityAuditTrailAspect",
            level,
            Thread.currentThread().getName(),
            className,
            methodName
        );
        event.setArg0(user);
        Long eventId = loggingEventRepository.save(event);
        
        // Add MDC properties like DBAppender
        loggingEventRepository.saveProperty(eventId, "user", user);
        loggingEventRepository.saveProperty(eventId, "class", className);
        loggingEventRepository.saveProperty(eventId, "method", methodName);
        loggingEventRepository.saveProperty(eventId, "thread", Thread.currentThread().getName());
        loggingEventRepository.saveProperty(eventId, "level", level);
        loggingEventRepository.saveProperty(eventId, "timestamp", String.valueOf(event.getTimestamp()));
        
        // Add exception stack trace if present
        if (exception != null) {
            loggingEventRepository.saveException(eventId, exception);
        }
    }
}