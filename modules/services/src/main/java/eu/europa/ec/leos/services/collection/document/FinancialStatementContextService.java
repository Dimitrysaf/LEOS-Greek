package eu.europa.ec.leos.services.collection.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.SecurityService;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.TemplateService;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor.createValueMap;
import static eu.europa.ec.leos.services.support.XmlHelper.XML_DOC_EXT;

@Component
@Scope("prototype")
public class FinancialStatementContextService {

    private static final Logger LOG = LoggerFactory.getLogger(FinancialStatementContextService.class);
    private static final String FINANCIAL_STATEMENT_PACKAGE_IS_REQUIRED = "FinancialStatement package is required!";
    private static final String FINANCIAL_STATEMENT_PURPOSE_IS_REQUIRED = "FinancialStatement purpose is required!";
    private static final String FINANCIAL_STATEMENT_DOCUMENT_IS_REQUIRED = "FinancialStatement document is required!";
    private static final String FINANCIAL_STATEMENT_METADATA_IS_REQUIRED = "FinancialStatement metadata is required!";

    private final TemplateService templateService;
    private final FinancialStatementService financialStatementService;
    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;
    private final ProposalService proposalService;
    private final SecurityService securityService;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;

    private LeosPackage leosPackage;
    private FinancialStatement financialStatement;
    private String purpose = null;
    private String title = "";
    private String type = null;
    private String template = null;
    private List<Collaborator> collaborators = null;

    private DocumentVO financialStatementDocument;
    private final Map<ContextActionService, String> actionMsgMap;
    private String versionComment;
    private String milestoneComment;
    private String financialStatementId;
    private boolean eeaRelevance;
    private boolean cloneProposal = false;

    public FinancialStatementContextService(TemplateService templateService, FinancialStatementService financialStatementService,
            ProposalService proposalService, SecurityService securityService, RepositoryPropertiesMapper repositoryPropertiesMapper,
            XmlNodeProcessor xmlNodeProcessor, XmlNodeConfigProcessor xmlNodeConfigProcessor) {
        this.templateService = templateService;
        this.financialStatementService = financialStatementService;
        this.proposalService = proposalService;
        this.securityService = securityService;
        this.actionMsgMap = new EnumMap<>(ContextActionService.class);
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xmlNodeConfigProcessor = xmlNodeConfigProcessor;
    }

    public void useTemplate(String template) {
        Validate.notNull(template, "Template name is required!");

        this.financialStatement = (FinancialStatement) templateService.getTemplate(template);
        Validate.notNull(financialStatement, "Template not found! [name=%s]", template);
        this.template = template;
        LOG.trace("Using {} template... [id={}, name={}]", financialStatement.getCategory(), financialStatement.getId(), financialStatement.getName());
    }

    public void useActionMessageMap(Map<ContextActionService, String> messages) {
        Validate.notNull(messages, "Action message map is required!");

        actionMsgMap.putAll(messages);
    }

    public void usePackage(LeosPackage leosPackage) {
        Validate.notNull(leosPackage, FINANCIAL_STATEMENT_PACKAGE_IS_REQUIRED);
        LOG.trace("Using FinancialStatement package... [id={}, path={}]", leosPackage.getId(), leosPackage.getPath());
        this.leosPackage = leosPackage;
    }

    public void usePurpose(String purpose) {
        Validate.notNull(purpose, FINANCIAL_STATEMENT_PURPOSE_IS_REQUIRED);
        LOG.trace("Using FinancialStatement purpose... [purpose={}]", purpose);
        this.purpose = purpose;
    }

    public void useType(String type) {
        Validate.notNull(type, "FinancialStatement type is required!");
        LOG.trace("Using FinancialStatement type... [type={}]", type);
        this.type = type;
    }

    public void usePackageTemplate(String template) {
        Validate.notNull(template, "template is required!");
        LOG.trace("Using template... [template={}]", template);
        this.template = template;
    }

    public void useTitle(String title) {
        Validate.notNull(title, "FinancialStatement title is required!");
        LOG.trace("Using FinancialStatement title... [title={}]", title);
        this.title = title;
    }

