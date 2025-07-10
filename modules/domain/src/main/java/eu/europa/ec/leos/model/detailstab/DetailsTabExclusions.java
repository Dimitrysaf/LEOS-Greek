package eu.europa.ec.leos.model.detailstab;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null fields
@JsonIgnoreProperties(ignoreUnknown = true)
public class DetailsTabExclusions {

    private Boolean eea;
    private Boolean coverPageSection;
    private List<CoverPageType> coverPageOptions;
}
