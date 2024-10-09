/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.collection;

import cool.graph.cuid.Cuid;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.ExplanatoryContextService;
import eu.europa.ec.leos.services.collection.document.FinancialStatementContextService;
import eu.europa.ec.leos.services.collection.document.MemorandumContextService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Provider;
import java.io.IOException;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.domain.repository.LeosCategory.BILL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.COUNCIL_EXPLANATORY;
import static eu.europa.ec.leos.domain.repository.LeosCategory.MEMORANDUM;
import static eu.europa.ec.leos.domain.repository.LeosCategory.PROPOSAL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.STAT_FINANC_LEGIS;

public abstract class CollectionContextService {

    private static final Logger LOG = LoggerFactory.getLogger(CollectionContextService.class);
    private static final String PROPOSAL_PURPOSE_IS_REQUIRED = "Proposal purpose is required!";
    private static final String PROPOSAL_PROCEDURE_TYPE_IS_REQUIRED = "Proposal procedure type is required!";
    private static final String PROPOSAL_ACT_TYPE_IS_REQUIRED = "Proposal act type is required!";
    private static final String PROPOSAL_METADATA_IS_REQUIRED = "Proposal metadata is required!";
    protected static final String TEMPLATE = "template";
    protected static final String ACT_TYPE = "actType";
    protected static final String PROCEDURE_TYPE = "procedureType";
    protected static final String DOCUMENT_MANDATORY_TEMPLATES = "documentMandatoryTemplates";
    protected static final String DOCUMENT_DEFAULT_TRUE_TEMPLATES = "documentDefaultTrueTemplates";
    protected static final String DOCUMENT_DEFAULT_FALSE_TEMPLATES = "documentDefaultFalseTemplates";
    protected static final String MANDATORY = "MANDATORY";
    protected static final String DEFAULT_TRUE = "DEFAULT_TRUE";
    protected static final String DEFAULT_FALSE = "DEFAULT_FALSE";
    protected static final String FORBIDDEN = "FORBIDDEN";

    protected final MessageHelper messageHelper;
    protected final ExplanatoryService explanatoryService;
    protected final TemplateService templateService;
    protected final PackageService packageService;
    protected final ProposalService proposalService;
    private final CollectionUrlBuilder urlBuilder;
    protected final Provider<MemorandumContextService> memorandumContextProvider;
    protected final Provider<BillContextService> billContextProvider;
    protected final Provider<ExplanatoryContextService> explanatoryContextProvider;
    protected final Provider<FinancialStatementContextService> financialStatementContextProvider;
    private SecurityContext securityContext;
    protected final Map<LeosCategory, XmlDocument> categoryTemplateMap;
    protected final Map<ContextActionService, String> actionMsgMap;
    protected Proposal proposal = null;
    protected String purpose;
    protected String procedureType;
    protected String actType;
    private String versionComment;
    private String milestoneComment;
    protected boolean eeaRelevance;
    private DocumentVO propDocument;
    private String propChildDocument;
    private String proposalComment;
    private CollectionIdsAndUrlsHolder idsAndUrlsHolder;
    private String originRef;
    private boolean cloneProposal = false;
    private String connectedEntity;
    private CloneProposalMetadataVO cloneProposalMetadataVO;
    private String explanatoryId;
    protected LeosPackage leosPackage = null;
    protected String language;
    protected boolean translated = false;
    protected String templateKey;

    CollectionContextService(TemplateService templateService, PackageService packageService, ProposalService proposalService,
                             CollectionUrlBuilder urlBuilder, Provider<MemorandumContextService> memorandumContextProvider,
                             Provider<BillContextService> billContextProvider, SecurityContext securityContext,
                             Provider<ExplanatoryContextService> explanatoryContextProvider, Provider<FinancialStatementContextService> financialStatementContextProvider, ExplanatoryService explanatoryService, MessageHelper messageHelper) {
        this.templateService = templateService;
        this.explanatoryService = explanatoryService;
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.urlBuilder = urlBuilder;
        this.memorandumContextProvider = memorandumContextProvider;
        this.billContextProvider = billContextProvider;
        this.explanatoryContextProvider = explanatoryContextProvider;
        this.financialStatementContextProvider = financialStatementContextProvider;
        this.securityContext = securityContext;
        this.categoryTemplateMap = new EnumMap<>(LeosCategory.class);
        this.actionMsgMap = new EnumMap<>(ContextActionService.class);
        this.messageHelper = messageHelper;
    }

