package eu.europa.ec.leos.services.collection.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ExplanatoryMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.SecurityService;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.TemplateService;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor.createValueMap;
import static eu.europa.ec.leos.services.support.XmlHelper.XML_DOC_EXT;
import static eu.europa.ec.leos.services.utils.LanguageMapUtils.generateTranslatedProposalReference;

@Component
@Scope("prototype")
public class ExplanatoryContextService {

    private static final Logger LOG = LoggerFactory.getLogger(ExplanatoryContextService.class);
    private static final String EXPLANATORY_PACKAGE_IS_REQUIRED = "Explanatory package is required!";
    private static final String EXPLANATORY_PURPOSE_IS_REQUIRED = "Explanatory purpose is required!";
    private static final String EXPLANATORY_DOCUMENT_IS_REQUIRED = "Explanatory document is required!";
    private static final String EXPLANATORY_METADATA_IS_REQUIRED = "Explanatory metadata is required!";

    private final TemplateService templateService;
    private final ExplanatoryService explanatoryService;
    private final ProposalService proposalService;
    private final SecurityService securityService;
    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;

    private LeosPackage leosPackage;
    private Explanatory explanatory;
    private String purpose = null;
    private String title = "";
    private String type = null;
    private String template = null;
    private String explanatoryId = null;
    private List<Collaborator> collaborators = null;

    private DocumentVO explanatoryDocument;
    private final Map<ContextActionService, String> actionMsgMap;
    private String versionComment;
    private String milestoneComment;
    private boolean eeaRelevance;
    private String language;
    private boolean translated;

    @Autowired
    public ExplanatoryContextService(
            TemplateService templateService,
            ExplanatoryService explanatoryService,
            ProposalService proposalService, SecurityService securityService, XmlNodeProcessor xmlNodeProcessor,
            XmlNodeConfigProcessor xmlNodeConfigProcessor) {
        this.templateService = templateService;
        this.explanatoryService = explanatoryService;
        this.proposalService = proposalService;
        this.securityService = securityService;
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xmlNodeConfigProcessor = xmlNodeConfigProcessor;
        this.actionMsgMap = new EnumMap<>(ContextActionService.class);
    }

    public void useTemplate(String template) {
        Validate.notNull(template, "Template name is required!");

        this.explanatory = (Explanatory) templateService.getTemplate(template);
        Validate.notNull(explanatory, "Template not found! [name=%s]", template);
        this.template = template;
        LOG.trace("Using {} template... [id={}, name={}]", explanatory.getCategory(), explanatory.getId(), explanatory.getName());
    }

    public void useActionMessageMap(Map<ContextActionService, String> messages) {
        Validate.notNull(messages, "Action message map is required!");

        actionMsgMap.putAll(messages);
    }

    public void usePackage(LeosPackage leosPackage) {
        Validate.notNull(leosPackage, EXPLANATORY_PACKAGE_IS_REQUIRED);
        LOG.trace("Using Explanatory package... [id={}, path={}]", leosPackage.getId(), leosPackage.getPath());
        this.leosPackage = leosPackage;
    }

    public void usePurpose(String purpose) {
        Validate.notNull(purpose, EXPLANATORY_PURPOSE_IS_REQUIRED);
        LOG.trace("Using Explanatory purpose... [purpose={}]", purpose);
        this.purpose = purpose;
    }

    public void useType(String type) {
        Validate.notNull(type, "Explanatory type is required!");
        LOG.trace("Using Explanatory type... [type={}]", type);
        this.type = type;
    }

    public void usePackageTemplate(String template) {
        Validate.notNull(template, "template is required!");
        LOG.trace("Using template... [template={}]", template);
        this.template = template;
    }

    public void useTitle(String title) {
        Validate.notNull(title, "Explanatory title is required!");
        LOG.trace("Using Explanatory title... [title={}]", title);
        this.title = title;
    }

    public void useExplanatory(Explanatory explanatory) {
        Validate.notNull(explanatory, EXPLANATORY_DOCUMENT_IS_REQUIRED);
        LOG.trace("Using Explanatory document'... [explanatoryId={}]", explanatory.getId());
        this.explanatory = explanatory;
    }

