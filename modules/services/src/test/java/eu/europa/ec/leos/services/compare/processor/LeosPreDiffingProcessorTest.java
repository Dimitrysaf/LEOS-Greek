package eu.europa.ec.leos.services.compare.processor;

import eu.europa.ec.leos.services.util.TestUtils;
import junit.framework.TestCase;
import org.junit.Test;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXml;

public class LeosPreDiffingProcessorTest extends TestCase {

    protected final static String FILE_PREFIX = "/leosDiffing";

    private LeosPreDiffingProcessor leosPreDiffingProcessor = new LeosPreDiffingProcessor();

    @Test
    public void testAdjustTrackChanges() {
        byte[] content = TestUtils.getFileContent(FILE_PREFIX + "/test_nestedTrackChanges.xml");
        byte[] expected = TestUtils.getFileContent(FILE_PREFIX + "/test_nestedTrackChanges_expected.xml");
        String result = leosPreDiffingProcessor.adjustTrackChanges(new String(content));
        assertEquals(squeezeXml(new String(expected)), squeezeXml(result));
    }

}