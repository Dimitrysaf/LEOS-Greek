package eu.europa.ec.leos.notice;

import eu.europa.ec.leos.notice.common.PathRetriever;
import eu.europa.ec.leos.notice.common.Product;
import eu.europa.ec.leos.notice.frontend.FrontEndNoticeGenerator;
import eu.europa.ec.leos.notice.frontend.xml.NpmJsXmlCopyrightsMapping;
import eu.europa.ec.leos.notice.license.EUPLv1_2Content;
import org.junit.jupiter.api.Test;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URISyntaxException;
import java.nio.file.Path;

class GenerateNoticeFileForLeosFE extends BaseTest {

    @Test
    void generateNotice() throws IOException, InterruptedException, URISyntaxException, ParserConfigurationException, SAXException {
        Path trustedAppTxtFile = getPathFromClasspath("/THIRD-PARTY-leos-fe.csv");
        String lookUpFileFile = "/copyrights-lookup-leos-fe.xml";
        String existingJsonResponse = "/remote/leos_fe_response.json";
        boolean useExistingResponses = false;
        String outputFile = "NOTICE_LEOS_FE.md";

        final Path xmlCopyrights = new PathRetriever().fromClasspath(lookUpFileFile);
        NpmJsXmlCopyrightsMapping mappings = new NpmJsXmlCopyrightsMapping(xmlCopyrights);

        final Product trustedApp = new Product("LEOS", "2022 European Union", "1.0", EUPLv1_2Content.content());

        final FrontEndNoticeGenerator trustedAppNoticeGenerator = new FrontEndNoticeGenerator(trustedApp, trustedAppTxtFile, mappings, existingJsonResponse, useExistingResponses);
        try (PrintStream ps = new PrintStream(outputFile)) {
            trustedAppNoticeGenerator.generateNotice(ps);
        }
    }

}