    public void useTemplate(String name) {
        Validate.notNull(name, "Template name is required!");
        XmlDocument template = templateService.getTemplate(name);
        Validate.notNull(template, "Template not found! [name=%s]", name);

        LOG.trace("Using {} template... [id={}, name={}]", template.getCategory(), template.getId(), template.getName());
        categoryTemplateMap.put(template.getCategory(), template);
    }

    public void useActionMessage(ContextActionService action, String actionMsg) {
        Validate.notNull(actionMsg, "Action message is required!");
        Validate.notNull(action, "Context Action not found! [name=%s]", action);

        LOG.trace("Using action message... [action={}, name={}]", action, actionMsg);
        actionMsgMap.put(action, actionMsg);
    }

    public String getUpdatedProposalId() {
        return proposal.getId();
    }

    public void useProposal(Proposal proposal) {
        Validate.notNull(proposal, "Proposal is required!");
        LOG.trace("Using Proposal... [proposal={}]", proposal);
        this.proposal = proposal;
    }

    public void useProposalId(String id) {
        Validate.notNull(id, "Proposal identifier is required!");
        LOG.trace("Using Proposal... [id={}]", id);
        proposal = proposalService.findProposal(id);
        Validate.notNull(proposal, "Proposal not found! [id=%s]", id);
    }

    public void usePurpose(String purpose) {
        Validate.notNull(purpose, PROPOSAL_PURPOSE_IS_REQUIRED);
        LOG.trace("Using Proposal purpose... [purpose={}]", purpose);
        this.purpose = purpose;
    }

    public void useProcedureType(String procedureType) {
        Validate.notNull(procedureType, PROPOSAL_PROCEDURE_TYPE_IS_REQUIRED);
        LOG.trace("Using Proposal procedureType... [procedureType={}]", procedureType);
        this.procedureType = procedureType;
    }

    public void useActType(String actType) {
        Validate.notNull(actType, PROPOSAL_ACT_TYPE_IS_REQUIRED);
        LOG.trace("Using Proposal actType... [actType={}]", actType);
        this.actType = actType;
    }

    public void useEeaRelevance(boolean eeaRelevance) {
        LOG.trace("Using Proposal eeaRelevance... [eeaRelevance={}]", eeaRelevance);
        this.eeaRelevance = eeaRelevance;
    }

    public void useTemplateKey(String templateKey) {
        LOG.trace("Using Proposal templateKey... [templateKey={}]", templateKey);
        this.templateKey = templateKey;
    }

    public void useDocument(DocumentVO document) {
        Validate.notNull(document, "Proposal document is required!");
        propDocument = document;
    }

    public void useVersionComment(String comment) {
        Validate.notNull(comment, "Version comment is required!");
        this.versionComment = comment;
    }

    public void useMilestoneComment(String milestoneComment) {
        Validate.notNull(milestoneComment, "milestoneComment is required!");
        this.milestoneComment = milestoneComment;
    }

    public void useChildDocument(String documentRef) {
        Validate.notNull(documentRef, "Proposal child document is required!");
        propChildDocument = documentRef;
    }

    public void useActionComment(String comment) {
        Validate.notNull(comment, "Proposal comment is required!");
        proposalComment = comment;
    }

    public void useIdsAndUrlsHolder(CollectionIdsAndUrlsHolder idsAndUrlsHolder) {
        Validate.notNull(idsAndUrlsHolder, "idsAndUrlsHolder is required!");
        this.idsAndUrlsHolder = idsAndUrlsHolder;
    }

    public void useOriginRef(String originRef) {
        this.originRef = originRef;
    }

    public void useCloneProposal(boolean cloneProposal) {
        this.cloneProposal = cloneProposal;
    }

