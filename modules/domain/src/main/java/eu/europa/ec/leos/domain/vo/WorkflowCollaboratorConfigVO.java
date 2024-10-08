package eu.europa.ec.leos.domain.vo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigInteger;

@Data
public class WorkflowCollaboratorConfigVO implements Serializable {
    private String aclCallBackUrl,
                   userCheckCallbackUrl;
    private BigInteger id;
}
