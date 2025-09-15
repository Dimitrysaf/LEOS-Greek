package eu.europa.ec.leos.domain.repository.metadata;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignatureMetadata {
    private String specialMention;
    private String commissionerTitle;
    private String signingCommissioner;
}
