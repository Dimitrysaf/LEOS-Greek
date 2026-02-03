package eu.europa.ec.leos.services.processor.content;

import org.junit.jupiter.api.Disabled;

@Disabled
public class TableOfContentHelperAnnexMandateTest extends TableOfXmlContentProcessorTest {

    @Override
    protected void getStructureFile() {
        docTemplate = "SG-017";
        configFile = "/structure-test-annex-CN.xml";
    }

}
