package eu.europa.ec.leos.repository.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public class XercesUtils {

    private static final Logger LOG = LoggerFactory.getLogger(XercesUtils.class);

    public static Transformer createSecureTransformer() throws TransformerConfigurationException {
        TransformerFactory factory = TransformerFactory.newInstance();
        factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
        return factory.newTransformer();
    }

    private static DocumentBuilder getDocumentBuilder(boolean namespaceEnabled) throws ParserConfigurationException {
        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        builderFactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        builderFactory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        builderFactory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        builderFactory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        builderFactory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        builderFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        builderFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
        builderFactory.setExpandEntityReferences(false);
        builderFactory.setNamespaceAware(namespaceEnabled);
        builderFactory.setXIncludeAware(false);
        return builderFactory.newDocumentBuilder();
    }

    public static Document createXercesDocument(byte[] xmlContent, boolean namespaceEnabled) {
        try {
            DocumentBuilder builder = getDocumentBuilder(namespaceEnabled);
            Document doc = builder.parse(new ByteArrayInputStream(fixUtf8Bytes(xmlContent)));
            doc.getDocumentElement().normalize();
            return doc;
        } catch (Exception e) {
            throw new IllegalStateException("Wrong XML Structure!", e);
        }
    }

    public static Document createNewDocument(boolean namespaceEnabled) {
        try {
            DocumentBuilder builder = getDocumentBuilder(namespaceEnabled);
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
}
