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
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.common.ConvalValidationResponse;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.i18n.LanguageHelper;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.integration.ConValidatorService;
import eu.europa.ec.leos.model.notification.validation.DocumentExternalValidationNotification;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.rest.support.model.Package;
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
import eu.europa.ec.leos.services.dto.response.LeosRenditionOutputResponse;
import eu.europa.ec.leos.services.dto.response.LeosRenditionOutputResponseList;
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
import eu.europa.ec.leos.services.structure.details.ProposalDetailsService;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.template.CustomTemplateService;
import eu.europa.ec.leos.services.template.TemplateConfigurationService;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.services.validation.ValidationService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.inject.Provider;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import static java.util.stream.Collectors.toList;
import static java.nio.charset.StandardCharsets.UTF_8;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ProposalApiServiceImpl extends ApiServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(ProposalApiServiceImpl.class);

    private ConValidatorService conValidatorService;

    public ProposalApiServiceImpl(CustomTemplateService customTemplateService, TemplateService templateService,
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
            ValidationService validationService, @Qualifier("applicationProperties") Properties applicationProperties,
            ExplanatoryService explanatoryService, ExportPackageService exportPackageService,
            NotificationService notificationService, LegService legService, UserHelper userHelper,
            LeosRepository leosRepository, TrackChangesContext trackChangesContext,
            DocumentViewService documentViewService, ConValidatorService conValidatorService,
            GenericDocumentTocApiService genericDocumentTocApiService, CoverPageApiService coverPageApiService,
            ProposalDetailsService proposalDetailsService, TemplateConfigurationService templateConfigurationService,
            LanguageHelper languageHelper, PackageRepository packageRepository,
            LanguageGroupService languageGroupService) {
        super(customTemplateService, templateService, workspaceService, userService, createCollectionService, proposalService, securityContext, authorityMap, exportService,
                collectionContextProvider, documentContentService, messageHelper, billContextProvider, packageService, billService, xmlContentProcessor,
                archiveService, annexService, cloneContext, milestoneService, proposalConverterService, postProcessingDocumentService, validationService,
                applicationProperties, explanatoryService, exportPackageService, notificationService, legService, userHelper, leosRepository, trackChangesContext,
                documentViewService, genericDocumentTocApiService, coverPageApiService, proposalDetailsService, templateConfigurationService,
                languageHelper, packageRepository, languageGroupService);
        this.conValidatorService = conValidatorService;
    }

    @Override
    public byte[] downloadProposal(String proposalRef) throws Exception {
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String jobFileName = getJobFileName(proposalRef);
        LeosFile packageFile;
        try {
            packageFile = exportService.createCollectionPackage(jobFileName, proposal.getId(), new ExportLW(ExportOptions.Output.WORD));
            return packageFile.getBytes();
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while downloading proposal - ", e.getMessage());
            throw e;
        }
    }

    @Override
    public void validateProposal(String proposalRef) throws Exception {
        LegPackage legPackage = null;
        LeosFile resultZipFile = null;
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        if (!securityContext.hasPermission(proposal, LeosPermission.CAN_VALIDATE)) {
            LOG.info("User does not have permission to perform the operation");
            throw new IllegalStateException("User does not have permission to perform the operation");
        }
        legPackage = legService.createLegPackage(proposal.getId(), new ExportLeos());
        ConvalValidationResponse validationResult = conValidatorService.validate(legPackage.getFile());

        Map<String, Object> contentToZip = new HashMap<>();
        contentToZip.put("result.xml", validationResult.getResult().getBytes(UTF_8));
        contentToZip.put(legPackage.getFile().getName(), legPackage.getFile().getBytes());
        resultZipFile = ZipPackageUtil.zipLeosFiles("validation.zip", contentToZip, "");

        notificationService.sendNotification(new DocumentExternalValidationNotification(securityContext.getUser().getEmail(),
                securityContext.getUserName(), new Date(), proposalRef, proposal.getTitle(), resultZipFile.getBytes()));
    }

    @Override
    public void validateProposals(String email, String userName) {
        List<String> packageNames = leosRepository.findPackagesForValidation();
        if (packageNames != null && !packageNames.isEmpty()) {
            packageNames.forEach(packageName -> {
                Package leosPackage = findPackageByName(packageName);
                if (leosPackage != null) {
                    LeosFile validationFile = new LeosFile();
                    try {
                        List<XmlDocument> xmlDocuments = packageRepository.findDocumentsByPackageId(leosPackage.getId(), XmlDocument.class, false, true);
                        validationFile.generateFileName("temp", ".zip");
                        Map<String, Object> contentToZip = new HashMap<>();
                        for (XmlDocument xmlDocument : xmlDocuments) {
                            contentToZip.put(xmlDocument.getName(), xmlDocument.getContent().get().getSource().getBytes());
                        }
                        validationFile.setBytes(ZipPackageUtil.convertContentToByteArray(contentToZip));
                        String proposalRef = xmlDocuments.stream().filter(xmlDocument -> xmlDocument.getCategory().name().equals("PROPOSAL")).findFirst().get().getName().replace(".xml","");
                        String proposalTitle = xmlDocuments.stream().filter(xmlDocument -> xmlDocument.getCategory().name().equals("PROPOSAL")).findFirst().get().getTitle();
                        String legFileName = proposalRef + ".leg";
                        validationFile.setName(legFileName);
                        validationFile.setOriginalFileName(legFileName);
                        ConvalValidationResponse validationResult = conValidatorService.validate(validationFile);

                        if(StringUtils.isNotEmpty(validationResult.getResult())) {
                            Map<String, Object> validationResultContent = new HashMap<>();
                            validationResultContent.put("result.xml", validationResult.getResult().getBytes(UTF_8));
                            validationResultContent.put(legFileName, validationFile.getBytes());
                            LeosFile resultZipFile = ZipPackageUtil.zipLeosFiles("validation.zip", validationResultContent, "");

                            if (!validationResult.isValid()) {
                                sendNotification(proposalTitle, proposalRef, email, userName, resultZipFile.getBytes());
                            }
                            setDocumentsValidationStatus(xmlDocuments);
                        }

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
        }
    }

    @Async("delegatingSecurityContextAsyncTaskExecutor")
    void setDocumentsValidationStatus( List<XmlDocument> xmlDocuments) {
        leosRepository.setDocumentsValidationStatus(xmlDocuments.stream().map(XmlDocument::getId).collect(toList()));
    }

    private void sendNotification(String proposalTitle, String proposalRef, String email, String userName, byte[] validationResult) {
        notificationService.sendNotification(new DocumentExternalValidationNotification(email, userName
                , new Date(), proposalRef, proposalTitle, validationResult));
    }

    @Override
    public Package findPackageByName(String packageName) {
        return leosRepository.findPackageByName(packageName);
    }

    @Override
    public LeosRenditionOutputResponseList getHtmlRenditions(byte[] document) throws IOException {
        List<LeosRenditionOutputResponse> renditionOutputResponses = new ArrayList<>();
        Map<String, Object> documentsMap = ZipPackageUtil.unzipByteArray(document);
        documentsMap.keySet().stream().forEach(documentKey -> {
            byte[] content = (byte[])documentsMap.get(documentKey);
            String tocJson = this.genericDocumentTocApiService.getTocAsJson(documentKey, content, TocMode.SIMPLIFIED);
            LeosRenditionOutputResponse renditionOutputResponse = this.genericDocumentTocApiService.addHtmlRendition(
                    documentKey, content, tocJson);
            renditionOutputResponses.add(renditionOutputResponse);
        });
        return new LeosRenditionOutputResponseList(renditionOutputResponses);
    }
}
