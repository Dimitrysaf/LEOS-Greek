package eu.europa.ec.digit.userdata.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class UserUpdateDto {
    @NotNull(message = "User login is required.")
    @Size(min = 1, max = 50,
            message = "User login must be between 1 and 50 characters long.")
    @Pattern(regexp = "^\\w+$",
            message = "User login cannot contain whitespaces")
    private String login;

    @Size(min = 1, max = 50,
            message = "User last name must be between 1 and 50 characters long.")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$",
            message = "User last name contains invalid characters")
    private String lastName;

    @Size(min = 1, max = 50,
            message = "User first name must be between 1 and 50 characters long.")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$",
            message = "User first name contains invalid characters")
    private String firstName;

    @Email
    private String email;

    private List<String> roles;

    private Set<UserEntityDto> addedEntities;

    private Set<String> removedEntities;
}
