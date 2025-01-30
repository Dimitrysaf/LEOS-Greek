package integration.saveToc.proposal;

import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.processor.content.TableOfContentHelper;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.model.ModelHelper;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndRemoveAllNS;
import static integration.saveToc.TocVOCreateUtils.getElementById;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

public class SaveTocBillDeleteProposalTest_IT extends SaveTocBillProposalTest_IT {

    private static final Logger log = LoggerFactory.getLogger(SaveTocBillDeleteProposalTest_IT.class);

    @Mock
    private SecurityContext securityContext;

    @Before
    public void onSetup() throws Exception {
        super.onSetUp();
        List<Entity> entities = new ArrayList<Entity>();
        entities.add(new Entity("1", "DIGIT.B2", "DIGIT"));
        User user = ModelHelper.buildUser(45L, "jane", "jane", entities);
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.getUserName()).thenReturn("jane");
    }

    @Test
    public void test_delete__article() {
        // Given
        final byte[] xmlInput = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "test_add__article__expected_ec.xml");
        final byte[] xmlExpected = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "bill_with1Article_ec.xml");
        List<TableOfContentItemVO> toc = buildTableOfContentBill(xmlInput);

        TableOfContentItemVO body = getElementById(toc, "body");
        TableOfContentHelper.removeChildItem(body, getElementById(toc, "new_art_1"));

        // When
        byte[] xmlResult = processSaveTocBill(xmlInput, toc);

        // Then
        String result = new String(xmlResult);
        String expected = new String(xmlExpected);
        result = squeezeXmlAndRemoveAllNS(result);
        expected = squeezeXmlAndRemoveAllNS(expected);
        assertEquals(expected, result);
    }

    @Test
    public void test_delete__3Articles() {
        // Given
        final byte[] xmlInput = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "test_add__3articles__expected_ec.xml");
        final byte[] xmlExpected = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "bill_with1Article_ec.xml");
        List<TableOfContentItemVO> toc = buildTableOfContentBill(xmlInput);

        TableOfContentItemVO body = getElementById(toc, "body");
        TableOfContentHelper.removeChildItem(body, getElementById(toc, "art_2"));
        TableOfContentHelper.removeChildItem(body, getElementById(toc, "art_3"));
        TableOfContentHelper.removeChildItem(body, getElementById(toc, "art_4"));

        // When
        byte[] xmlResult = processSaveTocBill(xmlInput, toc);

        // Then
        String result = new String(xmlResult);
        String expected = new String(xmlExpected);
        result = squeezeXmlAndRemoveAllNS(result);
        expected = squeezeXmlAndRemoveAllNS(expected);
        assertEquals(expected, result);
    }

    @Test
    public void test_delete__mixedElements() {
        // Given
        final byte[] xmlInput = TestUtils.getFileContent("", "/contentProcessor/test_createDocumentContentWithNewTocList.xml");
        final byte[] xmlExpected = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "test_delete__mixedElements_expected.xml");
        List<TableOfContentItemVO> toc = buildTableOfContentBill(xmlInput);

        TableOfContentItemVO cits = getElementById(toc, "cits");
        TableOfContentHelper.removeChildItem(cits, getElementById(toc, "cit_2"));
        TableOfContentHelper.removeChildItem(cits, getElementById(toc, "cit_3"));
        TableOfContentHelper.removeChildItem(cits, getElementById(toc, "cit_4"));
        TableOfContentHelper.removeChildItem(cits, getElementById(toc, "cit_5"));
        TableOfContentHelper.removeChildItem(cits, getElementById(toc, "cit_6"));

        TableOfContentItemVO recs = getElementById(toc, "recs");
        TableOfContentHelper.removeChildItem(recs, getElementById(toc, "rec_2"));
        TableOfContentHelper.removeChildItem(recs, getElementById(toc, "rec_3"));

        TableOfContentItemVO body = getElementById(toc, "body");
        TableOfContentHelper.removeChildItem(body, getElementById(toc, "art_2"));
        TableOfContentHelper.removeChildItem(body, getElementById(toc, "art_3"));

        // When
        byte[] xmlResult = processSaveTocBill(xmlInput, toc);

        // Then
        String result = new String(xmlResult);
        String expected = new String(xmlExpected);
        result = squeezeXmlAndRemoveAllNS(result);
        expected = squeezeXmlAndRemoveAllNS(expected);
        assertEquals(expected, result);
    }
}
