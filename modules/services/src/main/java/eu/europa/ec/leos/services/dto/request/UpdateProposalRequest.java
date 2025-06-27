package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.repository.metadata.LeosAuthenticLanguage;
import eu.europa.ec.leos.domain.repository.metadata.LeosCoverPageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UpdateProposalRequest {
    private String docPurpose;
    private Boolean eeaRelevance;
    private String packageTitle;
    private String internalRef;
    private LeosAuthenticLanguage isAuthenticLang;
    private List<String> authenticLang;
    private LeosCoverPageType coverPageType;
    private Float verticalShift;
}