    public void useLanguage(String language) {
        this.language = language;
    }

    public void useTranslated(boolean translated) {
        this.translated = translated;
    }

    public void useConnectedEntity(String connectedEntity) {
        Validate.notNull(connectedEntity, "Connected entity is required!");
        this.connectedEntity = connectedEntity;
    }

    public void useClonedProposalMetadataVO(CloneProposalMetadataVO cloneProposalMetadataVO) {
        Validate.notNull(cloneProposalMetadataVO, "cloned metadata vo is required!");
        this.cloneProposalMetadataVO = cloneProposalMetadataVO;
    }

    public void usePackage(LeosPackage leosPackage) {
        Validate.notNull(leosPackage, "Bill package is required!");
        LOG.trace("Using Bill package... [id={}, path={}]", leosPackage.getId(), leosPackage.getPath());
        this.leosPackage = leosPackage;
    }

    public void useExplanatoryId(String explanatoryId) {
        Validate.notNull(explanatoryId, "Proposal 'explId' is required!");
        LOG.trace("Using Proposal explanatory id [explId={}]", explanatoryId);
        this.explanatoryId = explanatoryId;
    }

    public Proposal executeImportProposal() {
        LOG.trace("Executing 'Import Proposal' use case...");
        MetadataVO propMeta = propDocument.getMetadata();
        Validate.notNull(propMeta, PROPOSAL_METADATA_IS_REQUIRED);
        Validate.notNull(propDocument.getChildDocuments(), "Proposal must contain child documents to import!");
        // create package
        this.packageService.useLanguage(this.language);
        this.packageService.useTranslated(this.translated);
        this.packageService.useOriginRef(this.originRef);
        LeosPackage leosPckg = packageService.createPackage();
        // use template
        Proposal proposalTemplate = cast(categoryTemplateMap.get(PROPOSAL));
        Validate.notNull(proposalTemplate, "Proposal template is required!");

        // get metadata from template
        Option<ProposalMetadata> metadataOption = proposalTemplate.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), PROPOSAL_METADATA_IS_REQUIRED);
        purpose = propMeta.getDocPurpose();
        Validate.notNull(purpose, PROPOSAL_PURPOSE_IS_REQUIRED);
        eeaRelevance = propMeta.getEeaRelevance();
        ProposalMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withEeaRelevance(eeaRelevance)
                .withLanguage(language)
                .build();
        if (cloneProposal) {
            setConnectedEntity();
            proposal = proposalService.createClonedProposalFromContent(leosPckg.getPath(), metadata, cloneProposalMetadataVO, propDocument.getSource());
            idsAndUrlsHolder.setPackageName(leosPckg.getName());
        } else {
            Validate.notNull(propDocument.getSource(), "Proposal xml is required!");
            proposal = proposalService.createProposalFromContent(leosPckg.getPath(), metadata, propDocument, translated);
            idsAndUrlsHolder.setPackageName(leosPckg.getName());
        }

        // create child element
        for (DocumentVO docChild : propDocument.getChildDocuments()) {
            switch (docChild.getCategory()) {
                case COUNCIL_EXPLANATORY:
                    ExplanatoryContextService explanatoryContext = explanatoryContextProvider.get();
                    explanatoryContext.usePackage(leosPckg);
                    // use template
                    explanatoryContext.useTemplate(categoryTemplateMap.get(COUNCIL_EXPLANATORY).getName());
                    // We want to use the same purpose that was set in the wizard for all the documents.
                    explanatoryContext.usePurpose(purpose);
                    explanatoryContext.useDocument(docChild);
                    explanatoryContext.useActionMessageMap(actionMsgMap);
                    explanatoryContext.useType(metadata.getType());
                    explanatoryContext.usePackageTemplate(metadata.getTemplate());
                    explanatoryContext.useEeaRelevance(eeaRelevance);
                    explanatoryContext.useLanguage(language);
                    explanatoryContext.useTranslated(translated);
                    explanatoryContext.useCollaborators(proposal.getCollaborators());
                    explanatoryContext.usePackageRef(proposal.getMetadata().get().getRef());
                    Explanatory explanatory = explanatoryContext.executeImportExplanatory();
                    proposal = proposalService.addComponentRef(proposal, explanatory.getName(), COUNCIL_EXPLANATORY);
                    String explanatoryRef = explanatory.getMetadata().get().getRef();
                    idsAndUrlsHolder.setExplanatoryId(explanatoryRef);
                    idsAndUrlsHolder.setExplanatoryUrl(urlBuilder.buildExplanatoryViewUrl(explanatoryRef));
                    break;
                case MEMORANDUM:
                    MemorandumContextService memorandumContext = memorandumContextProvider.get();
                    memorandumContext.usePackage(leosPckg);
                    // use template
                    memorandumContext.useTemplate(cast(categoryTemplateMap.get(MEMORANDUM)));
                    // We want to use the same purpose that was set in the wizard for all the documents.
                    memorandumContext.usePurpose(purpose);
                    memorandumContext.useDocument(docChild);
                    memorandumContext.useActionMessageMap(actionMsgMap);
                    memorandumContext.useType(metadata.getType());
                    memorandumContext.usePackageTemplate(metadata.getTemplate());
                    memorandumContext.useEeaRelevance(eeaRelevance);
                    memorandumContext.useLanguage(language);
                    memorandumContext.useTranslated(translated);
                    memorandumContext.useCloneProposal(cloneProposal);
                    memorandumContext.useOriginRef(originRef);
                    memorandumContext.usePackageRef(proposal.getMetadata().get().getRef());
                    Memorandum memorandum = memorandumContext.executeImportMemorandum();
                    proposal = proposalService.addComponentRef(proposal, memorandum.getName(), LeosCategory.MEMORANDUM);
                    String memorandumRef = memorandum.getMetadata().get().getRef();
                    idsAndUrlsHolder.setMemorandumId(memorandumRef);
                    idsAndUrlsHolder.setMemorandumUrl(urlBuilder.buildMemorandumViewUrl(memorandumRef));
                    idsAndUrlsHolder.addDocCloneAndOriginIdMap(memorandumRef, docChild.getRef());
                    break;
                case BILL:
                    BillContextService billContext = billContextProvider.get();
                    billContext.usePackage(leosPckg);
                    // use template
                    billContext.useTemplate(cast(categoryTemplateMap.get(BILL)));
                    billContext.usePurpose(purpose);
                    billContext.useDocument(docChild);
                    billContext.useActionMessageMap(actionMsgMap);
                    billContext.useIdsAndUrlsHolder(idsAndUrlsHolder);
                    billContext.useCloneProposal(cloneProposal);
                    billContext.useEeaRelevance(eeaRelevance);
                    billContext.useLanguage(language);
                    billContext.useTranslated(translated);
                    billContext.useOriginRef(originRef);
                    billContext.usePackageRef(proposal.getMetadata().get().getRef());
                    Bill bill = billContext.executeImportBill();
                    proposal = proposalService.addComponentRef(proposal, bill.getName(), LeosCategory.BILL);
                    String billRef = bill.getMetadata().get().getRef();
                    idsAndUrlsHolder.setBillId(billRef);
                    idsAndUrlsHolder.setBillUrl(urlBuilder.buildBillViewUrl(billRef));
                    idsAndUrlsHolder.addDocCloneAndOriginIdMap(billRef, docChild.getRef());
                    break;
                case STAT_FINANC_LEGIS:
                    FinancialStatementContextService financialStatementContext = financialStatementContextProvider.get();
                    financialStatementContext.usePackage(leosPckg);
                    String docTemplate = categoryTemplateMap.get(STAT_FINANC_LEGIS).getName();
                    financialStatementContext.useDocTemplate(docTemplate);
                    financialStatementContext.useTemplate(metadata.getTemplate());
                    financialStatementContext.usePurpose(purpose);
                    financialStatementContext.useTitle(messageHelper.getMessage("document.default.financial.statement.title.default." + docTemplate));
                    financialStatementContext.useDocument(docChild);
                    financialStatementContext.useEeaRelevance(eeaRelevance);
                    Validate.isTrue(metadataOption.isDefined(), PROPOSAL_METADATA_IS_REQUIRED);
                    financialStatementContext.useType(metadata.getType());
                    financialStatementContext.useActionMessageMap(actionMsgMap);
                    financialStatementContext.useCollaborators(proposal.getCollaborators());
                    financialStatementContext.useCloneProposal(cloneProposal);
                    financialStatementContext.useOriginRef(originRef);
                    financialStatementContext.useLanguage(language);
                    financialStatementContext.useTranslated(translated);
                    financialStatementContext.usePackageRef(proposal.getMetadata().get().getRef());
                    FinancialStatement financialStatement = financialStatementContext.executeImportFinancialStatement();
                    String financialStatementRef = financialStatement.getMetadata().get().getRef();
                    proposal = proposalService.addComponentRef(proposal, financialStatement.getName(), STAT_FINANC_LEGIS);
                    idsAndUrlsHolder.setFinancialStatementId(financialStatementRef);
                    idsAndUrlsHolder.setFinancialStatementUrl(urlBuilder.buildFinancialStatementViewUrl(financialStatementRef));
                    idsAndUrlsHolder.addDocCloneAndOriginIdMap(financialStatementRef, docChild.getRef());
                    break;
            }
        }
        String coverPageRef = proposal.getMetadata().get().getRef();
        idsAndUrlsHolder.setCoverpageId(coverPageRef);
        idsAndUrlsHolder.setCoverpageUrl(urlBuilder.buildCoverPageViewUrl(coverPageRef));
        return proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    private void setConnectedEntity() {
        Entity entity = new Entity(Cuid.createCuid(), connectedEntity, connectedEntity);
        User user = securityContext.getUser();
        user.setConnectedEntity(entity);
    }

    public void executeCreateFinancialStatement() {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        FinancialStatementContextService financialStatementContext = financialStatementContextProvider.get();
        financialStatementContext.usePackage(leosPackage);
        String docTemplate = categoryTemplateMap.get(STAT_FINANC_LEGIS).getName();
        Option<ProposalMetadata> metadataOption = proposal.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), PROPOSAL_METADATA_IS_REQUIRED);
        ProposalMetadata metadata = metadataOption.get();
        financialStatementContext.useDocTemplate(docTemplate);
        financialStatementContext.useTemplate(metadata.getTemplate());
        financialStatementContext.usePurpose(purpose);
        financialStatementContext.useTitle(messageHelper.getMessage("document.default.financial.statement.title.default." + docTemplate));
        financialStatementContext.useType(metadata.getType());
        financialStatementContext.useActionMessageMap(actionMsgMap);
        financialStatementContext.useCollaborators(proposal.getCollaborators());
        financialStatementContext.useCloneProposal(cloneProposal);
        financialStatementContext.useOriginRef(originRef);
        financialStatementContext.usePackageRef(proposal.getMetadata().get().getRef());
        FinancialStatement financialStatement = financialStatementContext.executeCreateFinancialStatement();
        proposalService.addComponentRef(proposal, financialStatement.getName(), STAT_FINANC_LEGIS);
        proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public Proposal executeCreateProposal() {
        LOG.trace("Executing 'Create Proposal' use case...");
        this.packageService.useLanguage(this.language);
        this.packageService.useTranslated(this.translated);
        LeosPackage leosPckg = packageService.createPackage();

        List<CatalogItem> catalogItems;
        Map<String, String> templatePropertiesMap = new HashMap<>();
        templatePropertiesMap.put(DOCUMENT_MANDATORY_TEMPLATES, "");
        templatePropertiesMap.put(DOCUMENT_DEFAULT_TRUE_TEMPLATES, "");
        templatePropertiesMap.put(DOCUMENT_DEFAULT_FALSE_TEMPLATES, "");
        try {
            catalogItems = templateService.getTemplatesCatalog();
            getTemplateProperties(templatePropertiesMap, catalogItems, templateKey, false);
        } catch (IOException e) {
            LOG.error("Error occurred while retrieving catalog items " + e.getMessage());
        }

        loadTemplates(templatePropertiesMap, DOCUMENT_MANDATORY_TEMPLATES);
        loadTemplates(templatePropertiesMap, DOCUMENT_DEFAULT_TRUE_TEMPLATES);
        loadTemplates(templatePropertiesMap, DOCUMENT_DEFAULT_FALSE_TEMPLATES);

        Proposal proposalTemplate = cast(categoryTemplateMap.get(PROPOSAL));
        Validate.notNull(proposalTemplate, "Proposal template is required!");

        Option<ProposalMetadata> metadataOption = proposalTemplate.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), PROPOSAL_METADATA_IS_REQUIRED);

        Validate.notNull(purpose, PROPOSAL_PURPOSE_IS_REQUIRED);
        ProposalMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withEeaRelevance(eeaRelevance)
                .build();

        Proposal prpsl = proposalService.createProposal(proposalTemplate.getId(), leosPckg.getPath(), metadata, null);

        if (cast(categoryTemplateMap.get(MEMORANDUM)) != null) {
            MemorandumContextService memorandumContext = memorandumContextProvider.get();
            memorandumContext.usePackage(leosPckg);
            memorandumContext.useTemplate(cast(categoryTemplateMap.get(MEMORANDUM)));
            memorandumContext.usePurpose(purpose);
            memorandumContext.useActionMessageMap(actionMsgMap);
            memorandumContext.useType(metadata.getType());
            memorandumContext.usePackageTemplate(metadata.getTemplate());
            Memorandum memorandum = memorandumContext.executeCreateMemorandum();
            prpsl = proposalService.addComponentRef(prpsl, memorandum.getName(), LeosCategory.MEMORANDUM);
        }

        BillContextService billContext = billContextProvider.get();
        billContext.usePackage(leosPckg);
        billContext.useTemplate(cast(categoryTemplateMap.get(BILL)));
        billContext.usePurpose(purpose);
        billContext.useActionMessageMap(actionMsgMap);
        Bill bill = billContext.executeCreateBill();
        proposalService.addComponentRef(prpsl, bill.getName(), LeosCategory.BILL);
        return proposalService.createVersion(prpsl.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public Proposal executeUpdateProposal() {
        LOG.trace("Executing 'Update Proposal' use case...");

        Validate.notNull(proposal, "Proposal is required!");
        Validate.notNull(proposalComment, "Proposal comment is required!");

        Option<ProposalMetadata> metadataOption = proposal.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), PROPOSAL_METADATA_IS_REQUIRED);

        Validate.notNull(purpose, PROPOSAL_PURPOSE_IS_REQUIRED);
        ProposalMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withEeaRelevance(eeaRelevance)
                .build();

        proposal = proposalService.updateProposal(proposal, metadata, VersionType.MINOR, proposalComment);

        useProposal(proposal);
        usePurpose(proposal.getMetadata().get().getPurpose());
        useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
        String comment = messageHelper.getMessage("operation.docpurpose.updated");
        useActionMessage(ContextActionService.METADATA_UPDATED, comment);
        useActionComment(comment);
        executeUpdateDocumentsAssociatedToProposal();

        return proposal;
    }

    public void executeUpdateDocumentsAssociatedToProposal() {
        LOG.trace("Executing 'Update Documents Associated to Proposal' use case...");

        Validate.notNull(proposal, "Proposal is required!");
        Validate.notNull(proposalComment, "Proposal comment is required!");

        Option<ProposalMetadata> metadataOption = proposal.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), "Proposal metadata is required!");

        Validate.notNull(purpose, "Proposal purpose is required!");

        LeosPackage leosPackage = packageService.findPackageByDocumentId(proposal.getId());
        List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(),
                XmlDocument.class, false);

        for (XmlDocument document : documents) {
            switch (document.getCategory()) {
                case COUNCIL_EXPLANATORY: {
                    executeUpdateExplanatory(leosPackage, purpose, actionMsgMap);
                    break;
                }
                case MEMORANDUM: {
                    MemorandumContextService memorandumContext = memorandumContextProvider.get();
                    memorandumContext.usePackage(leosPackage);
                    memorandumContext.usePurpose(purpose);
                    memorandumContext.useEeaRelevance(eeaRelevance);
                    memorandumContext.useActionMessageMap(actionMsgMap);
                    memorandumContext.executeUpdateMemorandum();
                    break;
                }
                case BILL: {
                    BillContextService billContext = billContextProvider.get();
                    billContext.usePackage(leosPackage);
                    billContext.usePurpose(purpose);
                    billContext.useEeaRelevance(eeaRelevance);
                    billContext.useActionMessageMap(actionMsgMap);
                    billContext.executeUpdateBill();
                    break;
                }
                default:
                    LOG.debug("Do nothing for rest of the categories like MEDIA, CONFIG & LEG");
                    break;
            }
        }
    }

    public void executeDeleteProposal() {
        LOG.trace("Executing 'Delete Proposal' use case...");
        if (proposal != null && proposal.getId() != null) {
            LeosPackage leosPckg = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
            packageService.deletePackage(leosPckg);
        }
    }

    public void executeUpdateProposalAsync() {
        Validate.notNull(propChildDocument, "Proposal child document is required!");
        proposalService.updateProposalAsync(propChildDocument, proposalComment);
    }

    /**
     * Given a proposalId, fetch all documents related from CMIS and update them to the next major version.
     * The document version is not updated if it is already a major version.
     */
    public void executeCreateMilestone() {
        LOG.info("Creating major versions for all documents of [proposal={}", proposal.getId());

        //Proposal
        List<String> milestoneComments = proposal.getMilestoneComments();
        milestoneComments.add(milestoneComment);
        if (proposal.getVersionType().equals(VersionType.MAJOR)) {
            proposal = proposalService.updateProposalWithMilestoneComments(proposal.getMetadata().get().getRef(), proposal.getId(), milestoneComments);
            LOG.info("Major version {} already present. Updated only milestoneComment for [proposal={}]", proposal.getVersionLabel(), proposal.getId());
        } else {
            proposal = proposalService.updateProposalWithMilestoneComments(proposal, milestoneComments, VersionType.MAJOR, versionComment);
            LOG.info("Created major version {} for [proposal={}]", proposal.getVersionLabel(), proposal.getId());
        }

        // Update the last structure
        final LeosPackage leosPckg = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);

        //Memorandum
        final MemorandumContextService memorandumContext = memorandumContextProvider.get();
        memorandumContext.usePackage(leosPckg);
        memorandumContext.useVersionComment(versionComment);
        memorandumContext.useMilestoneComment(milestoneComment);
        memorandumContext.executeCreateMilestone();

        //Bill + Annexes
        final BillContextService billContext = billContextProvider.get();
        billContext.usePackage(leosPckg);
        billContext.useVersionComment(versionComment);
        billContext.useMilestoneComment(milestoneComment);
        billContext.executeCreateMilestone();

        //FS
        final FinancialStatementContextService financialStatementContext = financialStatementContextProvider.get();
        financialStatementContext.usePackage(leosPckg);
        financialStatementContext.useVersionComment(versionComment);
        financialStatementContext.useMilestoneComment(milestoneComment);
        financialStatementContext.executeCreateMilestone();
    }

    public Proposal executeCreateExplanatoryDocument() {
        throw new UnsupportedOperationException("Method not supported");
    }

    public void executeCreateExplanatory() {
        LeosPackage leosPckg = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        ExplanatoryContextService explanatoryContext = explanatoryContextProvider.get();
        explanatoryContext.usePackage(leosPckg);
        String template = categoryTemplateMap.get(COUNCIL_EXPLANATORY).getName();
        explanatoryContext.useTemplate(template);
        explanatoryContext.usePurpose(purpose);
        explanatoryContext.useTitle(messageHelper.getMessage("document.default.explanatory.title.default." + template));
        Option<ProposalMetadata> metadataOption = proposal.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), PROPOSAL_METADATA_IS_REQUIRED);
        ProposalMetadata metadata = metadataOption.get();
        explanatoryContext.useType(metadata.getType());
        explanatoryContext.useActionMessageMap(actionMsgMap);
        explanatoryContext.useCollaborators(proposal.getCollaborators());
        explanatoryContext.usePackageRef(proposal.getMetadata().get().getRef());
        Explanatory explanatory = explanatoryContext.executeCreateExplanatory();
        proposalService.addComponentRef(proposal, explanatory.getName(), COUNCIL_EXPLANATORY);
        proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public void executeRemoveExplanatory() {
        LOG.trace("Executing 'Remove council explanatory' use case...");
        Validate.notNull(leosPackage, "Leos package is required!");
        Explanatory explanatory = explanatoryService.findExplanatory(explanatoryId);
        explanatoryService.deleteExplanatory(explanatory);
        Proposal prpsl = proposalService.findProposalByPackagePath(leosPackage.getPath());
        prpsl = proposalService.removeComponentRef(prpsl, explanatory.getName());
        proposalService.updateProposal(prpsl.getId(), prpsl.getContent().get().getSource().getBytes());
    }

    protected Map<String, String> getTemplateProperties(Map<String, String> tp, List<CatalogItem> catalogItems, String templateId, boolean isGetChildren) {
        CatalogItem matchingItem = catalogItems.stream()
                .filter(item -> item.getKey() != null && item.getKey().equalsIgnoreCase(templateId))
                .findFirst()
                .orElse(null);

        if (matchingItem != null) {
            tp.put(TEMPLATE, matchingItem.getKey());
            tp = getTemplateProperties(tp, matchingItem.getItems(), templateId, true);
            return tp;
        }

        boolean skipItr = false;
        for (CatalogItem item : catalogItems) {
            tp = getTemplateProperties(tp, item.getItems(), templateId, isGetChildren);
            if (tp.containsKey(TEMPLATE) && item.isEnabled() && (item.isMandatory() != null && item.isMandatory())) {
                // This method adds in object tp
                fillTemplate(tp, item, DOCUMENT_MANDATORY_TEMPLATES);
            } else if (tp.containsKey(TEMPLATE) && item.isEnabled() && (item.isDefaultDocument() != null && item.isDefaultDocument())) {
                // This method adds in object tp
                fillTemplate(tp, item, DOCUMENT_DEFAULT_TRUE_TEMPLATES);
            } else if (tp.containsKey(TEMPLATE) && item.isEnabled() && (item.isDefaultDocument() != null && !item.isDefaultDocument())) {
                // This method adds in object tp
                fillTemplate(tp, item, DOCUMENT_DEFAULT_FALSE_TEMPLATES);
            } else if (tp.containsKey(TEMPLATE) && !tp.containsKey(ACT_TYPE) && !isGetChildren) {
                tp.put(ACT_TYPE, item.getKey());
                skipItr = true;
            } else if (tp.containsKey(TEMPLATE) && tp.containsKey(ACT_TYPE) && !tp.containsKey(PROCEDURE_TYPE) && !isGetChildren) {
                tp.put(PROCEDURE_TYPE, item.getKey());
                skipItr = true;
            }
            if(skipItr) {
                break;
            }
        }
        return tp;
    }

    private static void fillTemplate(Map<String, String> tp, CatalogItem item, String documentTemplatesType) {
        if (tp.containsKey(documentTemplatesType) && !tp.get(documentTemplatesType).isEmpty()) {
            tp.put(documentTemplatesType, tp.get(documentTemplatesType) + ";");
        }
        tp.put(documentTemplatesType, tp.get(documentTemplatesType) + item.getId());
    }

    protected void loadTemplates(Map<String, String> templatePropertiesMap, String documentTemplatesType) {
        String template = templatePropertiesMap.get(documentTemplatesType);
        String[] templates = (template != null) ? template.split(";") : new String[0];
        for (String name : templates) {
            if (name != null && !name.isEmpty()) {
                this.useTemplate(name);
            }
        }
    }

    @SuppressWarnings("unchecked")
    protected static <T> T cast(Object obj) {
        return (T) obj;
    }

    protected abstract void executeUpdateExplanatory(LeosPackage leosPackage, String purpose, Map<ContextActionService, String> actionMsgMap);
}