package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.services.api.GenericDocumentApiService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.response.DocumentConfigResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

// This controller is going to be used as a Generic controller for all documents
// The 'financial-statement' request path will be replaced by any document category.
@RestController
@RequestMapping(value = "/secured/financial-statement")
public class FinancialStatementController {

    private GenericDocumentApiService genericDocumentApiService;

    public FinancialStatementController(GenericDocumentApiService genericDocumentApiService) {
        this.genericDocumentApiService = Objects.requireNonNull(genericDocumentApiService);
    }

    @GetMapping(value = "/{reference}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public DocumentViewResponse getDocumentByRef(@PathVariable("reference") String reference) {
        // When the controller will be used as generic document controller the category will be part of the path.
        DocumentViewResponse response = this.genericDocumentApiService.getDocumentByRef(reference);
        return response;
    }

    @GetMapping(value = "/{documentRef}/getToc", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<TableOfContentItemVO> getToc(@PathVariable("documentRef") String docRef,
                                             @RequestParam("tocMode") TocMode tocMode) {
        // When the controller will be used as generic document controller the category will be part of the path.
        List<TableOfContentItemVO> tableOfContent = this.genericDocumentApiService.getTableOfContent(docRef, tocMode);
        return tableOfContent;
    }

    @GetMapping(value = "/{documentRef}/getTocItems", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<TocItem> getTocItems(@PathVariable("documentRef") String documentRef) {
        List<TocItem> tocItems = this.genericDocumentApiService.getTocItems(documentRef);
        return tocItems;
    }

    @GetMapping(value = "/{documentRef}/version-data", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> getVersionData(@PathVariable("documentRef") String documentRef) {
        List<VersionVO> versions = this.genericDocumentApiService.getVersionsData(documentRef);
        return versions;
    }

    @GetMapping(value = "/{documentRef}/document-config", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public DocumentConfigResponse getDocumentConfig(@PathVariable("documentRef") String documentRef) {
        DocumentConfigResponse config = this.genericDocumentApiService.getDocumentConfig(documentRef);
        return config;
    }

    @GetMapping(value = "/{documentRef}/recent-changes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public List<VersionVO> getRecentChanges(@PathVariable("documentRef") String documentRef) {
        List<VersionVO> recentMinorVersions = this.genericDocumentApiService.getRecentMinorVersions(documentRef);
        return recentMinorVersions;
    }
}
