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

package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.dto.response.FetchElementResponse;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.util.LeosDomainUtil.CMIS_PROPERTY_SPLITTER;
import static eu.europa.ec.leos.util.LeosDomainUtil.wrapXmlFragment;

public abstract class DocumentApiServiceImpl implements DocumentApiService {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentApiServiceImpl.class);

    protected final DocumentContentService documentContentService;
    protected final PackageService packageService;
    protected final ProposalService proposalService;
    protected final ExportService exportService;
    protected final LeosRepository leosRepository;
    protected final ExportPackageService exportPackageService;
    protected final NotificationService notificationService;
    protected final SecurityContext securityContext;
    protected final MessageHelper messageHelper;
    protected final ComparisonDelegateAPI comparisonDelegate;
    protected final LegService legService;
    protected final ReferenceLabelService referenceLabelService;
    protected final WorkspaceService workspaceService;
    protected final ElementProcessor elementProcessor;
    protected final TransformationService transformationService;
    protected final RepositoryPropertiesMapper repositoryPropertiesMapper;
    protected final DocumentViewService<XmlDocument> documentViewService;
    protected final BillService billService;
    protected final AnnexService annexService;

    protected DocumentApiServiceImpl(DocumentContentService documentContentService, PackageService packageService,
                                     ProposalService proposalService, ExportService exportService, LeosRepository leosRepository,
                                     ExportPackageService exportPackageService, NotificationService notificationService,
                                     SecurityContext securityContext, MessageHelper messageHelper, ComparisonDelegateAPI comparisonDelegate,
                                     LegService legService, ReferenceLabelService referenceLabelService, WorkspaceService workspaceService,
                                     ElementProcessor elementProcessor, TransformationService transformationService,
            RepositoryPropertiesMapper repositoryPropertiesMapper, DocumentViewService<XmlDocument> documentViewService,
            BillService billService, AnnexService annexService) {
        this.documentContentService = documentContentService;
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.exportService = exportService;
        this.leosRepository = leosRepository;
        this.exportPackageService = exportPackageService;
        this.notificationService = notificationService;
        this.securityContext = securityContext;
        this.messageHelper = messageHelper;
        this.comparisonDelegate = comparisonDelegate;
        this.legService = legService;
        this.referenceLabelService = referenceLabelService;
        this.workspaceService = workspaceService;
        this.elementProcessor = elementProcessor;
        this.transformationService = transformationService;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
        this.documentViewService = documentViewService;
        this.billService = billService;
        this.annexService = annexService;
    }


    @Override
    public String doubleCompare(LeosCategoryClass documentType, String documentRef, String originalProposalId, String intermediateMajorId, String currentId) {

        Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
        final XmlDocument original = this.getDocumentByVersion(documentRef, originalProposalId, clazz);
        final XmlDocument intermediate = this.getDocumentByVersion(documentRef, intermediateMajorId, clazz);
        final XmlDocument current = this.getDocumentByVersion(documentRef, currentId, clazz);
        return comparisonDelegate.doubleCompareHtmlContents(original, intermediate, current, true);
    }

    @Override
    public DownloadVersionResponse downloadVersion(LeosCategoryClass documentType, String documentRef, String filteredAnnotations, boolean isWithAnnotations) {
        Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
        XmlDocument currentDocument = documentContentService.getDocumentByRef(documentRef, documentType);
        XmlDocument original = documentContentService.getOriginalDocument(currentDocument);

        ExportOptions exportOptions = getExportOptions(original, currentDocument, clazz, isWithAnnotations);
        exportOptions.setFilteredAnnotations(filteredAnnotations);
        exportOptions.setWithCoverPage(false);

        Proposal proposal = getProposal(currentDocument.getMetadata().get().getRef());
        String proposalId = proposal.getId();

        return doDownloadVersion(proposalId, exportOptions);
    }

    protected abstract DownloadVersionResponse doDownloadVersion(String proposalId, ExportOptions exportOptions);

    protected abstract ExportOptions getExportOptions(XmlDocument original, XmlDocument currentDocument, Class<XmlDocument> clazz, boolean isWithAnnotations);

    protected Proposal getProposal(String documentRef) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(documentRef, Proposal.class);
        return proposalService.findProposalByPackagePath(leosPackage.getPath());
    }

    protected <T extends LeosDocument> T getDocumentByVersion(String docRef, String versionLabel, Class<T> type) {
        return leosRepository.findDocumentByVersion(type, docRef, versionLabel);
    }

    protected DownloadVersionResponse packageComparedXmlFiles(XmlDocument original, XmlDocument current, XmlDocument intermediate, String leosComparedContent,
                                                              String exportComparedContent, String comparedInfo, String language, String type) throws IOException {
        File zipFile = null;
        try {
            final Map<String, Object> contentToZip = new HashMap<>();
            if (intermediate != null) {
                contentToZip.put(intermediate.getMetadata().get().getRef() + "_v" + intermediate.getVersionLabel() + ".xml",
                        intermediate.getContent().get().getSource().getBytes());
            }
            contentToZip.put(current.getMetadata().get().getRef() + "_v" + current.getVersionLabel() + ".xml", current.getContent().get().getSource().getBytes());
            contentToZip.put(original.getMetadata().get().getRef() + "_v" + original.getVersionLabel() + ".xml", original.getContent().get().getSource().getBytes());
            contentToZip.put("comparedContent_leos.xml", leosComparedContent);
            if (exportComparedContent != null) {
                contentToZip.put("comparedContent_" + type + ".xml", exportComparedContent);
            }
            final String zipFileName = original.getMetadata().get().getRef().concat("-").concat(comparedInfo).
                    concat(original.getMetadata().get().getLanguage().toLowerCase()).concat(".zip");
            zipFile = ZipPackageUtil.zipFiles(zipFileName, contentToZip, language);
            final byte[] zipBytes = FileUtils.readFileToByteArray(zipFile);
            return new DownloadVersionResponse(zipFileName, zipBytes);
        } catch (Exception e) {
            throw new IOException("Unexpected error occurred while packaging compared xml files", e);
        } finally {
            if (zipFile != null && !Files.deleteIfExists(zipFile.toPath())) {
                LOG.info("File was not deleted {}", zipFile.toPath());
            }
        }
    }

    @Override
    public String fetchReferenceLabel(String documentRef, List<String> references, String currentElementID, boolean capital) {
        XmlDocument currentDocument = workspaceService.findDocumentByRef(documentRef, XmlDocument.class);
        final byte[] sourceXmlContent = currentDocument.getContent().get().getSource().getBytes();
        Result<String> updatedLabel = referenceLabelService.generateLabelStringRef(references, documentRef, currentElementID, sourceXmlContent, documentRef, capital);

        return updatedLabel.get();
    }

    @Override
    public FetchElementResponse fetchElement(String elementId, String elementTagName, String documentRef) {
        XmlDocument document = workspaceService.findDocumentByRef(documentRef, XmlDocument.class);
        String contentForType = elementProcessor.getElement(document, elementTagName, elementId);
        String wrappedContentXml = wrapXmlFragment(contentForType != null ? contentForType : "");
        InputStream contentStream = new ByteArrayInputStream(wrappedContentXml.getBytes(StandardCharsets.UTF_8));
        contentForType = transformationService.toXmlFragmentWrapper(contentStream, "",
                securityContext.getPermissions(document));

        return new FetchElementResponse(elementId, elementTagName, contentForType, documentRef);
    }

    @Override
    public DocumentViewResponse changeBaseVersion(String documentRef, LeosCategory documentType, String documentId, String versionLabel, String versionComment) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.BASE_REVISION_ID),
                documentId + CMIS_PROPERTY_SPLITTER + versionLabel + CMIS_PROPERTY_SPLITTER + versionComment);
        XmlDocument updatedDocument = null;
        switch(documentType) {
            case BILL:
                updatedDocument = billService.updateBill(documentRef, documentId, properties, true);
                break;
            case ANNEX:
                updatedDocument = annexService.updateAnnex(documentRef, documentId, properties, true);
                break;
        }

        return this.documentViewService.updateDocumentView(updatedDocument);
    }

}
