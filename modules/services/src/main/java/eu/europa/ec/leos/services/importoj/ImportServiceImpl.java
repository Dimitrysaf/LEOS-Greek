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
package eu.europa.ec.leos.services.importoj;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.ExternalDocumentProvider;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Node;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static eu.europa.ec.leos.services.support.XercesUtils.createNodeFromXmlFragment;
import static eu.europa.ec.leos.services.support.XercesUtils.getAttributeValue;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToString;
import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.BODY;
import static eu.europa.ec.leos.services.support.XmlHelper.CHAPTER;
import static eu.europa.ec.leos.services.support.XmlHelper.HIGHER_ELEMENTS;
import static eu.europa.ec.leos.services.support.XmlHelper.OJ_IMPORT_ELEMENTS;
import static eu.europa.ec.leos.services.support.XmlHelper.PART;
import static eu.europa.ec.leos.services.support.XmlHelper.RECITAL;
import static eu.europa.ec.leos.services.support.XmlHelper.RECITALS;
import static eu.europa.ec.leos.services.support.XmlHelper.SECTION;
import static eu.europa.ec.leos.services.support.XmlHelper.TITLE;
import static eu.europa.ec.leos.services.support.XmlHelper.XMLID;

@Service
public class ImportServiceImpl implements ImportService {

    private static final Logger LOG = LoggerFactory.getLogger(ImportServiceImpl.class);

    private ExternalDocumentProvider externalDocumentProvider;
    private ConversionHelper conversionHelper;
    private XmlContentProcessor xmlContentProcessor;
    private NumberService numberService;
    private XPathCatalog xPathCatalog;
    private DocumentLanguageContext documentLanguageContext;

    @Autowired
    public ImportServiceImpl(ExternalDocumentProvider externalDocumentProvider, ConversionHelper conversionHelper,
            XmlContentProcessor xmlContentProcessor, NumberService numberService, XPathCatalog xPathCatalog, DocumentLanguageContext documentLanguageContext) {
        this.externalDocumentProvider = externalDocumentProvider;
        this.conversionHelper = conversionHelper;
        this.xmlContentProcessor = xmlContentProcessor;
        this.numberService = numberService;
        this.xPathCatalog = xPathCatalog;
        this.documentLanguageContext = documentLanguageContext;
    }

    @Autowired
    private MessageHelper messageHelper;

    @Override
    public String getFormexDocument(String type, int year, int number) {
        return externalDocumentProvider.getFormexDocument(type, year, number);
    }

    @Override
    @Cacheable(value = "aknCache")
    public String getAknDocument(String type, int year, int number) {
        return conversionHelper.convertFormexToAKN(getFormexDocument(type, year, number));
    }

