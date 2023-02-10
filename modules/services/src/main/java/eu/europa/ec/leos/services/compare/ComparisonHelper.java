/*
 * Copyright 2021 European Commission
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
package eu.europa.ec.leos.services.compare;

import eu.europa.ec.leos.model.action.SoftActionType;
import eu.europa.ec.leos.services.compare.vo.Element;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Node;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_SOFT_ACTION_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.LIST;
import static eu.europa.ec.leos.services.support.XercesUtils.hasChildTextNode;

public class ComparisonHelper {

    private static final Logger LOG = LoggerFactory.getLogger(ComparisonHelper.class);

    public static Element buildElement(Node node, Map<String, Integer> hmIndex, Map<String, Element> elementsMap) {
        String tagName = node.getNodeName();
        String tagContent = node.getTextContent();
        String tagId = XercesUtils.getId(node);

        hmIndex.put(tagName, hmIndex.get(tagName) == null ? 1 : (hmIndex.get(tagName)) + 1);
        Integer nodeIndex = hmIndex.get(tagName);

        boolean hasText = hasChildTextNode(node);
//        String innerText = getTextForSimilarityMatch(tagId, tagName, node);
        String innerText = "";  // TODO: This value is not used. TODO check if getTextForSimilarityMatch() is really needed
        List<Element> children = new ArrayList<>();
        List<Node> childrenNodes = XercesUtils.getChildren(node);
        for (int i = 0; i < childrenNodes.size(); i++) {
            Node childNode = childrenNodes.get(i);
            Element childElement = buildElement(childNode, hmIndex, elementsMap);
            children.add(childElement);
        }

        if (tagId == null) {
            tagId = tagName.concat(nodeIndex.toString());
        }

        Element element = new Element(node, tagId, tagName, tagContent, nodeIndex, hasText, innerText, children);
        elementsMap.put(tagId, element);
        return element;
    }

    public static boolean isElementContentEqual(ContentComparatorContext context) {
        boolean isElementContentEqual = false;
        if ((context.getOldElement() != null) && (context.getNewElement() != null)) {
            isElementContentEqual = (context.getOldElement().getNode()).isEqualNode(context.getNewElement().getNode());
            if (context.getThreeWayDiff() && (context.getIntermediateElement() != null)) {
                isElementContentEqual = isElementContentEqual && (context.getIntermediateElement().getNode()).isEqualNode(context.getNewElement().getNode());
            }
            if (isElementContentEqual
                    && (isListIntroAndFirstSubpoint(context.getOldElement()) && isListIntroAndFirstSubpoint(context.getNewElement()))) {
                isElementContentEqual = (context.getOldElement().getParent().getParent().getNode()).isEqualNode(context.getNewElement().getParent().getParent().getNode());
                if (context.getThreeWayDiff() && (context.getIntermediateElement() != null)) {
                    isElementContentEqual = isElementContentEqual && (context.getIntermediateElement().getParent().getParent().getNode()).isEqualNode(context.getNewElement().getParent().getParent().getNode());
                }
            }
        }
        return isElementContentEqual;
    }

    public static boolean isListIntro(Element element) {
        return (element != null
                && element.getTagName().equals(XmlHelper.SUBPARAGRAPH)
                && element.getParent().getTagName().equals(LIST)
                && element.getParent().getChildren().indexOf(element) == 0);
    }

    public static boolean isListEnding(Element element) {
        return (element != null
                && element.getTagName().equals(XmlHelper.SUBPARAGRAPH)
                && element.getParent().getTagName().equals(LIST)
                && element.getParent().getChildren().indexOf(element) == element.getParent().getChildren().size()-1);
    }

    public static boolean isListIntroAndFirstSubpoint(Element element) {
        if (isListIntro(element)) {
            int indexOfList = element.getParent().getParent().getChildren().indexOf(element.getParent());
            Element firstChild = element.getParent().getParent().getChildren().get(0);
            return (indexOfList == 0 || (indexOfList == 1 && firstChild.getTagName().equals(XmlHelper.NUM)));
        }
        return false;
    }

    public static boolean withPlaceholderPrefix(Node node, String placeholderPrefix) {
        String nodeId = XercesUtils.getId(node);
        return StringUtils.isNotEmpty(nodeId) && nodeId.startsWith(placeholderPrefix);
    }

    public static boolean isSoftAction(Node node, SoftActionType softActionType) {
        return XercesUtils.containsAttributeWithValue(node, LEOS_SOFT_ACTION_ATTR, softActionType.getSoftAction());
    }

    public static boolean isElementTransformedFrom(Node node, String attrName, String attrValue) {
        Node foundNode = XercesUtils.getNodeContainingAttributeValue(node, attrName, attrValue);
        return foundNode != null;
    }
}
