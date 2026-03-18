package eu.europa.ec.leos.repository.utils;

import eu.europa.ec.leos.repository.entities.DocumentContent;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

import javax.xml.transform.Transformer;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.StringWriter;

public class AknSanitizerTest {

    @Test
    void testTemplates() throws Exception {
        Transformer transformer = XercesUtils.createSecureTransformer();
        transformer.setOutputProperty(javax.xml.transform.OutputKeys.OMIT_XML_DECLARATION, "yes");
        File rootDir = new File("src/main/resources/leos/templates/5.4.0/ec");
        String[] dirs = rootDir.list((f, s) -> new File(f, s).isDirectory());
        for (String dirName : dirs) {
            File dir = new File(rootDir, dirName);
            String[] xmlFileNames = dir.list((f, s) -> s.endsWith(".xml"));

            for (String xmlFileName : xmlFileNames) {
                String xmlString = FileUtils.readFileToString(new File(dir, xmlFileName));
                DocumentContent content = new DocumentContent();
                content.setContent(xmlString);

                AknSanitizer.sanitize(content);

                Document doc = XercesUtils.createXercesDocument(xmlString.getBytes(), true);
                StringWriter writer = new StringWriter();
                transformer.transform(new DOMSource(doc), new StreamResult(writer));

                Assertions.assertEquals(writer.toString(), content.getContent());
            }
        }
    }

    @Test
    void testTemplateWithScriptTag() throws Exception {
        Transformer transformer = XercesUtils.createSecureTransformer();
        transformer.setOutputProperty(javax.xml.transform.OutputKeys.OMIT_XML_DECLARATION, "yes");

        String xmlStringWithScript = FileUtils.readFileToString(new File("src/test/resources/xml/BL-023-with-script.xml"));
        DocumentContent content = new DocumentContent();
        content.setContent(xmlStringWithScript);

        AknSanitizer.sanitize(content);

        Document doc = XercesUtils.createXercesDocument(xmlStringWithScript.getBytes(), true);
        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));


        Assertions.assertNotEquals(writer.toString(), content.getContent());

        String xmlString = FileUtils.readFileToString(new File("src/test/resources/xml/BL-023-without-script.xml"));
        doc = XercesUtils.createXercesDocument(xmlString.getBytes(), true);
        StringWriter expected = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(expected));

        Assertions.assertEquals(expected.toString(), content.getContent());
    }

}
