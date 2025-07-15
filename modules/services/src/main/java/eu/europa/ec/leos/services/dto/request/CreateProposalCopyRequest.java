package eu.europa.ec.leos.services.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProposalCopyRequest {

    private String templateId;
    private String templateName;
    private String langCode;
    private String docPurpose;
    private boolean eeaRelevance;
    private String key;
    private String proposalRef;

}