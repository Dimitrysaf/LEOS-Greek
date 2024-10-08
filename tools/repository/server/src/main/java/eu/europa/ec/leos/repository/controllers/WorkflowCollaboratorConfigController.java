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
package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.controllers.requests.WorkflowCollaboratorConfigRequest;
import eu.europa.ec.leos.repository.entities.WorkflowCollaboratorConfig;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.Package;
import eu.europa.ec.leos.repository.model.WorkflowCollaboratorConfiguration;
import eu.europa.ec.leos.repository.services.PackageService;
import eu.europa.ec.leos.repository.services.WorkflowCollaboratorConfigService;
import eu.europa.ec.leos.repository.utils.RestPreconditions;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.web.util.UriUtils.decode;

@RestController
@Tag(name = "Workflow Collaborator Config API", description = "Workflow Collaborator Config API")
@Slf4j
public class WorkflowCollaboratorConfigController {

    WorkflowCollaboratorConfigService workflowCollaboratorConfigService;
    PackageService packageService;

    @Autowired
    public WorkflowCollaboratorConfigController (
            WorkflowCollaboratorConfigService workflowCollaboratorConfigService,
            PackageService packageService
    ) {
        this.workflowCollaboratorConfigService = workflowCollaboratorConfigService;
        this.packageService = packageService;
    }
    //get config for a client_id and a package_id

    @PostMapping(path = "/workflow-collaborator-config",
            consumes = {MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Create or replace Workflow collaborator configuration")
    public ResponseEntity<Object> setWorkflowConfiguration(@Valid @RequestBody WorkflowCollaboratorConfigRequest workflowCollaboratorConfigRequest) {
        try {
            log.info("POST workflowCollaboratorConfigRequest "+workflowCollaboratorConfigRequest);
            final BigDecimal id = workflowCollaboratorConfigService.save(workflowCollaboratorConfigRequest);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/workflow-collaborator-config")
    @Operation(summary = "Get a Workflow collaborator config for a packageName and a clientName")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workflow collaborator config Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getWorkflowCollaboratorConfig
            (@RequestParam("packageName") String packageName,
             @RequestParam("clientName") String clientName) {
        final Optional<WorkflowCollaboratorConfig> workflowCollaboratorConfig = getWorkflowCollaboratorConfiguration(packageName, clientName);
        if (workflowCollaboratorConfig.isPresent()) {
            return ResponseEntity.ok(convert(workflowCollaboratorConfig.get()));
        }
        return new ResponseEntity<>("Resource not found for packageName "+packageName+", clientName "+clientName, HttpStatus.NOT_FOUND);
    }

    private Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfiguration
            (String packageName, String clientName) {
        packageName = decode(packageName, StandardCharsets.UTF_8.name());
        clientName = decode(clientName, StandardCharsets.UTF_8.name());
        log.info(String.format("searching for a package %s and clientId %s.", packageName, clientName));
        return workflowCollaboratorConfigService.getWorkflowCollaboratorConfig(packageName, clientName);
    }

    @GetMapping(path = "/workflow-collaborator-config/all")
    @Operation(summary = "Get a list of Workflow collaborator configs associated to a packageName")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List Workflow collaborator config Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> getWorkflowCollaboratorConfigs
            (@RequestParam("packageName") String packageName)
            throws  RepositoryException {
        packageName = decode(packageName, StandardCharsets.UTF_8.name());
        log.info(String.format("searching for a package %s.",packageName));
        Package pkg = packageService.getPackageByName(packageName);
        RestPreconditions.checkFound(pkg, HttpStatus.NOT_FOUND ,"Error while searching for a package");
        final List<WorkflowCollaboratorConfig> workflowCollaboratorConfigs = workflowCollaboratorConfigService.getWorkflowCollaboratorConfigs(packageName);
        RestPreconditions.checkFound(workflowCollaboratorConfigs, HttpStatus.NOT_FOUND ,String.format("Error while searching for a package %s.",packageName));
        return ResponseEntity.ok(convert(workflowCollaboratorConfigs));
    }

    @DeleteMapping(path = "/workflow-collaborator-config/{id}")
    @Operation(summary = "Delete a Workflow collaborator config")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workflow collaborator config Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> deleteWorkflowCollaboratorConfig
            (@PathVariable("id") int id) {
        final Optional<WorkflowCollaboratorConfig> workflowCollaboratorConfiguration = getWorkflowCollaboratorConfiguration(id);
        if (workflowCollaboratorConfiguration.isPresent()) {
            workflowCollaboratorConfigService.delete(workflowCollaboratorConfiguration.get());
        }
        return ResponseEntity.ok().build();
    }

    private Optional<WorkflowCollaboratorConfig> getWorkflowCollaboratorConfiguration(int id){
        final Optional<WorkflowCollaboratorConfig> workflowCollaboratorConfig = workflowCollaboratorConfigService.getWorkflowCollaboratorConfig(BigDecimal.valueOf(id));
        RestPreconditions.checkFound(workflowCollaboratorConfig, HttpStatus.NOT_FOUND ,String.format("Error while searching workflow collaborator config for id %s.", id));
        return workflowCollaboratorConfig;
    }


    private List<WorkflowCollaboratorConfiguration> convert(List<WorkflowCollaboratorConfig> list) {
        return list.stream().map(this::convert)
            .collect(Collectors.toList())
            ;
    }

    private WorkflowCollaboratorConfiguration convert(WorkflowCollaboratorConfig workflowCollaboratorConfig) {
        return WorkflowCollaboratorConfiguration.builder()
                .clientName(workflowCollaboratorConfig.getLeosClients().getName())
                .packageName(workflowCollaboratorConfig.getPkg().getName())
                .aclCallBackUrl(workflowCollaboratorConfig.getAclCallbackUrl())
                .userCheckCallbackUrl(workflowCollaboratorConfig.getUserCheckCallbackUrl())
                .id(workflowCollaboratorConfig.getId())
                .build();
    }

    @DeleteMapping(path = "/workflow-collaborator-config")
    @Operation(summary = "Delete a Workflow collaborator config for a packageName and a clientName")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workflow collaborator config Found", content = { @Content(mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", description = "Error while handling request", content = @Content) })
    public ResponseEntity<Object> deleteWorkflowCollaboratorConfig
            (@RequestParam("packageName") String packageName, @RequestParam("clientName") String clientName) {
        final Optional<WorkflowCollaboratorConfig> workflowCollaboratorConfiguration = getWorkflowCollaboratorConfiguration(packageName, clientName);
        if (workflowCollaboratorConfiguration.isPresent()) {
            workflowCollaboratorConfigService.delete(workflowCollaboratorConfiguration.get());
        }
        return ResponseEntity.ok().build();
    }

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    //Advanced
    //set/reset and get All the workflow collaborators (in collaboratos table) 4 a workflowCollabConfig

}
