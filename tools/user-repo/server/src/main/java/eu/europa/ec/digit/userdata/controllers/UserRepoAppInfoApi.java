package eu.europa.ec.digit.userdata.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Tag(name = "App Info", description = "Application information API")
public interface UserRepoAppInfoApi {

    @Operation(summary = "Get application information", description = "Retrieves application version and build information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Application information retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping
    Map<String, String> getAppInfo();
}
