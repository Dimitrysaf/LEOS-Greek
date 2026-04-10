package eu.europa.ec.digit.userdata.controllers;

import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.exception.UserRepoExceptionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import eu.europa.ec.digit.userdata.dto.validationgroup.Create;
import eu.europa.ec.digit.userdata.dto.validationgroup.Update;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;


@RequestMapping("/entities")
@Tag(name = "Entity Management", description = "Entity management API")
public interface EntityApi {
    @Operation(summary = "Get all organizations", description = "Retrieves list of all organizations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Organizations retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping
    Collection<String> getAllOrganizations();

    @Operation(summary = "Search users by organization and key", description = "Search users by organization and key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping("/{org}/users")
    Collection<User> searchUsersByOrganizationAndKey(
            @PathVariable(value = "org", required = false) String organization,
            @RequestParam(value = "searchKey") String searchKey);

    @Operation(summary = "Get entities for user", description = "Retrieves all full path entities for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Entities retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping("/{userId}")
    Collection<Entity> getAllFullPathEntitiesForUser(@PathVariable String userId);

    @Operation(summary = "Create special entity", description = "Creates a special entity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Special entity created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid DTO",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @PostMapping
    EntityDto createEntity(@Parameter(description = """
            Special entity to create:
            - Id must NOT be set;
            - Name is mandatory. Can contain alphanumeric [a-zA-Z0-9_] characters and dot only;""")
            @RequestBody @Validated(Create.class) EntityDto dto);

    /**
     * Gets the special entities for the given organization or all special entities if no organization name is passed.
     * If organization name is provided, then the organization is included in the result.
     * @param orgName
     * <ol>
     *     <li>If orgName is null or empty, then all SpecialEntity records are returned</li>
     *     <li>Matching special entities + the organization itself are returned otherwise</li>
     * </ol>
     * @return The special entities + organization
     */
    @Operation(summary = "Get special entities", description = """
        Retrieves all special entities for a given organization or all special entities if no organization name is passed.
        If organization name is provided, then the organization is included in the result.""")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Special entities retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping("/special")
    Collection<EntityDto> special(@Parameter(description = """
            - If orgName is null or empty, then all SpecialEntity records are returned;
            - Matching special entities + the organization itself are returned otherwise;""")
                                  @RequestParam(required = false) String orgName);

    @Operation(summary = "Update special entity", description = "Updates a special entity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Special entity updated successfully"),
            @ApiResponse(responseCode = "400", description = "Special entity not found or invalid DTO",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @PatchMapping
    EntityDto updateEntity(@Parameter(description = """
            Special entity to update:
            - Id is mandatory
            - Name is mandatory. Can contain alphanumeric [a-zA-Z0-9_] characters and dot only.""")
                           @RequestBody @Validated(Update.class) EntityDto dto);

    @Operation(summary = "Delete special entity", description = "Deletes a special entity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Special entity deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Special entity with that ID was not found",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @DeleteMapping("/{id}")
    void deleteEntity(@PathVariable String id);
}
