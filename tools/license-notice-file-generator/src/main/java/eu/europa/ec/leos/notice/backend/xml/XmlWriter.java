package eu.europa.ec.leos.notice.backend.xml;

import eu.europa.ec.leos.notice.common.xml.XmlDocumentPersister;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.OutputStream;

public class XmlWriter {
    private final Document doc;
    private final Element rootElement;

    XmlWriter() throws ParserConfigurationException {
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

        // root elements
        this.doc = docBuilder.newDocument();
        this.rootElement = createElement("copyrights-lookup");
        doc.appendChild(rootElement);
    }

    void addDependency(Dependency dependency) {
        final Element artifact = createElement("artifact");
        artifact.appendChild(createElementWithText("groupId", dependency.getMvnPackage().getGroupId()));
        artifact.appendChild(createElementWithText("artifactId", dependency.getMvnPackage().getArtifactId()));
        artifact.appendChild(createElementWithText("version", dependency.getMvnPackage().getVersion()));
        artifact.appendChild(createElementWithText("url", dependency.getUrl()));

        Element license = createElement("license");
        license.appendChild(createElementWithText("name", dependency.getLicenseAlias()));
        artifact.appendChild(license);

        dependency.getCopyrights()
                .forEach(copyright -> artifact.appendChild(createElementWithText("copyright", copyright)));

        rootElement.appendChild(artifact);
    }

    void writeXml(OutputStream os) throws TransformerException {
        new XmlDocumentPersister().serializeDocument(doc, os);
    }

    private Element createElement(String tagName) {
        return doc.createElement(tagName);
    }

    private Element createElementWithText(String tagName, String text) {
        final Element element = createElement(tagName);
        element.setTextContent(text);
        return element;
    }
}