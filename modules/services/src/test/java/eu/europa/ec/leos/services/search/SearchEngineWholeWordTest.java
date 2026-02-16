package eu.europa.ec.leos.services.search;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

import eu.europa.ec.leos.domain.vo.ElementMatchVO;
import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.services.search.SearchEngine;
import eu.europa.ec.leos.services.search.SearchEngineImpl;
import eu.europa.ec.leos.services.util.TestUtils;
import eu.europa.ec.leos.test.support.LeosTest;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

public class SearchEngineWholeWordTest extends LeosTest {

    protected final static String PREFIX_SEARCH_REPLACE = "/searchReplace";

    @BeforeEach
    public void setup() {
        super.setup();
        MockitoAnnotations.initMocks(this);
    }
    @Test
    public void testForContent_2words_withMetaContent() {

        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-meta.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("Having regard", false, true);

        results.forEach(System.out::println);
        assertThat(results.size(), is(4));
        List<ElementMatchVO> matchedElements1 = results.get(0).getMatchedElements();
        assertThat(matchedElements1.size(), is(1));
        assertThat(matchedElements1, hasItem(new ElementMatchVO("cit_1__p", 0, 13)));

        List<ElementMatchVO> matchedElements2 = results.get(1).getMatchedElements();
        assertThat(matchedElements2.size(), is(1));
        assertThat(matchedElements2, hasItem(new ElementMatchVO("cit_2__p", 0, 13)));

        List<ElementMatchVO> matchedElements3 = results.get(2).getMatchedElements();
        assertThat(matchedElements3.size(), is(1));
        assertThat(matchedElements3, hasItem(new ElementMatchVO("cit_4__p", 5, 18)));

        List<ElementMatchVO> matchedElements4 = results.get(3).getMatchedElements();
        assertThat(matchedElements4.size(), is(1));
        assertThat(matchedElements4, hasItem(new ElementMatchVO("cit_5__p", 0, 13)));
    }
    @Test
    public void testForContent_halfword_withMetaContent() {

        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-meta.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("Hav", false, true);

        results.forEach(System.out::println);
        assertThat(results.size(), is(0));
    }
    @Test
    public void testForContent_1word_withSimpleContent() {

        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-simple.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("search", false, true);

        assertThat(results.size(), is(1));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(1));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 11, 17)));
    }
    @Test
    public void testForContent_1word_case_withSimpleContent() {

        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-simple.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("SUBSIDIARITY", true, true);

        assertThat(results.size(), is(1));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(1));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 31, 43)));

        results = se.searchTextToReplace("subsidiarity", true, true);

        assertThat(results.size(), is(0));

    }
    @Test
    public void testForContent_halfword_withSimpleContent() {

        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-simple.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("sea", false, true);

        assertThat(results.size(), is(0));
    }
    @Test
    public void testForContent_2words_withCrossElementMatch() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-crossElements.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("content simple", false, true);

        assertThat(results.size(), is(1));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(2));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 7, 14)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p2", 0, 6)));
    }
    @Test
    public void testForContent_halfword_withCrossElementMatch() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-crossElements.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("regula", false, true);

        assertThat(results.size(), is(0));
    }
    @Test
    public void testForContent_2words_withAllContentFormatted() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-allContentFormatted.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("simple content", false, true);

        assertThat(results.size(), is(1));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(2));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_TErD12", 17, 25)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_Stz06P", 6, 12)));
    }
    @Test
    public void testForContent_halfword_withAllContentFormatted() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-allContentFormatted.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("simple conte", false, true);

        assertThat(results.size(), is(0));
    }

    @Test
    public void testForContent_multiplewords_withInnerTagMatch() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-innerTags.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("is my search content", false, true);

        assertThat(results.size(), is(1));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(3));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 5, 8)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_E3FfJO", 0, 9)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 17, 25)));
    }

    @Test
    public void testForContent_halfword_withInnerTagMatch() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-innerTags.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("tent", false, true);

        assertThat(results.size(), is(0));    }

    @Test
    public void testForContent_multiplewords_withMultiLevelTagMatch() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-multiLevelTags.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("is my search content with", false, true);

        assertThat(results.size(), is(1));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(6));

        //This does not look right
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 5, 8)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_TErD12", 0, 2)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 10, 18)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_E3FfJO", 0, 3)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_lgMXsf", 0, 4)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 25, 30)));
    }

    @Test
    public void testForContent_halfwords_withMultiLevelTagMatch() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-multiLevelTags.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("earch conten", false, true);

        assertThat(results.size(), is(0));
           }

    @Test
    public void testForContent_multiplewords_withMultipleHits() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-multipleHits.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("is my search content", false, true);

        assertThat(results.size(), is(2));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(1));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 5, 25)));

        matchedElements = results.get(1).getMatchedElements();
        assertThat(matchedElements.size(), is(3));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_3__blockcontainer__p", 5, 8)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("akn_E3FfJO3", 0, 9)));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_3__blockcontainer__p", 17, 25)));
    }
    @Test
    public void testForContent_1word_withMultipleHits() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-multipleHits.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("my search content", false, true);

        assertThat(results.size(), is(2));
        List<ElementMatchVO> matchedElements = results.get(0).getMatchedElements();
        assertThat(matchedElements.size(), is(1));
        assertThat(matchedElements, hasItem(new ElementMatchVO("tblock_2__tblock_2__blockcontainer__p", 8, 25)));
    }
    @Test
    public void testForContent_halfwords_withMultipleHits() {
        byte[] docContent = TestUtils.getFileContent(PREFIX_SEARCH_REPLACE + "/searchContent-multipleHits.xml");
        SearchEngine se = SearchEngineImpl.forContent(docContent);
        List<SearchMatchVO> results = se.searchTextToReplace("earch content", false, true);

        assertThat(results.size(), is(0));
    }
}
