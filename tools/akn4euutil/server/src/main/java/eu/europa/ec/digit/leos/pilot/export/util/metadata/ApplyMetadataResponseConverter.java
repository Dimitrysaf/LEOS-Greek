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
package eu.europa.ec.digit.leos.pilot.export.util.metadata;

import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataActionName;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataValidationResultKey;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import org.w3c.dom.Element;

import java.util.ArrayList;
import java.util.List;

public class ApplyMetadataResponseConverter {
    private ApplyMetadataResponseConverter() {
    }

    public static ApplyMetadataResponseConverter newInstance() {
        return new ApplyMetadataResponseConverter();
    }

    public XmlUtil.XmlFile applyMetadataResponseToXmlFile(ApplyMetadataResponse response) throws MetadataUtilsException {
        try {
            XmlUtil.XmlFile xmlFile = XmlUtil.newXmlFile();
            xmlFile.setName("content.xml");
            Element rootElement = createApplyMetadataResponseXmlRootElement(xmlFile, response);
            rootElement.appendChild(createApplyMetadataResponseXmlStatusNode(xmlFile, response.getStatus()));

            if (response.getTasks() != null){
                for (ApplyMetadataResponse.TaskNode task : response.getTasks()) {
                    rootElement.appendChild(createApplyMetadataResponseXmlTaskNode(xmlFile, task));
                }
            }

            return xmlFile;
        } catch(XmlUtilException e){
            throw new MetadataUtilsException("Error converting ApplyMetadataResponse to xml");
        }
    }

    private Element createApplyMetadataResponseXmlRootElement(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse response) {
        Element rootElement = xmlFile.createRoot("legisWriteResponse");
        rootElement.setAttribute("responseId", response.getResponseId());
        rootElement.setAttribute(MetadataUtil.ATTRIBUTE_VERSION, response.getVersion());
        rootElement.setAttribute("xmlns", response.getXmlns());
        return rootElement;
    }

    private Element createApplyMetadataResponseXmlStatusNode(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse.StatusNode status) {
        Element statusNode = xmlFile.newElement("status");
        if (status != null){
            statusNode.setAttribute("code", status.getCode());
            statusNode.setTextContent(status.getValue());
        }

        return statusNode;
    }

    private Element createApplyMetadataResponseXmlDocumentNode(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse.DocumentNode document) {
        Element documentNode = xmlFile.newElement(MetadataUtil.ELEMENT_DOCUMENT);
        if (document != null){
            documentNode.setAttribute(MetadataUtil.ATTRIBUTE_DOCUMENTID, document.getDocumentId());
            documentNode.setAttribute(MetadataUtil.ATTRIBUTE_MIMETYPE, document.getMimeType());
            documentNode.setAttribute(MetadataUtil.ATTRIBUTE_FILENAME, document.getFileName());
            documentNode.setAttribute(MetadataUtil.ATTRIBUTE_SOURCE_URL, document.getSourceURL());
        }

        return documentNode;
    }

    private Element createApplyMetadataResponseXmlTaskNode(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse.TaskNode task) {
        Element taskNode = xmlFile.newElement(MetadataUtil.ELEMENT_TASK);
        taskNode.setAttribute(MetadataUtil.ATTRIBUTE_TASKID, task.getTaskId());
        taskNode.setAttribute(MetadataUtil.ATTRIBUTE_STATUS_CODE, task.getStatusCode());
        taskNode.appendChild(createApplyMetadataResponseXmlValidationResultNode(xmlFile, task.getValidationResult()));

        if (task.getActions() != null){
            for (ApplyMetadataResponse.ActionNode action : task.getActions()){
                taskNode.appendChild(createApplyMetadataResponseXmlActionNode(xmlFile, action));
            }
        }

        taskNode.appendChild(createApplyMetadataResponseXmlDocumentNode(xmlFile, task.getDocument()));
        return taskNode;
    }

    private Element createApplyMetadataResponseXmlValidationResultNode(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse.ValidationResultNode validationResult) {
        Element validationResultNode = xmlFile.newElement("validationResult");
        validationResultNode.setAttribute(MetadataUtil.ATTRIBUTE_KEY, validationResult.getKey());
        validationResultNode.setAttribute(MetadataUtil.ATTRIBUTE_STATUS_CODE, validationResult.getStatusCode());

        return validationResultNode;
    }

    private Element createApplyMetadataResponseXmlActionNode(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse.ActionNode action) {
        Element actionNode = xmlFile.newElement(MetadataUtil.ELEMENT_ACTION);
        actionNode.setAttribute(MetadataUtil.ATTRIBUTE_NAME, action.getName());

        if (action.getFields() != null){
            for (ApplyMetadataResponse.FieldNode field : action.getFields()) {
                actionNode.appendChild(createApplyMetadataResponseXmlFieldNode(xmlFile, field));
            }
        }

        return actionNode;
    }


