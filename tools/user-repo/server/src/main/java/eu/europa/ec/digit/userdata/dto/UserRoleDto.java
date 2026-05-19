package eu.europa.ec.digit.userdata.dto;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@lombok.Data
public class UserRoleDto {
    private String role;
    private Boolean special;
}
