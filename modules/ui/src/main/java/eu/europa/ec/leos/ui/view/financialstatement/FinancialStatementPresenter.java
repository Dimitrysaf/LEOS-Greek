/*
 * Copyright 2022 European Commission
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
package eu.europa.ec.leos.ui.view.financialstatement;

import com.google.common.base.Stopwatch;
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;
import com.vaadin.server.VaadinServletService;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.domain.annotation.AnnotationStatus;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.annex.LevelItemVO;
import eu.europa.ec.leos.model.event.DocumentUpdatedByCoEditorEvent;
import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.Annotate.AnnotateService;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.FinancialStatementContextService;
import eu.europa.ec.leos.services.document.ContributionService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.messaging.UpdateInternalReferencesProducer;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.AttachmentProcessor;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.processor.FinancialStatementProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.search.SearchService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.toc.StructureContext;
import eu.europa.ec.leos.ui.component.ComparisonComponent;
import eu.europa.ec.leos.ui.component.toc.CheckDeleteLastEditingChildTypeConsumer;
import eu.europa.ec.leos.ui.event.CloseBrowserRequestEvent;
import eu.europa.ec.leos.ui.event.CloseScreenRequestEvent;
import eu.europa.ec.leos.ui.event.DownloadActualVersionRequestEvent;
import eu.europa.ec.leos.ui.event.DownloadXmlVersionRequestEvent;
import eu.europa.ec.leos.ui.event.FetchMilestoneByVersionedReferenceEvent;
import eu.europa.ec.leos.ui.event.InitLeosEditorEvent;
import eu.europa.ec.leos.ui.event.MergeElementRequestEvent;
import eu.europa.ec.leos.ui.event.metadata.SearchMetadataRequest;
import eu.europa.ec.leos.ui.event.metadata.SearchMetadataResponse;
import eu.europa.ec.leos.ui.event.revision.OpenRevisionDocumentEvent;
import eu.europa.ec.leos.ui.event.metadata.DocumentMetadataRequest;
import eu.europa.ec.leos.ui.event.metadata.DocumentMetadataResponse;
import eu.europa.ec.leos.ui.event.search.ReplaceAllMatchRequestEvent;
import eu.europa.ec.leos.ui.event.search.ReplaceAllMatchResponseEvent;
import eu.europa.ec.leos.ui.event.search.SearchTextRequestEvent;
import eu.europa.ec.leos.ui.event.search.ShowConfirmDialogEvent;
import eu.europa.ec.leos.ui.event.toc.CloseTocAndDocumentEvent;
import eu.europa.ec.leos.ui.event.toc.InlineTocEditRequestEvent;
import eu.europa.ec.leos.ui.event.view.DownloadXmlFilesRequestEvent;
import eu.europa.ec.leos.ui.event.view.ToolBoxExportRequestEvent;
import eu.europa.ec.leos.domain.annotation.AnnotateMetadata;
import eu.europa.ec.leos.ui.view.CommonDelegate;
import eu.europa.ec.leos.ui.window.milestone.MilestoneExplorer;
import eu.europa.ec.leos.web.event.component.CompareRequestEvent;
import eu.europa.ec.leos.web.event.component.CleanComparedContentEvent;
import eu.europa.ec.leos.web.event.component.RestoreVersionRequestEvent;
import eu.europa.ec.leos.web.event.component.ShowVersionRequestEvent;
import eu.europa.ec.leos.web.event.component.LayoutChangeRequestEvent;
import eu.europa.ec.leos.web.event.component.ResetRevisionComponentEvent;
import eu.europa.ec.leos.web.event.component.VersionListRequestEvent;
import eu.europa.ec.leos.web.event.component.VersionListResponseEvent;
import eu.europa.ec.leos.web.event.component.WindowClosedEvent;
import eu.europa.ec.leos.web.event.view.document.ComparisonEvent;
import eu.europa.ec.leos.web.event.view.document.ConvertAkn4euVersionDocument;
import eu.europa.ec.leos.web.event.view.document.FetchUserPermissionsRequest;
import eu.europa.ec.leos.web.event.view.document.RequestFilteredAnnotations;
import eu.europa.ec.leos.web.event.view.document.MergeSuggestionRequest;
import eu.europa.ec.leos.web.event.view.document.MergeSuggestionsRequest;
import eu.europa.ec.leos.web.event.view.document.ResponseFilteredAnnotations;
import eu.europa.ec.leos.web.event.view.document.ShowCleanVersionRequestEvent;
import eu.europa.ec.leos.web.event.view.document.SaveIntermediateVersionEvent;
import eu.europa.ec.leos.web.event.view.document.ShowIntermediateVersionWindowEvent;
import eu.europa.ec.leos.ui.event.DownloadCleanVersion;
import eu.europa.ec.leos.ui.support.CoEditionHelper;
import eu.europa.ec.leos.ui.support.ConfirmDialogHelper;
import eu.europa.ec.leos.ui.view.AbstractLeosPresenter;
import eu.europa.ec.leos.ui.view.ComparisonDelegate;
import eu.europa.ec.leos.usecases.document.CollectionContext;
import eu.europa.ec.leos.vo.coedition.InfoType;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.web.event.NavigationRequestEvent;
import eu.europa.ec.leos.web.event.NotificationEvent;
import eu.europa.ec.leos.web.event.view.AddChangeDetailsMenuEvent;
import eu.europa.ec.leos.web.event.view.document.CheckDeleteLastEditingChildTypeEvent;
import eu.europa.ec.leos.web.event.view.document.CheckElementCoEditionEvent;
import eu.europa.ec.leos.web.event.view.document.CloseDocumentConfirmationEvent;
import eu.europa.ec.leos.web.event.view.document.CloseDocumentEvent;
import eu.europa.ec.leos.web.event.view.document.CloseElementEvent;
import eu.europa.ec.leos.web.event.view.document.DeleteElementRequestEvent;
import eu.europa.ec.leos.web.event.view.document.DocumentUpdatedEvent;
import eu.europa.ec.leos.web.event.view.document.EditElementRequestEvent;
import eu.europa.ec.leos.web.event.view.document.FetchUserGuidanceRequest;
import eu.europa.ec.leos.web.event.view.document.InsertElementRequestEvent;
import eu.europa.ec.leos.web.event.view.document.InstanceTypeResolver;
import eu.europa.ec.leos.web.event.view.document.RefreshDocumentEvent;
import eu.europa.ec.leos.web.event.view.document.RefreshElementEvent;
import eu.europa.ec.leos.web.event.view.document.SaveElementRequestEvent;
import eu.europa.ec.leos.web.event.window.CancelElementEditorEvent;
import eu.europa.ec.leos.web.event.window.CloseElementEditorEvent;

import eu.europa.ec.leos.ui.event.search.SearchBarClosedEvent;
import eu.europa.ec.leos.ui.event.search.ReplaceMatchRequestEvent;
import eu.europa.ec.leos.ui.event.search.SaveAfterReplaceEvent;
import eu.europa.ec.leos.ui.event.search.SaveAndCloseAfterReplaceEvent;
import eu.europa.ec.leos.web.model.VersionInfoVO;
import eu.europa.ec.leos.web.support.SessionAttribute;
import eu.europa.ec.leos.web.support.UrlBuilder;
import eu.europa.ec.leos.web.support.UuidHelper;
import eu.europa.ec.leos.web.support.cfg.ConfigurationHelper;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.web.support.xml.DownloadStreamResource;
import eu.europa.ec.leos.web.ui.navigation.Target;
import eu.europa.ec.leos.web.ui.screen.document.ColumnPosition;
import io.atlassian.fugue.Option;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.inject.Provider;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.INDENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.POINT;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPOINT;
import static eu.europa.ec.leos.util.LeosDomainUtil.CMIS_PROPERTY_SPLITTER;

@Component
@Scope("prototype")
public class FinancialStatementPresenter extends AbstractLeosPresenter {

    private static final Logger LOG = LoggerFactory.getLogger(FinancialStatementPresenter.class);
    private static final String STATFINANCLEGIS = "statfinanclegis#";

    private final FinancialStatementScreen financialStatementScreen;

    private final FinancialStatementProcessor financialStatementProcessor;
    private final FinancialStatementService financialStatementService;
    private final ContributionService contributionService;
    private final ElementProcessor<FinancialStatement> elementProcessor;

    private final XmlContentProcessor xmlContentProcessor;
    private final DocumentContentService documentContentService;
    private final UrlBuilder urlBuilder;
    private final ComparisonDelegate<FinancialStatement> comparisonDelegate;
    private final UserHelper userHelper;
    private final MessageHelper messageHelper;
    private final ConfigurationHelper cfgHelper;
    private final Provider<CollectionContext> proposalContextProvider;
    private final CoEditionHelper coEditionHelper;
    private final ExportService exportService;
    private final Provider<StructureContext> structureContextProvider;
    private final ReferenceLabelService referenceLabelService;
    private final Provider<FinancialStatementContextService> financialStatementContextProvider;
    private final UpdateInternalReferencesProducer updateInternalReferencesProducer;
    private final TransformationService transformationService;
    private final LegService legService;
    private final ProposalService proposalService;
    private final SearchService searchService;
    private final ExportPackageService exportPackageService;
    private final NotificationService notificationService;
    private final CloneContext cloneContext;
    private CloneProposalMetadataVO cloneProposalMetadataVO;
    protected final AttachmentProcessor attachmentProcessor;
    private final AnnotateService annotateService;
    private final CommonDelegate<FinancialStatement> commonDelegate;

    private final static SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy HH:mm");
    private boolean milestoneExplorerOpened = false;
    private InstanceTypeResolver instanceTypeResolver;
    private String documentRef;
    private String strDocumentVersionSeriesId;
    private String documentId;
    private String proposalRef;
    private String connectedEntity;
    private final List<String> openElementEditors;
    private Element elementToEditAfterClose;
    private final TemplateConfigurationService templateConfigurationService;
    private boolean comparisonMode;

    protected FinancialStatementPresenter(SecurityContext securityContext, HttpSession httpSession, EventBus eventBus,
                                          EventBus leosApplicationEventBus, UuidHelper uuidHelper, PackageService packageService,
                                          WorkspaceService workspaceService, FinancialStatementScreen financialStatementScreen,
                                          FinancialStatementProcessor financialStatementProcessor, FinancialStatementService financialStatementService, ContributionService contributionService,
                                          ElementProcessor<FinancialStatement> elementProcessor, XmlContentProcessor xmlContentProcessor,
                                          DocumentContentService documentContentService,
                                          UrlBuilder urlBuilder, ComparisonDelegate<FinancialStatement> comparisonDelegate,
                                          UserHelper userHelper, MessageHelper messageHelper, ConfigurationHelper cfgHelper,
                                          Provider<CollectionContext> proposalContextProvider, CoEditionHelper coEditionHelper,
                                          ExportService exportService, Provider<StructureContext> structureContextProvider,
                                          ReferenceLabelService referenceLabelService, Provider<FinancialStatementContextService> financialStatementContextProvider,
                                          UpdateInternalReferencesProducer updateInternalReferencesProducer, TransformationService transformationService,
                                          LegService legService, ProposalService proposalService, SearchService searchService,
                                          ExportPackageService exportPackageService, NotificationService notificationService,
                                          CloneContext cloneContext, AttachmentProcessor attachmentProcessor,
                                          AnnotateService annotateService, CommonDelegate<FinancialStatement> commonDelegate, TemplateConfigurationService templateConfigurationService, InstanceTypeResolver instanceTypeResolver) {
        super(securityContext, httpSession, eventBus, leosApplicationEventBus, uuidHelper, packageService, workspaceService);
        this.financialStatementScreen = financialStatementScreen;
        this.financialStatementProcessor = financialStatementProcessor;
        this.financialStatementService = financialStatementService;
        this.contributionService = contributionService;
        this.elementProcessor = elementProcessor;
        this.xmlContentProcessor = xmlContentProcessor;
        this.documentContentService = documentContentService;
        this.urlBuilder = urlBuilder;
        this.comparisonDelegate = comparisonDelegate;
        this.userHelper = userHelper;
        this.messageHelper = messageHelper;
        this.cfgHelper = cfgHelper;
        this.proposalContextProvider = proposalContextProvider;
        this.coEditionHelper = coEditionHelper;
        this.exportService = exportService;
        this.structureContextProvider = structureContextProvider;
        this.referenceLabelService = referenceLabelService;
        this.financialStatementContextProvider = financialStatementContextProvider;
        this.updateInternalReferencesProducer = updateInternalReferencesProducer;
        this.transformationService = transformationService;
        this.legService = legService;
        this.proposalService = proposalService;
        this.searchService = searchService;
        this.exportPackageService = exportPackageService;
        this.notificationService = notificationService;
        this.cloneContext = cloneContext;
        this.attachmentProcessor = attachmentProcessor;
        this.annotateService = annotateService;
        this.commonDelegate = commonDelegate;
        this.openElementEditors = new ArrayList<>();
        this.templateConfigurationService = templateConfigurationService;
        this.instanceTypeResolver = instanceTypeResolver;
    }

    @Override
    public void enter() {
        super.enter();
        init();
    }

    @Override
    public void detach() {
        super.detach();
        coEditionHelper.removeUserEditInfo(id, strDocumentVersionSeriesId, null, InfoType.DOCUMENT_INFO);
        resetCloneProposalMetadataVO();
    }

    @Subscribe
    void refreshDocument(RefreshDocumentEvent event) {
        FinancialStatement financialStatement = getDocument();
        populateViewData(financialStatement, event.getTocMode());
    }

    private boolean isFinancialStatementUnsaved() {
        return getFinancialStatementFromSession() != null;
    }

    private FinancialStatement getFinancialStatementFromSession() {
        return (FinancialStatement) httpSession.getAttribute(STATFINANCLEGIS + getDocumentRef());
    }

    private boolean isHasOpenElementEditors() {
        return this.openElementEditors.size() > 0;
    }

    @Subscribe
    public void fetchMilestoneByVersionedReference(FetchMilestoneByVersionedReferenceEvent event) {
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        LegDocument legDocument = legService.findLastLegByVersionedReference(leosPackage.getPath(), event.getVersionedReference());
        milestoneExplorerOpened = true;
        financialStatementScreen.showMilestoneExplorer(legDocument, String.join(",", legDocument.getMilestoneComments()), proposalRef);
    }

    @Subscribe
    public void fetchSearchMetadata(SearchMetadataRequest event){
        if (!milestoneExplorerOpened) {
            List<AnnotateMetadata> metadataList = new ArrayList<>();
            if (instanceTypeResolver.getInstanceType().equals(InstanceType.COMMISSION.toString()) || instanceTypeResolver.getInstanceType().equals(InstanceType.COUNCIL.toString())) {
                AnnotateMetadata metadata = new AnnotateMetadata();
                List<String> statusList = new ArrayList<String>();
                statusList.add(AnnotationStatus.ALL.name());
                metadata.setStatus(statusList);
                metadataList.add(metadata);
            }
            eventBus.post(new SearchMetadataResponse(metadataList));
        }
    }

    @Subscribe
    public void afterClosedWindow(WindowClosedEvent<MilestoneExplorer> windowClosedEvent) {
        milestoneExplorerOpened = false;
        eventBus.post(new NavigationRequestEvent(Target.STAT_FINANC_LEGIS, getDocumentRef()));
    }

    @Subscribe
    void handleCloseDocumentConfirmation(CloseDocumentConfirmationEvent event) {
        this.closeDocument();
    }

    private void closeDocument() {
        coEditionHelper.removeUserEditInfo(id, strDocumentVersionSeriesId, null, InfoType.DOCUMENT_INFO);
        resetCloneProposalMetadataVO();
        eventBus.post(new NavigationRequestEvent(Target.PREVIOUS, false));
    }

    @Subscribe
    void handleShowConfirmDialog(ShowConfirmDialogEvent event) {
        ConfirmDialogHelper.showOpenEditorDialog(this.leosUI, event, this.eventBus, this.messageHelper);
    }

    @Subscribe
    void handleCloseBrowserRequest(CloseBrowserRequestEvent event) {
        coEditionHelper.removeUserEditInfo(id, strDocumentVersionSeriesId, null, InfoType.DOCUMENT_INFO);
        resetCloneProposalMetadataVO();
    }

    @Subscribe
    void handleCloseScreenRequest(CloseScreenRequestEvent event) {
        if (financialStatementScreen.isTocEnabled()) {
            eventBus.post(new CloseTocAndDocumentEvent());
        } else {
            eventBus.post(new CloseDocumentEvent());
        }
    }

    @Subscribe
    void handleCloseDocument(CloseDocumentEvent event) {
        LOG.trace("Handling close document request...");

        //if unsaved changes remain in the session, first ask for confirmation
        if(this.isFinancialStatementUnsaved() || this.isHasOpenElementEditors()){
            eventBus.post(new ShowConfirmDialogEvent(new CloseDocumentConfirmationEvent(), null));
            return;
        }
        this.closeDocument();
    }

    private void init() {
        try {
            populateWithProposalRefAndConnectedEntity();
            FinancialStatement financialStatement = getDocument();
            populateViewData(financialStatement, TocMode.SIMPLIFIED);
            populateVersionsData(financialStatement);
            String revisionReference = getRevisionRef();
            if (revisionReference != null) {
                Optional<ContributionVO> contributionVO = financialStatementScreen.findContributionAndShowTab(revisionReference);
                if (contributionVO.isPresent()) {
                    eventBus.post(new OpenRevisionDocumentEvent(contributionVO.get()));
                }
            }
        } catch (Exception exception) {
            LOG.error("Exception occurred in init(): ", exception);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "unknown.error.message"));
        }
    }

    private void populateWithProposalRefAndConnectedEntity() {
        Proposal proposal = getProposalFromPackage();
        if (proposal != null) {
            proposalRef = proposal.getMetadata().get().getRef();
            connectedEntity = userHelper.getCollaboratorConnectedEntityByLoggedUser(proposal.getCollaborators());
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            if(proposal != null && proposal.isClonedProposal()) {
                populateCloneProposalMetadataVO(xmlContent);
            }
        }
    }

    private Proposal getProposalFromPackage() {
        Proposal proposal = null;
        FinancialStatement financialStatement = getDocument();
        if (financialStatement != null) {
            LeosPackage leosPackage = packageService.findPackageByDocumentId(financialStatement.getId());
            proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        }
        return proposal;
    }

    private String getDocumentRef() {
        return (String) httpSession.getAttribute(id + "." + SessionAttribute.STAT_FINANC_LEGIS.name());
    }

    private String getRevisionRef() {
        return (String) httpSession.getAttribute(id + "." + SessionAttribute.REVISION_VERSION.name());
    }

    private FinancialStatement getDocument() {
        documentRef = getDocumentRef();
        FinancialStatement financialStatement = financialStatementService.findFinancialStatementByRef(documentRef);
        setDocumentData(financialStatement);
        return financialStatement;
    }

    private void setDocumentData(FinancialStatement financialStatement) {
        strDocumentVersionSeriesId = financialStatement.getVersionSeriesId();
        documentId = financialStatement.getId();
        structureContextProvider.get().useDocumentTemplate(financialStatement.getMetadata().getOrError(() -> "Financial statement metadata is required!").getDocTemplate());
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
    }

    private List<VersionVO> getVersionVOS() {
        return financialStatementService.getAllVersions(documentId, documentRef);
    }

    private void populateViewData(FinancialStatement financialStatement, TocMode mode) {
        Validate.notNull(financialStatement, "Financial statement document should not be null");
        try{
            Option<FinancialStatementMetadata> financialStatementMetadata = financialStatement.getMetadata();
            if (financialStatementMetadata.isDefined()) {
                financialStatementScreen.setTitle(financialStatementMetadata.get().getTitle());
            }
            financialStatementScreen.setContent(getEditableXml(financialStatement));
            financialStatementScreen.setToc(getTableOfContent(financialStatement, mode));
            DocumentVO financialStatementVO = createFinancialStatementVO(financialStatement);
            financialStatementScreen.updateUserCoEditionInfo(coEditionHelper.getCurrentEditInfo(financialStatement.getVersionSeriesId()), id);
            financialStatementScreen.setPermissions(financialStatementVO, isClonedProposal());
            financialStatementScreen.initAnnotations(financialStatementVO, proposalRef, connectedEntity);
            financialStatementScreen.initDatepickerExtension();
            if(isClonedProposal()) {
                eventBus.post(new AddChangeDetailsMenuEvent());
            }
        }
        catch (Exception ex) {
            LOG.error("Error while processing document", ex);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "error.message", ex.getMessage()));
        }
    }

    private String getEditableXml(FinancialStatement financialStatement) {
        VersionInfoVO versionInfoVO = getVersionInfo(financialStatement);
        String baseRevisionId = financialStatement.getBaseRevisionId();
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);

        if(!StringUtils.isEmpty(baseRevisionId) && baseRevisionId.split(CMIS_PROPERTY_SPLITTER).length >= 3) {
            String versionLabel = baseRevisionId.split(CMIS_PROPERTY_SPLITTER)[1];
            String versionComment = baseRevisionId.split(CMIS_PROPERTY_SPLITTER)[2];
            versionInfoVO.setRevisedBaseVersion(versionLabel);
            versionInfoVO.setBaseVersionTitle(versionComment);
        }
        financialStatementScreen.setDocumentVersionInfo(versionInfoVO);
        byte[] coverPageContent = new byte[0];
        byte[] financialStatementContent = financialStatement.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(financialStatementContent);
        if(financialStatementScreen.isCoverPageVisible() && !isCoverPageExists) {
            Proposal proposal = getProposalFromPackage();
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(financialStatement,
                urlBuilder.getWebAppPath(VaadinServletService.getCurrentServletRequest()), securityContext, coverPageContent);
        return editableXml;
    }

    @Subscribe
    void editInlineToc(InlineTocEditRequestEvent event) {
        FinancialStatement financialStatement = getDocument();
        coEditionHelper.storeUserEditInfo(httpSession.getId(), id, user, strDocumentVersionSeriesId, null, InfoType.TOC_INFO);
        financialStatementScreen.enableTocEdition(getTableOfContent(financialStatement, TocMode.NOT_SIMPLIFIED));
    }

    @Subscribe
    public void initLeosEditor(InitLeosEditorEvent event) {
        List<LeosMetadata> documentsMetadata = packageService.getDocumentsMetadata(event.getDocument().getId());
        financialStatementScreen.initLeosEditor(event.getDocument(), documentsMetadata);
    }

    @Subscribe
    void checkElementCoEdition(CheckElementCoEditionEvent event) {
        try {
            if (event.getAction().equals(CheckElementCoEditionEvent.Action.MERGE)) {
                FinancialStatement financialStatement = getDocument();
                final byte[] contentBytes = getContent(financialStatement);
                Element mergeOnElement = xmlContentProcessor.getMergeOnElement(contentBytes, event.getElementContent(), event.getElementTagName(), event.getElementId(), true);
                if (mergeOnElement != null) {
                    financialStatementScreen.checkElementCoEdition(coEditionHelper.getCurrentEditInfo(strDocumentVersionSeriesId), user,
                            mergeOnElement.getElementId(), mergeOnElement.getElementTagName(), event.getAction(), event.getActionEvent());
                } else {
                    financialStatementScreen.showAlertDialog("operation.element.not.performed");
                }
            } else {
                FinancialStatement financialStatement = getDocument();
                final byte[] contentBytes = getContent(financialStatement);
                Element tocElement = xmlContentProcessor.getTocElement(contentBytes, event.getElementId(),
                        getListOfTableOfContent(financialStatement, TocMode.SIMPLIFIED), Arrays.asList(SUBPARAGRAPH));
                financialStatementScreen.checkElementCoEdition(coEditionHelper.getCurrentEditInfo(strDocumentVersionSeriesId), user,
                        tocElement.getElementId(), tocElement.getElementTagName(), event.getAction(), event.getActionEvent());
            }
        } catch (Exception e) {
            LOG.error("Unexpected error in checkElementCoEdition", e);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "unknown.error.message"));
        }
    }

    private List<TableOfContentItemVO> getListOfTableOfContent(FinancialStatement financialStatement, TocMode mode) {
        return financialStatementService.getTableOfContent(financialStatement, mode);
    }

    private byte[] getContent(FinancialStatement financialStatement) {
        final Content content = financialStatement.getContent().getOrError(() -> "Financial statement content is required!");
        return content.getSource().getBytes();
    }

    @Subscribe
    void editElement(EditElementRequestEvent event){
        String elementId = event.getElementId();
        String elementTagName = event.getElementTagName();
        elementToEditAfterClose = null;
        LOG.trace("Handling edit element request... for {},id={}",elementTagName , elementId );
        try {
            //show confirm dialog if there is any unsaved replaced text
            //it can be detected from the session attribute
            if(isFinancialStatementUnsaved()){
                eventBus.post(new ShowConfirmDialogEvent(event, new CancelElementEditorEvent(event.getElementId(),event.getElementTagName())));
                return;
            }

            FinancialStatement financialStatement = getDocument();
            LevelItemVO levelItemVO = new LevelItemVO();
            String element = elementProcessor.getElement(financialStatement, elementTagName, elementId);
            coEditionHelper.storeUserEditInfo(httpSession.getId(), id, user, strDocumentVersionSeriesId, elementId, InfoType.ELEMENT_INFO);
            financialStatementScreen.showElementEditor(elementId, elementTagName, element, levelItemVO, securityContext.getPermissions(financialStatement));
            openElementEditors.add(elementId);
        }
        catch (Exception ex){
            LOG.error("Exception while edit element operation for ", ex);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "error.message", ex.getMessage()));
        }
    }

    @Subscribe
    void saveElement(SaveElementRequestEvent event){
        Stopwatch stopwatch = Stopwatch.createStarted();
        String elementId = event.getElementId();
        String elementTagName = event.getElementTagName();
        String elementContent = event.getElementContent();
        elementToEditAfterClose = null;
        LOG.trace("Handling save element request... for {},id={}",elementTagName , elementId );

        try {
            FinancialStatement financialStatement = getDocument();
            byte[] updatedXmlContent = elementProcessor.updateElement(financialStatement, elementContent, elementTagName, elementId, true);
            updatedXmlContent = xmlContentProcessor.doXMLPostProcessing(updatedXmlContent);
            if (updatedXmlContent == null) {
                financialStatementScreen.showAlertDialog("operation.element.not.performed");
                return;
            }

            if (financialStatement != null) {
                Pair<byte[], Element> splittedContent;
                if (event.isSplit() && checkIfCloseElementEditor(elementTagName, event.getElementContent())) {
                    splittedContent = xmlContentProcessor.getSplittedElement(updatedXmlContent, elementContent, elementTagName, elementId);
                    if (splittedContent != null) {
                        elementToEditAfterClose = splittedContent.right();
                        if(splittedContent.left() != null) {
                            updatedXmlContent = splittedContent.left();
                            updatedXmlContent = xmlContentProcessor.insertAttributeToElement(updatedXmlContent,
                                    elementToEditAfterClose.getElementTagName(), elementToEditAfterClose.getElementId(),
                                    LEOS_EDITABLE_ATTR, "true");
                        }
                        eventBus.post(new CloseElementEvent());
                    }
                }
                financialStatement = financialStatementService.updateFinancialStatement(financialStatement, updatedXmlContent,
                        VersionType.MINOR, messageHelper.getMessage("operation.financial.statement.block.updated"));
                String newElementContent = elementProcessor.getElement(financialStatement, elementTagName, elementId);
                eventBus.post(new RefreshElementEvent(elementId, elementTagName, newElementContent));
                eventBus.post(new RefreshDocumentEvent());
                eventBus.post(new DocumentUpdatedEvent());
                leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
            }
            LOG.info("Element '{}' in FinancialStatement {} id {}, saved in {} milliseconds ({} sec)", elementId, financialStatement.getName(),
                    financialStatement.getId(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception ex) {
            LOG.error("Exception while save FinancialStatement operation", ex);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "error.message", ex.getMessage()));
        }
    }

    boolean checkIfCloseElementEditor(String elementTagName, String elementContent) {
        switch (elementTagName) {
            case SUBPARAGRAPH:
            case CONTENT:
            case SUBPOINT:
                return elementContent.contains("<" + elementTagName);
            case PARAGRAPH:
                return elementContent.contains("<paragraph") || elementContent.contains("<subparagraph");
            case LEVEL:
                return elementContent.contains("<level") || elementContent.contains("<subparagraph");
            case POINT:
            case INDENT:
                return elementContent.contains("<alinea");
            default:
                return false;
        }
    }

    @Subscribe
    void closeEditorBlock(CloseElementEditorEvent event){
        String elementId = event.getElementId();
        coEditionHelper.removeUserEditInfo(id, strDocumentVersionSeriesId, elementId, InfoType.ELEMENT_INFO);
        openElementEditors.remove(elementId);
        LOG.debug("User edit information removed");
        eventBus.post(new RefreshDocumentEvent());
        if (elementToEditAfterClose != null) {
            financialStatementScreen.scrollTo(elementToEditAfterClose.getElementId());
            eventBus.post(new EditElementRequestEvent(elementToEditAfterClose.getElementId(), elementToEditAfterClose.getElementTagName()));
        }
    }

    @Subscribe
    public void getUserGuidance(FetchUserGuidanceRequest event) {
        FinancialStatement financialStatement = financialStatementService.findFinancialStatement(documentId);
        String jsonGuidance = templateConfigurationService.getTemplateConfiguration(financialStatement.getMetadata().get().getDocTemplate(), "guidance");
        financialStatementScreen.setUserGuidance(jsonGuidance);
    }

    @Subscribe
    void mergeElement(MergeElementRequestEvent event) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        try {
            String elementId = event.getElementId();
            String tagName = event.getElementTagName();
            String elementContent = event.getElementContent();

            FinancialStatement financialStatement = getDocument();
            byte[] xmlContent = financialStatement.getContent().get().getSource().getBytes();
            Element mergeOnElement = xmlContentProcessor.getMergeOnElement(xmlContent, elementContent, tagName, elementId, true);
            if (mergeOnElement != null) {
                byte[] newXmlContent =  financialStatementProcessor.mergeElement(financialStatement, elementContent, tagName, elementId);
                financialStatement = financialStatementService.updateFinancialStatement(financialStatement, newXmlContent,
                        VersionType.MINOR, messageHelper.getMessage("operation.element.updated", StringUtils.capitalize(tagName)));
                if (financialStatement != null) {
                    elementToEditAfterClose = null;
                    eventBus.post(new CloseElementEvent());
                    eventBus.post(new RefreshDocumentEvent());
                    eventBus.post(new DocumentUpdatedEvent());
                    leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
                    LOG.info("Element '{}' merged into '{}' in FinancialStatement {} id {}, in {} milliseconds ({} sec)", elementId, mergeOnElement.getElementId(),
                            financialStatement.getName(), financialStatement.getId(), stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
                }
            } else {
                financialStatementScreen.showAlertDialog("operation.element.not.performed");
            }
        } catch (Exception e) {
            LOG.error("Unexpected error in mergeElement", e);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "unknown.error.message"));
        }
    }

    @Subscribe
    void insertNewElement(InsertElementRequestEvent event) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        String tagName = event.getElementTagName();
        FinancialStatement financialStatement = getDocument();
        byte[] updatedXmlContent = financialStatementProcessor.insertNewElement(financialStatement, event.getElementId(),
                tagName, InsertElementRequestEvent.POSITION.BEFORE.equals(event.getPosition()));

        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, updatedXmlContent,
                VersionType.MINOR, messageHelper.getMessage("operation.financial.block.inserted"));
        if (financialStatement != null) {
            eventBus.post(new RefreshDocumentEvent());
            eventBus.post(new DocumentUpdatedEvent());
            leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
            updateInternalReferencesProducer.send(new UpdateInternalReferencesMessage(financialStatement.getId(), financialStatement.getMetadata().get().getRef(), id));
        }
        LOG.info("New Element of type '{}' inserted in Financial statement {} id {}, in {} milliseconds ({} sec)", tagName,
                financialStatement.getName(), financialStatement.getId(), stopwatch.elapsed(TimeUnit.MILLISECONDS),
                stopwatch.elapsed(TimeUnit.SECONDS));
    }

    @Subscribe
    public void getUserPermissions(FetchUserPermissionsRequest event) {
        FinancialStatement financialStatement = getDocument();
        List<LeosPermission> userPermissions = securityContext.getPermissions(financialStatement);
        financialStatementScreen.sendUserPermissions(userPermissions);
        annotateService.sendUserPermissions(userPermissions);
    }

    @Subscribe
    void mergeSuggestion(MergeSuggestionRequest event) {
        FinancialStatement financialStatement = getDocument();
        commonDelegate.mergeSuggestion(financialStatement, event, elementProcessor, financialStatementService::updateFinancialStatement);
    }

    @Subscribe
    void mergeBulkSuggestions(MergeSuggestionsRequest event) {
        FinancialStatement financialStatement = getDocument();
        commonDelegate.mergeSuggestions(financialStatement, event, elementProcessor, financialStatementService::updateFinancialStatement);
    }

    @Subscribe
    public void fetchMetadata(DocumentMetadataRequest event) {
        AnnotateMetadata metadata = new AnnotateMetadata();
        FinancialStatement financialStatement = getDocument();
        metadata.setVersion(financialStatement.getVersionLabel());
        metadata.setId(financialStatement.getId());
        metadata.setTitle(financialStatement.getTitle());
        eventBus.post(new DocumentMetadataResponse(metadata));
    }

    @Subscribe
    void deleteElement(DeleteElementRequestEvent event) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            FinancialStatement financialStatement = getDocument();
            String tagName = event.getElementTagName();
            byte[] updatedXmlContent = financialStatementProcessor.deleteElement(financialStatement, event.getElementId(),
                    tagName);

            // save document into repository
            financialStatement = financialStatementService.updateFinancialStatement(financialStatement, updatedXmlContent,
                    VersionType.MINOR, messageHelper.getMessage("operation.financial.block.deleted"));
            if (financialStatement != null) {
                eventBus.post(new RefreshDocumentEvent());
                eventBus.post(new DocumentUpdatedEvent());
                leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
                updateInternalReferencesProducer.send(new UpdateInternalReferencesMessage(financialStatement.getId(),
                        financialStatement.getMetadata().get().getRef(), id));
            }
            LOG.info("Element '{}' in FinancialStatement {} id {}, deleted in {} milliseconds ({} sec)", event.getElementId(),
                    financialStatement.getName(), financialStatement.getId(), stopwatch.elapsed(TimeUnit.MILLISECONDS),
                    stopwatch.elapsed(TimeUnit.SECONDS));
        }
        catch (Exception ex){
            LOG.error("Exception while deleting element operation for ", ex);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "error.message", ex.getMessage()));
        }
    }


    @Subscribe
    public void documentUpdatedByCoEditor(DocumentUpdatedByCoEditorEvent documentUpdatedByCoEditorEvent) {
        if (isCurrentInfoId(documentUpdatedByCoEditorEvent.getDocumentId()) &&
                !id.equals(documentUpdatedByCoEditorEvent.getPresenterId())) {
            eventBus.post(new NotificationEvent(leosUI, "coedition.caption", "coedition.operation.update", NotificationEvent.Type.TRAY,
                    documentUpdatedByCoEditorEvent.getUser().getName()));
            financialStatementScreen.displayDocumentUpdatedByCoEditorWarning();
        }
    }

    private boolean isCurrentInfoId(String versionSeriesId) {
        return versionSeriesId.equals(strDocumentVersionSeriesId);
    }

    private VersionInfoVO getVersionInfo(XmlDocument document) {
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                dateFormatter.format(Date.from(document.getLastModificationInstant())),
                document.getVersionType());
    }

    private List<TableOfContentItemVO> getTableOfContent(FinancialStatement financialStatement, TocMode mode) {
        return financialStatementService.getTableOfContent(financialStatement, mode);
    }

    private DocumentVO createFinancialStatementVO(FinancialStatement financialStatement) {
        DocumentVO financialStatementVO =
                new DocumentVO(financialStatement.getId(),
                        financialStatement.getMetadata().exists(m -> m.getLanguage() != null) ? financialStatement.getMetadata().get().getLanguage() : "EN",
                        LeosCategory.STAT_FINANC_LEGIS,
                        financialStatement.getLastModifiedBy(),
                        Date.from(financialStatement.getLastModificationInstant()), financialStatement.isTrackChangesEnabled());
        financialStatementVO.setProposalRef(proposalRef);
        if (financialStatement.getMetadata().isDefined()) {
            FinancialStatementMetadata financialStatementMetadata = financialStatement.getMetadata().get();
            financialStatementVO.setTitle(financialStatementMetadata.getTitle());
            financialStatementVO.getMetadata().setInternalRef(financialStatementMetadata.getRef());
        }
        if(!financialStatement.getCollaborators().isEmpty()) {
            financialStatementVO.addCollaborators(financialStatement.getCollaborators());
        }
        return financialStatementVO;
    }

    private void populateVersionsData(FinancialStatement financialStatement) {
        DocumentVO financialStatementVO = createFinancialStatementVO(financialStatement);
        final List<VersionVO> allVersions = getVersionVOS();
        final List<ContributionVO> allContributions = contributionService.getDocumentContributions(documentRef, 0, FinancialStatement.class);
        financialStatementScreen.setDataFunctions(
                financialStatementVO,
                allVersions,
                allContributions,
                this::majorVersionsFn, this::countMajorVersionsFn,
                this::minorVersionsFn, this::countMinorVersionsFn,
                this::recentChangesFn, this::countRecentChangesFn);
    }

    private Integer countMinorVersionsFn(String currIntVersion) {
        return financialStatementService.findAllMinorsCountForIntermediate(documentRef, currIntVersion);
    }

    private List<FinancialStatement> minorVersionsFn(String currIntVersion, int startIndex, int maxResults) {
        return financialStatementService.findAllMinorsForIntermediate(documentRef, currIntVersion, startIndex, maxResults);
    }

    private Integer countMajorVersionsFn() {
        return financialStatementService.findAllMajorsCount(documentRef);
    }

    private List<FinancialStatement> majorVersionsFn(int startIndex, int maxResults) {
        return financialStatementService.findAllMajors(documentRef, startIndex, maxResults);
    }

    private Integer countRecentChangesFn() {
        return financialStatementService.findRecentMinorVersionsCount(documentId, documentRef);
    }

    private List<FinancialStatement> recentChangesFn(int startIndex, int maxResults) {
        return financialStatementService.findRecentMinorVersions(documentId, documentRef, startIndex, maxResults);
    }

    @Subscribe
    void searchTextInDocument(SearchTextRequestEvent event) {
        FinancialStatement financialStatement = (FinancialStatement) httpSession.getAttribute("financialStatement#" + getDocumentRef());
        if (financialStatement == null) {
            financialStatement = getDocument();
        }
        List<SearchMatchVO> matches = Collections.emptyList();
        try {
            matches = searchService.searchText(getContent(financialStatement), event.getSearchText(), event.matchCase, event.completeWords);
        } catch (Exception e) {
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "Error while searching{1}", e.getMessage()));
        }
        financialStatementScreen.showMatchResults(event.searchID, matches);
    }

    @Subscribe
    void replaceAllTextInDocument(ReplaceAllMatchRequestEvent event) {
        FinancialStatement financialStatement = getFinancialStatementFromSession();
        if (financialStatement == null) {
            financialStatement = getDocument();
        }
        byte[] updatedContent = searchService.replaceText(
                getContent(financialStatement),
                event.getSearchText(),
                event.getReplaceText(),
                event.getSearchMatchVOs());
        FinancialStatement financialStatementUpdated = copyIntoNew(financialStatement, updatedContent);
        httpSession.setAttribute("financialStatement#" + getDocumentRef(), financialStatementUpdated);
        financialStatementScreen.setContent(getEditableXml(financialStatementUpdated));
        eventBus.post(new ReplaceAllMatchResponseEvent(true));
    }

    private FinancialStatement copyIntoNew(FinancialStatement source, byte[] updatedContent) {
        Content contentFromSession = source.getContent().get();
        Content.Source updatedSource = new SourceImpl(new ByteArrayInputStream(updatedContent));
        Content contentObj = new ContentImpl(
                contentFromSession.getFileName(),
                contentFromSession.getMimeType(),
                updatedContent.length,
                updatedSource
        );
        Option<Content> updatedContentOptionObj = Option.option(contentObj);
        return new FinancialStatement(
                source.getId(),
                source.getName(),
                source.getCreatedBy(),
                source.getCreationInstant(),
                source.getLastModifiedBy(),
                source.getLastModificationInstant(),
                source.getVersionSeriesId(),
                source.getCmisVersionLabel(),
                source.getVersionLabel(),
                source.getVersionComment(),
                source.getVersionType(),
                source.isLatestVersion(),
                source.getTitle(),
                source.getCollaborators(),
                source.getMilestoneComments(),
                updatedContentOptionObj,
                source.getMetadata(),
                source.getBaseRevisionId(),
                source.isTrackChangesEnabled());
    }

    @Subscribe
    void saveAndCloseAfterReplace(SaveAndCloseAfterReplaceEvent event){
        // save document into repository
        FinancialStatement financialStatement = getDocument();
        FinancialStatement financialStatementFromSession = (FinancialStatement) httpSession.getAttribute("financialStatement#" + getDocumentRef());
        httpSession.removeAttribute("financialStatement#" + getDocumentRef());
        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, financialStatementFromSession.getContent().get().getSource().getBytes(),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        if (financialStatement != null) {
            eventBus.post(new RefreshDocumentEvent());
            eventBus.post(new DocumentUpdatedEvent());
            leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "document.replace.success"));
        }
    }

    @Subscribe
    void saveAfterReplace(SaveAfterReplaceEvent event){
        // save document into repository
        FinancialStatement financialStatement = getDocument();
        FinancialStatement financialStatementFromSession = (FinancialStatement) httpSession.getAttribute("financialStatement#" + getDocumentRef());
        financialStatement = financialStatementService.updateFinancialStatement(financialStatement, financialStatementFromSession.getContent().get().getSource().getBytes(),
                VersionType.MINOR, messageHelper.getMessage("operation.search.replace.updated"));
        if (financialStatement != null) {
            httpSession.setAttribute("financialStatement#"+getDocumentRef(), financialStatement);
            eventBus.post(new RefreshDocumentEvent());
            eventBus.post(new DocumentUpdatedEvent());
            leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
            eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "document.replace.success"));
        }
    }

    @Subscribe
    void replaceOneTextInDocument(ReplaceMatchRequestEvent event) {
        if (event.getSearchMatchVO().isReplaceable()) {
            FinancialStatement financialStatementFromSession = getFinancialStatementFromSession();
            if (financialStatementFromSession == null) {
                financialStatementFromSession = getDocument();
            }
            byte[] updatedContent = searchService.replaceText(
                    getContent(financialStatementFromSession),
                    event.getSearchText(),
                    event.getReplaceText(),
                    Arrays.asList(event.getSearchMatchVO()));
            FinancialStatement financialStatementUpdated = copyIntoNew(financialStatementFromSession, updatedContent);
            httpSession.setAttribute("financialStatement#" + getDocumentRef(), financialStatementUpdated);
            financialStatementScreen.setContent(getEditableXml(financialStatementUpdated));
            financialStatementScreen.refineSearch(event.getSearchId(), event.getMatchIndex(), true);
        } else {
            financialStatementScreen.refineSearch(event.getSearchId(), event.getMatchIndex(), false);
        }
    }

    @Subscribe
    void closeSearchBar(SearchBarClosedEvent event) {
        //Cleanup the session etc
        financialStatementScreen.closeSearchBar();
        httpSession.removeAttribute("financialStatement#"+getDocumentRef());
        eventBus.post(new RefreshDocumentEvent());
    }

    @Subscribe
    public void updateVersionsTab(DocumentUpdatedEvent event) {
        final List<VersionVO> allVersions = getVersionVOS();
        financialStatementScreen.refreshVersions(allVersions, comparisonMode);
        if (financialStatementScreen.isCleanVersionShowed()) {
            showCleanVersion(new ShowCleanVersionRequestEvent());
        }
        if (event.isModified()) {
            CollectionContext context = proposalContextProvider.get();
            context.useChildDocument(documentId);
            context.executeUpdateProposalAsync();
        }
    }

    @Subscribe
    void getDocumentVersionsList(VersionListRequestEvent<FinancialStatement> event) {
        List<FinancialStatement> memoVersions = financialStatementService.findVersions(documentId);
        eventBus.post(new VersionListResponseEvent(new ArrayList<>(memoVersions)));
    }

    @Subscribe
    void downloadXmlFiles(DownloadXmlFilesRequestEvent event) {
        final ExportVersions<FinancialStatement> exportVersions = event.getExportOptions().getExportVersions();
        final FinancialStatement current = exportVersions.getCurrent();
        final FinancialStatement original = exportVersions.getOriginal();
        final FinancialStatement intermediate = exportVersions.getIntermediate();
        final String leosComparedContent;
        final String docuWriteComparedContent;
        final String comparedInfo;
        String language = original.getMetadata().get().getLanguage();
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        if(intermediate != null){
            comparedInfo = messageHelper.getMessage("version.compare.double", original.getVersionLabel(), intermediate.getVersionLabel(), current.getVersionLabel());
            leosComparedContent = comparisonDelegate.doubleCompareHtmlContents(original, intermediate, current, true);
            docuWriteComparedContent = legService.doubleCompareXmlContents(original, intermediate, current, false);
        } else {
            comparedInfo = messageHelper.getMessage("version.compare.simple", original.getVersionLabel(), current.getVersionLabel());
            leosComparedContent = comparisonDelegate.getMarkedContent(original, current);
            docuWriteComparedContent = legService.simpleCompareXmlContents(original, current, true);
        }
        financialStatementScreen.setDownloadStreamResourceForXmlFiles(original, intermediate, current, language, comparedInfo, leosComparedContent, docuWriteComparedContent);
    }

    @Subscribe
    void downloadXmlVersion(DownloadXmlVersionRequestEvent event) {
        try {
            cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
            final FinancialStatement chosenDocument = financialStatementService.findFinancialStatementVersion(event.getVersionId());
            final String fileName = chosenDocument.getMetadata().get().getRef() + "_v" + chosenDocument.getVersionLabel() + ".xml";
            DownloadStreamResource downloadStreamResource = new DownloadStreamResource(fileName, new ByteArrayInputStream(chosenDocument.getContent().get().getSource().getBytes()));
            financialStatementScreen.setDownloadStreamResourceForVersion(downloadStreamResource, chosenDocument.getId());
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while downloadXmlVersion", e);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "error.message", e.getMessage()));
        }
    }

    @Subscribe
    void downloadCleanVersion(DownloadCleanVersion event) {
        Stopwatch stopwatch = Stopwatch.createStarted();
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        FinancialStatementContextService context = financialStatementContextProvider.get();
        context.usePackage(leosPackage);
        String proposalId = context.getProposalId();
        try {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2LW_CLEAN_" + System.currentTimeMillis() + ".zip";
            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, FinancialStatement.class, false, true);
            exportOptions.setExportVersions(new ExportVersions(null, getDocument()));
            exportOptions.setWithCoverPage(false);
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, user);
            eventBus.post(new NotificationEvent("document.export.package.button.send", "document.export.message",
                    NotificationEvent.Type.TRAY, exportOptions.getExportOutputDescription(), user.getEmail()));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "export.legiswrite.error.message", e.getMessage()));
        }
        LOG.info("The actual version of CLEANED FinancialStatement for proposal {}, downloaded in {} milliseconds ({} sec)", proposalId, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
    }

    @Subscribe
    void downloadActualVersion(DownloadActualVersionRequestEvent event) {
        requestFilteredAnnotationsForDownload(event.isWithFilteredAnnotations());
    }

    private void requestFilteredAnnotationsForDownload(final Boolean isWithAnnotations) {
        if (isWithAnnotations) {
            eventBus.post(new RequestFilteredAnnotations());
        } else {
            doDownloadActualVersion(false, null);
        }
    }

    @Subscribe
    void responseFilteredAnnotations(ResponseFilteredAnnotations event) {
        String filteredAnnotations = event.getAnnotations();
        doDownloadActualVersion(true, filteredAnnotations);
    }

    private void doDownloadActualVersion(Boolean isWithAnnotations, String annotations) {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            final FinancialStatement currentDocument = getDocument();
            ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, FinancialStatement.class, false);
            exportOptions.setExportVersions(new ExportVersions(isClonedProposal() ?
                    documentContentService.getOriginalFinancialStatement(currentDocument) : null, currentDocument));
            exportOptions.setWithFilteredAnnotations(isWithAnnotations);
            exportOptions.setFilteredAnnotations(annotations);
            LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
            FinancialStatementContextService context = financialStatementContextProvider.get();
            context.usePackage(leosPackage);
            String proposalId = context.getProposalId();
            if (proposalId != null) {
                try {
                    this.createDocumentPackageForExport(exportOptions);
                    eventBus.post(new NotificationEvent("document.export.package.button.send",
                            "document.export.message",
                            NotificationEvent.Type.TRAY,
                            exportOptions.getExportOutputDescription(),
                            user.getEmail()));
                } catch (Exception e) {
                    LOG.error("Unexpected error occurred while using ExportService", e);
                    eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "export.package.error.message", e.getMessage()));
                }
            }
            LOG.info("The actual version of FinancialStatement {} downloaded in {} milliseconds ({} sec)", currentDocument.getName(),
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "export.docuwrite.error.message", e.getMessage()));
        }
    }

    @Subscribe
    void exportToToolBox(ToolBoxExportRequestEvent event) {
        try {
            cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
            this.createDocumentPackageForExport(event.getExportOptions());
            eventBus.post(new NotificationEvent("document.export.package.button.send", "document.export.message",
                    NotificationEvent.Type.TRAY, event.getExportOptions().getExportOutputDescription(), user.getEmail()));
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ToolBoxExportService", e);
            eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "export.package.error.message", e.getMessage()));
        }
    }

    private void createDocumentPackageForExport(ExportOptions exportOptions) throws Exception {
        Stopwatch stopwatch = Stopwatch.createStarted();
        final String proposalId = this.getContextProposalId();

        if (proposalId != null) {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".zip";
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, user);
            LOG.info("Exported to LegisWrite and downloaded file {}, in {} milliseconds ({} sec)", jobFileName,
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
        }
    }

    private String getContextProposalId(){
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        FinancialStatementContextService context = financialStatementContextProvider.get();
        context.usePackage(leosPackage);
        return context.getProposalId();
    }

    @Subscribe
    void versionRestore(RestoreVersionRequestEvent event) {
        String versionId = event.getVersionId();
        Boolean akn4euConversionDocumentsEnabled = Boolean.valueOf(cfgHelper.getProperty("leos.akn4eu.conversion.documents.enable"));

        FinancialStatement version = financialStatementService.findFinancialStatementVersion(versionId);
        byte[] resultXmlContent = getContent(version);

        if (akn4euConversionDocumentsEnabled && documentContentService.isDeprecatedDocument(resultXmlContent, cfgHelper.getProperty(
                "akn4eu.first.version.with.intro.in.lists"), cfgHelper.getProperty(
                "leos.template.first.version.with.intro.in.lists"))) {
            ConfirmDialogHelper.showConvertEditorDialog(this.leosUI, new ShowConfirmDialogEvent(new ConvertAkn4euVersionDocument(resultXmlContent, version.getVersionLabel()),
                            null),
                    this.eventBus, messageHelper.getMessage("document.akn4eu.version.convert.title"),
                    messageHelper.getMessage("document.akn4eu.version.convert.message"),
                    messageHelper.getMessage("document.akn4eu.version.convert.confirm"));
        } else {
            doRestoreVersion(resultXmlContent, version.getVersionLabel());
        }
    }

    @Subscribe
    void doAkn4euConversion(ConvertAkn4euVersionDocument event) {
        byte[] xmlContent = documentContentService.akn4euVersionDocumentConversion(event.getXmlContent(), cfgHelper.getProperty(
                "akn4eu.first.version.with.intro.in.lists"), cfgHelper.getProperty(
                "leos.template.first.version.with.intro.in.lists"));
        NotificationEvent notificationEvent = new NotificationEvent("document.akn4eu.version.converted.caption",
                "document.akn4eu.version.converted.message",
                NotificationEvent.Type.TRAY);
        eventBus.post(notificationEvent);
        doRestoreVersion(xmlContent, event.getVersionLabel() + " - " + messageHelper.getMessage("operation.akn4eu.version.conversion"));
    }

    private void doRestoreVersion(byte[] xmlContent, String versionLabel) {
        financialStatementService.updateFinancialStatement(getDocument(), xmlContent, VersionType.MINOR, messageHelper.getMessage("operation.restore.version",
                versionLabel));

        List documentVersions = financialStatementService.findVersions(documentId);
        financialStatementScreen.updateTimeLineWindow(documentVersions);
        eventBus.post(new RefreshDocumentEvent());
        eventBus.post(new DocumentUpdatedEvent()); //Document might be updated.
        leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, strDocumentVersionSeriesId, id));
    }

    @Subscribe
    void cleanComparedContent(CleanComparedContentEvent event) {
        financialStatementScreen.cleanComparedContent();
    }

    @Subscribe
    void showVersion(ShowVersionRequestEvent event) {
        final FinancialStatement version = financialStatementService.findFinancialStatementVersion(event.getVersionId());
        final String versionContent = documentContentService.getDocumentAsHtml(version, urlBuilder.getWebAppPath(VaadinServletService.getCurrentServletRequest()),
                securityContext.getPermissions(version));
        final String versionInfo = getVersionInfoAsString(version);
        financialStatementScreen.showVersion(versionContent, versionInfo);
    }

    @Subscribe
    void showCleanVersion(ShowCleanVersionRequestEvent event) {
        final FinancialStatement financialStatement = getDocument();
        final String versionContent = documentContentService.getCleanDocumentAsHtml(financialStatement, urlBuilder.getWebAppPath(VaadinServletService.getCurrentServletRequest()),
                securityContext.getPermissions(financialStatement));
        final String versionInfo = getVersionInfoAsString(financialStatement);
        financialStatementScreen.showCleanVersion(versionContent, versionInfo);
    }

    @Subscribe
    void compare(CompareRequestEvent event) {
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        final FinancialStatement oldVersion = financialStatementService.findFinancialStatementVersion(event.getOldVersionId());
        final FinancialStatement newVersion = financialStatementService.findFinancialStatementVersion(event.getNewVersionId());
        String comparedContent = comparisonDelegate.getMarkedContent(oldVersion, newVersion);
        final String comparedInfo = messageHelper.getMessage("version.compare.simple", oldVersion.getVersionLabel(), newVersion.getVersionLabel());
        financialStatementScreen.populateComparisonContent(comparedContent, comparedInfo, oldVersion, newVersion);
    }

    private String getVersionInfoAsString(XmlDocument document) {
        final VersionInfoVO versionInfo = getVersionInfo(document);
        final String versionInfoString = messageHelper.getMessage(
                "document.version.caption",
                versionInfo.getDocumentVersion(),
                versionInfo.getLastModifiedBy(),
                versionInfo.getEntity(),
                versionInfo.getLastModificationInstant()
        );
        return versionInfoString;
    }

    @Subscribe
    public void changeComparisionMode(ComparisonEvent event) {
        comparisonMode = event.isComparsionMode();
        LayoutChangeRequestEvent layoutEvent;
        if (comparisonMode) {
            financialStatementScreen.cleanComparedContent();
            layoutEvent = new LayoutChangeRequestEvent(ColumnPosition.DEFAULT, ComparisonComponent.class, null);
            eventBus.post(layoutEvent);
        } else {
            layoutEvent = new LayoutChangeRequestEvent(ColumnPosition.OFF, ComparisonComponent.class, null);
            eventBus.post(layoutEvent);
            eventBus.post(new ResetRevisionComponentEvent());
        }
        updateVersionsTab(new DocumentUpdatedEvent(false));
    }

    @Subscribe
    public void showIntermediateVersionWindow(ShowIntermediateVersionWindowEvent event) {
        financialStatementScreen.showIntermediateVersionWindow();
    }

    @Subscribe
    public void saveIntermediateVersion(SaveIntermediateVersionEvent event) {
        FinancialStatement financialStatement = financialStatementService.createVersion(documentId, event.getVersionType(), event.getCheckinComment());
        setDocumentData(financialStatement);
        eventBus.post(new NotificationEvent(NotificationEvent.Type.INFO, "document.major.version.saved"));
        eventBus.post(new RefreshDocumentEvent());
        eventBus.post(new DocumentUpdatedEvent());
        leosApplicationEventBus.post(new DocumentUpdatedByCoEditorEvent(user, financialStatement.getVersionSeriesId(), id));
    }

    private void resetCloneProposalMetadataVO() {
        cloneContext.setCloneProposalMetadataVO(null);
    }

    private void populateCloneProposalMetadataVO(byte[] xmlContent) {
        cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlContent);
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
    }

    private boolean isClonedProposal() {
        cloneContext.setCloneProposalMetadataVO(cloneProposalMetadataVO);
        return cloneContext != null && cloneContext.isClonedProposal();
    }

    private String generateLabel(String reference, XmlDocument sourceDocument) {
        final byte[] sourceXmlContent = sourceDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(reference), sourceDocument.getMetadata().get().getRef(), sourceXmlContent);
        return updatedLabel.get();
    }

    @Subscribe
    public void checkDeleteLastEditingChildType(CheckDeleteLastEditingChildTypeEvent event) {
        FinancialStatement financialStatement = getDocument();
        byte[] xmlContent = financialStatement.getContent().get().getSource().getBytes();
        new CheckDeleteLastEditingChildTypeConsumer(xmlContent, xmlContentProcessor, messageHelper, eventBus).accept(event);
    }
}
