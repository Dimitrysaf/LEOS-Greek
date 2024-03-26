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

import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/secured/home/")
public class HomePageController {
    private static final Logger LOG = LoggerFactory.getLogger(HomePageController.class);

    @Autowired
    private GenericDocumentApiService genericDocumentApiService;

    @GetMapping(path = "/my-recent-packages", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> findMyRecentPackages() {
        return ResponseEntity.ok().body(genericDocumentApiService.findRecentPackagesForUser());
    }

    @GetMapping(path = "/my-favourite-packages", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> findMyFavouritePackages() {
        return ResponseEntity.ok().body(genericDocumentApiService.findFavouritePackagesForUser());
    }

    @PutMapping(path = "/{documentRef}/toggle-favourite-package", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> toggleFavouritePackage(@PathVariable("documentRef") String documentRef) {
        return ResponseEntity.ok().body(genericDocumentApiService.toggleFavouritePackage(documentRef));
    }

}