    public void useExplanatoryId(String explanatoryId) {
        Validate.notNull(explanatoryId, "Explanatory 'explanatoryId' is required!");
        LOG.trace("Using ExplanatoryId'... [explanatoryId={}]", explanatoryId);
        this.explanatoryId = explanatoryId;
    }

    public void useDocument(DocumentVO document) {
        Validate.notNull(document, EXPLANATORY_DOCUMENT_IS_REQUIRED);
        explanatoryDocument = document;
    }

    public void useCollaborators(List<Collaborator> collaborators) {
        Validate.notNull(collaborators, "Explanatory 'collaborators' are required!");
        LOG.trace("Using collaborators'... [collaborators={}]", collaborators);
        this.collaborators = Collections.unmodifiableList(collaborators);
    }

    public void useVersionComment(String comment) {
        Validate.notNull(comment, "Version comment is required!");
        this.versionComment = comment;
    }

    public void useMilestoneComment(String milestoneComment) {
        Validate.notNull(milestoneComment, "milestoneComment is required!");
        this.milestoneComment = milestoneComment;
    }

    public void useActionMessage(ContextActionService action, String actionMsg) {
        Validate.notNull(actionMsg, "Action message is required!");
        Validate.notNull(action, "Context Action not found! [name=%s]", action);

        LOG.trace("Using action message... [action={}, name={}]", action, actionMsg);
        actionMsgMap.put(action, actionMsg);
    }

    public void useEeaRelevance(boolean eeaRelevance) {
        LOG.trace("Using Proposal eeaRelevance... [eeaRelevance={}]", eeaRelevance);
        this.eeaRelevance = eeaRelevance;
    }

