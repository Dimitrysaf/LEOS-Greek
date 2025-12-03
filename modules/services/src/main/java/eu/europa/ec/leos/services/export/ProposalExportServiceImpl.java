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
package eu.europa.ec.leos.services.export;

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.integration.AKN4EUService;
import eu.europa.ec.leos.integration.ToolBoxService;
import eu.europa.ec.leos.model.notification.pdfGeneration.PDFGenerationNotification;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.store.WorkspaceRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.exception.XmlValidationException;
import eu.europa.ec.leos.services.leoslight.service.LeosLightXmlDocumentService;
import eu.europa.ec.leos.services.notification.NotificationService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.StructureContext;
import io.atlassian.fugue.Pair;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ProposalExportServiceImpl extends ExportServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(ProposalExportServiceImpl.class);
    private static final String FILE_NOT_DELETED = "File not deleted {}";

    protected final AKN4EUService akn4euService;

    @Value("#{integrationProperties['leos.toolBox.converter.jobResultPullingThresholdInSeconds'] ?: 10}")
    protected int jobResultPullingThresholdInSeconds;
    @Value("#{integrationProperties['leos.toolBox.converter.jobResultMaxTries'] ?: 50}")
    protected int jobResultMaxTries;
    @Value("#{integrationProperties['pdf.generation.notification.functional.mailbox'] ?: ''}")
    private String pdfGenerationFunctionalMailBox;

    private NotificationService notificationService;
    protected final static String ZIP_PACKAGE_NAME = "AkomaNtoso2LegisWrite";
    protected CloneContext cloneContext;
    protected WorkspaceRepository workspaceRepository;
    private LeosLightXmlDocumentService leosLightXmlDocumentService;
    @Autowired
    ProposalExportServiceImpl(LegService legService, PackageService packageService, Optional<ToolBoxService> toolBoxServiceO,
                              SecurityContext securityContext, ExportHelper exportHelper, BillService billService,
                              AnnexService annexService, TransformationService transformationService, NotificationService notificationService,
                              AKN4EUService akn4euService, CloneContext cloneContext, WorkspaceRepository workspaceRepository,
                              LeosLightXmlDocumentService leosLightXmlDocumentService, Provider<StructureContext> structureContextProvider) {
        super(legService, packageService, securityContext, exportHelper, billService, annexService, transformationService, structureContextProvider);
        toolBoxServiceO.ifPresent(service -> this.toolBoxService = service);
        this.notificationService = notificationService;
        this.akn4euService = akn4euService;
        this.cloneContext = cloneContext;
        this.workspaceRepository = workspaceRepository;
        this.leosLightXmlDocumentService = leosLightXmlDocumentService;
    }

    /**
     * Asks to Toolbox the generation of PDF/LegisWrite for the given proposalId and return the jobId.
     * The result will be sent to the email of the logged user.
     *
     * @param proposalId    Proposal for which we need to generate the PDF/LegisWrite
     * @param exportOptions
     * @return jobId assigned from Toolbox for this generation.
     */
    @Override
    public String exportToToolboxCoDe(String proposalId, ExportOptions exportOptions) throws Exception {
        Validate.notNull(toolBoxService, "Export Service is not available!!");
        LeosFile legisWritePackage = null;
        String jobId;
        try {
            legisWritePackage = createCollectionPackage("job.zip", proposalId, exportOptions);
            String destinationEmail = securityContext.getUser().getEmail();
            Map<String, LeosFile> packages = new HashMap<>();
            packages.put(exportOptions.getFilePrefix() + ZIP_PACKAGE_NAME, legisWritePackage);
            jobId = toolBoxService.createJobWithEmail(proposalId, packages, destinationEmail);
        } catch (Exception ex) {
            LOG.error("Unexpected error occurred in method exportToToolboxCoDe() for proposal id {} with error {}", proposalId, ex.getMessage());
            throw ex;
        }
        return jobId;
    }

    /**
     * Asks to Toolbox the generation of PDF/LegisWrite for the given proposalId and return the byte[].
     * The method first send the request to Toolbox then, with the jobId assigned, keep pulling the reply until
     * it get the answer or until the maximum numbers of tries exceed.
     *
     * @param proposalId    Proposal for which we need to generate the PDF/LegisWrite
     * @param exportOptions
     * @return New zip/leg file returned from Toolbox containing the generated PDF/LegisWrite files
     */
    @Override
    public byte[] exportToToolboxCoDeDownload(String proposalId, ExportOptions exportOptions) throws Exception {
        Validate.notNull(toolBoxService, "Export Service is not available!!");
        LeosFile legisWritePackage = null;
        String jobId;
        try {
            legisWritePackage = createCollectionPackage("job.zip", proposalId, exportOptions);
            Map<String, LeosFile> packages = new HashMap<>();
            packages.put(exportOptions.getFilePrefix() + ZIP_PACKAGE_NAME, legisWritePackage);
            jobId = toolBoxService.createJob(packages);
            return checkForReply(jobId, exportOptions.getExportOutput(), legisWritePackage.getName());
        } catch (Exception ex) {
            LOG.error("Unexpected error occurred in method exportToToolboxCoDeDownload(): {}", ex.getMessage());
            throw ex;
        }
    }

    /**
     * Asks to Toolbox the generation of PDF/LegisWrite for the legFile passed as parameter.
     * The method first send the request to Toolbox then, with the jobId assigned, keep pulling the reply until
     * it get the answer or until the maximum numbers of tries exceed.
     *
     * @param legFile       Leg file for which we need to generate the PDF/LegisWrite.
     *                      It contains a full structure of a proposal (main.xml, bill, annexes, media, renditions, etc).
     * @param exportOptions
     * @return New zip/leg file returned from Toolbox containing the generated PDF/LegisWrite files
     */
    @Override
    public byte[] exportToToolboxCoDe(LeosFile legFile, ExportOptions exportOptions) throws Exception {
        LOG.debug("Calling Toolbox to convert leg file {} to {}", legFile.getName(), exportOptions.getExportOutput().name());
        LeosFile legisWritePackage = null;
        String jobId;
        try {
            legisWritePackage = createExportPackage("job.zip", legFile, exportOptions);

            Map<String, LeosFile> packages = new HashMap<>();
            packages.put(exportOptions.getFilePrefix() + ZIP_PACKAGE_NAME, legisWritePackage);
            jobId = toolBoxService.createJob(packages);
            LOG.debug("Rendition request with jobId '{}' correctly sent to Toolbox for legFile '{}'. JobFile sent to Toolbox '{}'. Waiting the reply...", jobId,
                    legFile.getName(), legisWritePackage.getName());

            return checkForReply(jobId, exportOptions.getExportOutput(), legFile.getName());
        } catch (Exception ex) {
            LOG.error("Unexpected error occurred in method exportToToolboxCoDe(): {}", ex.getMessage());
            throw ex;
        }
    }

    /**
     * Asks to Toolbox the generation of PDF and LegisWrite for the given proposalId and return the jobId.
     * The reply from Toolbox will be received in the callback.
     *
     * @param proposalId Proposal for which we need to generate the PDF/LegisWrite
     * @param legPackage Leg file structure in LegPackage format for which we need to generate the PDF/LegisWrite.
     * @return jobId assigned from Toolbox for this generation.
     */
    @Override
    public String exportLegPackage(String proposalId, LegPackage legPackage) throws Exception {
        Validate.notNull(toolBoxService, "Export Service is not available!!");
        String jobId;
        LeosFile pdfPackage = null;
        LeosFile legisWritePackage = null;
        try {
            ExportLW exportOptionsPDF = new ExportLW(ExportOptions.Output.PDF);
            ExportLW exportOptionsWord = new ExportLW(ExportOptions.Output.WORD);
            pdfPackage = createZipFile(legPackage, "job1.zip", exportOptionsPDF);
            legisWritePackage = createZipFile(legPackage, "job2.zip", exportOptionsWord);
            Map<String, LeosFile> packages = new HashMap<>();
            packages.put(exportOptionsPDF.getFilePrefix() + ZIP_PACKAGE_NAME, pdfPackage);
            packages.put(exportOptionsWord.getFilePrefix() + ZIP_PACKAGE_NAME, legisWritePackage);

            jobId = toolBoxService.createJobWithCallback(proposalId, packages);
        } catch (Exception ex) {
            LOG.error("Unexpected error occurred in method exportLegPackage(): {}", ex.getMessage());
            throw ex;
        }

        LOG.trace("exportLegPackage - Create milestone JobId is {}", jobId);

        return jobId;
    }

    private byte[] checkForReply(String jobId, ExportOptions.Output exportOutput, String fileName) throws IOException, InterruptedException {
        Stopwatch stopwatch = Stopwatch.createStarted();
        int count = 0;
        while (count < jobResultMaxTries) {
            try {
                Pair<byte[], byte[]> zipFiles = toolBoxService.getZipFilesFromLegDocumentJobResult(jobId);
                LOG.debug("Rendition response from Toolbox in {} sec. Nr. tries made {} with a frequency of {} seconds", stopwatch.elapsed(TimeUnit.SECONDS),
                        count, jobResultPullingThresholdInSeconds);

                switch (exportOutput) {
                    case PDF:
                        byte[] outputPdf = zipFiles.left();
                        if (outputPdf != null && outputPdf.length > 0) {
                            notificationService.sendNotification(new PDFGenerationNotification(pdfGenerationFunctionalMailBox, "PDF generations", outputPdf, fileName));
                        }
                        return outputPdf;
                    case WORD:
                        return zipFiles.right();
                }
            } catch (IllegalStateException e) {
                LOG.error("Exception occoured while retreiving document from toolbox", e);
            }

            count++;
            Thread.sleep(jobResultPullingThresholdInSeconds * 1000L);
        }
        LOG.warn("Couldn't generate Rendition for legFile with jobId '{}'. jobResultMaxTries: {}, jobResultPullingThresholdInSeconds: {} . Total time {} secs",
                jobId, jobResultMaxTries, jobResultPullingThresholdInSeconds, stopwatch.elapsed(TimeUnit.SECONDS));
        throw new RuntimeException("Toolbox didn't replied in the established number of tentatives");
    }

    private LeosFile createExportPackage(String jobFileName, LeosFile legFile, ExportOptions exportOptions) throws Exception {
        Validate.notNull(jobFileName);
        Validate.notNull(exportOptions);
        Validate.notNull(legFile);
        try {
            LegPackage legPackage = legService.createLegPackage(legFile, exportOptions);
            return createZipFile(legPackage, jobFileName, exportOptions);
        } catch (XmlValidationException e) {
            LOG.error("Xml validation error occurred while creating proposal from leg file: {}", e);
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public void createDocumentPackage(String jobFileName, String proposalId, ExportOptions exportOptions, User user) throws Exception {
        LOG.debug("calling createLegisWritePackage()....");
        Validate.notNull(exportOptions);
        Validate.notNull(proposalId);
        LegPackage legPackage = null;
        try {
            exportOptions.setDocuwrite(false);
            Proposal proposal = workspaceRepository.findDocumentById(proposalId, Proposal.class, true);
            if (proposal.isClonedProposal()) {
                legPackage = legService.createLegPackageForClone(proposalId, exportOptions);
            } else {
                legPackage = legService.createLegPackage(proposalId, exportOptions);
            }
            akn4euService.convert(legPackage.getFile(), user, exportHelper.createJsonOutputDescriptorFile(exportOptions, cloneContext.isClonedProposal()));
        } catch (Exception e) {
            LOG.error("An exception occurred while using the Legiswrite service: ", e);
            throw e;
        }
    }

    @Override
    public byte[] createDocumentPackage(String jobFileName, ExportOptions exportOptions, User user) throws Exception {
        LOG.debug("calling createDocumentPackage()....");
        Validate.notNull(exportOptions);
        LeosFile exportedFile = null;
        try {
            exportOptions.setDocuwrite(false);
            exportedFile = convertDocument(exportOptions);
            return exportedFile.getBytes();
        } catch (Exception e) {
            LOG.error("An exception occurred while converting the document: ", e);
            throw e;
        }
    }

    private LeosFile convertDocument(ExportOptions exportOptions) {
        LeosFile file = null;
        try {
            file = getZipFile(exportOptions);
        } catch (IOException exception) {
            LOG.error("An exception occurred while converting the document: ", exception);
            throw new RuntimeException(exception);
        }
        return file;
    }


    private LeosFile getZipFile(ExportOptions exportOptions) throws IOException {
        LeosDocument document = exportOptions.getExportVersions().getCurrent();
        String docName = document.getName();
        byte[] docContent = document.getContent().get().getSource().getBytes();
        Map<String, Object> contentToZip = new HashMap<>();
        //1.add xml doc
        contentToZip.put(docName, docContent);
        //2. HTML rendition
        String cssFileName = document.getCategory().name().toLowerCase(Locale.ROOT) + ".css";
        leosLightXmlDocumentService.addDocumentHtmlRendition(this.structureContextProvider, contentToZip, docName, docContent, cssFileName);
        //3.process annotation and add document conversion
        contentToZip.put("exports.zip", leosLightXmlDocumentService.convert(docContent, docName, exportOptions));
        //4.final packaging
        return ZipPackageUtil.zipLeosFiles("result.zip", contentToZip, null);
    }
}
