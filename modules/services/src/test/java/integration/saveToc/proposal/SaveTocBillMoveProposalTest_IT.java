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
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

public class SaveTocBillMoveProposalTest_IT extends SaveTocBillProposalTest_IT {

    private static final Logger log = LoggerFactory.getLogger(SaveTocBillMoveProposalTest_IT.class);

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
    public void test_from_part_title_chapter_section_article__move_section() {
        // Given
        final byte[] xmlInput = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "test_move_from_part_title_chapter_section_article__to_section.xml");
        final byte[] xmlExpected = TestUtils.getFileContent(PREFIX_SAVE_TOC_BILL_EC, "test_move_from_part_title_chapter_section_article__to_section_expected.xml");
        List<TableOfContentItemVO> toc = buildTableOfContentBill(xmlInput);
        assertTrue(toc.size() > 0);
        TableOfContentItemVO body = getElementById(toc, "body");
        TableOfContentItemVO section = getElementById(toc, "section");
        TableOfContentHelper.removeChildItem(section.getParentItem(), section);
        body.addChildItem(2, section);

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