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

    @Pattern(regexp = "^([a-zA-Z0-9_])+(\\.?[a-zA-Z0-9_])*$",
            groups = {Create.class, Update.class},
            message="Invalid entity name. The name can contain alphanumeric [a-zA-Z0-9_] characters and dot only.")
    @NotNull(groups = {Create.class, Update.class}, message = "Entity name is required.")
    @Size(min = 1, max = 50, groups = {Create.class, Update.class}, message = "Entity name must be between 1 and 50 characters long.")
    private String name;

    private String organizationName;

    private Boolean special;
}
