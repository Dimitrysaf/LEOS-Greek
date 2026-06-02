package eu.europa.ec.digit.userdata.dto;

import eu.europa.ec.digit.userdata.dto.validationgroup.Create;
import eu.europa.ec.digit.userdata.dto.validationgroup.Update;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.validation.constraints.*;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
public class EntityDto {

    @Null(groups = Create.class)
    @NotBlank(groups = Update.class)
    private String id;

    /**
     * Represents the name of an entity with specific validation constraints:
     * - Must not be blank when creating or updating the entity.
     * - Must be between 1 and 50 characters in length.
     * - Must match the specified pattern ensuring the following:
     *   - Balanced use of parentheses.
     *   - No invalid characters such as dots not preceded by alphanumeric characters,
     *     or commas not followed by valid characters or spaces.
     * - The pattern allows letters, numbers, underscores, spaces, periods,
     *   parentheses, hyphens, commas, and slashes within the defined character length.
     *
     * Validation is applied for the {@code Create} and {@code Update} groups.
     * An error message is provided when these constraints are violated.
     */
    @Pattern(regexp = "^(?=[^()]*(?:\\([^()]*\\)[^()]*)*$)(?!.*\\.[^\\p{L}0-9])(?!.*,[^\\p{L}0-9\\s])[\\p{L}_\\s.()\\-0-9/,]{0,49}[\\p{L}_0-9)]$",
            groups = {Create.class, Update.class},
            message="Invalid entity name.")
    @NotBlank(groups = {Create.class, Update.class}, message = "Entity name is required.")
    @Size(min = 1, max = 50, groups = {Create.class, Update.class}, message = "Entity name must be between 1 and 50 characters long.")
    private String name;

    private String organizationName;

    private Boolean special;
}
