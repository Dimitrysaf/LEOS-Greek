/*
 * Copyright 2023 European Commission
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

package eu.europa.ec.leos.services.api;

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.CheckinCommentVO;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.document.util.CheckinCommentUtil;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.exception.ExportException;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.FileHelper;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Instance(InstanceType.COUNCIL)
@Service
public class DocumentApiServiceMandateImpl extends DocumentApiServiceImpl {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentApiServiceMandateImpl.class);
    private static final String PROPOSAL = "Proposal_";
    private static final String AKN_2_DW = "_AKN2DW_";
    private static final String DOCX = ".docx";

    public DocumentApiServiceMandateImpl(DocumentContentService documentContentService, PackageService packageService,
                                         ProposalService proposalService, ExportService exportService, LeosRepository leosRepository,
                                         ExportPackageService exportPackageService, NotificationService notificationService,
                                         SecurityContext securityContext, MessageHelper messageHelper, ComparisonDelegateAPI comparisonDelegate,
                                         LegService legService, ReferenceLabelService referenceLabelService, WorkspaceService workspaceService, ElementProcessor elementProcessor, TransformationService transformationService) {
        super(documentContentService, packageService, proposalService, exportService, leosRepository, exportPackageService, notificationService,
                securityContext, messageHelper, comparisonDelegate, legService, referenceLabelService, workspaceService, elementProcessor, transformationService);
    }

    @Override
    protected ExportOptions getExportOptions(XmlDocument original, XmlDocument currentDocument, Class<XmlDocument> clazz, boolean isWithAnnotations) {
        ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, clazz, isWithAnnotations);
        exportOptions.setExportVersions(new ExportVersions<>(original, currentDocument));
        return exportOptions;
    }

    @Override
    protected DownloadVersionResponse doDownloadVersion(String proposalId, ExportOptions exportOptions) {
        try {
            final String jobFileName = PROPOSAL + proposalId + AKN_2_DW + System.currentTimeMillis() + DOCX;
            byte[] exportedBytes = exportService.createDocuWritePackage(FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            LOG.info("Downloaded DocuWrite Document: {}", jobFileName);
            return new DownloadVersionResponse(jobFileName, exportedBytes);
        } catch (Exception e) {
            throw new ExportException(messageHelper.getMessage("export.docuwrite.error.message", e.getMessage()));
        }
    }

    @Override
    public DownloadVersionResponse downloadXMLComparisonFiles(LeosCategoryClass documentType, String documentRef,
                                                              DownloadComparedVersionRequest comparedVersionRequest) throws IOException {
        try {
            Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
            final XmlDocument current = getDocumentByVersion(documentRef, comparedVersionRequest.getCurrentVersion(), clazz);
            final XmlDocument original = getDocumentByVersion(documentRef, comparedVersionRequest.getOriginalVersion(), clazz);
            XmlDocument intermediate = null;
            String comparedInfo;
            String leosComparedContent;
            String docuWriteComparedContent;

            if (comparedVersionRequest.getIntermediateVersion() != null) {
                intermediate = getDocumentByVersion(documentRef, comparedVersionRequest.getIntermediateVersion(), clazz);
            }
            String language = original.getMetadata().get().getLanguage();

            if (intermediate != null) {
                comparedInfo = messageHelper.getMessage("version.compare.double", original.getVersionLabel(), intermediate.getVersionLabel(),
                        current.getVersionLabel());
                leosComparedContent = comparisonDelegate.doubleCompareHtmlContents(original, intermediate, current, true);
                docuWriteComparedContent = legService.doubleCompareXmlContents(original, intermediate, current, true);
            } else {
                comparedInfo = messageHelper.getMessage("version.compare.simple", original.getVersionLabel(), current.getVersionLabel());
                leosComparedContent = comparisonDelegate.getMarkedContent(original, current);
                docuWriteComparedContent = legService.simpleCompareXmlContents(original, current, true);
            }
            return packageComparedXmlFiles(original, current, intermediate, leosComparedContent, docuWriteComparedContent, comparedInfo, language,
                    "docuWrite");
        } catch(Exception ex) {
            LOG.error("Error occurred while requesting download of xml comparison files", ex);
            throw new IOException("Unexpected error occurred please make sure the compared versions provided are valid ", ex);
        }
    }

    @Override
    public LeosExportStatus exportComparedVersionAsPDF(LeosCategoryClass documentType, String documentRef, DownloadComparedVersionRequest downloadComparedVersionRequest) {
        throw new ExportException("External system to export documents not available for this instance");
    }

    @Override
    public DownloadVersionResponse downloadComparedVersionAsDocuwrite(LeosCategoryClass documentType, String documentRef,
                                                                      DownloadComparedVersionRequest downloadComparedVersionRequest) throws Exception {
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
            ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, clazz, false);
            exportOptions.setDocuwrite(true);
            ExportVersions exportVersions = getExportVersions(clazz, documentRef, downloadComparedVersionRequest);
            exportOptions.setExportVersions(exportVersions);

            XmlDocument currentDocument = documentContentService.getDocumentByRef(documentRef, documentType);
            final Proposal proposal = getProposal(currentDocument.getId());
            if (proposal != null) {
                final String jobFileName = PROPOSAL + proposal.getId() + AKN_2_DW + System.currentTimeMillis() + DOCX;
                final byte[] exportedBytes = exportService.createDocuWritePackage(FileHelper.getReplacedExtensionFilename(jobFileName, "zip"),
                        proposal.getId(), exportOptions);

                LOG.info("Exported to DocuWrite and downloaded file {}, in {} milliseconds ({} sec)", jobFileName,
                        stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
                return new DownloadVersionResponse(jobFileName, exportedBytes);
            }
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using DocuWriteExportService", e);
            throw new ExportException("Unexpected error occurred while using DocuWriteExportService", e);
        }
        return null;
    }

    private ExportVersions getExportVersions(Class<XmlDocument> clazz, String documentRef,
                                             DownloadComparedVersionRequest comparedVersionRequest) {
        final XmlDocument original = getDocumentByVersion(documentRef, comparedVersionRequest.getOriginalVersion(), clazz);
        final XmlDocument current = getDocumentByVersion(documentRef, comparedVersionRequest.getCurrentVersion(), clazz);
        XmlDocument intermediate = null;
        if (comparedVersionRequest.getIntermediateVersion() != null) {
            intermediate = getDocumentByVersion(documentRef, comparedVersionRequest.getIntermediateVersion(), clazz);
        }
        return new ExportVersions(original, intermediate, current);
    }

    @Override
    public LeosExportStatus exportToConsilium(LeosCategoryClass documentType, String documentRef, ExportToConsiliumRequest exportToConsiliumRequest) {
        Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
        XmlDocument currentDocument = documentContentService.getDocumentByRef(documentRef, documentType);
        ExportVersions exportVersions = getExportVersionsForEconsilium(documentRef, documentType, clazz, exportToConsiliumRequest);
        ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, clazz, exportToConsiliumRequest.isWithAnnotations());
        exportOptions.setExportVersions(exportVersions);
        exportOptions.setRelevantElements(exportToConsiliumRequest.getRelevantElements());
        exportOptions.setWithFilteredAnnotations(exportToConsiliumRequest.isWithAnnotations());
        exportOptions.setFilteredAnnotations(exportToConsiliumRequest.getAnnotations());

        return doExportPackage(exportToConsiliumRequest.getTitle(), exportToConsiliumRequest.isCleanVersion(), exportOptions, currentDocument, documentType);
    }

    private ExportVersions getExportVersionsForEconsilium(String documentRef, LeosCategoryClass documentType, Class<XmlDocument> clazz,
                                                          ExportToConsiliumRequest exportToConsiliumRequest) {
        XmlDocument current;
        XmlDocument original;
        XmlDocument intermediate;

        if (exportToConsiliumRequest.getOriginalVersion() == null && exportToConsiliumRequest.getCurrentVersion() == null) {
            current = documentContentService.getDocumentByRef(documentRef, documentType);
            original = documentContentService.getOriginalDocument(current);
            return new ExportVersions(original, current);
        }
        original = getDocumentByVersion(documentRef, exportToConsiliumRequest.getOriginalVersion(), clazz);
        current = getDocumentByVersion(documentRef, exportToConsiliumRequest.getCurrentVersion(), clazz);
        if (exportToConsiliumRequest.getIntermediateVersion() != null) {
            intermediate = getDocumentByVersion(documentRef, exportToConsiliumRequest.getIntermediateVersion(), clazz);
            return new ExportVersions(original, current, intermediate);
        }
        return new ExportVersions(original, current);
    }

    private LeosExportStatus doExportPackage(final String title, final Boolean isExportCleanVersion, ExportOptions exportOptions, XmlDocument currentDocument, LeosCategoryClass documentType) {
        Proposal proposal = getProposal(currentDocument.getId());
        String proposalId = proposal.getId();
        String proposalRef = proposal.getMetadata().get().getRef();
        final String jobFileName = Boolean.TRUE.equals(isExportCleanVersion) ? PROPOSAL + proposalId + "_AKN2DW_CLEAN_" + System.currentTimeMillis() + DOCX
                : PROPOSAL + proposalId + AKN_2_DW + System.currentTimeMillis() + DOCX;

        ExportDocument exportDocument = null;
        LeosExportStatus processedStatus = LeosExportStatus.PROCESSED_ERROR;
        if (exportOptions.isWithFilteredAnnotations()) {
            exportOptions.setFilteredAnnotations(exportOptions.getFilteredAnnotations());
        }
        try {
            Stopwatch stopwatch = Stopwatch.createStarted();
            exportOptions.setComments(getCommentsForExportPackage(title, exportOptions, documentType, currentDocument));

            byte[] exportedBytes = exportService.createExportPackage(FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            exportDocument = exportPackageService.createExportDocument(proposalId, exportOptions.getComments(), exportedBytes);
            exportPackageService.updateExportDocument(exportDocument.getId(), LeosExportStatus.NOTIFIED);
            notificationService.sendNotification(proposalRef, exportDocument.getId());
            processedStatus = LeosExportStatus.PROCESSED_OK;
            LOG.info("Export Package {} for proposal {} created in {} milliseconds ({} sec)", exportDocument.getName(), proposalRef,
                    stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
            return processedStatus;
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
            throw new ExportException(messageHelper.getMessage("export.package.error.message", e.getMessage()));
        } finally {
            if ((exportDocument != null)){
                exportDocument = exportPackageService.findExportDocumentById(exportDocument.getId(), true);
            }
            if ((exportDocument != null) && (!exportDocument.getStatus().equals(LeosExportStatus.FILE_READY))) {
                exportDocument = exportPackageService.updateExportDocument(exportDocument.getId(), processedStatus);
                //TO DO: Send notification to the client
            }
        }
    }

    private List<String> getCommentsForExportPackage(String title, ExportOptions exportOptions, LeosCategoryClass documentType, XmlDocument currentDocument) {
        List<String> comments = new ArrayList<>();
        comments.add(title);
        if(LeosCategoryClass.ANNEX.equals(documentType) && currentDocument instanceof Annex) {
            AnnexMetadata metadata = ((Annex) currentDocument).getMetadata().get();
            String annexTitleNumber = StringUtils.EMPTY;
            if(StringUtils.isNotBlank(metadata.getNumber())) {
                annexTitleNumber = StringUtils.substringAfter(metadata.getNumber(), " ");
            }
            comments.add(messageHelper.getMessage("document.export.package.creation.comment.annex", annexTitleNumber));
        } else if (LeosCategoryClass.COUNCIL_EXPLANATORY.equals(documentType) && currentDocument instanceof Explanatory) {
            String commentCE = messageHelper.getMessage("document.export.package.creation.comment.explanatory");
            if(StringUtils.isNotBlank(currentDocument.getTitle()) && currentDocument.getTitle().equals(commentCE)) {
                comments.add(commentCE);
            } else {
                comments.add(commentCE + " - " + currentDocument.getTitle());
            }
        } else {
            comments.add(messageHelper.getMessage("document.export.package.creation.comment.legal.act"));
        }
        StringBuilder versionsComment = new StringBuilder();
        versionsComment.append(exportOptions.getExportVersions().getOriginal() != null ? getCommentForVersion(exportOptions.getExportVersions().getOriginal()) : "");
        versionsComment.append(exportOptions.getExportVersions().getIntermediate() != null ? " vs " + getCommentForVersion(exportOptions.getExportVersions().getIntermediate()) : "");
        versionsComment.append(exportOptions.getExportVersions().getCurrent() != null ? " vs " + getCommentForVersion(exportOptions.getExportVersions().getCurrent()) : "");
        comments.add(versionsComment.toString());
        return comments;
    }

    private String getCommentForVersion(XmlDocument document) {
        StringBuilder versionsComment = new StringBuilder(document.getVersionLabel());
        if (document.getVersionType().equals(VersionType.INTERMEDIATE) && document.getVersionComment() != null) {
            final CheckinCommentVO checkinCommentVO = CheckinCommentUtil.getJavaObjectFromJson(document.getVersionComment());
            versionsComment.append(" (").append(checkinCommentVO.getTitle()).append(") ");
        }
        return versionsComment.toString();
    }

}
