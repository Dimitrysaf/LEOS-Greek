/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.digit.leos.pilot.controller;

import eu.europa.ec.digit.leos.pilot.export.exception.LeosDocumentException;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.service.LeosDocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
public class EditLightApiController {

    private final LeosDocumentService leosDocumentService;

    public EditLightApiController(LeosDocumentService leosDocumentService) {
        this.leosDocumentService = leosDocumentService;
    }
    
    @RequestMapping("/test")
    public String test() { return "Test RESTful service"; }
}
