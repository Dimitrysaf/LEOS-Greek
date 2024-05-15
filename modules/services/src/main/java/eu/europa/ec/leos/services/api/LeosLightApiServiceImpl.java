package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.ErrorVO;
import eu.europa.ec.leos.domain.vo.MilestonesVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.collection.CreateCollectionService;
import eu.europa.ec.leos.services.converter.ProposalConverterService;
import eu.europa.ec.leos.services.dto.request.ExportDocumentOptions;
import eu.europa.ec.leos.services.dto.response.LegFileValidation;
import eu.europa.ec.leos.services.dto.response.MilestoneDocumentView;
import eu.europa.ec.leos.services.dto.response.MilestoneViewResponse;
import eu.europa.ec.leos.services.exception.InternalServerException;
import eu.europa.ec.leos.services.exception.InvalidInputException;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.services.exception.XmlValidationException;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.leoslight.service.LeosLightXmlDocumentService;
import eu.europa.ec.leos.services.leoslight.util.ByteChecksumComparator;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.validation.ValidationService;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getDocumentMetadata;
import static eu.europa.ec.leos.services.leoslight.util.DocumentApiUtil.getLeosMetaData;
import static eu.europa.ec.leos.services.support.XmlHelper.encodeParam;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
public class LeosLightApiServiceImpl implements LeosLightApiService {

    private static final Logger LOG = LoggerFactory.getLogger(LeosLightApiServiceImpl.class);

    public static final Map<Class, String> DOC_TYPE_MAP;

    static {
        Map<Class, String> tempMap = new HashMap<>();
        tempMap.put(Annex.class, "annex");
        tempMap.put(Bill.class, "document");
        tempMap.put(Explanatory.class, "council_explanatory");
        tempMap.put(FinancialStatement.class, "financial-statement");
        tempMap.put(Memorandum.class, "memorandum");
        tempMap.put(Proposal.class, "collection");

        DOC_TYPE_MAP = Collections.unmodifiableMap(tempMap);
    }

    private ValidationService validationService;
    private ProposalConverterService proposalConverterService;
    private LeosRepository leosRepository;
    private PackageService packageService;
    private MessageHelper messageHelper;
    private SecurityContext securityContext;
    private LeosLightXmlDocumentService leosLightXmlDocumentService;
    private Properties applicationProperties;
    private ApiService apiService;
    private CreateCollectionService createCollectionService;

    @Autowired
    public LeosLightApiServiceImpl(ValidationService validationService, ProposalConverterService proposalConverterService, LeosRepository leosRepository,
            PackageService packageService, MessageHelper messageHelper, SecurityContext securityContext, LeosLightXmlDocumentService leosLightXmlDocumentService,
            Properties applicationProperties, ApiService apiService, CreateCollectionService createCollectionService) {
        this.validationService = validationService;
        this.proposalConverterService = proposalConverterService;
        this.leosRepository = leosRepository;
        this.packageService = packageService;
        this.messageHelper = messageHelper;
        this.securityContext = securityContext;
        this.leosLightXmlDocumentService = leosLightXmlDocumentService;
        this.applicationProperties = applicationProperties;
        this.apiService = apiService;
        this.createCollectionService = createCollectionService;
    }

    @Override
    public Pair<String, String> importDocument(String inputFileName, byte[] docContent, String locale, String callbackAddress) throws InvalidInputException {
        DocumentVO documentVO = null;
        String docRef = encodeParam(inputFileName.substring(0, inputFileName.lastIndexOf("-") + 1) + locale);
        try {
            documentVO = getDocumentVO(docRef, docContent);
        } catch (XmlValidationException e) {
            throw new InvalidInputException(e.getMessage());
        }

        Class docType = LeosCategoryClass.getClass(documentVO.getDocumentType());
        LeosMetadata docMetaData = getLeosMetaData(documentVO, locale, docRef);
        docMetaData.setCallbackAddress(callbackAddress);
        docMetaData.setImported(true);

        LeosDocument savedDocument = findLeosDocument(docRef, docType);

        String documentReferenceUrl = getDocumentViewUrl(docRef, docType);

        if (savedDocument == null) {
            LOG.info(String.format("User %s created document %s via leos light import API", securityContext.getUser().getLogin(), inputFileName));
            createLeosDocument(docRef, docType, documentVO, docMetaData);
            return new Pair<>(documentReferenceUrl, messageHelper.getMessage("leoslight.document.created"));
        } else {
            if (ByteChecksumComparator.checksumMatched(savedDocument.getContent().get().getSource().getBytes(), documentVO.getSource())) {
                return new Pair<>(documentReferenceUrl, messageHelper.getMessage("leoslight.document.duplicate"));
            } else {
                LOG.info(String.format("User %s updated document %s via leos light import API", securityContext.getUser().getLogin(), inputFileName));
                updateLeosDocument(savedDocument.getId(), docType, documentVO, docMetaData);
                return new Pair<>(documentReferenceUrl, messageHelper.getMessage("leoslight.document.updated.major.version"));
            }
        }
    }

