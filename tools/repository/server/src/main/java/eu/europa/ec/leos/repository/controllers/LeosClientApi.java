package eu.europa.ec.leos.repository.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "LeosClient", description = "LEOS client management API")
public interface LeosClientApi {

    @Operation(
            summary = "Get LEOS client",
            description = "Retrieves LEOS client information by client name and optional technical user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Client information retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Client not found", content = @Content)
    })
    @GetMapping(path = "/leos-client")
    ResponseEntity<Object> getLeosClient(
            @Parameter(description = "Client name", required = true) @RequestParam(value = "clientName", required = true) String clientName,
            @Parameter(description = "Technical user") @RequestParam(value = "technicalUser", required = false) String technicalUser);
}
