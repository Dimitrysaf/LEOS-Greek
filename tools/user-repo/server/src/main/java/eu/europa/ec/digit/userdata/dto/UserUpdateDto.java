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
    @NotNull(message = "User login is required.")
    @Pattern(regexp = "^\\w{1,50}$",
            message = "User login cannot contain whitespaces")
    private String login;

    @Pattern(regexp = "^(?!\\s*$)[\\p{L}\\s'-]{1,50}$",
            message = "Invalid last name")
    private String lastName;

    @Pattern(regexp = "^(?!\\s*$)[\\p{L}\\s'-]{1,50}$",
            message = "Invalid first name")
    private String firstName;

    @Email(message = "User email is not valid.")
    private String email;

    private List<String> roles;

    private Set<UserEntityDto> addedEntities;

    private Set<String> removedEntities;
}
