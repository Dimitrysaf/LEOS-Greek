package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.services.document.operation.OperationStrategy;
import eu.europa.ec.leos.services.document.operation.OperationStrategyFactory;
import eu.europa.ec.leos.services.dto.request.*;
import eu.europa.ec.leos.services.store.WorkspaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

/**
 * Implementation of InjectElementService for processing element injection requests.
 * This service integrates with external applications (e.g., DG SANTE EMP2) to modify
 * EdiT document content by applying operations on specific sections.
 * 
 * The service:
 * 1. Retrieves the target document from the workspace
 * 2. Parses the XML content into a DOM structure
 * 3. Applies the requested operations using strategy pattern
 * 4. Persists the modified document back to the repository
 */
@Service
@Slf4j
public class InjectElementServiceImpl implements InjectElementService {

    private final WorkspaceService workspaceService;
    private final DocumentContentService documentContentService;
    private final OperationStrategyFactory strategyFactory;

    @Autowired
    public InjectElementServiceImpl(WorkspaceService workspaceService, 
                                   DocumentContentService documentContentService,
                                   OperationStrategyFactory strategyFactory) {
        this.workspaceService = workspaceService;
        this.documentContentService = documentContentService;
        this.strategyFactory = strategyFactory;
    }

    /**
     * Processes element injection requests for a document.
     * 
     * This method:
     * 1. Retrieves the document by its reference ID
     * 2. Parses the XML content into a DOM Document
     * 3. Iterates through each section request and applies the corresponding operation strategy
     * 4. Converts the modified DOM back to bytes
     * 5. Updates the document in the repository
     * 
     * @param request the DocumentLinesRequest containing document ID and section operations
     * @throws RuntimeException if document retrieval, parsing, or update fails
     */
    @Override
    public void injectElements(DocumentLinesRequest request) {
        try {
            XmlDocument document = workspaceService.findDocumentByRef(request.getDocumentId(), XmlDocument.class);
            byte[] content = document.getContent().get().getSource().getBytes();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(content));

            for (SectionRequest section : request.getSections()) {
                OperationStrategy strategy = strategyFactory.getStrategy(section.getOperation());
                strategy.execute(doc, section);
            }

            content = documentToBytes(doc);
            documentContentService.updateDocument(document, content, 
                "Inject elements - " + request.getSections().get(0).getOperation());
        } catch (Exception e) {
            log.error("Error injecting elements: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to inject elements", e);
        }
    }

    /**
     * Converts a DOM Document to a byte array.
     * 
     * @param doc the DOM Document to convert
     * @return byte array representation of the XML document
     * @throws Exception if transformation fails
     */
    private byte[] documentToBytes(Document doc) throws Exception {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        transformer.transform(new DOMSource(doc), new StreamResult(outputStream));
        return outputStream.toByteArray();
    }
}
