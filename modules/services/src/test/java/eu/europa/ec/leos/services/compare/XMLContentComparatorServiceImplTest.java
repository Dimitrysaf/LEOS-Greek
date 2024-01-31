/*
 * Copyright 2019 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.compare;

import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorProposal;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.LeosTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.w3c.dom.Document;

import static eu.europa.ec.leos.services.TestVOCreatorUtils.getJaneDigitUser;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.ATTR_NAME;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_ADDED_CLASS;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_REMOVED_CLASS;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXml;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

public class XMLContentComparatorServiceImplTest extends LeosTest {

    private final static String CLONED_FOLDER = "/compare/cloned/";
    private final static String PROPOSAL_FOLDER = "/compare/proposal/";

    @Mock
    private MessageHelper messageHelper;
    @InjectMocks
    private TextComparator textComparator = new LeosTextComparatorImpl(messageHelper);
    @Mock
    private SecurityContext securityContext;
    @Mock
    protected CloneContext cloneContext;
    @InjectMocks
    private XmlContentProcessor xmlContentProcessor = new XmlContentProcessorProposal();

    @InjectMocks
    protected ContentComparatorService proposalCompareService = new XMLContentComparatorServiceImplProposal(messageHelper,
            textComparator, cloneContext, securityContext, xmlContentProcessor);

    @Before
    public void onSetUp() throws Exception {
        User user = getJaneDigitUser();
        when(cloneContext.isClonedProposal()).thenReturn(true);
        when(securityContext.getUser()).thenReturn(user);
        when(securityContext.getUserName()).thenReturn(user.getName());
    }
    @Test
    public void test_delete_reference_of_internal_reference_in_clone() {
        String oldContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_delete_reference_of_internal_reference_in_clone_proposal_old_content.xml"));
        String newContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_delete_reference_of_internal_reference_in_clone_proposal_new_content.xml"));
        String expectedResult = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_delete_reference_of_internal_reference_in_clone_proposal_expected.xml"));
        Document documentExpected = createXercesDocument(expectedResult.getBytes(UTF_8));
        String expectedStr = XercesUtils.nodeToString(documentExpected);
        String result = testCompareForCloned(oldContent, newContent);
        Document documentResult = createXercesDocument(result.getBytes(UTF_8));
        result = XercesUtils.nodeToString(documentResult);
        assertEquals(squeezeXml(expectedStr), squeezeXml(result));
    }

    private String testCompareForCloned(String oldContent, String newContent) {
        return proposalCompareService.compareContents(new ContentComparatorContext.Builder(oldContent, newContent)
                .withAttrName(ATTR_NAME)
                .withRemovedValue(CONTENT_REMOVED_CLASS)
                .withAddedValue(CONTENT_ADDED_CLASS)
                .withDisplayRemovedContentAsReadOnly(Boolean.TRUE)
                .build());
    }

    private String testCompareDeletedElementsForCloned(String oldContent, String newContent) {
        return proposalCompareService.compareDeletedElements(new ContentComparatorContext.Builder(oldContent, newContent)
                .withDisplayRemovedContentAsReadOnly(Boolean.TRUE)
                .build());
    }

    @Test
    public void test_clone_compare_deleted_numbered_to_unnumbered_article() {
        String oldContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_numbered_to_unnumbered_article_V0.xml"));
        String newContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_numbered_to_unnumbered_article_V1.xml"));
        String expectedResult = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_numbered_to_unnumbered_article_expected.xml"));
        Document documentExpected = createXercesDocument(expectedResult.getBytes(UTF_8), false);

        String expectedStr = XercesUtils.nodeToString(documentExpected);
        String result = testCompareDeletedElementsForCloned(oldContent, newContent);
        Document documentResult = createXercesDocument(result.getBytes(UTF_8), false);
        result = XercesUtils.nodeToString(documentResult);
        assertEquals(squeezeXml(expectedStr), squeezeXml(result));
    }

    @Test
    public void test_cloneProposal_compare_content_numbered_to_unnumbered_article() {
        String oldContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_numbered_to_unnumbered_article_multi_para_V0.xml"));
        String newContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_numbered_to_unnumbered_article_multi_para_V1.xml"));
        String expectedResult = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_numbered_to_unnumbered_article_multi_para_expected.xml"));
        Document documentExpected = createXercesDocument(expectedResult.getBytes(UTF_8), false);

        String expectedStr = XercesUtils.nodeToString(documentExpected);
        String result = testCompareForCloned(oldContent, newContent);
        Document documentResult = createXercesDocument(result.getBytes(UTF_8), false);
        result = XercesUtils.nodeToString(documentResult);
        assertEquals(squeezeXml(expectedStr), squeezeXml(result));
    }

    @Test
    public void test_cloneProposal_delete_content_numbered_to_unnumbered_article() {
        String oldContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_delete_content_numbered_to_unnumbered_article_V0.xml"));
        String newContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_delete_content_numbered_to_unnumbered_article_V1.xml"));
        String expectedResult = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_delete_content_numbered_to_unnumbered_article_expected.xml"));
        Document documentExpected = createXercesDocument(expectedResult.getBytes(UTF_8), false);

        String expectedStr = XercesUtils.nodeToString(documentExpected);
        String result = testCompareDeletedElementsForCloned(oldContent, newContent);
        Document documentResult = createXercesDocument(result.getBytes(UTF_8), false);
        result = XercesUtils.nodeToString(documentResult);
        assertEquals(squeezeXml(expectedStr), squeezeXml(result));
    }

    @Test
    public void test_cloneProposal_delete_points_article() {
        String oldContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_delete_points_article_V0.xml"));
        String newContent = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_delete_points_article_V1.xml"));
        String expectedResult = new String(TestUtils.getFileContent(CLONED_FOLDER, "test_cloneProposal_delete_points_article_expected.xml"));
        Document documentExpected = createXercesDocument(expectedResult.getBytes(UTF_8), false);

        String expectedStr = XercesUtils.nodeToString(documentExpected);
        String result = testCompareDeletedElementsForCloned(oldContent, newContent);
        Document documentResult = createXercesDocument(result.getBytes(UTF_8), false);
        result = XercesUtils.nodeToString(documentResult);
        assertEquals(squeezeXml(expectedStr), squeezeXml(result));
    }

    @Test
    public void test_2() {
        String oldContent = new String(TestUtils.getFileContent(PROPOSAL_FOLDER, "test_2_V0.xml"));
        String newContent = new String(TestUtils.getFileContent(PROPOSAL_FOLDER, "test_2_V1.xml"));
        String expectedResult = new String(TestUtils.getFileContent(PROPOSAL_FOLDER, "test_2_expected.xml"));
        Document documentExpected = createXercesDocument(expectedResult.getBytes(UTF_8), false);

        String expectedStr = XercesUtils.nodeToString(documentExpected);
        String result = testCompare(oldContent, newContent);
        Document documentResult = createXercesDocument(result.getBytes(UTF_8), false);
        result = XercesUtils.nodeToString(documentResult);
//        expectedStr = squeezeXml(expectedStr);
//        result = squeezeXml(result);
        assertEquals(expectedStr, result);
    }


    private String testCompare(String oldContent, String newContent) {

        return proposalCompareService.compareContents(new ContentComparatorContext.Builder(oldContent, newContent)
                .withAttrName(ATTR_NAME)
                .withRemovedValue(CONTENT_REMOVED_CLASS)
                .withAddedValue(CONTENT_ADDED_CLASS)
                .withDisplayRemovedContentAsReadOnly(Boolean.TRUE)
                .build());
    }
}
