package eu.europa.ec.leos.repository.utils;

import eu.europa.ec.leos.repository.entities.DocumentContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.*;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;


/**
 * Sanitizer for AKN input.
 * <p>
 *     Elements, attributes and attribute values sanitization is blacklisted-based.
 * </p><p>
 *     Processing Instructions sanitization is whitelist-based, with xml-stylesheet only allowed.
 * </p>
 */
public class AknSanitizer {
    private static final Logger LOG = LoggerFactory.getLogger(AknSanitizer.class);

    private static final int MAX_DEPTH = 100;

    // Transformers are not thread-safe, so we use ThreadLocal to cache them and avoid synchronization at the same time
    private static final ThreadLocal<Transformer> transformerTL = ThreadLocal.withInitial(() -> {
        try {
            return XercesUtils.createSecureTransformer();
        } catch (TransformerConfigurationException e) {
            throw new RuntimeException("Failed to create transformer.", e);
        }
    });

    // Elements that can execute or embed code regardless of namespace
    private static final Set<String> BLOCKED_ELEMENTS = Set.of(
            "script", "noscript",
            "object", "embed", "applet",
            "iframe", "frame", "frameset",
            "base",           // redirects all relative URLs
            "link",           // external stylesheet loading
            "style",          // inline CSS can carry expression() attacks
            "form", "input", "button",  // unexpected interactivity
            "xml",            // IE legacy data islands
            "handler",        // XBL in old Firefox
            "binding"         // XBL
    );

    // Attribute name patterns — block entire categories
    private static final List<Pattern> BLOCKED_ATTR_PATTERNS = List.of(
            Pattern.compile("^on.+", Pattern.CASE_INSENSITIVE),        // all event handlers
            Pattern.compile("^xlink:.+", Pattern.CASE_INSENSITIVE),    // xlink:href etc.
            Pattern.compile("^xml:base$", Pattern.CASE_INSENSITIVE)   // base URL manipulation
    );

    // Attribute value patterns — catch javascript:, data: etc. in any attribute
    private static final List<Pattern> BLOCKED_VALUE_PATTERNS = List.of(
            Pattern.compile("javascript\\s*:", Pattern.CASE_INSENSITIVE),
            Pattern.compile("vbscript\\s*:", Pattern.CASE_INSENSITIVE),
            Pattern.compile("data\\s*:(?!image/\\S+)", Pattern.CASE_INSENSITIVE), // Any data different from an image
            Pattern.compile("\\bexpression\\s*\\(", Pattern.CASE_INSENSITIVE), // CSS expression()
            Pattern.compile("<\\s*script", Pattern.CASE_INSENSITIVE)
    );

    private static final Set<String> ALLOWED_PROCESSING_INSTRUCTIONS = Set.of("xml-stylesheet");

    /**
     * Sanitize the XML input string based on a blacklist of elements and attributes.
     * <p>
     *     <b>Note that this method's side effect on {@link DocumentContent#content} of the passed object!</b>
     *     The content is replaced with the sanitized XML.
     * </p>
     * @param content document content to sanitize
     * @return the original {@link DocumentContent} with sanitized XML content
     * @throws RuntimeException if the sanitizer fails to serialize the sanitized XML
     */
    public static DocumentContent sanitize(final DocumentContent content) {
        final Document doc = XercesUtils.createXercesDocument(content.getContent().getBytes(), true);
        final List<Node> sanitizedNodes = new LinkedList<>();
        sanitizeNode(doc.getDocumentElement(), sanitizedNodes, 0);
        if (!sanitizedNodes.isEmpty()) {
            final StringWriter writer = new StringWriter();
            boolean hasXmlDeclaration = content.getContent().stripLeading().startsWith("<?xml ");
            Transformer transformer = transformerTL.get();
            transformer.setOutputProperty(javax.xml.transform.OutputKeys.OMIT_XML_DECLARATION, hasXmlDeclaration ? "no" : "yes");
            try {
                transformer.transform(new DOMSource(doc), new StreamResult(writer));
                content.setContent(writer.toString());
            } catch (TransformerException e) {
                throw new RuntimeException("Unable to serialize sanitized XML", e);
            }
        }
        return content;
    }

    private static void sanitizeNode(final Node node, final List<Node> removed, final int depth) {
        if (depth > MAX_DEPTH) {
            throw new RuntimeException("XML tree is too deep. Maximum allowed depth is " + MAX_DEPTH);
        }
        final NodeList children = node.getChildNodes();

        for (int i = children.getLength() - 1; i >= 0; i--) {
            final Node child = children.item(i);

            switch (child.getNodeType()) {
                case Node.ELEMENT_NODE -> {
                    final String localName = child.getLocalName().toLowerCase();

                    if (BLOCKED_ELEMENTS.contains(localName)) {
                        removed.add(node.removeChild(child));
                        LOG.warn("Removed blacklisted element: {}", localName);
                    } else {
                        sanitizeAttributes((Element) child, removed);
                        sanitizeNode(child, removed, depth + 1);
                    }
                }
                case Node.PROCESSING_INSTRUCTION_NODE -> sanitizeProcessingInstructions(child, removed);
            }
        }
    }

    private static void sanitizeAttributes(final Element element, final List<Node> removed) {
        final NamedNodeMap attrs = element.getAttributes();

        for (int i = attrs.getLength() - 1; i >= 0; i--) {
            final Attr attr = (Attr) attrs.item(i);
            final String name = attr.getName();
            final String value = attr.getValue();

            if (isBlockedAttribute(name)) {
                LOG.warn("Removed blacklisted attribute: {}", name);
                removed.add(element.removeAttributeNode(attr));
            }
            if (isBlockedValue(value)) {
                LOG.warn("Removed attribute {} because of a blacklisted value: {}", name, value);
                removed.add(element.removeAttributeNode(attr));
            }
        }
    }

    private static boolean isBlockedAttribute(final String name) {
        return BLOCKED_ATTR_PATTERNS.stream()
                .anyMatch(p -> p.matcher(name).matches());
    }

    private static boolean isBlockedValue(final String value) {
        return BLOCKED_VALUE_PATTERNS.stream()
                .anyMatch(p -> p.matcher(value).find());
    }

    private static void sanitizeProcessingInstructions(final Node processingInstruction, final List<Node> removed) {
        if (!ALLOWED_PROCESSING_INSTRUCTIONS.contains(processingInstruction.getNodeName())) {
            LOG.warn("Removed processing instruction: {}", processingInstruction.getNodeName());
            removed.add(processingInstruction.getParentNode().removeChild(processingInstruction));
        }
    }
}
