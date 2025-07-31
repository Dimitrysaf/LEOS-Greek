package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.repository.metadata.LeosAuthenticLanguage;
import eu.europa.ec.leos.domain.repository.metadata.LeosCoverPageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
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
    private List<String> crossReferences;
    private String targetProposalReference;
    private Date targetProposalDate;
    private List<String> proposalTargetLang;
    private String correctionInformation;
    private String proposalType;
    private Boolean showCorrigendumAddendum;
    private Boolean finalVersion;

    private String adoptionPlace;
    private Date adoptionDate;
    private String institutionalReference;
    private Boolean institutionalReferenceFinalVersion;
    private String interInstitutionalReference;
    private String specialMention;
    private String signingCommissioner;
    private String commissionerTitle;

    public void setCrossReferences(List<String> crossReferences) {
        if (crossReferences == null) {
            return;
        }
        List<String> newCrossRefs = new ArrayList<String>();
        for (String crossReference : crossReferences) {
            crossReference = crossReference.trim();
            if (!crossReference.startsWith("{")) {
                crossReference = "{" + crossReference;
            }
            if (!crossReference.endsWith("{")) {
                crossReference = crossReference + "}";
            }
            newCrossRefs.add(crossReference);
        }
        this.crossReferences = newCrossRefs;
    }
}
