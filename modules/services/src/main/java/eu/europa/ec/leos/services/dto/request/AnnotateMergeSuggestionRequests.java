/*
 * Copyright 2024 European Union
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
