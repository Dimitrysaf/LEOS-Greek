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

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.List;

@Service
public class WeeklyUserActivityReportService {

    private static final Logger LOG = LoggerFactory.getLogger(WeeklyUserActivityReportService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private NotificationProvider notificationProvider;

    @Value("${weekly.user.report.recipients:}")
    private String reportRecipients;

    /**
     * Runs every Monday at 06:00 UTC.
     * Calculates distinct users from the previous week (Monday 00:00 to Sunday 23:59 UTC).
     */
    @Scheduled(cron = "0 0 6 * * MON")
    public void generateAndSendWeeklyReport() {
        LOG.info("Starting weekly user activity report generation...");
        try {
            LocalDate today = LocalDate.now(ZoneOffset.UTC);
            LocalDate weekEnd = today.with(TemporalAdjusters.previous(DayOfWeek.SUNDAY));
            LocalDate weekStart = weekEnd.minusDays(6);

            long startMillis = weekStart.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
            long endMillis = weekEnd.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli() - 1;

            List<String> distinctUserList = getDistinctUsers(startMillis, endMillis);
            int distinctUsers = distinctUserList.size();
            LocalDateTime generatedAt = LocalDateTime.now(ZoneOffset.UTC);

            String csvReport = buildCsvReport(weekStart, weekEnd, distinctUserList, generatedAt);

            LOG.info("Weekly report generated: {} distinct users from {} to {}", distinctUserList.size(), weekStart, weekEnd);

            sendReportByEmail(csvReport, weekStart, weekEnd, distinctUserList.size(), generatedAt);
        } catch (Exception e) {
            LOG.error("Failed to generate weekly user activity report", e);
        }
    }

    int countDistinctUsers(long startMillis, long endMillis) {
        String sql = "SELECT DISTINCT arg0 FROM logging_event WHERE timestmp >= ? AND timestmp <= ? AND arg0 IS NOT NULL";
        List<String> users = jdbcTemplate.queryForList(sql, String.class, startMillis, endMillis);
        return users.size();
    }

    List<String> getDistinctUsers(long startMillis, long endMillis) {
        String sql = "SELECT DISTINCT arg0 FROM logging_event WHERE timestmp >= ? AND timestmp <= ? AND arg0 IS NOT NULL";
        return jdbcTemplate.queryForList(sql, String.class, startMillis, endMillis);
    }

    String buildCsvReport(LocalDate weekStart, LocalDate weekEnd, List<String> users, LocalDateTime generatedAt) {
        StringBuilder csv = new StringBuilder();
        csv.append("Week Start Date,Week End Date,Distinct Users,Report Generated At\n");
        csv.append(weekStart.format(DATE_FORMAT)).append(",");
        csv.append(weekEnd.format(DATE_FORMAT)).append(",");
        csv.append(users.size()).append(",");
        csv.append(generatedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append(" UTC\n");
        csv.append("\nUsers:\n");
        for (String user : users) {
            csv.append(user).append("\n");
        }
        return csv.toString();
    }

    private void sendReportByEmail(String csvReport, LocalDate weekStart, LocalDate weekEnd, int distinctUsers, LocalDateTime generatedAt) {
        if (notificationProvider == null) {
            LOG.warn("NotificationProvider not available, skipping email delivery");
            return;
        }
        if (reportRecipients == null || reportRecipients.isBlank()) {
            LOG.warn("No recipients configured for weekly user activity report (weekly.user.report.recipients)");
            return;
        }

        List<String> recipients = Arrays.stream(reportRecipients.split(";"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        EmailNotification notification = new WeeklyUserActivityEmailNotification(
                recipients,
                weekStart,
                weekEnd,
                distinctUsers,
                generatedAt,
                csvReport.getBytes(StandardCharsets.UTF_8)
        );

        notificationProvider.sendNotification(notification);
        LOG.info("Weekly user activity report sent to: {}", recipients);
    }

    /**
     * Inner class implementing EmailNotification for the weekly report.
     */
    static class WeeklyUserActivityEmailNotification implements EmailNotification {

        private final List<String> recipients;
        private final String subject;
        private final String body;
        private final byte[] attachmentContent;

        WeeklyUserActivityEmailNotification(List<String> recipients, LocalDate weekStart, LocalDate weekEnd,
                                            int distinctUsers, LocalDateTime generatedAt, byte[] csvContent) {
            this.recipients = List.copyOf(recipients);
            this.subject = String.format("EdiT Weekly User Activity Report (%s to %s)",
                    weekStart.format(DATE_FORMAT), weekEnd.format(DATE_FORMAT));
            this.body = """
                    Weekly User Activity Report for EdiT
                    
                    Reporting Period: %s (Monday) to %s (Sunday)
                    Distinct Users: %d
                    Report Generated: %s UTC
                    
                    The detailed report is attached as a CSV file."""
                    .formatted(weekStart.format(DATE_FORMAT), weekEnd.format(DATE_FORMAT),
                            distinctUsers, generatedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            this.attachmentContent = csvContent;
        }

        @Override
        public List<String> getRecipients() { return recipients; }

        @Override
        public String getNotificationName() { return "WeeklyUserActivityReport"; }

        @Override
        public String getEmailSubject() { return subject; }

        @Override
        public String getEmailBody() { return body; }

        @Override
        public byte[] getAttachmentContent() { return attachmentContent; }

        @Override
        public String getAttachmentName() { return "weekly_user_activity_report.csv"; }

        @Override
        public String getMimeType() { return "text/csv"; }

        @Override
        public boolean withAttachment() { return true; }
    }
}
