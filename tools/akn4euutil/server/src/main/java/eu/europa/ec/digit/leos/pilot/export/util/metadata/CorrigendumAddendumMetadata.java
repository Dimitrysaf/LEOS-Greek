package eu.europa.ec.digit.leos.pilot.export.util.metadata;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class CorrigendumAddendumMetadata implements Serializable {
    private String targetProposalReference;
    private String targetProposalDate;
    private List<String> proposalTargetLang;
    private String correctionInformation;
    private String proposalType;
    private Boolean showCorrigendumAddendum;
    private Boolean finalVersion;
    private Integer targetProposalInterInstitutionalRefYear;
    private String targetProposalInterInstitutionalRefNumber;
    private String targetProposalInterInstitutionalRefType;
}
