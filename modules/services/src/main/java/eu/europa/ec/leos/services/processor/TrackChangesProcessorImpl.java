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
import io.atlassian.fugue.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;

import static eu.europa.ec.leos.services.support.XmlHelper.EC;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_DELETABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_INITIAL_NUM_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_ORIGIN_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ROOT_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_DATE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVED_LABEL_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_FROM;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_MOVE_TO;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_USER_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_TITLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_UID_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LS;
import static eu.europa.ec.leos.services.support.XmlHelper.NUM;
import static eu.europa.ec.leos.services.support.XmlHelper.P;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_DELETE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.SOFT_MOVE_PLACEHOLDER_ID_PREFIX;
import static eu.europa.ec.leos.services.support.XmlHelper.TITLE;

@Service
public class TrackChangesProcessorImpl<T extends XmlDocument> implements TrackChangesProcessor<T> {
    @Autowired
    protected ElementProcessor elementProcessor;
    @Autowired
    protected XmlContentProcessor xmlContentProcessor;

    private static ArrayList<String> trackChangesAttrs = new ArrayList<>(Arrays.asList(LEOS_UID_ATTR, LEOS_ACTION_ATTR, LEOS_TITLE_ATTR, LEOS_INITIAL_NUM_ATTR,
            LEOS_SOFT_ACTION_ATTR, LEOS_SOFT_ACTION_ROOT_ATTR, LEOS_SOFT_USER_ATTR, LEOS_SOFT_DATE_ATTR, LEOS_SOFT_MOVE_TO,  LEOS_SOFT_MOVE_FROM,
            LEOS_SOFT_MOVED_LABEL_ATTR));

    private String removeTrackChangesActionOnElement(String elementContent, boolean updateOrigin) {
        int endOfTag = elementContent.indexOf(">");
        if (endOfTag != -1) {
            String tagStr = elementContent.substring(0, endOfTag+1);
            elementContent = cleanTag(elementContent, tagStr, updateOrigin);
        }
        //Check num
        int startOfNumTag = elementContent.indexOf("<" + NUM);
        int endOfNumTag = elementContent.indexOf("</" + NUM + ">");
        if (startOfNumTag != -1) {
            String tagNum = elementContent.substring(startOfNumTag, endOfNumTag + new String("</" + NUM + ">").length());
            if (!tagNum.contains(LEOS_ACTION_ATTR) && tagNum.contains(LEOS_TITLE_ATTR)) {
                elementContent = cleanTag(elementContent, tagNum, false);
            }
        }
        return elementContent.replaceAll("<akn" + P, "<" + P).replaceAll("</akn" + P + ">", "</" + P + ">").replaceAll("<akn" + TITLE, "<" + TITLE).replaceAll(
                "</akn" + TITLE + ">", "</" + TITLE + ">");
    }

    private String cleanTag(String elementContent, String tagStr, boolean updateOrigin) {
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
        if (updateOrigin && leosOriginAttrValue != null && leosOriginAttrValue.equals(LS)) {
            updatedTag = XmlHelper.insertOrUpdateAttributeValue(updatedTag, LEOS_ORIGIN_ATTR, EC);
        }
        return elementContent.replace(tagStr, updatedTag.toString());
    }

    private String keepOriginalNumValue(String moveToElementContent, String moveFromElementContent) {
        int startOfNumTag = moveToElementContent.indexOf("<" + NUM);
        int endOfNumTag = moveToElementContent.indexOf("</" + NUM + ">");
        startOfNumTag = startOfNumTag != -1 && endOfNumTag != -1 ? startOfNumTag + moveToElementContent.substring(startOfNumTag, endOfNumTag).indexOf(">") : -1;
        if (startOfNumTag != -1) {
            String tagNumValue = moveToElementContent.substring(startOfNumTag+1, endOfNumTag);
            startOfNumTag = moveFromElementContent.indexOf("<" + NUM);
            endOfNumTag = moveFromElementContent.indexOf("</" + NUM + ">");
            startOfNumTag = startOfNumTag != -1 && endOfNumTag != -1 ? startOfNumTag + moveFromElementContent.substring(startOfNumTag, endOfNumTag).indexOf(">") : -1;
            if (startOfNumTag != -1) {
                StringBuilder elementContent = new StringBuilder(moveFromElementContent);
                elementContent = elementContent.replace(startOfNumTag+1, endOfNumTag, tagNumValue);
                return elementContent.toString();
            }
        }
        return moveFromElementContent;
    }

