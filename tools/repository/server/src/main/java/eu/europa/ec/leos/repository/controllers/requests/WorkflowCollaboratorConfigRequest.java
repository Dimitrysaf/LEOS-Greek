package eu.europa.ec.leos.repository.controllers.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowCollaboratorConfigRequest implements Serializable {
    @NotBlank(message = "Package name cannot be blank")
    private String packageName;
    @NotBlank(message = "Client name cannot be blank")
    private String clientName;
    @NotBlank(message = "ACL Callback URL name cannot be blank")
    private String aclCallbackUrl;
    @NotBlank(message = "User check Callback URL name cannot be blank")
    private String userCheckCallbackUrl;
}
