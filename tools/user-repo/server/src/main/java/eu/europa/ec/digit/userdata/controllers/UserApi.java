/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.userdata.controllers;

import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.request.SpecialEntityRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Tag(name = "User Management", description = "User and entity management API")
public interface UserApi {

    @Operation(summary = "Search users", description = "Search users by key with optional context and reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(path = "/users")
    @Transactional(readOnly = true)
    Collection<User> searchUsers(
            @Parameter(description = "Search key") @RequestParam(value = "searchKey") String searchKey,
            @Parameter(description = "Search context") @RequestParam(value = "searchContext", required = false) String searchContext,
            @Parameter(description = "Search reference") @RequestParam(value = "searchReference", required = false) String searchReference
    );

    @Operation(summary = "Get user by ID", description = "Retrieves user details by user ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User found successfully"),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(path = "/users/{userId}")
    @Transactional(readOnly = true)
    User getUser(@Parameter(description = "User ID") @PathVariable(value = "userId") String userId);

    @Operation(summary = "Get all organizations", description = "Retrieves list of all organizations")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Organizations retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(path = "/entities")
    @Transactional(readOnly = true)
    Collection<String> getAllOrganizations();

    @Operation(summary = "Get users by job title", description = "Retrieves users with specified job title")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(method = RequestMethod.GET, path = "/users/jobTitle/{jobTitle}")
    @Transactional(readOnly = true)
    Collection<User> getUsersForJobTitle(@Parameter(description = "Job title") @PathVariable(value = "jobTitle") String jobTitle);

    @Operation(summary = "Search users by organization", description = "Search users by organization and key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users found successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @RequestMapping(method = RequestMethod.GET, path = "/entities/{org}/users")
    @Transactional(readOnly = true)
    Collection<User> searchUsersByOrganizationAndKey(
            @Parameter(description = "Organization") @PathVariable(value = "org", required = false) String organization,
            @Parameter(description = "Search key") @RequestParam(value = "searchKey", required = true) String searchKey
    );

    @Operation(summary = "Add special entity for user", description = "Adds a special entity connection for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Special entity added successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(path = "/users/connectedEntity")
    @Transactional
    Boolean addSpecialEntityForUser(@Parameter(description = "Special entity request") @RequestBody SpecialEntityRequest request);

    @Operation(summary = "Get entities for user", description = "Retrieves all full path entities for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Entities retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(path = "/entities/{userId}")
    @Transactional(readOnly = true)
    Collection<Entity> getAllFullPathEntitiesForUser(@Parameter(description = "User ID") @PathVariable(value = "userId") String userId);
}
