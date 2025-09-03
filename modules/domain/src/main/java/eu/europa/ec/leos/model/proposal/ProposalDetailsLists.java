package eu.europa.ec.leos.model.proposal;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProposalDetailsLists {
    List<String> proposalRefTypes;
    List<String> institionalRefsTypes;
    List<String> interInstitionalRefsTypes;
    List<String> adoptionPlaces;
    List<String> languages;
    List<String> specialMentions;
    List<String> commissionerTitles;
    List<String> signingCommissioner;
}
