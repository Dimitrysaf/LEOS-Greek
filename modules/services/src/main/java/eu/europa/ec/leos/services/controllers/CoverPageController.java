package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.api.BillApiService;
import eu.europa.ec.leos.services.api.CoverPageApiService;
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
@RequestMapping("/secured/coverPage/")
public class CoverPageController {
    private static final Logger LOG = LoggerFactory.getLogger(CoverPageController.class);

    @Autowired
    CoverPageApiService coverPageApiService;

    @GetMapping(value = "/{documentRef}", produces = MediaType.TEXT_XML_VALUE )
    @ResponseBody
    public ResponseEntity<Object> getCoverPage(@PathVariable("documentRef") String documentRef) {
        try {
            String coverPageDocument = this.coverPageApiService.getCoverPageDocument(documentRef);
            return  ResponseEntity.ok().body(coverPageDocument);
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
            List<TableOfContentItemVO> tocItems = this.coverPageApiService.getTocItems(documentRef);
            return  ResponseEntity.ok().body(tocItems);
        } catch (Exception e) {
            LOG.error("Error occurred while getting annex toc items - " + e.getMessage());
            return  new ResponseEntity<>("Unexpected error occurred while getting annex toc items", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
