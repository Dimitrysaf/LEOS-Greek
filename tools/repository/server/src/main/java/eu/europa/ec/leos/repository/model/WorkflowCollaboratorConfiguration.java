package eu.europa.ec.leos.repository.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WorkflowCollaboratorConfiguration {
    private String packageName,
                   clientName,
                   aclCallBackUrl,
                   userCheckCallbackUrl;
    private BigDecimal id;
}