    public Explanatory executeCreateExplanatory() {
        LOG.trace("Executing 'Create Explanatory' use case...");

        Validate.notNull(leosPackage, EXPLANATORY_PACKAGE_IS_REQUIRED);
        Validate.notNull(explanatory, "Explanatory template is required!");
        Validate.notNull(collaborators, "Explanatory collaborators are required!");

        Option<ExplanatoryMetadata> metadataOption = explanatory.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), EXPLANATORY_METADATA_IS_REQUIRED);

        Validate.notNull(purpose, EXPLANATORY_PURPOSE_IS_REQUIRED);
        ExplanatoryMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withType(type)
                .withTemplate(template)
                .withTitle(title)
                .build();

        explanatory = explanatoryService.createExplanatory(explanatory.getId(), leosPackage.getPath(), metadata, actionMsgMap.get(ContextActionService.ANNEX_METADATA_UPDATED), null);
        explanatory = securityService.updateCollaborators(explanatory.getMetadata().get().getRef(), explanatory.getId(), collaborators, Explanatory.class);

        return explanatoryService.createVersion(explanatory.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public Explanatory executeImportExplanatory() {
        LOG.trace("Executing 'Import Explanatory' use case...");
        Validate.notNull(leosPackage, EXPLANATORY_PACKAGE_IS_REQUIRED);
        Validate.notNull(explanatory, EXPLANATORY_DOCUMENT_IS_REQUIRED);
        Validate.notNull(purpose, EXPLANATORY_PURPOSE_IS_REQUIRED);
        Option<ExplanatoryMetadata> metadataOption = explanatory.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), EXPLANATORY_METADATA_IS_REQUIRED);

        String ref = createRefForExplanatory();
        ExplanatoryMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withType(type)
                .withTemplate(template)
                .withRef(ref)
                .withEeaRelevance(eeaRelevance)
                .withLanguage(language)
                .withTitle(explanatoryDocument.getMetadata().getTitle())
                .build();

        final byte[] updatedSource = xmlNodeProcessor.setValuesInXml(explanatoryDocument.getSource(), createValueMap(metadata),
                xmlNodeConfigProcessor.getConfig(metadata.getCategory()));
        explanatory = explanatoryService.createExplanatoryFromContent(leosPackage.getPath(), metadata,
                actionMsgMap.get(ContextActionService.METADATA_UPDATED), updatedSource, explanatoryDocument.getName());
        explanatory = securityService.updateCollaborators(explanatory.getMetadata().get().getRef(), explanatory.getId(), collaborators, Explanatory.class);
        return explanatoryService.createVersion(explanatory.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    private String createRefForExplanatory() {
        Validate.notNull(explanatoryDocument.getSource(), "Explanatory xml is required!");

        String docLanguage = language != null ? language : explanatory.getMetadata().get().getLanguage();
        String ref;
        if(translated) {
            ref = generateTranslatedProposalReference(explanatoryDocument.getRef(), docLanguage);
        } else {
            ref = explanatoryService.generateExplanatoryReference(explanatory.getContent().get().getSource().getBytes(), docLanguage);
        }
        final ExplanatoryMetadata updatedExplanatoryMetadata = explanatory.getMetadata().get()
                .builder()
                .withPurpose(purpose)
                .withRef(ref)
                .withLanguage(language)
                .build();

        explanatoryDocument.setName(ref + XML_DOC_EXT);
        explanatoryDocument.setMetadataDocument(updatedExplanatoryMetadata);
        return ref;
    }

    public void executeUpdateExplanatory() {
        LOG.trace("Executing 'Update explanatory metadata' use case...");
        Validate.notNull(purpose, EXPLANATORY_PURPOSE_IS_REQUIRED);
        Validate.notNull(explanatory, EXPLANATORY_DOCUMENT_IS_REQUIRED);

        Option<ExplanatoryMetadata> metadataOption = explanatory.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), EXPLANATORY_METADATA_IS_REQUIRED);

        // Updating only purpose at this time. other metadata needs to be set, if needed
        ExplanatoryMetadata explanatoryMetadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .build();
        explanatoryService.updateExplanatory(explanatory, explanatoryMetadata, VersionType.MINOR, actionMsgMap.get(ContextActionService.METADATA_UPDATED));
    }

    public void executeUpdateExplanatoryStructure() {
        byte[] xmlContent = getContent(explanatory); //Use the content from template
        explanatory = explanatoryService.findExplanatory(explanatoryId); //Get the existing explanatory document

        Option<ExplanatoryMetadata> metadataOption = explanatory.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), EXPLANATORY_METADATA_IS_REQUIRED);
        ExplanatoryMetadata metadata = metadataOption.get();
        ExplanatoryMetadata explanatoryMetadata = metadata
                .builder()
                .withPurpose(metadata.getPurpose())
                .withType(metadata.getType())
                .withTemplate(template)
                .withDocVersion(metadata.getDocVersion())
                .withDocTemplate(template)
                .build();

        explanatory = explanatoryService.updateExplanatory(explanatory, xmlContent, explanatoryMetadata, VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.ANNEX_STRUCTURE_UPDATED));
    }

    private byte[] getContent(Explanatory explanatory) {
        final Content content = explanatory.getContent().getOrError(() -> "Explanatory content is required!");
        return content.getSource().getBytes();
    }

    public void executeCreateMilestone() {
        explanatory = explanatoryService.findExplanatory(explanatoryId);
        List<String> milestoneComments = explanatory.getMilestoneComments();
        milestoneComments.add(milestoneComment);
        if (explanatory.getVersionType().equals(VersionType.MAJOR)) {
            explanatory = explanatoryService.updateExplanatoryWithMilestoneComments(explanatory.getMetadata().get().getRef(), explanatory.getId(), milestoneComments);
            LOG.info("Major version {} already present. Updated only milestoneComment for [explanatory={}]", explanatory.getVersionLabel(), explanatory.getId());
        } else {
            explanatory = explanatoryService.updateExplanatoryWithMilestoneComments(explanatory, milestoneComments, VersionType.MAJOR, versionComment);
            LOG.info("Created major version {} for [explanatory={}]", explanatory.getVersionLabel(), explanatory.getId());
        }
    }

    public String getUpdatedExplanatoryId() {
        return explanatory.getId();
    }

    public String getProposalId() {
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal != null ? proposal.getId() : null;
    }

    public void useLanguage(String language) {
        this.language = language;
    }

    public void useTranslated(boolean translated) {
        this.translated = translated;
    }
}
