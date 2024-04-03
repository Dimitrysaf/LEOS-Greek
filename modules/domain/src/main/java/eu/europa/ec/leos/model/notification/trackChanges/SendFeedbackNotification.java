package eu.europa.ec.leos.model.notification.trackChanges;

import eu.europa.ec.leos.model.notification.EmailNotification;

import java.util.ArrayList;
import java.util.List;

public class SendFeedbackNotification implements EmailNotification {
    private String emailBody;
    private String emailSubject;
    public String documentRef;
    private String proposalRef;
    public String link;
    public String namePart;
    private String title;
    private List<String> recipients = new ArrayList<>();
    public SendFeedbackNotification(String proposalRef, String documentRef, String link) {
        this.proposalRef = proposalRef;
        this.documentRef = documentRef;
        this.link = link;
    }
    public String getDocumentRef() {
        return documentRef;
    }
    public void setDocumentRef(String documentRef) {
        this.documentRef = documentRef;
    }
    public String getProposalRef() {
        return proposalRef;
    }
    public void setProposalRef(String proposalRef) {
        this.proposalRef = proposalRef;
    }
    public String getLink() {
        return link;
    }
    public void setLink(String link) {
        this.link = link;
    }
    public String getNamePart() {
        return namePart;
    }
    public void setNamePart(String namePart) {
        this.namePart = namePart;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public List<String> getRecipients() {
        return recipients;
    }
    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }
    public String getEmailBody() {
        return emailBody;
    }
    public String getEmailSubject() {
        return emailSubject;
    }
    public void setEmailBody(String emailBody) {
        this.emailBody = emailBody;
    }
    public void setEmailSubject(String emailSubject) {
        this.emailSubject = emailSubject;
    }
    public String getNotificationName() {
        return this.getClass().getSimpleName();
    }
    public String getEmailSubjectKey() {
        return "notification.collaborator.send.feedback";
    }
    @Override
    public boolean withAttachment() {
        return false;
    }
    @Override
    public byte[] getAttachmentContent() {
        return null;
    }
    @Override
    public String getAttachmentName() {
        return "";
    }
    @Override
    public String getMimeType() {
        return "";
    }
}