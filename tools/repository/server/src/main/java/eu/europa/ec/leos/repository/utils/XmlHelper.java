package eu.europa.ec.leos.repository.utils;

import eu.europa.ec.leos.repository.config.DocumentBuilderFactoryNS;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class XmlHelper {

    private final DocumentBuilderFactory documentBuilderFactory;
    private final DocumentBuilderFactoryNS documentBuilderFactoryNS;
    private final TransformerFactory transformerFactory;

    public Document createDocument(byte[] xmlContent, boolean namespaceEnabled) {
        try {
            DocumentBuilder builder = getDocumentBuilderFactory(namespaceEnabled).newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(fixUtf8Bytes(xmlContent)));
            doc.getDocumentElement().normalize();
            return doc;
        } catch (Exception e) {
            throw new IllegalStateException("Wrong XML Structure!", e);
        }
    }

    public Document createNewDocument(boolean namespaceEnabled) {
        try {
            DocumentBuilder builder = getDocumentBuilderFactory(namespaceEnabled).newDocumentBuilder();
            return builder.newDocument();
        } catch (Exception e) {
            throw new IllegalStateException("Wrong XML Structure!", e);
        }
    }

    private static byte[] fixUtf8Bytes(byte[] originalBytes) {
        if (originalBytes == null) return null;

        String content = new String(originalBytes, StandardCharsets.UTF_8);
        return content.getBytes(StandardCharsets.UTF_8);
    }

    public DocumentBuilderFactory getDocumentBuilderFactory(boolean namespaceEnabled) {
        return namespaceEnabled? documentBuilderFactoryNS : documentBuilderFactory;
    }

    public Transformer createTransformer() {
        try {
            return transformerFactory.newTransformer();
        } catch (TransformerConfigurationException e) {
            throw new IllegalStateException("Bad transformer configuration", e);
        }
    }
}
