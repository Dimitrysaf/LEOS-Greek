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

    private byte[] documentToBytes(Document doc) throws Exception {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        transformer.transform(new DOMSource(doc), new StreamResult(outputStream));
        return outputStream.toByteArray();
    }
}
