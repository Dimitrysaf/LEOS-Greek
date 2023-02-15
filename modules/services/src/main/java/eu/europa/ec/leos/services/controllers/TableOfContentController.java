package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.services.api.TableOfContentService;
import eu.europa.ec.leos.services.dto.request.NodeDropValidationRequest;
import eu.europa.ec.leos.services.dto.response.NodeValidationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/secured/toc/")
public class TableOfContentController {
    private static final Logger LOG = LoggerFactory.getLogger(TableOfContentController.class);

    @Autowired
    TableOfContentService tableOfContentService;

    @PostMapping(value = "/{documentRef}/validate-node-drop", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> validateNodeDrop(@PathVariable("documentRef") String documentRef,
                                              @RequestBody() NodeDropValidationRequest nodeValidationRequest
    ) {
        try {
            NodeValidationResponse response = this.tableOfContentService.nodeValidationDrop(nodeValidationRequest);
            return  ResponseEntity.ok().body(response);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting annex toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
