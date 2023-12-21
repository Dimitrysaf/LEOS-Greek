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

package eu.europa.ec.leos.services.processor;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.response.SaveElementResponse;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XercesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;

import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;

@Service
public class TrackChangesProcessorImpl<T extends XmlDocument> implements TrackChangesProcessor<T> {
    @Autowired
    protected ElementProcessor elementProcessor;
    @Autowired
    protected XmlContentProcessor xmlContentProcessor;
    @Autowired
    protected CoEditionContext coEditionContext;

    @Override
    public byte[] acceptChange(T doc, String elementId, TrackChangeActionType trackChangeAction) throws Exception {
        byte[] updatedContent = doc.getContent().get().getSource().getBytes();
        switch (trackChangeAction) {
            case DELETE:
                return xmlContentProcessor.applyDeleteActionOnElement(updatedContent, elementId, true);
            case ADD:
                return xmlContentProcessor.applyAddActionOnElement(updatedContent, elementId, true);
            case MOVE_TO:
                String movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                return xmlContentProcessor.applyMoveActionOnElement(updatedContent, movedFromElementId, true);
            case MOVE_FROM:
                return xmlContentProcessor.applyMoveActionOnElement(updatedContent, elementId, true);
            default:
                throw new UnsupportedOperationException(
                        "Unsupported track change action"
                );
        }
    }

    @Override
    public byte[] rejectChange(T doc, String elementId, TrackChangeActionType trackChangeAction) throws Exception {
        byte[] updatedContent = doc.getContent().get().getSource().getBytes();
        switch (trackChangeAction) {
            case DELETE:
                return xmlContentProcessor.applyDeleteActionOnElement(updatedContent, elementId, false);
            case ADD:
                return xmlContentProcessor.applyAddActionOnElement(updatedContent, elementId, false);
            case MOVE_TO:
                String movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                return xmlContentProcessor.applyMoveActionOnElement(updatedContent, movedFromElementId, false);
            case MOVE_FROM:
                return xmlContentProcessor.applyMoveActionOnElement(updatedContent, elementId, false);
            default:
                throw new UnsupportedOperationException(
                        "Unsupported track change action"
                );
        }
    }

    @Override
    public void handleCoEdition(byte[] xmlContent, String docRef, String elementId, String tagName, TrackChangeActionType trackChangeAction, String presenterId,
                                boolean accept) {
        String elementFragment;
        String movedFromElementId;
        String movedToElementId;
        Node nodeToBeRemoved;
        Node nodeToBeAdded;
        String fragmentForMoveTo;
        String fragmentForMoveFrom;
        switch (trackChangeAction) {
            case DELETE:
                nodeToBeRemoved = XercesUtils.getElementById(xmlContent, elementId.replace(SOFT_DELETE_PLACEHOLDER_ID_PREFIX, ""));
                elementFragment = nodeToBeRemoved != null ? nodeToString(nodeToBeRemoved) : "";
                coEditionContext.sendUpdatedElements(docRef, presenterId, new SaveElementResponse(elementId, tagName, elementFragment));
                break;
            case ADD:
                nodeToBeAdded = XercesUtils.getElementById(xmlContent, elementId);
                elementFragment = nodeToBeAdded != null ? nodeToString(nodeToBeAdded) : "";
                coEditionContext.sendUpdatedElements(docRef, presenterId, new SaveElementResponse(elementId, tagName, elementFragment));
                break;
            case MOVE_TO:
                movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                movedToElementId = elementId;
                if (accept) {
                    nodeToBeAdded = XercesUtils.getElementById(xmlContent, movedFromElementId);
                    fragmentForMoveFrom = nodeToBeAdded != null ? nodeToString(nodeToBeAdded) : "";
                    fragmentForMoveTo = "";
                } else {
                    nodeToBeAdded = XercesUtils.getElementById(xmlContent, movedFromElementId);
                    fragmentForMoveTo = nodeToBeAdded != null ? nodeToString(nodeToBeAdded) : "";
                    fragmentForMoveFrom = "";
                }
                coEditionContext.addUpdatedElement(movedFromElementId, tagName, fragmentForMoveFrom);
                coEditionContext.sendUpdatedElements(docRef, presenterId, new SaveElementResponse(movedToElementId, tagName, fragmentForMoveTo));
                break;
            case MOVE_FROM:
                movedToElementId = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId;
                movedFromElementId = elementId;
                if (accept) {
                    nodeToBeAdded = XercesUtils.getElementById(xmlContent, movedFromElementId);
                    fragmentForMoveFrom = nodeToBeAdded != null ? nodeToString(nodeToBeAdded) : "";
                    fragmentForMoveTo = "";
                } else {
                    nodeToBeAdded = XercesUtils.getElementById(xmlContent, movedFromElementId);
                    fragmentForMoveTo = nodeToBeAdded != null ? nodeToString(nodeToBeAdded) : "";
                    fragmentForMoveFrom = "";
                }
                coEditionContext.addUpdatedElement(movedFromElementId, tagName, fragmentForMoveFrom);
                coEditionContext.sendUpdatedElements(docRef, presenterId, new SaveElementResponse(movedToElementId, tagName, fragmentForMoveTo));
                break;
            default:
                throw new UnsupportedOperationException(
                        "Unsupported track change action"
                );
        }
    }
}
