package eu.europa.ec.digit.userdata.controllers;

import eu.europa.ec.digit.userdata.dto.UserAuthDto;
import eu.europa.ec.digit.userdata.dto.UserDto;
import eu.europa.ec.digit.userdata.dto.UserUpdateDto;
import eu.europa.ec.digit.userdata.dto.validationgroup.Create;
import eu.europa.ec.digit.userdata.exception.UserRepoExceptionResponse;
import eu.europa.ec.digit.userdata.request.SpecialEntityRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;


@RequestMapping("/users")
@Tag(name = "User Management", description = "User management API")
public interface UserApi {
    @Operation(summary = "Search users", description = "Search users by key with optional context and reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping
    Collection<UserAuthDto> searchUsers(
            @Parameter(description = "Search key") @RequestParam(value = "searchKey") String searchKey,
            @Parameter(description = "Search context") @RequestParam(value = "searchContext", required = false) String searchContext,
            @Parameter(description = "Search reference") @RequestParam(value = "searchReference", required = false) String searchReference);

    @Operation(summary = "Get user by ID", description = "Retrieves user details by user ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping(path = "/{userId}")
    UserAuthDto getUser(@Parameter(description = "User ID") @PathVariable String userId);

    @Operation(summary = "Get users by job title", description = "Retrieves users with specified job title")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @RequestMapping(method = RequestMethod.GET, path = "/jobTitle/{jobTitle}")
    Collection<UserAuthDto> getUsersForJobTitle(@Parameter(description = "Job Title") @PathVariable String jobTitle);

    @Operation(summary = "Add special entity for user", description = "Adds a special entity connection for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Special entity added successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @PostMapping(path = "/connectedEntity")
    Boolean addSpecialEntityForUser(@Parameter(description = "Special entity request")
                                    @RequestBody SpecialEntityRequest request);

    @Operation(summary = "Search for users by term and/or entity", description = "Retrieves special user by login")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users search OK"),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @GetMapping("/search")
    Page<UserDto> searchUsers(@Parameter(description = "Search key matching First Name, Last Name, Username, Email")
                              @RequestParam(required = false) String searchKey,
                              @Parameter(description = "If passed, will look for users only belonging to the given entity")
                              @RequestParam(required = false) String entityId,
                              Pageable pageable);

    @Operation(summary = "Create user", description = "Creates a new user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = """
                    On:
                    - Username conflict;
                    - Any of the passed entities does not exist;
                    -Invalid DTO object.""",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @PostMapping
    UserDto createUser(@Parameter(description = "User DTO") @RequestBody @Validated(Create.class) UserDto userDto);

    @Operation(summary = "Update user", description = "Updates an existing user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "400", description = "User not found or invalid DTO object",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @PatchMapping
    UserDto updateUser(@Parameter(description = "User DTO") @RequestBody @Validated UserUpdateDto userDto);

    @Operation(summary = "Delete user", description = "Deletes a user by login")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "400", description = "User not found",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = UserRepoExceptionResponse.class)))
    })
    @DeleteMapping("/{userLogin}")
    ResponseEntity<Void> deleteUser(@Parameter(description = "User login") @PathVariable String userLogin);
}