/*
 * Copyright 2022 European Commission
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

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.vo.toc.StructureConfigUtils;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.apache.commons.lang3.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.CONTENT;
import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.SUBPARAGRAPH;

@Service
public class FinancialStatementProcessorImpl implements FinancialStatementProcessor {

    protected ElementProcessor elementProcessor;
    private XmlContentProcessor xmlContentProcessor;
    protected NumberService numberService;
    protected final TableOfContentProcessor tableOfContentProcessor;
    private Provider<StructureContext> structureContextProvider;
    protected MessageHelper messageHelper;


    @Autowired
    public FinancialStatementProcessorImpl(XmlContentProcessor xmlContentProcessor, NumberService numberService, ElementProcessor elementProcessor,
                                           Provider<StructureContext> structureContextProvider, TableOfContentProcessor tableOfContentProcessor,
                                           MessageHelper messageHelper) {
        this.xmlContentProcessor = xmlContentProcessor;
        this.numberService = numberService;
        this.elementProcessor = elementProcessor;
        this.structureContextProvider = structureContextProvider;
        this.tableOfContentProcessor = tableOfContentProcessor;
        this.messageHelper = messageHelper;
    }

    @Override
    public byte[] updateElement(FinancialStatement document, String elementName, String elementId, String elementFragment) throws Exception {
        Validate.notNull(document, "Document is required.");
        Validate.notNull(elementId, "Element id is required.");
        Validate.notNull(elementFragment, "Element Fragment is required.");
        byte[] updatedContent = elementProcessor.updateElement(document, elementFragment, elementName, elementId, true);

        return xmlContentProcessor.doXMLPostProcessing(updatedContent);
    }

    @Override
    public byte[] insertNewElement(FinancialStatement financialStatement, String elementId, String tagName, boolean before) {
        String template;byte[] updatedContent;
        List<TocItem> items = structureContextProvider.get().getTocItems();
        byte[] content;
        switch (tagName) {
            case SUBPARAGRAPH:
                template = XmlHelper.getTemplateForFinancialStatement(StructureConfigUtils.getTocItemByNameOrThrow(items, SUBPARAGRAPH), messageHelper);
                template = XmlHelper.addDocTypeToXmlId(template, XmlHelper.STAT_FINANC_LEGIS);
                updatedContent = xmlContentProcessor.insertElementByTagNameAndId(getContent(financialStatement), template,
                        tagName, elementId, before, financialStatement.isTrackChangesEnabled());
                break;
            case CONTENT:
                content = getContent(financialStatement);
                Element contentElement = xmlContentProcessor.getElementById(content, elementId);
                template = XmlHelper.getTemplateForFinancialStatement(StructureConfigUtils.getTocItemByNameOrThrow(items, SUBPARAGRAPH), messageHelper);
                template = XmlHelper.addDocTypeToXmlId(template, XmlHelper.STAT_FINANC_LEGIS);
                String updatedElementContent = convertToSubparagraph(contentElement, template);
                try {
                    updatedContent = xmlContentProcessor.replaceElementById(content, updatedElementContent,
                            elementId);
                } catch (Exception e) {
                    throw new UnsupportedOperationException("Unsupported operation for tag: " + tagName);
                }
                break;
            default:
                throw new UnsupportedOperationException("Unsupported operation for tag: " + tagName);
        }
        return xmlContentProcessor.doXMLPostProcessing(updatedContent);
    }

    @Override
    public byte[] deleteElement(FinancialStatement financialStatement, String elementId, String tagName) throws Exception {
        Validate.notNull(financialStatement, "Document is required.");
        Validate.notNull(elementId, "Element id is required.");
        Validate.notNull(tagName, "Tag name is required.");
        byte[] updatedContent = getContent(financialStatement);
        if(tagName.equalsIgnoreCase(SUBPARAGRAPH)) {
            //TODO: Check for last element deletion
            updatedContent = xmlContentProcessor.removeElementById(updatedContent, elementId, financialStatement.isTrackChangesEnabled());
        } else {
            throw new UnsupportedOperationException("Unsupported operation for tag: " + tagName);
        }
        return xmlContentProcessor.doXMLPostProcessing(updatedContent);
    }

    private String convertToSubparagraph(Element contentElement, String template) {
        String wrappedContent = new StringBuilder("<" + SUBPARAGRAPH.toLowerCase() + " xml:id=\"transformed_" + contentElement.getElementId() + "\" " +
                LEOS_EDITABLE_ATTR+"=\"true\">").append(contentElement.getElementFragment().replaceAll("leos:editable=\"true\"", "")).
                append("</" + SUBPARAGRAPH.toLowerCase() + ">").append(template).toString();
        return wrappedContent;
    }

    private byte[] getContent(FinancialStatement financialStatement) {
        final Content content = financialStatement.getContent().getOrError(() -> "Financial statement content is required!");
        return content.getSource().getBytes();
    }

    @Override
    public byte[] mergeElement(FinancialStatement document, String elementContent, String elementName, String elementId) {
        Validate.notNull(document, "Document is required.");
        Validate.notNull(elementContent, "ElementContent is required.");
        Validate.notNull(elementName, "ElementName is required.");
        Validate.notNull(elementId, "ElementId is required.");

        byte[] contentBytes = getContent(document);
        byte[] updatedContent = xmlContentProcessor.mergeElement(contentBytes, elementContent, elementName, elementId);
        if (updatedContent != null) {
            updatedContent = xmlContentProcessor.doXMLPostProcessing(updatedContent);
        }
        return updatedContent;
    }
}
