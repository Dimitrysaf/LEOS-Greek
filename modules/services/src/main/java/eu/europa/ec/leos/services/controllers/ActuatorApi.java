package eu.europa.ec.leos.services.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Tag(name = "Actuator", description = "Application health and monitoring API")
public interface ActuatorApi {

    @Operation(summary = "Get application health", description = "Retrieves application health status including database and component checks")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Application is healthy"),
            @ApiResponse(responseCode = "503", description = "Service unavailable", content = @Content)
    })
    @GetMapping("/health")
    ResponseEntity<Map<String, Object>> health();
}
