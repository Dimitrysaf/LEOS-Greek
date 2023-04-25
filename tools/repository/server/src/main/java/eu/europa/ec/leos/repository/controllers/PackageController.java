package eu.europa.ec.leos.repository.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.repositories.PackageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Package API", description = "Package API")
public class PackageController {

	@Autowired
	PackageRepository packageRepository;

	@GetMapping(path = "/package/name/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
	@Operation(summary = "Get a Package by name")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Found the Package", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Package.class)) }),
			@ApiResponse(responseCode = "404", description = "Package not found", content = @Content),
			@ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
	public ResponseEntity<Package> getPackageFromId(@PathVariable("name") String name) {
		try {
			Package p = packageRepository.findByName(name);
			if (p != null) {
				return new ResponseEntity<>(p, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
