package eu.europa.ec.leos.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRoleDTO {
    private String role;
    private Boolean special;
}
