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
s
package eu.europa.ec.leos.services.controllers;


import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.api.MemorandumApiService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/secured/memorandum/")
public class MemorandumController {
    private static final Logger LOG = LoggerFactory.getLogger(MemorandumController.class);

    @Autowired
    MemorandumApiService memorandumApiService;

    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getMemorandum(@PathVariable("documentRef") String documentRef) {
        try {
            DocumentViewResponse memorandumDocument = this.memorandumApiService.getDocument(documentRef);
            return  ResponseEntity.ok().body(memorandumDocument);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum document - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting annex document", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getToc(@PathVariable("documentRef") String documentRef,
                                              @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> toc = this.memorandumApiService.getToc(documentRef,tocMode);
            return  ResponseEntity.ok().body(toc);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting annex toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef) {
        try {
            List<TocItem> tocItems = this.memorandumApiService.getTocItems(documentRef);
            return  ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting memorandum toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error memorandum while getting memorandum toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
