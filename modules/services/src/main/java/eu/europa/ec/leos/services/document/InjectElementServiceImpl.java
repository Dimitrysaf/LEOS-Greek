package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.services.dto.request.*;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.WorkspaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
@Slf4j
public class InjectElementServiceImpl implements InjectElementService {

    private final WorkspaceService workspaceService;
    private final DocumentContentService documentContentService;

    @Autowired
    public InjectElementServiceImpl(WorkspaceService workspaceService, DocumentContentService documentContentService) {
        this.workspaceService = workspaceService;
        this.documentContentService = documentContentService;
    }

    @Override
    public void injectElements(DocumentLinesRequest request) {
        try {
            XmlDocument document = workspaceService.findDocumentByRef(request.getDocumentId(), XmlDocument.class);
            byte[] content = document.getContent().get().getSource().getBytes();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(content));

            for (SectionRequest section : request.getSections()) {
                if (section.getOperation() == Operation.CLEAN) {
                    cleanSection(doc, section.getSectionType());
                }
            }

            content = documentToBytes(doc);
            documentContentService.updateDocument(document, content, "Inject elements - CLEAN operation");
        } catch (Exception e) {
            log.error("Error injecting elements: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to inject elements", e);
        }
    }

    private void cleanSection(Document doc, SectionType sectionType) {
        String tagName = getSectionTagName(sectionType);
        Node sectionNode = doc.getElementsByTagName(tagName).item(0);
        
        if (sectionNode != null) {
            while (sectionNode.hasChildNodes()) {
                sectionNode.removeChild(sectionNode.getFirstChild());
            }
        }
    }

    private String getSectionTagName(SectionType sectionType) {
        switch (sectionType) {
            case CITATIONS: return "citations";
            case RECITALS: return "recitals";
            case ENACTING_TERMS: return "body";
            default: throw new IllegalArgumentException("Unknown section type: " + sectionType);
        }
    }

    private String getElementTagName(AknType type) {
        switch (type) {
            case CITATION: return "citation";
            case RECITAL: return "recital";
            case TITLE: return "title";
            case CHAPTER: return "chapter";
            case SECTION: return "section";
            case NUMBERED_ARTICLE: return "article";
            case UNNUMBERED_ARTICLE: return "article";
            case PARAGRAPH: return "paragraph";
            case LIST: return "list";
            case POINT: return "point";
            default: throw new IllegalArgumentException("Unknown AKN type: " + type);
        }
    }

    private byte[] documentToBytes(Document doc) throws Exception {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        transformer.transform(new DOMSource(doc), new StreamResult(outputStream));
        return outputStream.toByteArray();
    }
}
