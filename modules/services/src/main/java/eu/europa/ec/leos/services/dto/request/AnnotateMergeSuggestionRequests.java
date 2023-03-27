package eu.europa.ec.leos.services.dto.request;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

public class AnnotateMergeSuggestionRequests implements Serializable {

    private List<AnnotateMergeSuggestionRequest> mergeSuggestionRequests;

    public List<AnnotateMergeSuggestionRequest> getMergeSuggestionRequests() {
        return mergeSuggestionRequests;
    }

    public void setMergeSuggestionRequests(List<AnnotateMergeSuggestionRequest> mergeSuggestionRequests) {
        this.mergeSuggestionRequests = mergeSuggestionRequests;
    }

    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .appendSuper(super.toString())
                .append("mergeSuggestionRequests", mergeSuggestionRequests)
                .toString();
    }
}
