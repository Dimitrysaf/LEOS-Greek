package eu.europa.ec.leos.services.audit.service;

import eu.europa.ec.leos.integration.NotificationProvider;
import eu.europa.ec.leos.model.notification.EmailNotification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
public class UserActivityReportService {

    private static final Logger LOG = LoggerFactory.getLogger(UserActivityReportService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private NotificationProvider notificationProvider;

    @Value("${edit.user.report.recipients:}")
    private String reportRecipients;

    /**
     * Runs every day at 06:00.
     * Calculates distinct users from the previous day (00:00 to 23:59 local time).
     */
    @Scheduled(cron = "0 9 11 * * *")
    public void generateAndSendUserReport() {
        LOG.info("Starting daily user activity report generation...");
        try {
            LocalDate reportDate = LocalDate.now().minusDays(1);

            long startMillis = reportDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
            long endMillis = reportDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli() - 1;

            List<String> distinctUserList = getDistinctUsers(startMillis, endMillis);
            LocalDateTime generatedAt = LocalDateTime.now();

            String csvReport = buildCsvReport(reportDate, distinctUserList, generatedAt);

            LOG.info("Daily user report generated: {} distinct users on {}", distinctUserList.size(), reportDate);
            LOG.info("CSV Report:\n{}", csvReport);

            sendReportByEmail(csvReport, reportDate, distinctUserList.size(), generatedAt);
        } catch (Exception e) {
            LOG.error("Failed to generate daily user activity report", e);
        }
    }

    List<String> getDistinctUsers(long startMillis, long endMillis) {
        String sql = "SELECT DISTINCT arg0 FROM logging_event WHERE timestmp >= ? AND timestmp <= ? AND arg0 IS NOT NULL";
        return jdbcTemplate.queryForList(sql, String.class, startMillis, endMillis);
    }

    String buildCsvReport(LocalDate reportDate, List<String> users, LocalDateTime generatedAt) {
        StringBuilder csv = new StringBuilder();
        csv.append("Report Date,Distinct Users,Report Generated At\n");
        csv.append(reportDate.format(DATE_FORMAT)).append(",");
        csv.append(users.size()).append(",");
        csv.append(generatedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        csv.append("\nUsers:\n");
        for (String user : users) {
            csv.append(user).append("\n");
        }
        return csv.toString();
    }

    private void sendReportByEmail(String csvReport, LocalDate reportDate, int distinctUsers, LocalDateTime generatedAt) {
        if (notificationProvider == null) {
            LOG.warn("NotificationProvider not available, skipping email delivery");
            return;
        }
        if (reportRecipients == null || reportRecipients.isBlank()) {
            LOG.warn("No recipients configured for user activity report (edit.user.report.recipients)");
            return;
        }

        List<String> recipients = Arrays.stream(reportRecipients.split(";"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        EmailNotification notification = new UserActivityEmailNotification(
                recipients,
                reportDate,
                distinctUsers,
                generatedAt,
                csvReport.getBytes(StandardCharsets.UTF_8)
        );

        notificationProvider.sendNotification(notification);
        LOG.info("Daily user activity report sent to: {}", recipients);
    }

    /**
     * Inner class implementing EmailNotification for the daily report.
     */
    static class UserActivityEmailNotification implements EmailNotification {

        private static final DateTimeFormatter FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("dd_MM_yyyy");

        private final List<String> recipients;
        private final String subject;
        private final String body;
        private final byte[] attachmentContent;
        private final String attachmentName;

        UserActivityEmailNotification(List<String> recipients, LocalDate reportDate,
                                      int distinctUsers, LocalDateTime generatedAt, byte[] csvContent) {
            this.recipients = List.copyOf(recipients);
            this.subject = String.format("EdiT Daily User Activity Report (%s)",
                    reportDate.format(DATE_FORMAT));
            this.body = """
                    User Activity Report for EdiT
                    
                    Reporting Date: %s
                    Distinct Users: %d
                    Report Generated: %s
                    
                    The detailed report is attached as a CSV file."""
                    .formatted(reportDate.format(DATE_FORMAT),
                            distinctUsers, generatedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            this.attachmentContent = csvContent;
            this.attachmentName = String.format("daily_user_activity_report_%s.csv", reportDate.format(FILE_DATE_FORMAT));
        }

        @Override
        public List<String> getRecipients() { return recipients; }

        @Override
        public String getNotificationName() { return "DailyUserActivityReport"; }

        @Override
        public String getEmailSubject() { return subject; }

        @Override
        public String getEmailBody() { return body; }

        @Override
        public byte[] getAttachmentContent() { return attachmentContent; }

        @Override
        public String getAttachmentName() { return attachmentName; }

        @Override
        public String getMimeType() { return "text/csv"; }

        @Override
        public boolean withAttachment() { return true; }
    }
}
