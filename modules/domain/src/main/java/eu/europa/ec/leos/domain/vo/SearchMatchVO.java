package eu.europa.ec.leos.domain.vo;

import java.util.List;
import java.util.Objects;

public class SearchMatchVO {

    private List<ElementMatchVO> matchedElements;
    private boolean replaceable;
    private boolean searchHaltedPastThis;
    private int maxSearchLimit;

    public SearchMatchVO() {
    }

    public SearchMatchVO(List<ElementMatchVO> matchedElements, boolean replaceable) {
        this.matchedElements = matchedElements;
        this.replaceable = replaceable;
    }

    public List<ElementMatchVO> getMatchedElements() {
        return matchedElements;
    }

    public boolean isReplaceable() {
        return replaceable;
    }

    public void setMatchedElements(List<ElementMatchVO> matchedElements) {
        throw new UnsupportedOperationException();// method needed for vaadin reflection to create JSON
    }

    public void setReplaceable(boolean replaceable) {
        throw new UnsupportedOperationException();// method needed for vaadin reflection to create JSON
    }

    public boolean isSearchHaltedPastThis() {
        return this.searchHaltedPastThis;
    }

    public void setSearchHaltedPastThis(boolean searchHaltedPastThis) {
        this.searchHaltedPastThis = searchHaltedPastThis;
    }

    public int getMaxSearchLimit() {
        return maxSearchLimit;
    }

    public void setMaxSearchLimit(int maxSearchLimit) {
        this.maxSearchLimit = maxSearchLimit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SearchMatchVO that = (SearchMatchVO) o;
        return replaceable == that.replaceable &&
                Objects.equals(matchedElements, that.matchedElements);
    }

    @Override
    public int hashCode() {
        return Objects.hash(matchedElements, replaceable);
    }

    @Override
    public String toString() {
        return "SearchMatchVO{" +
                "matchedElements=" + matchedElements +
                ", replaceable=" + replaceable +
                '}';
    }
}
