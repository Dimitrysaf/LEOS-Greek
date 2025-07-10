package eu.europa.ec.leos.domain.vo;

import eu.europa.ec.leos.model.proposal.ProposalDetailsLists;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProposalDetailsVO {
    private DocumentVO document;
    private ProposalDetailsLists proposalDetailsLists;
}
