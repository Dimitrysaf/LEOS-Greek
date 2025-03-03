package eu.europa.ec.leos.services.collection;

import java.io.File;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.inject.Provider;

import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.notification.cloneProposal.ClonedProposalNotification;
import eu.europa.ec.leos.model.notification.cloneProposal.RevisionDoneNotification;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.document.PostProcessingDocumentService;
import eu.europa.ec.leos.services.exception.XmlValidationException;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import io.atlassian.fugue.Pair;

import static eu.europa.ec.leos.domain.repository.LeosCategory.PROPOSAL;

@Service
public class CreateCollectionServiceImpl implements CreateCollectionService {
    private static final Logger LOG = LoggerFactory.getLogger(CreateCollectionServiceImpl.class);

    private final Provider<CollectionContextService> proposalContextProvider;
    private ProposalConverterService proposalConverterService;
    private ContributionService contributionService;
    private PostProcessingDocumentService postProcessingDocumentService;
    private final NotificationService notificationService;
    private SecurityContext securityContext;

    private CollectionUrlBuilder urlBuilder;
    private MessageHelper messageHelper;
    private CloneContext cloneContext;

    @Value("${notification.functional.mailbox}")
    private String notificationRecepient;

    @Autowired
    public CreateCollectionServiceImpl(
            Provider<CollectionContextService> proposalContextProvider,
            PostProcessingDocumentService postProcessingDocumentService,
            ContributionService contributionService,
            ProposalConverterService proposalConverterService,
            NotificationService notificationService,
            SecurityContext securityContext, CollectionUrlBuilder urlBuilder,
            MessageHelper messageHelper,
            CloneContext cloneContext) {
        this.proposalContextProvider = proposalContextProvider;
        this.proposalConverterService = proposalConverterService;
        this.postProcessingDocumentService = postProcessingDocumentService;
        this.contributionService = contributionService;
        this.notificationService = notificationService;
        this.securityContext = securityContext;
        this.urlBuilder = urlBuilder;
        this.messageHelper = messageHelper;
        this.cloneContext = cloneContext;
    }

    @Override
    public DocumentVO createDocumentVOFromLegfile(File legDocument) throws XmlValidationException {
        Validate.notNull(legDocument, "Leg document is required");
        DocumentVO propDocument = proposalConverterService.createProposalFromLegFile(legDocument, true);

        CollectionContextService context = proposalContextProvider.get();
        context.useTemplate(propDocument.getMetadata().getDocTemplate());
        return propDocument;
    }

    @Override
    public DocumentVO getProposalDocumentFromLeg(File legDocument) throws CreateCollectionException {
        DocumentVO propDocument;
        try {
            propDocument = createDocumentVOFromLegfile(legDocument);
        } catch (XmlValidationException e) {
            LOG.error("Xml validation error occurred while creating proposal from leg file: {}", e);
            CreateCollectionError error = new CreateCollectionError(e.getErrorCode().ordinal(), e.getMessage());
            throw new CreateCollectionException(error.getMessage());
        }
        return propDocument;
    }

    private void addTemplateInContext(CollectionContextService context, DocumentVO documentVO) {
        context.useTemplate(documentVO.getMetadata().getDocTemplate());
        if (documentVO.getChildDocuments() != null) {
            for (DocumentVO docChild : documentVO.getChildDocuments()) {
                addTemplateInContext(context, docChild);
            }
        }
    }

