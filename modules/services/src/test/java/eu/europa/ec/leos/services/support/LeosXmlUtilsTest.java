package eu.europa.ec.leos.services.support;

import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.LeosTest;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXml;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class LeosXmlUtilsTest extends LeosTest {

    protected final static String FILE_PREFIX = "/leosXercesUtil";

    @Test
    public void test_pageOrientationWrapper() {
        byte[] fileContent = TestUtils.getFileContent(FILE_PREFIX + "/test_pageOrientationWrapper.xml");
        byte[] fileContentExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_pageOrientationWrapper_expected.xml");

        Document document = XmlUtils.createDocument(fileContent);
        byte[] nodeActual = LeosXmlUtils.wrapWithPageOrientationDivs(document);

        String expected = new String(fileContentExpected, UTF_8);
        String nodeActualAsString = new String(nodeActual, UTF_8);
        expected = squeezeXml(expected);
        nodeActualAsString = squeezeXml(nodeActualAsString);

        assertEquals(expected, nodeActualAsString);
    }
    @Test
    public void test_removeElementWithIdDeleted() {
        byte[] fileContent = TestUtils.getFileContent(FILE_PREFIX + "/test_removeElementWithIdDeleted.xml");
        byte[] fileContentExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_removeElementWithIdDeleted_expected.xml");

        String nodeActualAsString = LeosXmlUtils.removeSoftDeletedNodes(new String(fileContent, UTF_8));

        String expected = new String(fileContentExpected, UTF_8);
        expected = squeezeXml(expected);
        nodeActualAsString = squeezeXml(nodeActualAsString);

        assertEquals(expected, nodeActualAsString);
    }
}