    public void useFinancialStatement(FinancialStatement financialStatement) {
        Validate.notNull(financialStatement, FINANCIAL_STATEMENT_DOCUMENT_IS_REQUIRED);
        LOG.trace("Using FinancialStatement document'... [FinancialStatementId={}]", financialStatement.getId());
        this.financialStatement = financialStatement;
    }

    public void useDocument(DocumentVO document) {
        Validate.notNull(document, FINANCIAL_STATEMENT_DOCUMENT_IS_REQUIRED);
        financialStatementDocument = document;
    }

    public void useCollaborators(List<Collaborator> collaborators) {
        Validate.notNull(collaborators, "FinancialStatement 'collaborators' are required!");
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

    public void useFinancialStatement(String financialStatementId) {
        Validate.notNull(financialStatementId, "Financial statementId is required!");
        LOG.trace("Using Proposal explanatory id [explId={}]", financialStatementId);
        this.financialStatementId = financialStatementId;
    }

    public void useCloneProposal(boolean cloneProposal) {
        this.cloneProposal = cloneProposal;
    }

    public FinancialStatement executeCreateFinancialStatement() {
        LOG.trace("Executing 'Create FinancialStatement' use case...");

        Validate.notNull(leosPackage, FINANCIAL_STATEMENT_PACKAGE_IS_REQUIRED);
        Validate.notNull(financialStatement, "FinancialStatement template is required!");
        Validate.notNull(collaborators, "FinancialStatement collaborators are required!");

        Option<FinancialStatementMetadata> metadataOption = financialStatement.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), FINANCIAL_STATEMENT_METADATA_IS_REQUIRED);

        Validate.notNull(purpose, FINANCIAL_STATEMENT_PURPOSE_IS_REQUIRED);
        FinancialStatementMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withType(type)
                .withTemplate(template)
                .withTitle(title)
                .build();

