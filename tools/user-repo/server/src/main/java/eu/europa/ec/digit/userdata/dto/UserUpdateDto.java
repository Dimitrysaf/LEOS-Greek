package eu.europa.ec.digit.userdata.dto;

import eu.europa.ec.digit.userdata.dto.validationgroup.UserValidOnUpdate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@EqualsAndHashCode(of = "login")
@AllArgsConstructor
@NoArgsConstructor
@UserValidOnUpdate
public class UserUpdateDto {
    @NotNull(message = "page.workspace.administration.user-info.error.login_required")
    @Pattern(regexp = "^\\w{1,50}$",
            message = "page.workspace.administration.user-info.error.invalid_login")
    private String login;

    @Pattern(regexp = "^(?!\\s*$)[\\p{L}\\s'-]{1,50}$",
            message = "page.workspace.administration.user-info.error.invalid_lastname")
    private String lastName;

    @Pattern(regexp = "^(?!\\s*$)[\\p{L}\\s'-]{1,50}$",
            message = "page.workspace.administration.user-info.error.invalid_firstname")
    private String firstName;

    @Email(message = "page.workspace.administration.user-info.error.invalid_email")
    private String email;

    private List<String> roles;

    private Set<UserEntityDto> addedEntities;

    private Set<String> removedEntities;
}
