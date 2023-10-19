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
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;

import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_DELETABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LS;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;

@Service
public class TrackChangesProcessorImpl<T extends XmlDocument> implements TrackChangesProcessor<T> {
    @Autowired
    protected ElementProcessor elementProcessor;
    @Autowired
    protected XmlContentProcessor xmlContentProcessor;

    private static ArrayList<String> trackChangesAttrs = new ArrayList<>(Arrays.asList("leos:uid", "leos:action", "leos:title", "leos:initial-num", "leos:softaction", "leos:softactionroot", "leos:softuser", "leos:softdate", "leos:softmove_to",  "leos:softmove_from", "leos:softmove_label"));

    private String removeTrackChangesActionOnElement(String elementContent, String elementTagName, String elementId, boolean updateOrigin) {
        int endOfTag = elementContent.indexOf(">");
        if (endOfTag != -1) {
            String tagStr = elementContent.substring(0, endOfTag+1);
            StringBuilder updatedTag = new StringBuilder(tagStr);
            for (String attr : this.trackChangesAttrs) {
                updatedTag = XmlHelper.removeAttribute(updatedTag, attr);
            }
            Boolean leosEditableAttrValue = XmlHelper.getAttributeValueAsBoolean(tagStr, LEOS_EDITABLE_ATTR);
            Boolean leosDeletableAttrValue = XmlHelper.getAttributeValueAsBoolean(tagStr, LEOS_DELETABLE_ATTR);
            String leosOriginAttrValue = XmlHelper.getAttributeValue(tagStr, LEOS_ORIGIN_ATTR);

            if (leosEditableAttrValue != null) {
                updatedTag = XmlHelper.insertOrUpdateAttributeValue(updatedTag, LEOS_EDITABLE_ATTR, true);
            }
            if (leosDeletableAttrValue != null) {
                updatedTag = XmlHelper.insertOrUpdateAttributeValue(updatedTag, LEOS_DELETABLE_ATTR, true);
            }
            if (updateOrigin && leosOriginAttrValue != null && leosOriginAttrValue == LS) {
                updatedTag = XmlHelper.insertOrUpdateAttributeValue(updatedTag, LEOS_ORIGIN_ATTR, EC);
            }
            elementContent = elementContent.replace(tagStr, updatedTag.toString());
        }
        return elementContent.replaceAll("<aknp", "<p").replaceAll("</aknp>", "</p>").replaceAll("<akntitle", "<title").replaceAll(
                "</akntitle>", "</title>");
    }

    private String keepOriginalMunValue(String moveToElementContent, String moveFromElementContent) {
        int startOfNumTag = moveToElementContent.indexOf("<num");
        int endOfNumTag = moveToElementContent.indexOf("</num>");
        startOfNumTag = startOfNumTag != -1 && endOfNumTag != -1 ? startOfNumTag + moveToElementContent.substring(startOfNumTag, endOfNumTag).indexOf(">") : -1;
        if (startOfNumTag != -1) {
            String tagNumValue = moveToElementContent.substring(startOfNumTag+1, endOfNumTag);
            startOfNumTag = moveFromElementContent.indexOf("<num");
            endOfNumTag = moveFromElementContent.indexOf("</num>");
            startOfNumTag = startOfNumTag != -1 && endOfNumTag != -1 ? startOfNumTag + moveFromElementContent.substring(startOfNumTag, endOfNumTag).indexOf(">") : -1;
            if (startOfNumTag != -1) {
                StringBuilder elementContent = new StringBuilder(moveFromElementContent);
                elementContent = elementContent.replace(startOfNumTag+1, endOfNumTag, tagNumValue);
                return elementContent.toString();
            }
        }
        return moveFromElementContent;
    }

    private byte[] updateElement(byte[] contentBytes, String elementFragment, String elementId, String elementName, boolean updateOrigin) {
        elementFragment = removeTrackChangesActionOnElement(elementFragment, elementName, elementId, updateOrigin);
        return xmlContentProcessor.replaceElementById(contentBytes, elementFragment, elementId);
    }

    @Override
    public byte[] acceptChange(T doc, String elementId, String elementTagName, TrackChangeActionType trackChangeAction) throws Exception {
        String elementType = elementTagName == "akntitle" ? "title" : elementTagName;
        byte[] updatedContent = doc.getContent().get().getSource().getBytes();
        String elementFragment;
        switch (trackChangeAction) {
            case DELETE:
                return xmlContentProcessor.removeElementById(updatedContent, elementId, true);
            case ADD:
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                return updateElement(updatedContent, elementFragment, elementId, elementType,  true);
            case MOVE_TO:
                String movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, movedFromElementId);
                updatedContent = elementProcessor.deleteElement(doc, elementId, elementType, false);
                return updateElement(updatedContent, elementFragment, movedFromElementId, elementType,  true);
            case MOVE_FROM:
                String movedToElementId = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId;
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                updatedContent = elementProcessor.deleteElement(doc, movedToElementId, elementType, false);
                return updateElement(updatedContent, elementFragment, elementId, elementType,  true);
            default:
                throw new UnsupportedOperationException(
                        "Unsupported track change action"
                );
        }
    }

    @Override
    public byte[] rejectChange(T doc, String elementId, String elementTagName, TrackChangeActionType trackChangeAction) throws Exception {
        String elementType = elementTagName == "akntitle" ? "title" : elementTagName;
        byte[] updatedContent = doc.getContent().get().getSource().getBytes();
        String elementFragment;
        String moveToElementFragment;
        switch (trackChangeAction) {
            case DELETE:
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                return updateElement(updatedContent, elementFragment, elementId, elementType,  true);
            case ADD:
                return xmlContentProcessor.removeElementById(updatedContent, elementId, true);
            case MOVE_TO:
                String movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, movedFromElementId);
                moveToElementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                elementFragment = keepOriginalMunValue(moveToElementFragment, elementFragment);
                updatedContent = elementProcessor.deleteElement(doc, movedFromElementId, elementType, false);
                return updateElement(updatedContent, elementFragment, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + movedFromElementId, elementType,  true);
            case MOVE_FROM:
                String movedToElementId = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId;
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                moveToElementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, movedToElementId);
                elementFragment = keepOriginalMunValue(moveToElementFragment, elementFragment);
                updatedContent = elementProcessor.deleteElement(doc, elementId, elementType, false);
                return updateElement(updatedContent, elementFragment, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + elementId, elementType,  true);
            default:
                throw new UnsupportedOperationException(
                        "Unsupported track change action"
                );
        }
    }
}
