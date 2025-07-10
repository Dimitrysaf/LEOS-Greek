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

import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import org.w3c.dom.Node;

import java.util.ArrayList;
import java.util.List;

public class ApplyMetadataRequestConverter {
    private ApplyMetadataRequestConverter() {
    }

    public static ApplyMetadataRequestConverter newInstance() {
        return new ApplyMetadataRequestConverter();
    }

    public ApplyMetadataRequest xmlFileToApplyMetadataRequest(XmlUtil.XmlFile xmlFile) {
        final Node nodeRequest = xmlFile.getElementByName("legisWriteRequest");
        return processApplyMetadataRequestNode(nodeRequest);
    }

    public ApplyMetadataRequest processApplyMetadataRequestNode(Node nodeRequest) {
        if (nodeRequest != null){
            List<Node> taskNodes = XmlUtil.getChildNodesWithName(nodeRequest, MetadataUtil.ELEMENT_TASK);
            List<ApplyMetadataRequest.TaskNode> requestTasks = processApplyMetadataRequestTaskNodes(taskNodes);
            ApplyMetadataRequest applyMetadataRequest = parseApplyMetadataRequestNode(nodeRequest)
                    .setTasks(requestTasks);
            return applyMetadataRequest;
        }
        return null;
    }

    public ApplyMetadataRequest.DocumentNode parseApplyMetadataRequestDocumentNode(Node nodeDocument) {
        if (nodeDocument != null){
            return new ApplyMetadataRequest.DocumentNode(XmlUtil.getNodeAttributeValue(nodeDocument, MetadataUtil.ATTRIBUTE_SOURCE_URL),
                    XmlUtil.getNodeAttributeValue(nodeDocument, MetadataUtil.ATTRIBUTE_FILENAME),
                    XmlUtil.getNodeAttributeValue(nodeDocument, MetadataUtil.ATTRIBUTE_MIMETYPE),
                    XmlUtil.getNodeAttributeValue(nodeDocument, MetadataUtil.ATTRIBUTE_DOCUMENTID));
        }
        return null;
    }

    public List<ApplyMetadataRequest.TaskNode> processApplyMetadataRequestTaskNodes(List<Node> taskNodes) {
        if (taskNodes != null){
            List<ApplyMetadataRequest.TaskNode> tasks = new ArrayList<>();
            for (int i = 0; i < taskNodes.size(); i++){
                Node nodeTask = taskNodes.get(i);
                Node nodeDocument = XmlUtil.getChildNodeWithName(nodeTask, MetadataUtil.ELEMENT_DOCUMENT);
                ApplyMetadataRequest.DocumentNode requestDocument = parseApplyMetadataRequestDocumentNode(nodeDocument);
                ApplyMetadataRequest.TaskNode task = parseApplyMetadataRequestTaskNode(nodeTask)
                        .setDocument(requestDocument)
                        .setActions(processApplyMetadataRequestTaskNode(nodeTask));
                tasks.add(task);
            }
            return tasks;
        }
        return null;
    }

    public ApplyMetadataRequest.TaskNode parseApplyMetadataRequestTaskNode(Node nodeTask) {
        if (nodeTask != null) {
            return new ApplyMetadataRequest.TaskNode(XmlUtil.getNodeAttributeValue(nodeTask, MetadataUtil.ATTRIBUTE_TASKID));
        }
        return null;
    }

    public List<ApplyMetadataRequest.ActionNode> processApplyMetadataRequestTaskNode(Node nodeTask) {
        if (nodeTask != null){
            List<ApplyMetadataRequest.ActionNode> actions = new ArrayList<>();
            List<Node> actionNodes = XmlUtil.getChildNodesWithName(nodeTask, MetadataUtil.ELEMENT_ACTION);
            for (int i = 0; i < actionNodes.size(); i++){
                Node nodeAction = actionNodes.get(i);
                ApplyMetadataRequest.ActionNode akn4euAction = parseApplyMetadataRequestActionNode(nodeAction)
                        .setFields(processApplyMetadataRequestActionNode(nodeAction));
                actions.add(akn4euAction);
            }
            return actions;
        }
        return null;
    }

    public ApplyMetadataRequest.ActionNode parseApplyMetadataRequestActionNode(Node nodeAction) {
        if (nodeAction != null){
            return new ApplyMetadataRequest.ActionNode(XmlUtil.getNodeAttributeValue(nodeAction, MetadataUtil.ATTRIBUTE_NAME),
                    XmlUtil.getNodeAttributeValue(nodeAction, MetadataUtil.ATTRIBUTE_CLEANUP));
        }
        return null;
    }

    public List<ApplyMetadataRequest.FieldNode> processApplyMetadataRequestActionNode(Node nodeAction) {
        if (nodeAction != null){
            List<ApplyMetadataRequest.FieldNode> fields = new ArrayList<>();
            List<Node> fieldNodes = XmlUtil.getChildNodesWithName(nodeAction, MetadataUtil.ELEMENT_FIELD);
            for (int i = 0; i < fieldNodes.size(); i++){
                Node nodeField = fieldNodes.get(i);
                ApplyMetadataRequest.FieldNode akn4euField = parseApplyMetadataRequestFieldNode(nodeField);
                fields.add(akn4euField);
            }
            return fields;
        }
        return null;
    }

    public ApplyMetadataRequest.FieldNode parseApplyMetadataRequestFieldNode(Node nodeField) {
        if (nodeField != null){
            return new ApplyMetadataRequest.FieldNode(XmlUtil.getNodeAttributeValue(nodeField, MetadataUtil.ATTRIBUTE_KEY),
                    nodeField.getTextContent());
        }
        return null;
    }

    public ApplyMetadataRequest parseApplyMetadataRequestNode(Node nodeRequest) {
        if (nodeRequest != null){
            return new ApplyMetadataRequest(XmlUtil.getNodeAttributeValue(nodeRequest, "xmlns"),
                    XmlUtil.getNodeAttributeValue(nodeRequest, MetadataUtil.ATTRIBUTE_VERSION),
                    XmlUtil.getNodeAttributeValue(nodeRequest, MetadataUtil.ATTRIBUTE_DATE),
                    XmlUtil.getNodeAttributeValue(nodeRequest, "requestId"));
        }
        return null;
    }


}