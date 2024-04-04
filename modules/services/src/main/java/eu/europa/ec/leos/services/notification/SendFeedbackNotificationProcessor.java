package eu.europa.ec.leos.services.notification;

import eu.europa.ec.leos.model.notification.EmailNotification;
import eu.europa.ec.leos.model.notification.trackChanges.SendFeedbackNotification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class SendFeedbackNotificationProcessor implements EmailNotificationProcessor<SendFeedbackNotification> {

    private final FreemarkerNotificationProcessor processor;

    @Autowired
    public SendFeedbackNotificationProcessor(FreemarkerNotificationProcessor processor
                                            ) {
        this.processor = processor;
    }

    @Override
    public boolean canProcess(EmailNotification emailNotification) {
        if (SendFeedbackNotification.class.isAssignableFrom(emailNotification.getClass())) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void process(SendFeedbackNotification sendFeedbackNotification) {
        sendFeedbackNotification.setEmailBody(processor.processTemplate(sendFeedbackNotification));
    }

}