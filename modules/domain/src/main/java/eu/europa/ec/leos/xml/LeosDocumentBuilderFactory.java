package eu.europa.ec.leos.xml;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

/**
 * Factory class for creating secure DocumentBuilderFactory instances.
 */
public class LeosDocumentBuilderFactory {
    public static final String FACTORY_CLASS_NAME = "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl";

    public static final String DISALLOW_DOCTYPE_DECL = "http://apache.org/xml/features/disallow-doctype-decl";
    public static final String EXTERNAL_GENERAL_ENTITIES = "http://xml.org/sax/features/external-general-entities";
    public static final String EXTERNAL_PARAMETER_ENTITIES = "http://xml.org/sax/features/external-parameter-entities";
    public static final String LOAD_EXTERNAL_DTD = "http://apache.org/xml/features/nonvalidating/load-external-dtd";

    /**
     * Creates and configures a new instance of the DocumentBuilderFactory using the internal Java implementation
     * <code>com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl</code>.
     * The configuration includes the following:
     * - Disallows DOCTYPE declarations to prevent XML Entity Expansion attacks.
     * - Disables external general and parameter entities.
     * - Prevents loading of external DTDs.
     * - Enables secure processing.
     * - Restricts access to external DTDs.
     * - Disables entity reference expansion.
     * - Disables XInclude processing.
     *
     * @return a securely configured instance of DocumentBuilderFactory
     * @throws ParserConfigurationException if a configuration error is encountered during factory creation
     */
    public static DocumentBuilderFactory newInstance() throws ParserConfigurationException {
        final DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance(FACTORY_CLASS_NAME, null);
        builderFactory.setFeature(DISALLOW_DOCTYPE_DECL, true);
        builderFactory.setFeature(EXTERNAL_GENERAL_ENTITIES, false);
        builderFactory.setFeature(EXTERNAL_PARAMETER_ENTITIES, false);
        builderFactory.setFeature(LOAD_EXTERNAL_DTD, false);
        builderFactory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        builderFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        builderFactory.setExpandEntityReferences(false);
        builderFactory.setXIncludeAware(false);
        return builderFactory;
    }

    /**
     * Helper method to create a new DocumentBuilder instance with the specified namespace awareness setting.
     * @param namespaceEnabled as required
     * @return a new instance of DocumentBuilder with the specified namespace awareness setting.
     * @throws ParserConfigurationException if a configuration error is encountered during factory creation
     */
    public static DocumentBuilder newDocumentBuilder(boolean namespaceEnabled) throws ParserConfigurationException {
        final DocumentBuilderFactory builderFactory = newInstance();
        builderFactory.setNamespaceAware(namespaceEnabled);
        return builderFactory.newDocumentBuilder();
    }
}