    @Override
    public CreateCollectionResult createCollection(DocumentVO documentVO) throws CreateCollectionException {
        Stopwatch stopwatch = Stopwatch.createStarted();
        LOG.debug("Handling create document request event... [category={}]", documentVO.getCategory());
        CollectionIdsAndUrlsHolder idsAndUrlsHolder = new CollectionIdsAndUrlsHolder();
        if (LeosCategory.PROPOSAL.equals(documentVO.getCategory())) {
            CollectionContextService context = proposalContextProvider.get();
            context.usePurpose(documentVO.getMetadata().getDocPurpose());
            context.useEeaRelevance(documentVO.getMetadata().getEeaRelevance());
            context.useActionMessage(ContextActionService.METADATA_UPDATED, messageHelper.getMessage("operation.metadata.updated"));
            context.useActionMessage(ContextActionService.DOCUMENT_CREATED, messageHelper.getMessage("operation.document.created"));
            context.useLanguage(documentVO.getMetadata().getLanguage());
            context.useTranslated(false);
            context.useTemplateKey(documentVO.getMetadata().getTemplate());
            //create proposal
            Proposal proposal = context.executeCreateProposal();

            String proposalId = proposal.getMetadata().get().getRef();
            String proposalUrl = urlBuilder.buildProposalViewUrl(proposalId);
            idsAndUrlsHolder.setProposalId(proposalId);
            idsAndUrlsHolder.setProposalUrl(proposalUrl);
            LOG.info("New document of type {} created in {} milliseconds ({} sec)", documentVO.getCategory(),
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
            return new CreateCollectionResult(idsAndUrlsHolder, true, null);
        }
        CreateCollectionError error = new CreateCollectionError(0,
                messageHelper.getMessage("repository.create.proposal.error"));
        throw new CreateCollectionException(error.getMessage());
    }

    @Override
    public CreateCollectionResult createCollectionFromLeg(File legDocument, DocumentVO propDocument, String language, boolean isTranslated) {
        CollectionIdsAndUrlsHolder idsAndUrlsHolder = new CollectionIdsAndUrlsHolder();

        CollectionContextService context = proposalContextProvider.get();
        context.useDocument(propDocument);
        context.useIdsAndUrlsHolder(idsAndUrlsHolder);
        context.useCloneProposal(false);
        context.useLanguage(language);
        context.useTranslated(isTranslated);
        context.useOriginRef(propDocument.getRef());
        addTemplateInContext(context, propDocument);
        postProcessingDocumentService.processDocument(propDocument);
        context.useTemplateKey(propDocument.getMetadata().getTemplate());
        Proposal proposal = context.executeImportProposal();

        String proposalId = proposal.getMetadata().get().getRef();
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalId);
        idsAndUrlsHolder.setProposalId(proposalId);
        idsAndUrlsHolder.setProposalUrl(proposalUrl);

        return new CreateCollectionResult(idsAndUrlsHolder, true, null);
    }

