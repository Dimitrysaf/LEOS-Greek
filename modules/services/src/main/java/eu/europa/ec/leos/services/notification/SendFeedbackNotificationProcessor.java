package eu.europa.ec.leos.services.notification;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.notification.EmailNotification;
import eu.europa.ec.leos.model.notification.trackChanges.SendFeedbackNotification;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Component
public class SendFeedbackNotificationProcessor implements EmailNotificationProcessor<SendFeedbackNotification> {

    private MessageHelper messageHelper;
    private LeosPermissionAuthorityMapHelper authorityMapHelper;

    private final ProposalService proposalService;
    private final LeosRepository leosRepository;
    private final UserService userService;
    private final FreemarkerNotificationProcessor processor;

    @Autowired
    public SendFeedbackNotificationProcessor(ProposalService proposalService, UserService userService, FreemarkerNotificationProcessor processor,
                                             MessageHelper messageHelper, LeosPermissionAuthorityMapHelper authorityMapHelper
            , LeosRepository leosRepository) {
        this.proposalService = proposalService;
        this.userService = userService;
        this.processor = processor;
        this.messageHelper = messageHelper;
        this.authorityMapHelper = authorityMapHelper;
        this.leosRepository = leosRepository;
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
        buildEmailBody(sendFeedbackNotification);
        buildEmailSubject(sendFeedbackNotification);
    }

    private void buildEmailBody(SendFeedbackNotification sendFeedbackNotification) {
        Proposal proposal = proposalService.findProposalByRef(sendFeedbackNotification.getProposalRef());
        XmlDocument document = this.findDocumentByRef(sendFeedbackNotification.getDocumentRef());
        sendFeedbackNotification.setRecipients(buildCollaboratorList(proposal));
        sendFeedbackNotification.setTitle(getProposalTitle(proposal));
        sendFeedbackNotification.setNamePart(document.getCategory().toString());
        sendFeedbackNotification.setLink(sendFeedbackNotification.getLink());
        sendFeedbackNotification.setEmailBody(processor.processTemplate(sendFeedbackNotification));
    }

    private void buildEmailSubject(SendFeedbackNotification sendFeedbackNotification) {
        sendFeedbackNotification
                .setEmailSubject(messageHelper.getMessage(sendFeedbackNotification.getEmailSubjectKey()));
    }

    private List<String> buildCollaboratorList(Proposal proposal) {
        List<String> collaborators = new ArrayList<>();
        proposal.getCollaborators().forEach((collaborator) -> {
            User user = userService.getUser(collaborator.getLogin());
            if (user == null) {
                throw new IllegalStateException("User '" + collaborator.getLogin() + "' not found in the database!");
            }
            collaborators.add(user.getEmail());
        });
        return collaborators;
    }

    private String getProposalTitle(Proposal proposal) {
        ProposalMetadata proposalMetadata = proposal.getMetadata().get();
        StringBuilder proposalTitle = new StringBuilder(proposalMetadata.getStage()).append(" ");
        proposalTitle.append(proposalMetadata.getType()).append(" ");
        proposalTitle.append(proposalMetadata.getPurpose()).append(" ");
        return proposalTitle.toString();
    }

    private XmlDocument findDocumentByRef(String docRef) throws NotFoundException {
        return Optional.ofNullable(this.leosRepository.findDocumentByRef(docRef, XmlDocument.class))
                .orElseThrow(() -> new NotFoundException(String.format("Not found document %s", docRef)));
    }
}