    private Element createApplyMetadataResponseXmlFieldNode(XmlUtil.XmlFile xmlFile, ApplyMetadataResponse.FieldNode field) {
        Element fieldNode = xmlFile.newElement(MetadataUtil.ELEMENT_FIELD);
        fieldNode.setAttribute(MetadataUtil.ATTRIBUTE_KEY, field.getKey());
        fieldNode.setAttribute(MetadataUtil.ATTRIBUTE_STATUS_CODE, field.getStatusCode());
        fieldNode.setTextContent(field.getValue());

        return fieldNode;
    }

    public ApplyMetadataResponse getApplyMetadataResponseWithErrorStatus(ApplyMetadataRequest request) {
        return new ApplyMetadataResponse(request != null ? request.getRequestId() : "", null, getErrorStatusResult());
    }

    public ApplyMetadataResponse getApplyMetadataResponseWithXmlValidationError(ApplyMetadataRequest request) {
        if (request.getTasks() != null) {
            List<ApplyMetadataResponse.TaskNode> responseTasks = new ArrayList<>();
            for (ApplyMetadataRequest.TaskNode task : request.getTasks()) {
                responseTasks.add(getApplyMetadataResponseTaskWithXmlValidationError(task));
            }
            return new ApplyMetadataResponse(request != null ? request.getRequestId() : "", responseTasks, getErrorStatusResult());
        }
        return getApplyMetadataResponseWithErrorStatus(request);
    }

    public ApplyMetadataResponse.DocumentNode applyMetadataRequestDocumentToResultDocument(ApplyMetadataRequest.DocumentNode document) {
        return new ApplyMetadataResponse.DocumentNode(document.getSourceURL(), document.getFileName(), document.getMimeType(),
                document.getDocumentId());
    }

    public ApplyMetadataResponse.DocumentNode applyMetadataRequestDocumentToResultDocument(ApplyMetadataRequest.DocumentNode document, String legFilename) {
        return new ApplyMetadataResponse.DocumentNode("zip://" + legFilename, legFilename, document.getMimeType(),
                document.getDocumentId());
    }

    public ApplyMetadataResponse.TaskNode getApplyMetadataResponseTaskWithXmlValidationError(ApplyMetadataRequest.TaskNode requestTask) {
        List<ApplyMetadataResponse.ActionNode> responseTaskActions = new ArrayList<>();
        String taskId = null;

        if (requestTask != null) {
            taskId = requestTask.getTaskId();
            if (requestTask.getActions() != null) {
                for (ApplyMetadataRequest.ActionNode requestAction : requestTask.getActions()) {
                    responseTaskActions.add(getApplyMetadataResponseActionError(requestAction));
                }
            }
        }

        return new ApplyMetadataResponse.TaskNode(taskId, MetadataUtil.VALUE_ONE, responseTaskActions,
                applyMetadataRequestDocumentToResultDocument(requestTask.getDocument()),
                getValidationErrorResult(MetadataValidationResultKey.XML_VALIDATION_CHECK.getKey()));
    }

    public ApplyMetadataResponse.ActionNode getApplyMetadataResponseActionError(ApplyMetadataRequest.ActionNode requestAction) {
        List<ApplyMetadataResponse.FieldNode> responseActionFields = new ArrayList<>();
        if (requestAction.getFields() != null) {
            for (ApplyMetadataRequest.FieldNode requestField : requestAction.getFields()) {
                responseActionFields.add(new ApplyMetadataResponse.FieldNode(requestField.getKey(), MetadataUtil.VALUE_ONE, "XML validation error"));
            }
        }
        return new ApplyMetadataResponse.ActionNode(MetadataActionName.INSERT_DATA.getValue(), responseActionFields);
    }

    public ApplyMetadataResponse.StatusNode getSuccessStatusResult() {
        return new ApplyMetadataResponse.StatusNode(MetadataUtil.VALUE_ZERO, "Success");
    }

    public ApplyMetadataResponse.StatusNode getErrorStatusResult() {
        return new ApplyMetadataResponse.StatusNode(MetadataUtil.VALUE_ONE, "Failure");
    }

    public ApplyMetadataResponse.ValidationResultNode getValidationSuccessResult(String key) {
        return new ApplyMetadataResponse.ValidationResultNode(key, MetadataUtil.VALUE_ZERO);
    }

    public ApplyMetadataResponse.ValidationResultNode getValidationErrorResult(String key) {
        return new ApplyMetadataResponse.ValidationResultNode(key, MetadataUtil.VALUE_ONE);
    }


}