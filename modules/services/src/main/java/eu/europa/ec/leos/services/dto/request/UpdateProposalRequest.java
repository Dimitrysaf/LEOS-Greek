package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.repository.metadata.LeosAuthenticLanguage;
import eu.europa.ec.leos.domain.repository.metadata.LeosCoverPageType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
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
    private String targetProposalDate;
    private List<String> proposalTargetLang;
    private String correctionInformation;
    private String proposalType;
    private Boolean showCorrigendumAddendum;
    private Boolean finalVersion;

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

    public Boolean getShowCorrigendumAddendum() {
        return showCorrigendumAddendum;
    }

    public void setShowCorrigendumAddendum(Boolean showCorrigendumAddendum) {
        this.showCorrigendumAddendum = showCorrigendumAddendum;
    }

    public String getTargetProposalReference() {
        return targetProposalReference;
    }

    public void setTargetProposalReference(String targetProposalReference) {
        this.targetProposalReference = targetProposalReference;
    }

    public String getTargetProposalDate() {
        return targetProposalDate;
    }

    public void setTargetProposalDate(String targetProposalDate) {
        this.targetProposalDate = targetProposalDate;
    }

    public List<String> getProposalTargetLang() {
        return proposalTargetLang;
    }

    public void setProposalTargetLang(List<String> proposalTargetLang) {
        this.proposalTargetLang = proposalTargetLang;
    }

    public String getCorrectionInformation() {
        return correctionInformation;
    }

    public void setCorrectionInformation(String correctionInformation) {
        this.correctionInformation = correctionInformation;
    }

    public String getProposalType() {
        return proposalType;
    }

    public void setProposalType(String proposalType) {
        this.proposalType = proposalType;
    }

    public Boolean getFinalVersion() {
        return finalVersion;
    }

    public void setFinalVersion(Boolean finalVersion) {
        this.finalVersion = finalVersion;
    }
}
