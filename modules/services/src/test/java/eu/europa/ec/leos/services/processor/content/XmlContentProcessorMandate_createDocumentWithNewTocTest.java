/*
 * Copyright 2022 European Commission
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
package eu.europa.ec.leos.services.processor.content;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;

import java.io.IOException;
import java.util.List;

import static eu.europa.ec.leos.services.TestVOCreatorUtils.getJohnTestUser;
import static eu.europa.ec.leos.services.support.XmlHelper.DOC;
import static eu.europa.ec.leos.services.util.TestUtils.squeezeXmlAndRemoveAllNS;
import static org.junit.Assert.assertEquals;

public class XmlContentProcessorMandate_createDocumentWithNewTocTest extends XmlContentProcessorTest {

    @InjectMocks
    private TableOfContentProcessor tableOfContentProcessor = Mockito.spy(new TableOfContentProcessorImpl());
    @InjectMocks
    private XmlContentProcessorImpl xercesXmlContentProcessor = new XmlContentProcessorMandate();

    @Override
    protected void getStructureFile() {
        docTemplate = "BL-023";
        configFile = "/structure-test-explanatory-CN.xml";
    }

    @Test
    public void test_createDocumentContentWithNewTocList() {
        byte[] xmlDocument = TestUtils.getFileContent(FILE_PREFIX + "/test_explanatory_createDocumentContentWithNewTocList.xml");
        List<TableOfContentItemVO> tocList = tableOfContentProcessor.buildTableOfContent(DOC, xmlDocument, TocMode.NOT_SIMPLIFIED);

        byte[] xmlResult = xercesXmlContentProcessor.createDocumentContentWithNewTocList(tocList, xmlDocument, getJohnTestUser());

        byte[] xmlExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_explanatory_createDocumentContentWithNewTocList_expected.xml");
        String result = new String(xmlResult);
        String expected = new String(xmlExpected);
        result = squeezeXmlAndRemoveAllNS(result);
        expected = squeezeXmlAndRemoveAllNS(expected);
        assertEquals(expected, result);
    }

    @Test
    @SuppressWarnings("unchecked")
    public void test_addSubParagraphInPointAUsingTOC() throws IOException, ClassNotFoundException {

        /*
         * The file test_addSubParagraphInPointAUsingTOC.xml has an annex with this structure:
         * - Level with text "Text of Level 1"
         *    - Point (a) with text "Text of Point (a)"
         *
         * The test_addSubParagraphInPointAUsingTOC_TocObject.obj contains a java object that represents a toc in annex with
         * the previous structure, and adding a Subparagraph:
         * - Level with text "Text of Level 1"
         *    - Point (a) with text "Text of Point (a)"
         *       - Subparagraph with text "Text..." (simulating adding by TOC)
         *
         */

        byte[] xmlDocument = TestUtils.getFileContent(FILE_PREFIX + "/test_addSubParagraphInPointAUsingTOC.xml");
        List<TableOfContentItemVO> tocList = (List<TableOfContentItemVO>) TestUtils.getDeserializeObject(FILE_PREFIX + "/test_addSubParagraphInPointAUsingTOC_TocObject.obj");

        byte[] xmlResult = xercesXmlContentProcessor.createDocumentContentWithNewTocList(tocList, xmlDocument, getJohnTestUser());
        xmlResult = xercesXmlContentProcessor.doXMLPostProcessing(xmlResult);
        byte[] xmlExpected = TestUtils.getFileContent(FILE_PREFIX + "/test_addSubParagraphInPointAUsingTOC_expected.xml");

        String result = new String(xmlResult);
        String expected = new String(xmlExpected);
        result = squeezeXmlAndRemoveAllNS(result);
        expected = squeezeXmlAndRemoveAllNS(expected);
        assertEquals(expected, result);

    }

}
