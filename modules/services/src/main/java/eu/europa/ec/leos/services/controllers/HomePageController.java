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
import eu.europa.ec.leos.services.response.FavouritePackageResponse;
import eu.europa.ec.leos.services.response.RecentPackageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
        try {
            List<RecentPackageResponse> response = genericDocumentApiService.findRecentPackagesForUser();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while getting recent packages - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting recent packages ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/my-favorite-packages", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> findMyFavoritePackages() {
        try {
            List<FavouritePackageResponse> response = genericDocumentApiService.findFavoritePackagesForUser();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while getting favourite packages - " + e.getMessage());
            return new ResponseEntity<>("Unexpected error occurred while getting favourite packages ", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
