package eu.europa.ec.leos.notice;

import eu.europa.ec.leos.notice.backend.BackEndNoticeGenerator;
import eu.europa.ec.leos.notice.backend.xml.MavenXmlCopyrightsMapping;
import eu.europa.ec.leos.notice.common.PathRetriever;
import eu.europa.ec.leos.notice.common.Product;
import eu.europa.ec.leos.notice.license.EUPLv1_2Content;
import org.junit.jupiter.api.Test;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URISyntaxException;
import java.nio.file.Path;

class GenerateNoticeFileForAnnotationBE extends BaseTest {

    @Test
    void generateNotice() throws IOException, InterruptedException, URISyntaxException, ParserConfigurationException, SAXException {
        Path trustedAppTxtFile = getPathFromClasspath("/THIRD-PARTY-annotation-maven.txt");
        String lookUpFileFile = "/copyrights-lookup-annotation-maven.xml";
        String outputFile = "NOTICE_ANNOTATION_BE.md";

        final Path xmlCopyrights = new PathRetriever().fromClasspath(lookUpFileFile);
        MavenXmlCopyrightsMapping mappings = new MavenXmlCopyrightsMapping(xmlCopyrights);

        final Product trustedApp = new Product("ANNOTATION", "2022 European Union", "1.0", EUPLv1_2Content.content());

        final BackEndNoticeGenerator trustedAppNoticeGenerator = new BackEndNoticeGenerator(trustedApp, trustedAppTxtFile, mappings);
        try (PrintStream ps = new PrintStream(outputFile)) {
            trustedAppNoticeGenerator.generateNotice(ps);
        }
    }

}