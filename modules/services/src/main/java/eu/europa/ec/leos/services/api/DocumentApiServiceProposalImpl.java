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
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.delegates.ComparisonDelegateAPI;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;
import eu.europa.ec.leos.services.exception.ExportException;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Instance(InstanceType.COMMISSION)
@Service
public class DocumentApiServiceProposalImpl extends DocumentApiServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(DocumentApiServiceProposalImpl.class);

    protected DocumentApiServiceProposalImpl(DocumentContentService documentContentService, PackageService packageService,
            ProposalService proposalService, ExportService exportService, LeosRepository leosRepository,
            ExportPackageService exportPackageService, NotificationService notificationService,
            SecurityContext securityContext, MessageHelper messageHelper, ComparisonDelegateAPI comparisonDelegate,
            LegService legService) {
        super(documentContentService, packageService, proposalService, exportService, leosRepository, exportPackageService, notificationService,
                securityContext, messageHelper, comparisonDelegate, legService);
    }

    @Override
    protected DownloadVersionResponse doDownloadVersion(String proposalId, ExportOptions exportOptions) {
        try {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".zip";
            exportService.createDocumentPackage(jobFileName, proposalId, exportOptions, securityContext.getUser());
            LOG.info("Sent ToolBox Document: {}", jobFileName);
            return new DownloadVersionResponse(jobFileName, new byte[0]);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
            throw new ExportException(messageHelper.getMessage("export.package.error.message"));
        }
    }

    @Override
    protected ExportOptions getExportOptions(XmlDocument original, XmlDocument currentDocument, Class<XmlDocument> clazz, boolean isWithAnnotations) {
        ExportOptions exportOptions = new ExportLW(ExportOptions.Output.PDF, clazz, isWithAnnotations);
        exportOptions.setExportVersions(new ExportVersions<>(isClonedProposal(original) ? original : null, currentDocument));
        return exportOptions;
    }

    @Override
    public DownloadVersionResponse downloadXMLComparisonFiles(LeosCategoryClass documentType, String documentRef,
            DownloadComparedVersionRequest comparedVersionRequest) throws IOException {
        Class<XmlDocument> clazz = LeosCategoryClass.valueOf(documentType.name()).getClazz();
        final XmlDocument current = getDocumentByVersion(documentRef, comparedVersionRequest.getCurrentVersion(), clazz);
        final XmlDocument original = getDocumentByVersion(documentRef, comparedVersionRequest.getOriginalVersion(), clazz);
        String language = original.getMetadata().get().getLanguage();

        String comparedInfo = messageHelper.getMessage("version.compare.simple", original.getVersionLabel(), current.getVersionLabel());
        String leosComparedContent = comparisonDelegate.getMarkedContent(original, current);
        String legisWriteComparedContent = legService.simpleCompareXmlContents(original, current, false);
        return packageComparedXmlFiles(original, current, null, leosComparedContent, legisWriteComparedContent, comparedInfo, language,
                "legisWrite");
    }

    @Override
    public LeosExportStatus exportComparedVersionAsPDF(LeosCategoryClass documentType, String documentRef, String version1, String version2) {
        return null;
    }

    @Override
    public LeosExportStatus exportComparedVersionToConsilium(LeosCategoryClass documentType, String documentRef, ExportComparedVersionRequest exportToConsiliumRequest) {
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

    private boolean isClonedProposal(XmlDocument original) {
        byte[] xmlBytes = original.getContent().get().getSource().getBytes();
        CloneProposalMetadataVO cloneProposalMetadataVO = proposalService.getClonedProposalMetadata(xmlBytes);
        return cloneProposalMetadataVO != null && cloneProposalMetadataVO.isClonedProposal();
    }

}
