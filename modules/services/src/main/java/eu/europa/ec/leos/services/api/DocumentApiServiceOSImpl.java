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
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.exception.ExportException;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.ElementProcessor;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Instance(InstanceType.OS)
@Service
public class DocumentApiServiceOSImpl extends DocumentApiServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentApiServiceOSImpl.class);


    protected DocumentApiServiceOSImpl(DocumentContentService documentContentService, PackageService packageService,
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
    public DownloadVersionResponse downloadXMLComparisonFiles(LeosCategoryClass documentType, String documentRef,
                                                              DownloadComparedVersionRequest comparedVersionRequest) throws IOException {
        try {
            Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
            final XmlDocument current = getDocumentByVersion(documentRef, comparedVersionRequest.getCurrentVersion(), clazz);
            final XmlDocument original = getDocumentByVersion(documentRef, comparedVersionRequest.getOriginalVersion(), clazz);
            String language = original.getMetadata().get().getLanguage();

            String comparedInfo = messageHelper.getMessage("version.compare.simple", original.getVersionLabel(), current.getVersionLabel());
            String leosComparedContent = comparisonDelegate.getMarkedContent(original, current);
            return packageComparedXmlFiles(original, current, null, leosComparedContent, null, comparedInfo, language,
                    null);
        } catch(Exception ex) {
            LOG.error("Error occurred while requesting download of xml comparison files", ex);
            throw new IOException("Unexpected error occurred please make sure the compared versions provided are valid " + ex);
        }
    }

    @Override
    public LeosExportStatus exportComparedVersionAsPDF(LeosCategoryClass documentType, String documentRef, DownloadComparedVersionRequest downloadComparedVersionRequest) {
        throw new ExportException("External system to export documents not available for this instance");
    }

    @Override
    public DownloadVersionResponse downloadComparedVersionAsDocuwrite(LeosCategoryClass documentType, String documentRef, DownloadComparedVersionRequest downloadComparedVersionRequest) {
        throw new ExportException("External system to download documents not available for this instance");
    }

    @Override
    public LeosExportStatus exportToConsilium(LeosCategoryClass documentType, String documentRef, ExportToConsiliumRequest exportToConsiliumRequest) {
        throw new ExportException("External system to export documents not available for this instance");
    }

    @Override
    protected DownloadVersionResponse doDownloadVersion(String proposalId, ExportOptions exportOptions) {
        throw new ExportException("External system to export documents not available for this instance");
    }
}
