package eu.europa.ec.leos.repository.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;

@Configuration
public class RepositoryXmlFactoryConfig {

    private static final String DOCUMENT_BUILDER_FACTORY_CLASS_NAME = "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl";
    public static final String TRANSFORMER_FACTORY_CLASS_NAME = "com.sun.org.apache.xalan.internal.xsltc.trax.TransformerFactoryImpl";


    public static final String DISALLOW_DOCTYPE_DECL = "http://apache.org/xml/features/disallow-doctype-decl";
    public static final String EXTERNAL_GENERAL_ENTITIES = "http://xml.org/sax/features/external-general-entities";
    public static final String EXTERNAL_PARAMETER_ENTITIES = "http://xml.org/sax/features/external-parameter-entities";
    public static final String LOAD_EXTERNAL_DTD = "http://apache.org/xml/features/nonvalidating/load-external-dtd";

    @Bean
    public DocumentBuilderFactory documentBuilderFactory() throws ParserConfigurationException {
        return createDocumentBuilderFactory();
    }

    @Bean
    public TransformerFactory transformerFactory() throws TransformerConfigurationException {
        final TransformerFactory transformerFactory = TransformerFactory.newInstance(
                TRANSFORMER_FACTORY_CLASS_NAME, null);
        // Secure the factory to prevent XXE attacks
        transformerFactory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        transformerFactory.setURIResolver((href, base) -> {
            throw new TransformerException("External URI resolution blocked");
        });
        transformerFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
        transformerFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
        return transformerFactory;
    }

    @Bean
    public DocumentBuilderFactoryNS documentBuilderFactoryNS() throws ParserConfigurationException {
        final DocumentBuilderFactory builderFactory = createDocumentBuilderFactory();
        return new DocumentBuilderFactoryNS( builderFactory);
    }

    private DocumentBuilderFactory createDocumentBuilderFactory() throws ParserConfigurationException {
        final DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance(
                DOCUMENT_BUILDER_FACTORY_CLASS_NAME,null);
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
}
