package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.services.dto.request.LineItem;
import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.dto.request.SectionType;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.vo.structure.TocItem;
import jakarta.inject.Provider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static eu.europa.ec.leos.services.support.XmlHelper.CITATIONS;

@Component
@Slf4j
public class CleanOperationStrategy implements OperationStrategy {

    private final ElementInjectionHelper injectionHelper;
    private final XmlContentProcessor xmlContentProcessor;
    private final NumberService numberService;
    private final SectionContentValidator sectionContentValidator;
    private final Provider<StructureContext> structureContextProvider;
    private final DocumentLanguageContext documentLanguageContext;
    private final DocumentBuilderFactory documentBuilderFactory;
    private final TransformerFactory transformerFactory;

    @Autowired
    public CleanOperationStrategy(ElementInjectionHelper injectionHelper,
                                  XmlContentProcessor xmlContentProcessor,
                                  NumberService numberService,
                                  SectionContentValidator sectionContentValidator,
                                  Provider<StructureContext> structureContextProvider,
                                  DocumentLanguageContext documentLanguageContext,
                                  DocumentBuilderFactory documentBuilderFactory,
                                  TransformerFactory transformerFactory) {
        this.injectionHelper = injectionHelper;
        this.xmlContentProcessor = xmlContentProcessor;
        this.numberService = numberService;
        this.sectionContentValidator = sectionContentValidator;
        this.structureContextProvider = structureContextProvider;
        this.documentLanguageContext = documentLanguageContext;
        this.documentBuilderFactory = documentBuilderFactory;
        this.transformerFactory = transformerFactory;
    }

    @Override
    public byte[] execute(byte[] content, SectionRequest section, String documentCollectionName, LeosCategory category) {
        try {
            sectionContentValidator.validate(section.getSectionType(), section.getItems(), documentCollectionName, category);
            Document doc = parseXml(content);
            Node sectionNode = findSection(doc, section.getSectionType());

            if (sectionNode == null) {
                log.warn("Section {} not found in document", getSectionTagName(section.getSectionType()));
                return content;
            }

            clearSection(sectionNode, section.getSectionType());
            injectItems(doc, section);
            return postProcess(doc, section.getSectionType());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private Document parseXml(byte[] content) throws Exception {
        DocumentBuilder builder;
        // DocumentBuilder is not thread-safe; a new instance must be created per call
        synchronized (documentBuilderFactory) {
            builder = documentBuilderFactory.newDocumentBuilder();
        }
        return builder.parse(new ByteArrayInputStream(content));
    }

    private Node findSection(Document doc, SectionType sectionType) {
        return doc.getElementsByTagName(getSectionTagName(sectionType)).item(0);
    }

    private void clearSection(Node sectionNode, SectionType sectionType) {
        if (sectionType == SectionType.RECITALS) {
            org.w3c.dom.NodeList children = sectionNode.getChildNodes();
            for (int i = children.getLength() - 1; i >= 0; i--) {
                Node child = children.item(i);
                if (XmlHelper.RECITAL.equals(child.getLocalName()) || XmlHelper.RECITALS.equals(child.getLocalName())) {
                    sectionNode.removeChild(child);
                }
            }
        } else if (sectionType == SectionType.ENACTING_TERMS) {
            org.w3c.dom.NodeList children = sectionNode.getChildNodes();
            for (int i = children.getLength() - 1; i >= 0; i--) {
                Node child = children.item(i);
                if (!XmlHelper.CLAUSE.equals(child.getLocalName())) {
                    sectionNode.removeChild(child);
                }
            }
        } else {
            while (sectionNode.hasChildNodes()) {
                sectionNode.removeChild(sectionNode.getFirstChild());
            }
        }
    }

    private void injectItems(Document doc, SectionRequest section) {
        List<LineItem> items = section.getItems() != null ? section.getItems() : Collections.emptyList();
        if (section.getSectionType() == SectionType.CITATIONS) {
            injectionHelper.insertCitations(doc, items);
        } else if (section.getSectionType() == SectionType.RECITALS) {
            injectionHelper.insertRecitals(doc, items);
        } else if (section.getSectionType() == SectionType.ENACTING_TERMS) {
            injectionHelper.insertEnactingTerms(doc, items);
        }
    }

    private byte[] postProcess(Document doc, SectionType sectionType) throws Exception {
        byte[] result;
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            transformerFactory.newTransformer().transform(new DOMSource(doc), new StreamResult(outputStream));
            result = outputStream.toByteArray();
        }
        if (sectionType == SectionType.RECITALS) {
            result = numberService.renumberRecitals(result);
        } else if (sectionType == SectionType.ENACTING_TERMS) {
            result = numberService.renumberArticles(result, true);
            List<TocItem> tocItems = structureContextProvider.get().getTocItems();
            String language = documentLanguageContext.getDocumentLanguage();
            for (String elementName : Arrays.asList(XmlHelper.PART, XmlHelper.TITLE, XmlHelper.CHAPTER, XmlHelper.SECTION)) {
                result = numberService.renumberHigherSubDivisions(result, language, elementName, tocItems);
            }
        }
        return xmlContentProcessor.doXMLPostProcessing(result);
    }

    private String getSectionTagName(SectionType sectionType) {
        switch (sectionType) {
            case CITATIONS:      return CITATIONS;
            case RECITALS:       return XmlHelper.RECITALS;
            case ENACTING_TERMS: return XmlHelper.BODY;
            default: throw new IllegalArgumentException("Unknown section type: " + sectionType);
        }
    }
}
