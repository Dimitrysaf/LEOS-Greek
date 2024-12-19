package eu.europa.ec.leos.model.notification.milestone;

import eu.europa.ec.leos.model.notification.EmailNotification;
import eu.europa.ec.leos.model.user.User;

import java.util.ArrayList;
import java.util.List;

public class MilestoneReadyEmailNotification implements EmailNotification {

    private User recipient;
    private List<String> recipients = new ArrayList<>();
    private String emailBody;
    private String emailSubject;
    private String title;
    private byte[] attachmentContent;
    private String legFileName;
    private String packageId;

    public MilestoneReadyEmailNotification(User recipient, String title, byte[] attachmentContent, String legFileName, String packageId) {
        this.recipient = recipient;
        this.title = title;
        this.attachmentContent = attachmentContent;
        this.legFileName = legFileName;
        this.packageId = packageId;
    }

    public void setAttachmentContent(byte[] attachmentContent) {
        this.attachmentContent = attachmentContent;
    }

    public String getLegFileName() {
        return legFileName;
    }

    public void setLegFileName(String legFileName) {
        this.legFileName = legFileName;
    }

    public String getEmailSubjectKey() {
        return "notification.milestone.ready.subject";
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = new ArrayList<>();
        this.recipients.addAll(recipients);
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) { this.recipient = recipient; }

    public void setEmailBody(String emailBody) {
        this.emailBody = emailBody;
    }

    public void setEmailSubject(String emailSubject) {
        this.emailSubject = emailSubject;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public byte[] getAttachmentContent() {
        return attachmentContent;
    }

    public String getPackageId() { return packageId; }

    @Override
    public String getNotificationName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public String getEmailSubject() {
        return emailSubject;
    }

    @Override
    public String getEmailBody() {
        return emailBody;
    }

    @Override
    public String getAttachmentName() {
        return legFileName;
    }

    @Override
    public String getMimeType() {
        return "application/zip";
    }

    @Override
    public boolean withAttachment() {
        return true;
    }

    @Override
    public List<String> getRecipients() {
        return recipients;
    }

}
