package eu.europa.ec.leos.integration.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
public class UserEntityDTO extends EntityDTO {
    private String role;

    public UserEntityDTO(EntityDTO entityDTO) {
        this(entityDTO.getId(), entityDTO.getName(), entityDTO.getOrganizationName(), true);
    }

    public UserEntityDTO(String id, String name, String organizationName, Boolean special) {
        super(id, name, organizationName, special);
    }

}
