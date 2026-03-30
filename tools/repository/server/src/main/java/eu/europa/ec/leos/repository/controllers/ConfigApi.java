package eu.europa.ec.leos.repository.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Config", description = "Configuration management API")
public interface ConfigApi {

    @Operation(
            summary = "Upload notifications configuration",
            description = "Saves notifications configuration in JSON format"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid JSON format", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PostMapping(path = "/config/notifications/upload",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> configNotificationsUpload(
            @Parameter(description = "Notifications configuration in JSON format", required = true) @RequestBody String json);

    @Operation(
            summary = "Fetch notifications configuration",
            description = "Retrieves the current notifications configuration"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Configuration retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping(path = "/config/notifications/fetch",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<Object> configNotificationsFetch();
}
