package eu.europa.ec.leos.xml;

import javax.xml.XMLConstants;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;

/**
 * Factory class for creating secure TransformerFactory instances.
 */
public class LeosTransformerFactory {

    public static final String FACTORY_CLASS_NAME = "com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl";

    private static final String SAXON_JAXP_FACTORY_CLASS_NAME = "net.sf.saxon.jaxp.SaxonTransformerFactory";

    /**
     * Creates and configures a new instance of the TransformerFactory usding the internal Java implementation
     * <code>com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl</code>.
     * @return a securely configured instance of TransformerFactory
     * @throws TransformerConfigurationException if an error occurs during factory configuration
     */
    public static TransformerFactory newInstance() throws TransformerConfigurationException {
        final TransformerFactory transformerFactory = TransformerFactory.newInstance(FACTORY_CLASS_NAME, null);
        return configTransformerFactory(transformerFactory);
    }

    /**
     * Creates and configures a new instance of the TransformerFactory usding the internal Java implementation
     * <code>net.sf.saxon.jaxp.SaxonTransformerFactory</code>.
     * @return a securely configured instance of TransformerFactory
     * @throws TransformerConfigurationException if an error occurs during factory configuration
     */
    public static TransformerFactory newSaxonInstance() throws TransformerConfigurationException {
        final TransformerFactory transformerFactory = TransformerFactory.newInstance(SAXON_JAXP_FACTORY_CLASS_NAME, null);
        return configTransformerFactory(transformerFactory);
    }

    // Secure the factory to prevent XXE attacks
    private static TransformerFactory configTransformerFactory(final TransformerFactory transformerFactory)
            throws TransformerConfigurationException {
        transformerFactory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        transformerFactory.setURIResolver((href, base) -> {
            throw new TransformerException("External URI resolution blocked");
        });
        transformerFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        transformerFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
        return transformerFactory;
    }


    /**
     * Helper method to create a new transformer instance.
     * @return a new instance of Transformer
     * @throws TransformerConfigurationException if an error occurs during factory configuration
     */
    public static Transformer newTransformer() throws TransformerConfigurationException {
        return newInstance().newTransformer();
    }
}