        financialStatement = financialStatementService.createFinancialStatement(financialStatement.getId(), leosPackage.getPath(), metadata, actionMsgMap.get(ContextActionService.STAT_FINANC_LEGIS_METADATA_UPDATED), null);
        financialStatement = securityService.updateCollaborators(financialStatement.getId(), collaborators, FinancialStatement.class);
        if (cloneProposal) {
            Map<String, Object> financialStatementProperties = new HashMap<>();
            financialStatementProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), false);
            financialStatementService.updateFinancialStatement(financialStatement.getId(), financialStatementProperties, true);
        }
        return financialStatementService.createVersion(financialStatement.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public FinancialStatement executeImportFinancialStatement() {
        LOG.trace("Executing 'Import FinancialStatement' use case...");
        Validate.notNull(leosPackage, FINANCIAL_STATEMENT_PACKAGE_IS_REQUIRED);
        Validate.notNull(financialStatement, "FinancialStatement template is required!");
        Validate.notNull(purpose, FINANCIAL_STATEMENT_PURPOSE_IS_REQUIRED);
        Option<FinancialStatementMetadata> metadataOption = financialStatement.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), FINANCIAL_STATEMENT_METADATA_IS_REQUIRED);

        String ref = createRefForFS();
        FinancialStatementMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withType(type)
                .withTemplate(template)
                .withTitle(title)
                .withRef(ref)
                .withEeaRelevance(eeaRelevance)
                .build();

        Validate.notNull(financialStatementDocument.getSource(), "Financial statement xml is required!");
        final byte[] updatedSource = xmlNodeProcessor.setValuesInXml(financialStatementDocument.getSource(), createValueMap(metadata),
                xmlNodeConfigProcessor.getConfig(metadata.getCategory()));
        FinancialStatement updatedFinancialStatement = financialStatementService.createFinancialStatementFromContent(leosPackage.getPath(), metadata,
                actionMsgMap.get(ContextActionService.METADATA_UPDATED), updatedSource, financialStatementDocument.getName());
        if (cloneProposal) {
            Map<String, Object> fsProperties = new HashMap<>();
            fsProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM), financialStatementDocument.getId());
            fsProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED), false);
            financialStatementService.updateFinancialStatement(updatedFinancialStatement.getId(), fsProperties, true);
        }
        return financialStatementService.createVersion(updatedFinancialStatement.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    private String createRefForFS() {
        final String ref = financialStatementService.generateFinancialStatementReference(financialStatement.getContent().get().getSource().getBytes(),
                financialStatement.getMetadata().get().getLanguage());
        final FinancialStatementMetadata updatedFSMetadata = financialStatement.getMetadata().get()
                .builder()
                .withPurpose(purpose)
                .withRef(ref)
                .build();

        financialStatementDocument.setName(ref + XML_DOC_EXT);
        financialStatementDocument.setMetadataDocument(updatedFSMetadata);
        return ref;
    }

    public void executeUpdateFinancialStatement() {
        LOG.trace("Executing 'Update FinancialStatement metadata' use case...");
        Validate.notNull(purpose, FINANCIAL_STATEMENT_PURPOSE_IS_REQUIRED);
        Validate.notNull(financialStatement, FINANCIAL_STATEMENT_DOCUMENT_IS_REQUIRED);

        Option<FinancialStatementMetadata> metadataOption = financialStatement.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), FINANCIAL_STATEMENT_METADATA_IS_REQUIRED);

        // Updating only purpose at this time. other metadata needs to be set, if needed
        FinancialStatementMetadata financialStatementMetadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .build();
        financialStatementService.updateFinancialStatement(financialStatement, financialStatementMetadata, VersionType.MINOR, actionMsgMap.get(ContextActionService.METADATA_UPDATED));
    }

    public void executeUpdateFinancialStatementStructure() {
        byte[] xmlContent = getContent(financialStatement); //Use the content from template
        financialStatement = financialStatementService.findFinancialStatement(financialStatementId); //Get the existing FinancialStatement document

        Option<FinancialStatementMetadata> metadataOption = financialStatement.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), FINANCIAL_STATEMENT_METADATA_IS_REQUIRED);
        FinancialStatementMetadata metadata = metadataOption.get();
        FinancialStatementMetadata financialStatementMetadata = metadata
                .builder()
                .withPurpose(metadata.getPurpose())
                .withType(metadata.getType())
                .withTemplate(template)
                .withDocVersion(metadata.getDocVersion())
                .withDocTemplate(template)
                .build();

        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, xmlContent, financialStatementMetadata, VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.ANNEX_STRUCTURE_UPDATED));
    }

    private byte[] getContent(FinancialStatement financialStatement) {
        final Content content = financialStatement.getContent().getOrError(() -> "FinancialStatement content is required!");
        return content.getSource().getBytes();
    }

    public void executeCreateMilestone() {
        List<FinancialStatement> fsList = financialStatementService.findFinancialStatementByPackagePath(leosPackage.getPath());
        if (fsList != null && !fsList.isEmpty()) {
            financialStatement = fsList.get(0);
            List<String> milestoneComments = financialStatement.getMilestoneComments();
            milestoneComments.add(milestoneComment);
            if (financialStatement.getVersionType().equals(VersionType.MAJOR)) {
                financialStatement = financialStatementService.updateFinancialStatementWithMilestoneComments(financialStatement.getId(), milestoneComments);
                LOG.info("Major version {} already present. Updated only milestoneComment for [FinancialStatement={}]", financialStatement.getVersionLabel(), financialStatement.getId());
            } else {
                financialStatement = financialStatementService.updateFinancialStatementWithMilestoneComments(financialStatement, milestoneComments, VersionType.MAJOR, versionComment);
                LOG.info("Created major version {} for [FinancialStatement={}]", financialStatement.getVersionLabel(), financialStatement.getId());
            }
        }
    }

    public String getUpdatedFinancialStatementId() {
        return financialStatement.getId();
    }

    public void executeDeleteFinancialStatement() {
        LOG.trace("Executing 'FinancialStatement' use case...");
        Validate.notNull(leosPackage, "Leos package is required!");
        FinancialStatement finStat = financialStatementService.findFinancialStatement(financialStatementId);
        financialStatementService.deleteFinancialStatement(finStat);
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        proposal = proposalService.removeComponentRef(proposal, finStat.getName());
        proposalService.updateProposal(proposal.getId(), proposal.getContent().get().getSource().getBytes());
    }

    public String getProposalId() {
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal != null ? proposal.getId() : null;
    }

    public void useEeaRelevance(boolean eeaRelevance) {
        LOG.trace("Using Proposal eeaRelevance... [eeaRelevance={}]", eeaRelevance);
        this.eeaRelevance = eeaRelevance;
    }
}
