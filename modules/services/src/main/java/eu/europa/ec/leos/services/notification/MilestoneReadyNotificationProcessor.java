package eu.europa.ec.leos.services.notification;

import eu.europa.ec.leos.domain.vo.CollaboratorVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.notification.EmailNotification;
import eu.europa.ec.leos.model.notification.milestone.MilestoneReadyEmailNotification;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.dto.collaborator.CollaboratorDTO;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MilestoneReadyNotificationProcessor implements EmailNotificationProcessor<MilestoneReadyEmailNotification> {
    private MessageHelper messageHelper;

    @Autowired
    WorkflowCollaboratorService workflowCollaboratorService;

    @Autowired
    PackageService packageService;

    @Autowired
    UserService userService;

    @Autowired
    public MilestoneReadyNotificationProcessor(MessageHelper messageHelper) {
        this.messageHelper = messageHelper;
    }

    private static final Logger LOG = LoggerFactory.getLogger(MilestoneReadyNotificationProcessor.class);

    @Override
    public void process(MilestoneReadyEmailNotification emailNotification) {
        setRecipients(emailNotification);
        buildEmailBody(emailNotification);
        buildEmailSubject(emailNotification);
    }

    @Override
    public boolean canProcess(EmailNotification emailNotification) {
        return MilestoneReadyEmailNotification.class.isAssignableFrom(emailNotification.getClass());
    }

    private void buildEmailBody(MilestoneReadyEmailNotification milestoneReadyEmailNotification) {
        milestoneReadyEmailNotification.setEmailBody(milestoneReadyEmailNotification.getLegFileName());
    }

    private void buildEmailSubject(MilestoneReadyEmailNotification milestoneReadyEmailNotification) {
        String title = milestoneReadyEmailNotification.getTitle();
        milestoneReadyEmailNotification.setEmailSubject(messageHelper.getMessage(milestoneReadyEmailNotification.getEmailSubjectKey(), title));
    }

    private void setRecipients(MilestoneReadyEmailNotification emailNotification) {
        try {
            List<CollaboratorVO> lsiOfCollaborator = packageService.getPackageCollaborators(emailNotification.getPackageId());
            List<String> recipients = new ArrayList<>();
            for (CollaboratorVO vo : lsiOfCollaborator) {
                User user = userService.getUser(vo.getLogin());
                String collaboratorEmail = user != null ? user.getEmail() : null;
                if (collaboratorEmail != null) {
                    if(vo.getRole().equals("OWNER")) {
                        recipients.add(collaboratorEmail);
                    }
                } else {
                    LOG.warn("User '{}' email is not available", vo.getLogin());
                }
            }
            emailNotification.setRecipients(recipients);
        } catch (Exception exception) {
            LOG.error("Error occured while fetching recipients", exception);
        }
    }
}
