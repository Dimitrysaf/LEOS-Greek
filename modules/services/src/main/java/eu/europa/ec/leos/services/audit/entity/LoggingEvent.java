package eu.europa.ec.leos.services.audit.entity;

import java.time.Instant;

public class LoggingEvent {
    
    private Long eventId;
    private Long timestamp;
    private String formattedMessage;
    private String loggerName;
    private String levelString;
    private String threadName;
    private String callerClass;
    private String callerMethod;
    private String arg0;
    private String arg1;
    private String arg2;
    private String arg3;

    public LoggingEvent() {}

    public LoggingEvent(String formattedMessage, String loggerName, String levelString, 
                       String threadName, String callerClass, String callerMethod) {
        this.timestamp = Instant.now().toEpochMilli();
        this.formattedMessage = formattedMessage;
        this.loggerName = loggerName;
        this.levelString = levelString;
        this.threadName = threadName;
        this.callerClass = callerClass;
        this.callerMethod = callerMethod;
    }

    // Getters and setters
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    
    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
    
    public String getFormattedMessage() { return formattedMessage; }
    public void setFormattedMessage(String formattedMessage) { this.formattedMessage = formattedMessage; }
    
    public String getLoggerName() { return loggerName; }
    public void setLoggerName(String loggerName) { this.loggerName = loggerName; }
    
    public String getLevelString() { return levelString; }
    public void setLevelString(String levelString) { this.levelString = levelString; }
    
    public String getThreadName() { return threadName; }
    public void setThreadName(String threadName) { this.threadName = threadName; }
    
    public String getCallerClass() { return callerClass; }
    public void setCallerClass(String callerClass) { this.callerClass = callerClass; }
    
    public String getCallerMethod() { return callerMethod; }
    public void setCallerMethod(String callerMethod) { this.callerMethod = callerMethod; }
    
    public String getArg0() { return arg0; }
    public void setArg0(String arg0) { this.arg0 = arg0; }
    
    public String getArg1() { return arg1; }
    public void setArg1(String arg1) { this.arg1 = arg1; }
    
    public String getArg2() { return arg2; }
    public void setArg2(String arg2) { this.arg2 = arg2; }
    
    public String getArg3() { return arg3; }
    public void setArg3(String arg3) { this.arg3 = arg3; }
}