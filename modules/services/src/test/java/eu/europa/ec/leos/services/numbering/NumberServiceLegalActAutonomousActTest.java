package eu.europa.ec.leos.services.numbering;

import eu.europa.ec.leos.services.util.TestUtils;
import org.junit.Test;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndRemoveAllNS;
import static org.junit.Assert.assertEquals;

public class NumberServiceLegalActAutonomousActTest extends NumberServiceAutonomousActTest {

    @Test
    public void test_numbering_recitals_with_recital_sections() {
        final byte[] xmlInput = TestUtils.getFileContent(FILE_PREFIX, "test_numbering_recitals.xml");
        final byte[] xmlExpected = TestUtils.getFileContent(FILE_PREFIX, "test_numbering_recitals_expected.xml");
        byte[] result = numberService.renumberRecitals(xmlInput);
        assertEquals(squeezeXmlAndRemoveAllNS(new String(xmlExpected)), squeezeXmlAndRemoveAllNS(new String(result)));
    }

}
