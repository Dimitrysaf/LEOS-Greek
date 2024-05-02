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
package eu.europa.ec.leos.services.numbering;

import com.google.common.base.Stopwatch;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.services.numbering.depthBased.ParentChildConverter;
import eu.europa.ec.leos.services.numbering.depthBased.ParentChildNode;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.structure.NumberingType;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.inject.Provider;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XercesUtils.replaceElement;
import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.CHAPTER;
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.PART;
import static eu.europa.ec.leos.services.support.XmlHelper.RECITAL;
import static eu.europa.ec.leos.services.support.XmlHelper.SECTION;
import static eu.europa.ec.leos.services.support.XmlHelper.TITLE;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;
import static eu.europa.ec.leos.services.utils.StructureConfigUtils.getTocItemByName;
import static eu.europa.ec.leos.services.utils.StructureConfigUtils.isAutoNumberingEnabled;

/**
 * Service used for Numbering a full XNL document.
 *
 * The service makes use of two components to achieve the goal:
 * - NumberProcessorHandler: CompositePattern used for generic numbering configured in structure_xx.xml
 * - NumberProcessorLevel: Specific/custom implementation for Level numbering
 */
@Component
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class NumberServiceProposal implements NumberService {

    private static final Logger LOG = LoggerFactory.getLogger(NumberServiceProposal.class);

    private final Provider<StructureContext> structureContextProvider;
    private final NumberProcessorHandler numberProcessorHandler;
    private final ParentChildConverter parentChildConverter;
    private final XmlContentProcessor xmlContentProcessor;
    private final DocumentLanguageContext documentLanguageContext;

    private List<TocItem> tocItems;

    @Autowired
    public NumberServiceProposal(Provider<StructureContext> structureContextProvider, NumberProcessorHandler numberProcessorHandler,
            ParentChildConverter parentChildConverter, XmlContentProcessor xmlContentProcessor, DocumentLanguageContext documentLanguageContext) {
        this.structureContextProvider = structureContextProvider;
        this.numberProcessorHandler = numberProcessorHandler;
        this.parentChildConverter = parentChildConverter;
        this.xmlContentProcessor = xmlContentProcessor;
        this.documentLanguageContext = documentLanguageContext;
    }

    @Override
    public byte[] renumberArticles(byte[] xmlContent) {
        return renumberDocument(xmlContent, ARTICLE, true, false);
    }

    @Override
    public byte[] renumberArticles(byte[] xmlContent, boolean renumberChildren) {
        return renumberDocument(xmlContent, ARTICLE, true, renumberChildren);
    }

    @Override
    public byte[] renumberSpecificElementChildren(byte[] xmlContent, String tagName, String elementId) {
        Document document = createXercesDocument(xmlContent, true);
        Node specificNode = XercesUtils.getElementById(document, elementId);
        if (specificNode != null) {
            Document specificNodeDoc = createXercesDocument(nodeToByteArray(specificNode), true);
            numberProcessorHandler.renumberDocument(specificNodeDoc, tagName, documentLanguageContext.getDocumentLanguage(),true);
            replaceElement(specificNode, nodeToString(specificNodeDoc));
        }
        return nodeToByteArray(document);
    }

    @Override
    public byte[] renumberRecitals(byte[] xmlContent) {
        return renumberDocument(xmlContent, RECITAL, true, false);
    }

    @Override
    public String renumberImportedArticle(String xmlContentAsString) {
        byte[] initialContent = xmlContentAsString.getBytes(UTF_8);
        byte[] renumberedContent = renumberDocument(initialContent, ARTICLE, false, true);
        if (!Arrays.equals(initialContent, renumberedContent)) {
            return new String(renumberedContent);
        }
        return xmlContentAsString;
    }

    private byte[] renumberDocument(byte[] xmlContent, String elementName, boolean namespaceEnabled, boolean renumberChildren) {
        tocItems = structureContextProvider.get().getTocItems();
        if (isAutoNumberingEnabled(tocItems, elementName, documentLanguageContext.getDocumentLanguage())) {
            Document document = createXercesDocument(xmlContent, namespaceEnabled);
            numberProcessorHandler.renumberDocument(document, elementName, documentLanguageContext.getDocumentLanguage(), renumberChildren);
            return nodeToByteArray(document);
        }
        return xmlContent;
    }

    @Override
    public String renumberImportedRecital(String xmlContent) {
        return xmlContent;
    }

    @Override
    public byte[] renumberParagraph(byte[] xmlContent) {
        return xmlContent;
    }

    @Override
    public byte[] renumberDivisions(byte[] xmlContent) {
        return xmlContent;
    }

    @Override
    public byte[] renumberLevel(byte[] xmlContent) {
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        if (isAutoNumberingEnabled(tocItems, LEVEL, documentLanguageContext.getDocumentLanguage())) {
            Stopwatch stopwatch = Stopwatch.createStarted();
            Document document = createXercesDocument(xmlContent);
            NodeList nodeList = document.getElementsByTagName(LEVEL);
            List<ParentChildNode> parentChildList = parentChildConverter.getParentChildStructure(nodeList, true);
            LOG.trace("renumberLevel - Found {} '{}'s element in the document, and grouped them in {} top elements", nodeList.getLength(), LEVEL, parentChildList.size());
            numberProcessorHandler.renumberDepthBased(parentChildList, LEVEL, 1);
            LOG.debug("Renumbered {} '{}' in {} milliseconds ({} sec)", nodeList.getLength(), LEVEL, stopwatch.elapsed(TimeUnit.MILLISECONDS), stopwatch.elapsed(TimeUnit.SECONDS));
            return nodeToByteArray(document);
        }
        return xmlContent;
    }

    @Override
    public byte[] renumberHigherSubDivisions(byte[] xmlContent, List<TableOfContentItemVO> tableOfContentItemVOList) {
        xmlContent = renumberDocumentSubdivision(xmlContent, tableOfContentItemVOList, PART, false);
        xmlContent = renumberDocumentSubdivision(xmlContent, tableOfContentItemVOList, TITLE, false);
        xmlContent = renumberDocumentSubdivision(xmlContent, tableOfContentItemVOList, CHAPTER, false);
        xmlContent = renumberDocumentSubdivision(xmlContent, tableOfContentItemVOList, SECTION, false);
        return xmlContent;
    }

    public static List<TableOfContentItemVO> searchInFlatList(List<TableOfContentItemVO> tableOfContentItemVOList, String elementName) {
        List<TableOfContentItemVO> flatList = new ArrayList<>();
        for (TableOfContentItemVO item : tableOfContentItemVOList) {
            flatList.add(item);
            if (!item.getChildItems().isEmpty()) {
                flatList.addAll(searchInFlatList(item.getChildItems(), elementName));
            }
        }
        flatList = flatList.stream().filter(tocVO -> tocVO.getTocItem().getAknTag().value().equalsIgnoreCase(elementName))
                .collect(Collectors.toList());
        return flatList;
    }

    private byte[] renumberDocumentSubdivision(byte[] xmlContent, List<TableOfContentItemVO> tableOfContentItemVOList, String elementName, boolean namespaceEnabled) {
        tocItems = structureContextProvider.get().getTocItems();
        String language = documentLanguageContext.getDocumentLanguage();
        TocItem tocItem = getTocItemByName(tocItems, elementName);
        NumberingType numberingType = StructureConfigUtils.getNumberingTypeByLanguage(tocItem, language);
        List<TableOfContentItemVO> itemVOs = searchInFlatList(tableOfContentItemVOList, elementName);
        if (!itemVOs.isEmpty() && elementName.equals(CHAPTER)) {
            TableOfContentItemVO tableOfContentItemVO = itemVOs.stream().filter(itemVO -> itemVO.getNumberingType() != null).findFirst().orElse(null);
            numberingType = tableOfContentItemVO != null ? tableOfContentItemVO.getNumberingType() : numberingType;
        }

        if (isAutoNumberingEnabled(tocItems, elementName, language)) {
            Document document = createXercesDocument(xmlContent, namespaceEnabled);
            NodeList elements = document.getElementsByTagName(elementName);
            List<Node> nodeList = XercesUtils.getNodesAsList(elements);
            List<Node> subDivParentNodeList = new ArrayList<>();
            //from this list find parent and get child nodes list of same subdivision type and send that list to renumber
            for (int i = 0; i < nodeList.size(); i++) {
                Node parentNode = nodeList.get(i).getParentNode();
                if (subDivParentNodeList.indexOf(parentNode) == -1) {
                    subDivParentNodeList.add(parentNode);
                    NodeList childNodes = parentNode.getChildNodes();
                    List<Node> subdivsionNodeList = XercesUtils.getNodesAsList(childNodes).stream()
                            .filter(node -> node.getNodeName().equals(elementName))
                            .collect(Collectors.toList());
                    numberProcessorHandler.renumberHighSubDiv(subdivsionNodeList, numberingType, language);
                }
            }
            return nodeToByteArray(document);
        }
        return xmlContent;
    }
}
