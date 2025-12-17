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

package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.collection.CreateCollectionException;
import eu.europa.ec.leos.services.collection.CreateCollectionResult;
import eu.europa.ec.leos.services.dto.request.CreateProposalRequest;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import eu.europa.ec.leos.services.dto.response.WorkspaceProposalResponse;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping(value = "/secured")
public class WorkspaceApiController {

    private static final Logger LOG = LoggerFactory.getLogger(WorkspaceApiController.class);

    private final ApiService apiService;
    private final SecurityContext securityContext;

    @Autowired
    public WorkspaceApiController(ApiService apiService, SecurityContext securityContext) {
        this.apiService = apiService;
        this.securityContext = securityContext;
    }

    @RequestMapping(value = "/filterProposals", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> filterProposals(@RequestBody FilterProposalsRequest request) {
        try {
            WorkspaceProposalResponse workspaceProposalResponse = apiService.listDocumentsWithFilter(request);
            if(workspaceProposalResponse != null) {
                return new ResponseEntity<>(workspaceProposalResponse, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No result found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            LOG.error("Error occurred while retrieving list of proposals " + ex.getMessage());
            return new ResponseEntity<>("Error occurred while retrieving list of proposals " + ex.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/createPackage", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> createPackage(@RequestBody CreateProposalRequest request) {
        CreateCollectionResult createCollectionResult;
        try {
            createCollectionResult = apiService.createProposal(request.getTemplateId(), request.getTemplateName(), request.getLangCode(),
                    request.getDocPurpose(), request.isEeaRelevance(), request.isCustomTemplateAct(), request.getKey());
            LOG.info("A package with proposal is created with proposal ref {} by the user {}", createCollectionResult.getProposalId(),
                    securityContext.getUser().getLogin());
            return new ResponseEntity<>(createCollectionResult, HttpStatus.OK);
        } catch (CreateCollectionException ex) {
            LOG.error("Error occurred while creating proposal " + ex.getMessage());
            return new ResponseEntity<>("Error occurred while creating proposal", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/getTemplates", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getTemplates() {
        try {
            List<CatalogItem> catalogItems = apiService.getTemplates();
            if (catalogItems != null && catalogItems.size() > 0) {
                return new ResponseEntity<>(catalogItems, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No result found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            LOG.error("Error occurred while retrieving list of proposals " + ex.getMessage());
            return new ResponseEntity<>("Error occurred while retrieving list of proposals " + ex.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/getCustomTemplates/{entityName}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getCustomTemplates(@PathVariable String entityName) {
        try {
            List<CatalogItem> catalogItems = apiService.getCustomTemplates(entityName);
            return new ResponseEntity<>(catalogItems, HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            if (StringUtils.startsWith(ex.getMessage(), "404 NOT_FOUND")) {
                return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
            }
            LOG.error("Error occurred while retrieving custom templates catalog: {}", ex.getMessage());
            return new ResponseEntity<>("Error occurred while retrieving custom templates catalog: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            LOG.error("Error occurred while retrieving custom templates catalog: {}", ex.getMessage());
            return new ResponseEntity<>("Error occurred while retrieving custom templates catalog: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/getTemplatesForEntity", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getTemplatesForEntity() {
        List<List<CatalogItem>> combinedList = new ArrayList<>();
        try {
            combinedList = apiService.getAllTemplatesForEntity();
            return new ResponseEntity<>(combinedList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>("Error occurred while retrieving templates for dg: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
