package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.api.BillApiService;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/secured/bill/")
public class BillController {
    private static final Logger LOG = LoggerFactory.getLogger(BillController.class);

    @Autowired
    BillApiService billApiService;

    @GetMapping(value = "/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getBillDocument(@PathVariable("documentRef") String documentRef) {
        try {
            byte[] billDocument = this.billApiService.getBillDocument(documentRef);
            return  ResponseEntity.ok().body(billDocument);
        } catch (Exception e) {
            LOG.error("Error occurred while getting bill document - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting annex document", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getTocItems(@PathVariable("documentRef") String documentRef,
                                              @RequestParam("tocMode") TocMode tocMode
    ) {
        try {
            List<TableOfContentItemVO> tocItems = this.billApiService.getTocItems(documentRef);
            return  ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting annex toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