    @Override
    public CreateCollectionResult cloneCollection(File legDocument, String originRef, String targetUser, String connectedEntity) {
        Validate.notNull(originRef, "originRef reference is required!");
        CollectionIdsAndUrlsHolder idsAndUrlsHolder = new CollectionIdsAndUrlsHolder();
        DocumentVO propDocument = null;
        try {
            propDocument = createDocumentVOFromLegfile(legDocument);
        } catch (XmlValidationException e) {
            LOG.error("Xml validation error occurred while creating proposal from leg file: {}", e);
            CreateCollectionError error = new CreateCollectionError(e.getErrorCode().ordinal(), e.getMessage());
            return new CreateCollectionResult(idsAndUrlsHolder, false, error);
        }

        //set metadata to cloned proposal
        CloneProposalMetadataVO cloneProposalMetadataVO = new CloneProposalMetadataVO();
        cloneProposalMetadataVO.setClonedProposal(Boolean.TRUE);
        cloneProposalMetadataVO.setOriginRef(originRef);
        cloneProposalMetadataVO.setClonedFromRef(propDocument.getRef());
        cloneProposalMetadataVO.setClonedFromObjectId(propDocument.getId());
        cloneProposalMetadataVO.setLegFileName(legDocument.getName());
        cloneProposalMetadataVO.setTargetUser(targetUser);
        cloneProposalMetadataVO.setRevisionStatus(messageHelper.getMessage("clone.proposal.status.sent"));

        CollectionContextService context = proposalContextProvider.get();
        context.useDocument(propDocument);
        context.useIdsAndUrlsHolder(idsAndUrlsHolder);
        context.useOriginRef(originRef);
        context.useCloneProposal(true);
        context.useLanguage(propDocument.getMetadata().getLanguage().toUpperCase());
        context.useTranslated(false);
        context.useConnectedEntity(connectedEntity);
        context.useClonedProposalMetadataVO(cloneProposalMetadataVO);
        context.useTemplateKey(propDocument.getMetadata().getTemplate());
        addTemplateInContext(context, propDocument);

        Result<?> result = postProcessingDocumentService.saveOriginalProposalIdToClonedProposal(propDocument, legDocument.getName(), originRef);
        if (result.isError()) {
            CreateCollectionError error = new CreateCollectionError(result.getErrorCode().orElse(ErrorCode.EXCEPTION).ordinal(),
                    messageHelper.getMessage("clone.proposal.metadata.preserve.error"));
            return new CreateCollectionResult(idsAndUrlsHolder, false, error);
        }

        Proposal proposal = context.executeImportProposal();
        String proposalId = proposal.getMetadata().get().getRef();
        String proposalUrl = urlBuilder.buildProposalViewUrl(proposalId);
        idsAndUrlsHolder.setProposalId(proposalId);
        idsAndUrlsHolder.setProposalUrl(proposalUrl);
        idsAndUrlsHolder.addDocCloneAndOriginIdMap(proposalId, propDocument.getRef());

        //set clone creation date to original proposal
        cloneProposalMetadataVO.setCreationDate(Date.from(proposal.getInitialCreationInstant()));

        result = postProcessingDocumentService.saveClonedProposalIdToOriginalProposal(propDocument, idsAndUrlsHolder, cloneProposalMetadataVO);
        if (result.isError()) {
            //In case of error delete the cloned proposal.
            context.useProposal(proposal);
            try {
                LOG.debug("Deleting cloned proposal as metadata update operation failed");
                context.executeDeleteProposal();
            } catch (Exception e) {
                LOG.error("Error deleting the cloned proposal", e);
            }
            CreateCollectionError error = new CreateCollectionError(result.getErrorCode().orElse(ErrorCode.EXCEPTION).ordinal(),
                    messageHelper.getMessage("clone.proposal.metadata.preserve.error"));
            return new CreateCollectionResult(idsAndUrlsHolder, true, error);
        }

        try {
            //Send CNS notification
            notificationService.sendNotification(new ClonedProposalNotification(notificationRecepient,
                    messageHelper.getMessage("clone.proposal.notification.title.originRef", originRef),
                    legDocument.getName(), proposalUrl, originRef));
        } catch (Exception e) {
            LOG.error("CNS notification exception. Service is not available at the moment.", e);
        }
        return new CreateCollectionResult(idsAndUrlsHolder, true, null);
    }

    @Override
    public Result<?> updateOriginalProposalAfterRevisionDone(String cloneProposalRef, String cloneLegFileId) {
        CloneProposalMetadataVO cloneProposalMetadataVO = cloneContext.getCloneProposalMetadataVO();
        if (cloneProposalMetadataVO == null) {
            cloneProposalMetadataVO = new CloneProposalMetadataVO();
        }
        cloneProposalMetadataVO.setRevisionStatus(messageHelper.getMessage("clone.proposal.status.contribution.done"));
        Result<?> result = contributionService.updateContributionStatusAfterContributionDone(cloneProposalRef,
                cloneLegFileId, cloneProposalMetadataVO);
        if (result.isOk()) {
            Proposal updatedProposal = (Proposal) ((Pair) result.get()).left();
            String proposalUrl = urlBuilder.buildProposalViewUrl(updatedProposal.getMetadata().get().getRef());
            try {
                //Send CNS notification
                notificationService.sendNotification(new RevisionDoneNotification(notificationRecepient,
                        messageHelper.getMessage("clone.proposal.contribution.done.notification.title",
                                securityContext.getUser().getDefaultEntity().getOrganizationName()),
                        proposalUrl, securityContext.getUser().getDefaultEntity().getOrganizationName()));
            } catch (Exception e) {
                LOG.error("CNS notification exception. Service is not available at the moment.", e);
            }
            return new Result<>(new Pair<>(proposalUrl, (LegDocument) ((Pair) result.get()).right()), null);
        }
        return result;
    }
}