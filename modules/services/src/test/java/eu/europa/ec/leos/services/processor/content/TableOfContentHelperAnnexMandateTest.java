package eu.europa.ec.leos.services.processor.content;

import org.junit.Ignore;

@Ignore
public class TableOfContentHelperAnnexMandateTest extends TableOfXmlContentProcessorTest {

    @Override
    protected void getStructureFile() {
        docTemplate = "SG-017";
        configFile = "/structure-test-annex-CN.xml";
    }

}
