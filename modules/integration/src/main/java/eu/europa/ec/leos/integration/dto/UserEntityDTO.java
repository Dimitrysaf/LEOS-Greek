package eu.europa.ec.leos.integration.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
public class UserEntityDTO extends EntityDTO {
    private String role;

    public UserEntityDTO(EntityDTO entityDTO) {
        this(entityDTO.getId(), entityDTO.getName(), entityDTO.getOrganizationName());
    }

    public UserEntityDTO(String id, String name, String organizationName) {
        super(id, name, organizationName);
    }

    public UserEntityDTO(String id, String name, String organizationName, String role) {
        super(id, name, organizationName);
        this.role = role;
    }
}