    private byte[] updateElement(byte[] contentBytes, String elementFragment, String elementId, boolean updateOrigin) {
        elementFragment = removeTrackChangesActionOnElement(elementFragment, updateOrigin);
        Pair<byte[], String> result = xmlContentProcessor.updateSoftMovedElement(contentBytes, elementFragment);
        if (result.left() != null && result.left().length > 0) {
            contentBytes = result.left();
        }
        return xmlContentProcessor.replaceElementById(contentBytes, elementFragment, elementId);
    }

    @Override
    public byte[] acceptChange(T doc, String elementId, String elementTagName, TrackChangeActionType trackChangeAction) throws Exception {
        String elementType = elementTagName.equals("akn" + TITLE) ? TITLE : elementTagName;
        byte[] updatedContent = doc.getContent().get().getSource().getBytes();
        String elementFragment;
        switch (trackChangeAction) {
            case DELETE:
                return xmlContentProcessor.removeElementById(updatedContent, elementId, true);
            case ADD:
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                return updateElement(updatedContent, elementFragment, elementId, true);
            case MOVE_TO:
                String movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, movedFromElementId);
                updatedContent = elementProcessor.deleteElement(doc, elementId, elementType, false);
                return updateElement(updatedContent, elementFragment, movedFromElementId, true);
            case MOVE_FROM:
                String movedToElementId = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId;
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                updatedContent = elementProcessor.deleteElement(doc, movedToElementId, elementType, false);
                return updateElement(updatedContent, elementFragment, elementId, true);
            default:
                throw new UnsupportedOperationException(
                    "Unsupported track change action"
                );
        }
    }

    @Override
    public byte[] rejectChange(T doc, String elementId, String elementTagName, TrackChangeActionType trackChangeAction) throws Exception {
        String elementType = elementTagName.equals("akn" + TITLE) ? TITLE : elementTagName;
        byte[] updatedContent = doc.getContent().get().getSource().getBytes();
        String elementFragment;
        String moveToElementFragment;
        switch (trackChangeAction) {
            case DELETE:
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                return updateElement(updatedContent, elementFragment, elementId, true);
            case ADD:
                return xmlContentProcessor.removeElementById(updatedContent, elementId, true);
            case MOVE_TO:
                String movedFromElementId = elementId.replace(SOFT_MOVE_PLACEHOLDER_ID_PREFIX, "");
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, movedFromElementId);
                moveToElementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                elementFragment = keepOriginalNumValue(moveToElementFragment, elementFragment);
                updatedContent = elementProcessor.deleteElement(doc, movedFromElementId, elementType, false);
                return updateElement(updatedContent, elementFragment, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + movedFromElementId, true);
            case MOVE_FROM:
                String movedToElementId = SOFT_MOVE_PLACEHOLDER_ID_PREFIX + elementId;
                elementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, elementId);
                moveToElementFragment = xmlContentProcessor.getElementByNameAndId(updatedContent, elementType, movedToElementId);
                elementFragment = keepOriginalNumValue(moveToElementFragment, elementFragment);
                updatedContent = elementProcessor.deleteElement(doc, elementId, elementType, false);
                return updateElement(updatedContent, elementFragment, SOFT_DELETE_PLACEHOLDER_ID_PREFIX + elementId, true);
            default:
                throw new UnsupportedOperationException(
                    "Unsupported track change action"
                );
        }
    }
}