    @Override
    public Pair<Boolean, File> exportDocument(String docRef, String callbackAddress, ExportDocumentOptions options) {
        LeosDocument savedDocument = findLeosDocument(docRef, XmlDocument.class);
        if(savedDocument == null) {
            throw new NotFoundException(messageHelper.getMessage("leoslight.document.not.found"));
        }

        File file = convertDocument(docRef, savedDocument, options);

        if(StringUtils.isEmpty(callbackAddress)) {
            Map<String, Object> documentMetadata = getDocumentMetadata(docRef, leosRepository);
            callbackAddress = documentMetadata == null ? null : (String) documentMetadata.get("callbackAddress");
        }

        if (StringUtils.isEmpty(callbackAddress)) {
            return new Pair<>(Boolean.FALSE, file);
        }

        try {
            leosLightXmlDocumentService.sendFileToCallbackUrl(file.getName(), Files.readAllBytes(file.toPath()), callbackAddress);
        } catch (IOException exception) {
            if ((file != null) && file.exists()) {
                file.delete();
            }
            String errorMessage = String.format(messageHelper.getMessage("leoslight.service.export.callback.error"), callbackAddress, exception.getMessage());
            LOG.error(errorMessage);
            throw new InternalServerException(errorMessage);
        }

        return new Pair<>(Boolean.TRUE, file);
    }

