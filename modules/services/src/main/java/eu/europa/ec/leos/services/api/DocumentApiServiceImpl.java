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

import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.domain.cmis.LeosExportStatus;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.PackageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class DocumentApiServiceImpl implements DocumentApiService {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentApiServiceImpl.class);

    protected final DocumentContentService documentContentService;
    protected final PackageService packageService;
    protected final ProposalService proposalService;
    protected final ExportService exportService;
    protected final ExportPackageService exportPackageService;
    protected final NotificationService notificationService;
    protected final SecurityContext securityContext;
    protected final MessageHelper messageHelper;

    protected DocumentApiServiceImpl(DocumentContentService documentContentService, PackageService packageService,
                                     ProposalService proposalService, ExportService exportService,
                                     ExportPackageService exportPackageService, NotificationService notificationService,
                                     SecurityContext securityContext, MessageHelper messageHelper) {
        this.documentContentService = documentContentService;
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.exportService = exportService;
        this.exportPackageService = exportPackageService;
        this.notificationService = notificationService;
        this.securityContext = securityContext;
        this.messageHelper = messageHelper;
    }

    @Override
    public DownloadVersionResponse downloadVersion(LeosCategoryClass documentType, String documentRef, String filteredAnnotations, boolean isWithAnnotations) {
        Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
        XmlDocument currentDocument = documentContentService.getDocumentByRef(documentRef, documentType);
        XmlDocument original = documentContentService.getOriginalDocument(currentDocument);
        String currentDocumentId = currentDocument.getId();

        ExportOptions exportOptions = getExportOptions(original, currentDocument, clazz, isWithAnnotations);
        exportOptions.setFilteredAnnotations(filteredAnnotations);
        exportOptions.setWithCoverPage(false);

        Proposal proposal = getProposal(currentDocumentId);
        String proposalId = proposal.getId();

        return doDownloadVersion(proposalId, exportOptions);
    }

    abstract protected DownloadVersionResponse doDownloadVersion(String proposalId, ExportOptions exportOptions);

    abstract protected ExportOptions getExportOptions(XmlDocument original, XmlDocument currentDocument, Class<XmlDocument> clazz, boolean isWithAnnotations);

    protected Proposal getProposal(String documentId) {
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        return proposalService.findProposalByPackagePath(leosPackage.getPath());
    }
}
