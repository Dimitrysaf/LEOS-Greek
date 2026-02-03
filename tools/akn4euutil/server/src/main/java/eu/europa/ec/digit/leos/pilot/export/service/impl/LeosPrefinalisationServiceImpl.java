/*
 * Copyright 2021-2025 European Commission
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
package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.exception.LeosPrefinalisationException;
import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlValidationException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotAvailableException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotSupportedException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ListFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.SimpleFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.service.LeosPrefinalisationService;
import eu.europa.ec.digit.leos.pilot.export.service.MetadataService;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XmlFile;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.ApplyMetadataRequestConverter;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.ApplyMetadataResponseConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.xml.sax.SAXException;

import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Validator;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
class LeosPrefinalisationServiceImpl implements LeosPrefinalisationService {
    private static final Logger LOG = LoggerFactory.getLogger(LeosPrefinalisationServiceImpl.class);

    private final MetadataService metadataService;

    @Autowired
    public LeosPrefinalisationServiceImpl(final MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    public byte[] applyMetadata(Map<String, Object> zipContent) {
        ApplyMetadataRequest request = null;

        try {
            LOG.debug("Start applying meta data ...");
            request = readContentXml(zipContent);

            Map<String, Object> documentZipContent = readAndUnzipDocument(zipContent, getFirstTaskDocument(request));
            List<XmlFile> documentXmlFiles = readDocumentXmlFiles(documentZipContent);
            Map<String, Object> documentFurtherContent = readFurtherDocumentContent(documentZipContent);

            validateDocumentXmlFiles(documentXmlFiles);
            String prefinalizedLegName = MetadataUtil.buildPrefinalizationLegName(request);
            ApplyMetadataResponse response = processApplyMetadataRequest(request, documentXmlFiles);
            return buildResponse(response, documentXmlFiles, documentFurtherContent, prefinalizedLegName);
        }
        catch(XmlValidationException ex) {
            LOG.error("One or more xml files do not match the xml schema", ex);
            return buildXmlValidationErrorResponse(request);
        }
        catch(Exception ex){
            LOG.error("Error applying metadata", ex);
            return buildErrorResponse(request);
        }
    }

    public String applyMetadataAsync(Map<String, Object> zipContent, String callbackUrl) {
        String asyncId = UUID.randomUUID().toString();
        CompletableFuture.runAsync(ApplyMetadataRunnable.create(asyncId, zipContent, callbackUrl, this));
        return asyncId;
    }

    private ApplyMetadataRequest readContentXml(Map<String, Object> zipContent) throws LeosPrefinalisationException {
        byte[] contentXmlData = objectToByteArray(zipContent.get("content.xml"));

        if (contentXmlData == null || contentXmlData.length == 0) {
            throw new LeosPrefinalisationException("content.xml not found");
        }

        try {
            InputStream xmlInputStream = new ByteArrayInputStream(contentXmlData);
            XmlFile contentXmlFile = XmlUtil.parseXml(xmlInputStream, "content.xml");
            ApplyMetadataRequest request = getRequestConverter().xmlFileToApplyMetadataRequest(contentXmlFile);
            closeInputStream(xmlInputStream);
            return request;
        } catch (XmlUtilException e) {
            throw new LeosPrefinalisationException("Error unzip document", e);
        }
    }

    private Map<String, Object> readAndUnzipDocument(Map<String, Object> zipContent, ApplyMetadataRequest.DocumentNode document) throws LeosPrefinalisationException {
        if (document == null) {
            throw new LeosPrefinalisationException("Document not found");
        }

        byte[] documentZipData = objectToByteArray(zipContent.get(document.getFileName()));
        if (documentZipData == null || documentZipData.length == 0) {
            throw new LeosPrefinalisationException("Document file not found");
        }

        try {
            Map<String, Object> documentZipContent = ZipUtil.unzipByteArray(documentZipData);
            documentZipContent.entrySet().removeIf(entry -> entry.getKey().startsWith("renditions")); // Remove all files inside renditions folder
            return documentZipContent;
        } catch (IOException e) {
            throw new LeosPrefinalisationException("Error unzip document", e);
        }
    }

    private List<XmlFile> readDocumentXmlFiles(Map<String, Object> documentZipContent){
        List<XmlFile> xmlDocuments = new ArrayList<>();
        String[] contentNames = (String[]) documentZipContent.keySet().toArray(new String[0]);

        for (String contentName : contentNames) {
            if (!contentName.endsWith(".xml")) {
                continue;
            }
            try {
                byte[] documentZipBytes = objectToByteArray(documentZipContent.get(contentName));
                XmlUtil.XmlFile xmlFile = XmlUtil.parseXml(new ByteArrayInputStream(documentZipBytes), contentName);
                if (MetadataUtil.isDocumentXmlFilename(contentName) || MetadataUtil.isDocumentXmlFile(xmlFile)) {
                    xmlDocuments.add(xmlFile);
                }
            } catch(Exception e){
                LOG.error("Error parsing xml document", e);
            }
        }

        return xmlDocuments;
    }

    private Map<String, Object> readFurtherDocumentContent(Map<String, Object> documentZipContent){
        Map<String, Object> furtherContent = new HashMap<>();
        String[] contentNames = documentZipContent.keySet().toArray(new String[0]);

        for (String contentName : contentNames) {
            if (MetadataUtil.isDocumentXmlFilename(contentName)) {
                continue;
            }
            try {
                furtherContent.put(contentName, documentZipContent.get(contentName));
            } catch(Exception e){
                LOG.error("Error parsing xml document", e);
            }
        }

        return furtherContent;
    }

    private void validateDocumentXmlFiles(List<XmlFile> xmlFiles) throws XmlValidationException {
        Validator schemaValidator = XmlUtil.getAknSchemaValidator();
        for (XmlFile xmlFile : xmlFiles) {
            ByteArrayInputStream inputStream = null;
            try {
                inputStream = new ByteArrayInputStream(xmlFile.getBytes());
                schemaValidator.validate(new StreamSource(inputStream));
            } catch (XmlUtilException ex) {
                LOG.error("Error reading xml file", ex);
                throw new XmlValidationException("Error reading xml file", ex);
            } catch (IOException | SAXException ex) {
                LOG.error("Error validate xml file '" + xmlFile.getName() + "'", ex);
                throw new XmlValidationException("Error validate xml file '" + xmlFile.getName() + "'", ex);
            } finally {
                closeInputStream(inputStream);
            }
        }
    }

    private ApplyMetadataResponse processApplyMetadataRequest(ApplyMetadataRequest request, List<XmlFile> documentXmlFiles) {
        List<ApplyMetadataResponse.TaskNode> taskResponses = new ArrayList<>();
        if (request.getTasks() != null) {
            for (ApplyMetadataRequest.TaskNode task : request.getTasks()) {
                taskResponses.add(processApplyMetadataRequestTask(task, documentXmlFiles));
            }
        }

        final ApplyMetadataResponse.StatusNode successResult = isContainsTaskResponseWithErrors(taskResponses)
                ? getResponseConverter().getErrorStatusResult() : getResponseConverter().getSuccessStatusResult();
        return new ApplyMetadataResponse(request.getRequestId(), taskResponses, successResult);
    }

    private ApplyMetadataResponse.TaskNode processApplyMetadataRequestTask(ApplyMetadataRequest.TaskNode task, List<XmlFile> documentXmlFiles) {
        List<ApplyMetadataResponse.ActionNode> actionResponses = new ArrayList<>();
        for (ApplyMetadataRequest.ActionNode action : task.getActions()){
            actionResponses.add(processApplyMetadataRequestAction(action, documentXmlFiles));
        }
        documentXmlFiles.stream().forEach((xmlFile) -> {
            metadataService.removeTemplateClassAttributes(xmlFile);
            metadataService.removeDateIfNeeded(xmlFile);
        });

        final String statusCode = isContainsActionResponseWithErrors(actionResponses) ? "1" : "0";
        return new ApplyMetadataResponse.TaskNode(task.getTaskId(), statusCode, actionResponses,
                getResponseConverter().applyMetadataRequestDocumentToResultDocument(task.getDocument()),
                getResponseConverter().getValidationSuccessResult("XMLValidationCheck"));
    }

    private ApplyMetadataResponse.ActionNode processApplyMetadataRequestAction(ApplyMetadataRequest.ActionNode action, List<XmlFile> documentXmlFiles){
        Optional<ApplyMetadataRequest.FieldNode> diffusionVersionField = MetadataUtil.getDiffusionVersion(action);
        final String diffusionVersion = diffusionVersionField.isPresent() ? diffusionVersionField.get().getValue() : null;
        int commissionerPos = 0;
        List<ApplyMetadataResponse.FieldNode> fieldResponses = new ArrayList<>();
        for (ApplyMetadataRequest.FieldNode field : action.getFields()){
            fieldResponses.add(processApplyMetadataRequestField(field, documentXmlFiles, commissionerPos, diffusionVersion));
            if (MetadataFieldType.isCommissioner(field.getKey())) {
                commissionerPos += 1;
            }
        }
        if (!hasLinkedDocumentsField(action)) {
            // Remove associatedReferences container if no linkedDocuments are set
            processApplyMetadataRequestField(new ApplyMetadataRequest.FieldNode(MetadataFieldType.LINKED_DOCUMENTS.toString(), ""), documentXmlFiles, commissionerPos);
        }
        return new ApplyMetadataResponse.ActionNode(action.getName(), fieldResponses);
    }

    private boolean hasLinkedDocumentsField(ApplyMetadataRequest.ActionNode action) {
        return action.getFields().stream().anyMatch((field) -> field.getKey().equals(MetadataFieldType.LINKED_DOCUMENTS.toString()));
    }

    private ApplyMetadataResponse.FieldNode processApplyMetadataRequestField(ApplyMetadataRequest.FieldNode field,
                                                                             List<XmlFile> documentXmlFiles,
                                                                             int commissionerPos) {
        return this.processApplyMetadataRequestField(field, documentXmlFiles, commissionerPos, null);
    }

    private ApplyMetadataResponse.FieldNode processApplyMetadataRequestField(ApplyMetadataRequest.FieldNode field,
                                                                             List<XmlFile> documentXmlFiles,
                                                                             int commissionerPos,
                                                                             String diffusionVersion) {
        try {
            processMetadataFieldInfo(metadataService.lookupFieldInfo(field), documentXmlFiles, commissionerPos, diffusionVersion);
            return metadataService.getFieldSuccessResult(field.getKey());
        } catch(MetadataFieldNotAvailableException | XmlUtilException | MetadataUtilsException ex) {
            LOG.debug("Lookup field info failed: {}", ex);
            return metadataService.getFieldNotAvailableResult(field.getKey());
        } catch(MetadataFieldNotSupportedException ex) {
            LOG.debug("Lookup field info failed: {}", ex);
            return metadataService.getFieldNotSupportedResult(field.getKey());
        } catch(MetadataFieldInvalidValueException ex) {
            LOG.error("Lookup field info '{}' failed: {}", field.getKey(), ex.getReason());
            return metadataService.getFieldInvalidValueResult(field.getKey(), ex.getReason());
        }
    }

    private void processMetadataFieldInfo(MetadataFieldInfo fieldInfo, List<XmlFile> documentXmlFiles, int commissionerPos, String diffusionVersion) throws MetadataUtilsException,
            XmlUtilException {
        LOG.debug("Process field info  '{}'", fieldInfo);

        final boolean isAutonomousAct = MetadataUtil.isAutonomousAct(documentXmlFiles);
        for (XmlFile xmlFile : documentXmlFiles){
            LOG.debug("Process xml file '{}'", xmlFile.getName());
            switch(fieldInfo.getFieldType()){
                case ADOPTION_DATE:
                    metadataService.processAdoptionDate((ReferenceFieldInfo)fieldInfo, xmlFile, isAutonomousAct);
                    break;
                case ADOPTION_LOCATION:
                    metadataService.processAdoptionLocation((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case EMISSION_DATE:
                    metadataService.processEmissionDate((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case INTERINSTITUTIONAL_COTE:
                    metadataService.processInterinstitutionalCote((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case LINKED_DOCUMENTS:
                    metadataService.processLinkedDocuments((MultipleReferencesFieldInfo)fieldInfo, xmlFile);
                    break;
                case COTE:
                    metadataService.processCote((ReferenceFieldInfo)fieldInfo, diffusionVersion, xmlFile);
                    break;
                case FINAL_COTE:
                    metadataService.processFinalCote((ReferenceFieldInfo)fieldInfo, diffusionVersion, xmlFile);
                    break;
                case STAMP:
                    metadataService.processStamp((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case COMMISSIONER:
                    metadataService.processCommissioner((ReferenceFieldInfo) fieldInfo, xmlFile, commissionerPos);
                    break;
                case CORRIGENDUM_ADDENDUM:
                    metadataService.processCorrigendumAddendum((SimpleFieldInfo) fieldInfo, xmlFile);
                    break;
                case PACKAGE_TITLE:
                    metadataService.processPackageTitle((SimpleFieldInfo)fieldInfo, xmlFile);
                    break;
                case INTERNAL_REF:
                    metadataService.processInternalRef((SimpleFieldInfo)fieldInfo, xmlFile);
                    break;
                case AUTHENTIC_LANG:
                    metadataService.processAuthenticLanguages((ListFieldInfo)fieldInfo, xmlFile);
                    break;
                case COVERPAGE_TYPE:
                    metadataService.processCoverPageType((SimpleFieldInfo)fieldInfo, xmlFile);
                    break;
                case DIFFUSION_VERSION:
                    metadataService.processDiffusionVersion(diffusionVersion, xmlFile);
                    break;
                default:
                    throw new MetadataUtilsException(MetadataUtil.FIELD_NOT_SUPPORTED_MESSAGE);
            }
        }
    }

    private boolean isContainsActionResponseWithErrors(List<ApplyMetadataResponse.ActionNode> actions){
        return (actions != null) &&  (actions.stream()
                .filter(action -> isContainsFieldResponseWithErrors(action.getFields())).count() > 0);
    }

    private boolean isContainsFieldResponseWithErrors(List<ApplyMetadataResponse.FieldNode> fields){
        return (fields != null) && (fields.stream().filter(field -> field.getStatusCode().equals("1")).count() > 0);
    }

    private boolean isContainsTaskResponseWithErrors(List<ApplyMetadataResponse.TaskNode> tasks){
        return (tasks != null) &&  (tasks.stream().filter(task -> task.getStatusCode().equals("1")).count() > 0);
    }

    private byte[] buildResponse(ApplyMetadataResponse response,
                                 List<XmlFile> documentXmlFiles,
                                 Map<String, Object> documentFurtherContent,
                                 String prefinalizedLegName){
        try {
            Map<String, Object> responseContent = new HashMap<>();
            XmlFile xmlResponse = getResponseConverter().applyMetadataResponseToXmlFile(response);
            responseContent.put(xmlResponse.getName(), xmlResponse.getBytes());
            responseContent.put(prefinalizedLegName, buildResponseLegFile(documentXmlFiles, documentFurtherContent));
            return ZipUtil.zipByteArray(responseContent);
        } catch(Exception e) {
            LOG.error("Error building response {}", e);
            return null;
        }
    }

    private byte[] buildResponseLegFile(List<XmlFile> xmlDocuments, Map<String, Object> documentFurtherContent){
        try {
            Map<String, Object> legFileContent = new HashMap<>();

            for (XmlFile xmlDocument : xmlDocuments) {
                legFileContent.put(xmlDocument.getName(), xmlDocument.getBytes());
            }
            legFileContent.putAll(documentFurtherContent);

            return ZipUtil.zipByteArray(legFileContent);
        } catch(Exception e) {
            LOG.error("Error building response leg file {}", e);
            return new byte[0];
        }
    }

    private byte[] buildXmlValidationErrorResponse(ApplyMetadataRequest request) {
        if (request.getTasks() != null) {
            try {
                final ApplyMetadataResponseConverter responseConverter = getResponseConverter();
                ApplyMetadataResponse response = responseConverter.getApplyMetadataResponseWithXmlValidationError(request);
                Map<String, Object> responseContent = new HashMap<>();
                XmlFile xmlResponse = responseConverter.applyMetadataResponseToXmlFile(response);
                responseContent.put(xmlResponse.getName(), xmlResponse.getBytes());
                return ZipUtil.zipByteArray(responseContent);
            } catch(Exception e) {
                LOG.error("Error building xml validation error response {}", e);
            }
        }
        return buildErrorResponse(request);
    }

    private byte[] buildErrorResponse(ApplyMetadataRequest request){
        try {
            final ApplyMetadataResponseConverter responseConverter = getResponseConverter();
            ApplyMetadataResponse response = responseConverter.getApplyMetadataResponseWithErrorStatus(request);
            Map<String, Object> responseContent = new HashMap<>();
            XmlFile xmlResponse = responseConverter.applyMetadataResponseToXmlFile(response);
            responseContent.put(xmlResponse.getName(), xmlResponse.getBytes());
            return ZipUtil.zipByteArray(responseContent);
        } catch(Exception e) {
            LOG.error("Error building error response {}", e);
            return new byte[0];
        }
    }

    private void closeInputStream(InputStream inputStream) {
        try {
            if (inputStream != null) {
                inputStream.close();
            }
        } catch(Exception e){
            LOG.error("Error closing Stream", e);
        }
    }

    private byte[] objectToByteArray(Object obj){
        if (obj != null && obj instanceof byte[]) {
            return (byte[]) obj;
        }
        return null;
    }

    private ApplyMetadataRequest.DocumentNode getFirstTaskDocument(ApplyMetadataRequest request) {
        return request.getTasks()
                .stream()
                .findFirst()
                .map((task) -> task.getDocument())
                .orElseGet(null);
    }

    private ApplyMetadataResponse.DocumentNode getFirstTaskDocument(ApplyMetadataResponse response) {
        return response.getTasks()
                .stream()
                .findFirst()
                .map((task) -> task.getDocument())
                .orElseGet(null);
    }

    private ApplyMetadataResponseConverter getResponseConverter() {
        return ApplyMetadataResponseConverter.newInstance();
    }

    private ApplyMetadataRequestConverter getRequestConverter() {
        return ApplyMetadataRequestConverter.newInstance();
    }

    public static class ApplyMetadataRunnable implements Runnable {
        private String id;
        private final String callbackUrl;
        private final Map<String, Object> zipContent;
        private final LeosPrefinalisationService leosPrefinalisationService;

        public ApplyMetadataRunnable(String id, Map<String, Object> zipContent, String callbackUrl, LeosPrefinalisationService leosPrefinalisationService) {
            this.id = id;
            this.zipContent = zipContent;
            this.callbackUrl = callbackUrl;
            this.leosPrefinalisationService = leosPrefinalisationService;
        }

        @Override
        public void run() {
            LOG.debug("Start apply metadata async");
            final byte[] content = this.leosPrefinalisationService.applyMetadata(this.zipContent);

            LOG.debug("Send ZIP to callback url");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("token", this.id);
            body.add("inputFile", new ByteArrayResource(content) {
                @Override
                public String getFilename() {
                    return "inputFile.zip"; // Filename has to be returned in order to be able to POST
                }
                @Override
                public long contentLength() {
                    return -1;
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            try {
                new RestTemplate().exchange(callbackUrl, HttpMethod.POST, requestEntity, Void.class);
            } catch (Exception ex) {
                LOG.info("Error sending ZIP to callback url {} with token {}", this.callbackUrl, this.id, ex);
            }
        }

        public static Runnable create(String id, Map<String, Object> zipContent, String callbackUrl, LeosPrefinalisationService leosPrefinalisationService) {
            return new ApplyMetadataRunnable(id, zipContent, callbackUrl, leosPrefinalisationService);
        }
    }
}
