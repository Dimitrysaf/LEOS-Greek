package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.xml.LeosDocumentBuilderFactory;
import eu.europa.ec.leos.xml.LeosTransformerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Templates;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamSource;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@RequiredArgsConstructor
public class XmlFactoryConfig {

    private static final String FMX_2_AKN_LEOS_XSLT = "classpath:eu/europa/ec/leos/xslt/templates/fmx2akn-leos.xslt";

    private final ApplicationContext context;

    @Bean
    public DocumentBuilderFactory documentBuilderFactory() throws Exception {
        return LeosDocumentBuilderFactory.newInstance();
    }

    @Bean
    public TransformerFactory transformerFactory() throws TransformerConfigurationException {
        return LeosTransformerFactory.newInstance();
    }

    @Bean
    public Templates xsltTemplates() throws TransformerConfigurationException, IOException {
        final TransformerFactory transformerFactory = LeosTransformerFactory.newSaxonInstance();
        Resource resource = context.getResource(FMX_2_AKN_LEOS_XSLT);
        try (InputStream is = resource.getInputStream()) {
            return transformerFactory.newTemplates(new StreamSource(is));
        }
    }
}