    @Override
    public byte[] insertSelectedElements(Bill bill, byte[] importedContent, List<String> elementIds, List<TableOfContentItemVO> tocList) {
        LOG.info("Importing {} elements...", elementIds.size());
        String language = bill.getMetadata().get().getLanguage();
        documentLanguageContext.setDocumentLanguage(language);
        byte[] documentContent = getContent(bill);
        long startTime = System.currentTimeMillis();
        List<String> importedElementIds = new ArrayList<>();
        for (String id : elementIds) {
            if(importedElementIds.contains(id)) {
                continue;
            }
            Element element = xmlContentProcessor.getElementById(importedContent, id);
            if (element == null) {
                throw new IllegalStateException("One of the IDs passed from FE is not present in the document. ID: " + id);
            }
            // Get id of the last element in the document
            String xPath = xPathCatalog.getXPathLastElement(element.getElementTagName());
            String elementId = null;
            try {
                elementId = xmlContentProcessor.getElementIdByPath(documentContent, xPath);
            } catch (IllegalArgumentException exception) {
                LOG.info("Element with xpath {} not found in document with id {}",xPath, bill.getId());
            }
            String elementType = element.getElementTagName();

            Node elementNode = createNodeFromXmlFragment(element.getElementFragment().getBytes());
            removeUnselectedChildNodes(elementNode, elementIds);
            importedElementIds.addAll(getElementIds(elementNode));
            String elementFragment = nodeToString(elementNode);

            // Do pre-processing on the selected elements
            String updatedElement = xmlContentProcessor.doImportedElementPreProcessing(replaceNotAllowedElements(elementFragment), elementType);
            if (HIGHER_ELEMENTS.contains(elementType.toLowerCase())) {
                updatedElement = this.numberService.renumberImportedHigherSubDivision(updatedElement, language, elementType);
            } else if (elementType.equalsIgnoreCase(ARTICLE)) {
                updatedElement = this.numberService.renumberImportedArticle(updatedElement);
            } else if (elementType.equalsIgnoreCase(RECITAL)) {
                updatedElement = this.numberService.renumberImportedRecital(updatedElement);
            }
            updatedElement = XercesUtils.removeXmlDefinition(updatedElement).replaceFirst(">", " leos:editable=\"true\" leos:deletable=\"true\">");

            // Insert selected element to the document
            if (elementId != null) {
                documentContent = xmlContentProcessor.insertElementByTagNameAndId(documentContent, updatedElement,
                        element.getElementTagName(), elementId, checkIfLastArticleIsEntryIntoForce(documentContent, element, elementId,
                                documentLanguageContext.getDocumentLanguage()), bill.isTrackChangesEnabled());
            } else if (HIGHER_ELEMENTS.contains(elementType.toLowerCase())) {
                documentContent = xmlContentProcessor.appendElementToTag(documentContent, BODY, updatedElement, true);
            } else if (elementType.equalsIgnoreCase(ARTICLE)) {
                documentContent = xmlContentProcessor.appendElementToTag(documentContent, BODY, updatedElement, true);
            } else if (elementType.equalsIgnoreCase(RECITAL)) {
                documentContent = xmlContentProcessor.appendElementToTag(documentContent, RECITALS, updatedElement, true);
            }
        }
        long endTime = System.currentTimeMillis();
        long insertTime = endTime - startTime;
        startTime = System.currentTimeMillis();

        // Renumber
        documentContent = this.numberService.renumberRecitals(documentContent);
        documentContent = this.numberService.renumberArticles(documentContent);
        documentContent = this.numberService.renumberHigherSubDivisions(documentContent, tocList);
        endTime = System.currentTimeMillis();
        long numberingTime = endTime - startTime;
        startTime = System.currentTimeMillis();

        documentContent = xmlContentProcessor.doXMLPostProcessing(documentContent);
        endTime = System.currentTimeMillis();
        long postProcessingTime = endTime - startTime;

        LOG.info("{} elements imported. insertTime {} ms ({} secs), numberingTime {} ms, postProcessingTime {} ms", elementIds.size(), insertTime, insertTime/1000, numberingTime, postProcessingTime);
        return documentContent;
    }

    private void removeUnselectedChildNodes(Node elementNode, List<String> selectedElementIds) {
        for(int i = 0; i < elementNode.getChildNodes().getLength(); i++) {
            Node childNode = elementNode.getChildNodes().item(i);
            if(OJ_IMPORT_ELEMENTS.contains(childNode.getNodeName().toLowerCase())) {
                if (!selectedElementIds.contains(getAttributeValue(childNode, XMLID))) {
                    elementNode.removeChild(childNode);
                    i--;
                } else {
                    removeUnselectedChildNodes(childNode, selectedElementIds);
                }
            }
        }
    }

    private List<String> getElementIds(Node element) {
        List<String> elementIds = new ArrayList<>();
        elementIds.add(getAttributeValue(element, XMLID));
        for(int i = 0; i < element.getChildNodes().getLength(); i++) {
            Node child = element.getChildNodes().item(i);
            if(OJ_IMPORT_ELEMENTS.contains(child.getNodeName().toLowerCase())) {
                elementIds.addAll(getElementIds(child));
            }
        }
        return elementIds;
    }

    private static String replaceNotAllowedElements(String elementFragment) {
        return elementFragment.replace("<eol/>", " - ");
    }

    // check if the last article in the document has heading Entry into force, if yes articles imported before EIF article
    private boolean checkIfLastArticleIsEntryIntoForce(byte[] documentContent, Element element, String elementId, String language) {
        boolean isLastElementEIF = false;
        String lastElement = xmlContentProcessor.getElementByNameAndId(documentContent, element.getElementTagName(), elementId);
        // Xml fragment passed may not contain namespace information
        String headingElementValue = xmlContentProcessor.getElementValue(lastElement.getBytes(StandardCharsets.UTF_8), xPathCatalog.getXPathHeading(), false);
        if (checkIfHeadingIsEntryIntoForce(headingElementValue, language)) {
            isLastElementEIF = true;
        }
        return isLastElementEIF;
    }

    // Gets the heading message from locale
    private boolean checkIfHeadingIsEntryIntoForce(String headingElementValue, String language) {
        boolean isHeadingMatched = false;
        if (headingElementValue != null && !headingElementValue.isEmpty()) {
            isHeadingMatched = messageHelper.getMessage("legaltext.article.entryintoforce.heading").replaceAll("\\h+", "")
                    .equalsIgnoreCase(StringUtils.trimAllWhitespace(headingElementValue.replaceAll("\\h+", "")));
        }
        return isHeadingMatched;
    }

    private byte[] getContent(Bill bill) {
        final Content content = bill.getContent().getOrError(() -> "Document content is required!");
        return content.getSource().getBytes();
    }

}