    @Override
    public Pair<Object, Object> importProposal(MultipartFile file, String origProposalRef, String languageCode) throws IOException {
        File content = new File(file.getOriginalFilename());
        byte[] fileContent = file.getBytes();
        try (FileOutputStream fos = new FileOutputStream(content)) {
            fos.write(file.getBytes());
        } catch (IOException ioe) {
            LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
            return new Pair<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //Validate Leg file first
        LegFileValidation validation = apiService.validateLegFile(content);
        DocumentVO documentVO = validation.getDocumentToBeCreated();

        if (validation.getErrors() == null || validation.getErrors().isEmpty()) {
            String docRef = file.getOriginalFilename().substring(0, file.getOriginalFilename().lastIndexOf("."));
            LeosDocument savedDocument = findLeosDocument(docRef, LegDocument.class);
            if (savedDocument == null) {
                try (FileOutputStream fos = new FileOutputStream(content)) {
                    fos.write(file.getBytes());
                } catch (IOException ioe) {
                    LOG.error("Error Occurred while reading the Leg file: " + ioe.getMessage(), ioe);
                    return new Pair<>("An error occurred during the reading of the Leg file.", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                CreateCollectionResult createCollectionResult;
                try {
                    createCollectionResult = createCollectionService.createCollectionFromLeg(content, origProposalRef, languageCode, true);
                    if (createCollectionResult.isCollectionCreated()) {
                        String pkgName = createCollectionResult.getPackageName();
                        List<MilestonesVO> milestonesVOS = apiService.getProposalMilestones(origProposalRef);
                        MilestonesVO milestonesVO = milestonesVOS.get(0);
                        String legDocumentName = milestonesVO.getLegDocumentName();
                        MilestoneViewResponse response = apiService.listMilestoneDocuments(origProposalRef, legDocumentName);
                        MilestoneDocumentView documentView = response.getDocuments().stream().filter(doc ->
                                doc.getContentFileName().startsWith("main-")).findFirst().get();
                        String proposalVersionLabel = getNextVersionLabel(VersionType.MAJOR, documentView.getVersion());
                        List<String> containedDocs = new ArrayList<>();
                        containedDocs.add(documentVO.getRef() + "_" + proposalVersionLabel);
                        documentVO.getChildDocuments().forEach(docVo -> {
                            MilestoneDocumentView childDocView = response.getDocuments().stream().filter(doc ->
                                    doc.getLeosCategory().equals(docVo.getCategory())).findFirst().get();
                            String childVersionLabel = getNextVersionLabel(VersionType.MAJOR, childDocView.getVersion());
                            containedDocs.add(docVo.getRef() + "_" + childVersionLabel);
                        });
                        List<String> milestoneComments = new ArrayList<>();
                        milestoneComments.add("Milestone imported");
                        apiService.addLegDocument(pkgName, file.getOriginalFilename(), milestoneComments, fileContent, LeosLegStatus.IMPORTED, containedDocs);
                    }
                } catch (CreateCollectionException e) {
                    LOG.error("Error Occurred while reading the Leg file: " + e.getMessage(), e);
                    return new Pair<>("An error occurred during the reading of the Leg file. " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                } catch (Exception e) {
                    LOG.error("Error Occurred while reading the Leg file: " + e.getMessage(), e);
                    return new Pair<>("An error occurred during the reading of the Leg file. " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return new Pair<>(createCollectionResult, HttpStatus.OK);
            } else {
                if (ByteChecksumComparator.checksumMatched(savedDocument.getContent().get().getSource().getBytes(), fileContent)) {
                    return new Pair<>(messageHelper.getMessage("leoslight.document.duplicate"), HttpStatus.INTERNAL_SERVER_ERROR);
                } else {
                    updateLegDocument(savedDocument.getId(), LeosLegStatus.IMPORTED, fileContent);
                    return new Pair<>(messageHelper.getMessage("leoslight.document.updated.major.version"), HttpStatus.OK);
                }
            }
        } else {
            return new Pair<>(validation.getErrors(), HttpStatus.PRECONDITION_FAILED);
        }
    }

    private String getNextVersionLabel(VersionType versionType, String oldVersion) {
        if (StringUtils.isEmpty(oldVersion)) {
            if (versionType.equals(VersionType.MAJOR)) {
                return "1.0.0";
            } else if (versionType.equals(VersionType.INTERMEDIATE)) {
                return "0.1.0";
            } else {
                return "0.0.1";
            }
        }

        String[] newVersion = oldVersion.split("\\.");
        if (versionType.equals(VersionType.MAJOR)) {
            newVersion[0] = Integer.parseInt(newVersion[0]) + 1 + "";
            newVersion[1] = "0";
            newVersion[2] = "0";
        } else if (versionType.equals(VersionType.INTERMEDIATE)) {
            newVersion[1] = Integer.parseInt(newVersion[1]) + 1 + "";
            newVersion[2] = "0";
        } else {
            newVersion[2] = Integer.parseInt(newVersion[2]) + 1 + "";
        }
        return newVersion[0] + "." + newVersion[1] + "." + newVersion[2];
    }

    private File convertDocument(String docRef, LeosDocument document, ExportDocumentOptions options) {
        File file = null;
        try {
            if (options == null || ExportDocumentOptions.OutputType.XML.equals(options.getOutputType())) {
                byte[] docContent = document.getContent().get().getSource().getBytes();
                file = getXmlFile(docRef, docContent);
            } else {
                file = getZipFile(document, options);
            }
        } catch (IOException exception) {
            if ((file != null) && file.exists()) {
                file.delete();
            }
            throw new InternalServerException(messageHelper.getMessage("leoslight.service.export.convert.error"), exception);
        }

        return file;
    }

    private DocumentVO getDocumentVO(String docRef, byte[] docContent) throws XmlValidationException {
        File docFileTemp = null;
        DocumentVO documentVO = null;

        try {
            docFileTemp = getXmlFile(docRef, docContent);
            documentVO = proposalConverterService.createDocument(docRef + ".xml", docFileTemp, true);
            List<ErrorVO> errors = validationService.validateDocument(documentVO);

            if (!errors.isEmpty()) {
                LOG.info(errors.toString());
                throw new XmlValidationException(messageHelper.getMessage("leoslight.document.validation.failure"));
            }
        } catch (IOException e) {
            throw new XmlValidationException(messageHelper.getMessage("leoslight.document.invalid.document"));
        } finally {
            if ((docFileTemp != null) && docFileTemp.exists()) {
                docFileTemp.delete();
            }
        }

        return documentVO;
    }

    private LeosDocument findLeosDocument(String docRef, Class docType) {
        LeosDocument savedDocument = null;
        try {
            savedDocument = leosRepository.findDocumentByRef(docRef, docType);
        } catch (Exception exception) {
            LOG.info(messageHelper.getMessage("leoslight.document.not.found"));
        }
        return  savedDocument;
    }


    private void createLeosDocument(String docRef, Class docType, DocumentVO documentVO, LeosMetadata docMetaData) {
        LeosDocument savedDocument = leosRepository.createDocumentFromContent(
                packageService.createPackage().getPath(),
                docRef + ".xml",
                docMetaData,
                docType,
                documentVO.getCategory().name(),
                documentVO.getSource());

        leosRepository.updateDocument(
                savedDocument.getId(),
                docMetaData,
                documentVO.getSource(),
                VersionType.INTERMEDIATE,
                "Document created by Leos Light",
                docType);
    }

    private void updateLeosDocument(String id, Class docType, DocumentVO documentVO, LeosMetadata docMetaData) {
        leosRepository.updateDocument(
                id,
                docMetaData,
                documentVO.getSource(),
                VersionType.MAJOR,
                "Document updated by Leos Light",
                docType);
    }

    private void updateLegDocument(String id, LeosLegStatus status, byte[] contentBytes) {
        leosRepository.updateLegDocument(
                id,
                status,
                contentBytes,
                VersionType.MAJOR,
                "Document updated using import"
                );
    }

    private <D extends LeosDocument> String getDocumentViewUrl(String docRef, Class<? extends D> docType) {
        String mappingUrl = applicationProperties.getProperty("leos.mapping.url");
        String urlPart = DOC_TYPE_MAP.get(docType);
        String documentReferenceUrl = mappingUrl + "/ui/"+ urlPart + '/' + docRef;
        return encodeParam(documentReferenceUrl);
    }

    private File getXmlFile(String docRef, byte[] docContent) throws IOException {
        File file = null;
        OutputStream outputStream = null;
        try {
            file = File.createTempFile(docRef, ".xml");
            Path path = Paths.get(file.getAbsolutePath());
            path = Files.move(path, path.resolveSibling(docRef + ".xml"), REPLACE_EXISTING);
            file = path.toFile();
            outputStream = new FileOutputStream(file);
            outputStream.write(docContent);
        } finally {
            if(outputStream != null) {
                outputStream.close();
            }
        }
        return file;
    }

    private File getZipFile(LeosDocument document, ExportDocumentOptions options) throws IOException {
        String docName = document.getName();
        byte[] docContent = document.getContent().get().getSource().getBytes();
        Class docType = LeosCategoryClass.getClass(document.getCategory());

        Map<String, Object> contentToZip = new HashMap<>();

        //1.add xml doc
        contentToZip.put(docName, docContent);

        //2. HTML rendition
        String cssFileName = document.getCategory().name().toLowerCase(Locale.ROOT) + ".css";
        leosLightXmlDocumentService.addDocumentHtmlRendition(contentToZip, docName, docContent, cssFileName);

        //3.process annotation and add document conversion
        ExportOptions exportOptions = new ExportLW(ExportOptions.Output.valueOf(options.getOutputType().name()), docType, options.isWithAnnotations(), true);
        exportOptions.setExportVersions(new ExportVersions(null, (XmlDocument) document));
        contentToZip.put("exports.zip", leosLightXmlDocumentService.convert(docContent, docName,  exportOptions));

        //4.final packaging
        return ZipPackageUtil.zipFiles("result.zip", contentToZip, null);
    }
}
