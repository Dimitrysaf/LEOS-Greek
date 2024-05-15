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

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.integration.ConValidatorService;
import eu.europa.ec.leos.model.notification.validation.DocumentExternalValidationNotification;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMap;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.CollectionContextService;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.PostProcessingDocumentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportLeos;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportService;
import eu.europa.ec.leos.services.export.LegPackage;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.milestone.MilestoneService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.ArchiveService;
import eu.europa.ec.leos.services.store.ExportPackageService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.validation.ValidationService;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ProposalApiServiceImpl extends ApiServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(ProposalApiServiceImpl.class);

    private ConValidatorService conValidatorService;

    public ProposalApiServiceImpl(TemplateService templateService,
            WorkspaceService workspaceService,
            UserService userService, CreateCollectionService createCollectionService,
            ProposalService proposalService, SecurityContext securityContext,
            LeosPermissionAuthorityMap authorityMap, ExportService exportService,
            Provider<CollectionContextService> collectionContextProvider,
            DocumentContentService documentContentService, MessageHelper messageHelper,
            Provider<BillContextService> billContextProvider, PackageService packageService,
            BillService billService, XmlContentProcessor xmlContentProcessor,
            ArchiveService archiveService, AnnexService annexService,
            CloneContext cloneContext, MilestoneService milestoneService,
            ProposalConverterService proposalConverterService,
            PostProcessingDocumentService postProcessingDocumentService,
            ValidationService validationService, Properties applicationProperties,
            ExplanatoryService explanatoryService, ExportPackageService exportPackageService,
            NotificationService notificationService, LegService legService, UserHelper userHelper,
            LeosRepository leosRepository, TrackChangesContext trackChangesContext,
            DocumentViewService documentViewService, ConValidatorService conValidatorService) {
        super(templateService, workspaceService, userService, createCollectionService, proposalService, securityContext, authorityMap, exportService,
                collectionContextProvider, documentContentService, messageHelper, billContextProvider, packageService, billService, xmlContentProcessor,
                archiveService, annexService, cloneContext, milestoneService, proposalConverterService, postProcessingDocumentService, validationService,
                applicationProperties, explanatoryService, exportPackageService, notificationService, legService, userHelper, leosRepository, trackChangesContext,
                documentViewService);
        this.conValidatorService = conValidatorService;
    }

    @Override
    public byte[] downloadProposal(String proposalRef) throws Exception {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String jobFileName = getJobFileName(proposalRef);
        File packageFile;
        try {
            packageFile = exportService.createCollectionPackage(jobFileName, proposal.getId(), new ExportLW(ExportOptions.Output.WORD));
            return FileUtils.readFileToByteArray(packageFile);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while downloading proposal - ", e.getMessage());
            throw e;
        }
    }

    @Override
    public void validateProposal(String proposalRef) throws Exception {
        LegPackage legPackage = null;
        File resultZipFile = null;

        try {
            Proposal proposal = proposalService.findProposalByRef(proposalRef);
            if (!securityContext.hasPermission(proposal, LeosPermission.CAN_VALIDATE)) {
                LOG.info("User does not have permission to perform the operation");
                throw new IllegalStateException("User does not have permission to perform the operation");
            }
            legPackage = legService.createLegPackage(proposal.getId(), new ExportLeos());
            String validationResult = conValidatorService.validate(legPackage.getFile());

            Map<String, Object> contentToZip = new HashMap<>();
            contentToZip.put("result.xml", validationResult);
            contentToZip.put(legPackage.getFile().getName(), legPackage.getFile());
            resultZipFile = ZipPackageUtil.zipFiles("validation.zip", contentToZip, "");

            notificationService.sendNotification(new DocumentExternalValidationNotification(securityContext.getUser().getEmail(),
                    securityContext.getUserName(), new Date(), proposalRef, FileUtils.readFileToByteArray(resultZipFile)));
        } finally {
            if ((legPackage != null) && (legPackage.getFile() != null) && legPackage.getFile().exists() &&
                    !legPackage.getFile().delete()) {
                LOG.info("File not deleted {}", legPackage.getFile().toPath());
            }
            if ((resultZipFile != null) && resultZipFile.exists() && !resultZipFile.delete()) {
                LOG.info("File not deleted {}", resultZipFile.toPath());
            }
        }
    }

}
