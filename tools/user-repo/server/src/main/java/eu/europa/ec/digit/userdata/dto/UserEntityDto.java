package eu.europa.ec.digit.userdata.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@EqualsAndHashCode(callSuper = true, exclude = "role")
@NoArgsConstructor
public class UserEntityDto extends EntityDto {
    private String role;

    public UserEntityDto(String id, String name, String organizationName, Boolean special, String role) {
        super(id, name, organizationName, special);
        this.role = role;
    }
}
