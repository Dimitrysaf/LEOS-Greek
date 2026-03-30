package eu.europa.ec.leos.services.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Home Page")
public interface HomePageApi {

    @Operation(summary = "Find my recent packages", description = "Retrieves the list of recently accessed packages for the current user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent packages retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(path = "/my-recent-packages", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> findMyRecentPackages();

    @Operation(summary = "Find my favourite packages", description = "Retrieves the list of packages marked as favourites by the current user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favourite packages retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(path = "/my-favourite-packages", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> findMyFavouritePackages();

    @Operation(summary = "Toggle favourite package", description = "Adds or removes a package from the current user's favourites list")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favourite package toggled successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping(path = "/{documentRef}/toggle-favourite-package", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> toggleFavouritePackage(@Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef);

    @Operation(summary = "Upload notifications configuration", description = "Uploads and saves the notifications configuration settings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notifications uploaded successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(path = "/uploadNotifications", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> configNotificationsUpload(@Parameter(description = "Content") @RequestBody String content);

    @Operation(summary = "Fetch notifications configuration", description = "Retrieves the current notifications configuration settings")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notifications fetched successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(path = "/fetchNotifications", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> configNotificationsFetch();
}
