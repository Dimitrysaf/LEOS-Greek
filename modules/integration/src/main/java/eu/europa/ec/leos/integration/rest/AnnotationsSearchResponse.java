package eu.europa.ec.leos.integration.rest;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AnnotationsSearchResponse {
    private final List<Object> rows;
    private final long total;
    private final List<Object> replies;

    @JsonCreator
    public AnnotationsSearchResponse(@JsonProperty("rows") final List<Object> rows,
                                     @JsonProperty("total") final long total,
                                     @JsonProperty("replies") final List<Object> replies) {
        this.rows = rows;
        this.total = total;
        this.replies = replies;
    }

    public List<Object> getRows() {
        return this.rows;
    }

    public long getTotal() {
        return this.total;
    }

    public List<Object> getReplies() {
        return this.replies;
    }
}
