package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.services.dto.request.DoubleCompareRequest;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.DownloadVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Document")
public interface DocumentApi {

    @Operation(summary = "Upload document", description = "Uploads a new version of a document with check-in comment and version type")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/upload-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> uploadDocument(
            @Parameter(description = "Uploaded file") @RequestParam("uploadedFile") MultipartFile uploadedFile,
            @Parameter(description = "Checkin comment") @RequestParam("checkinComment") String checkinComment,
            @Parameter(description = "Version type") @RequestParam("versionType") VersionType versionType,
            @Parameter(description = "Document reference") @RequestParam("documentRef") String documentRef);

    @Operation(summary = "Download version", description = "Downloads a specific version of the document in the requested format")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/downloadVersion/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> downloadVersion(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Download version request") @RequestBody DownloadVersionRequest downloadVersionRequest);

    @Operation(summary = "Export to eConsilium", description = "Exports the document to eConsilium system with specified options")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Export successful"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/export-to-econsilium/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> exportToEconsilium(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Export to Consilium request") @RequestBody ExportToConsiliumRequest exportToConsiliumRequest);

    @Operation(summary = "Download compared version XML file", description = "Downloads an XML file containing the comparison between two document versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "XML file downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/download-compared-version-XML/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> downloadComparedVersionXMLFile(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Download compared version request") @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest);

    @Operation(summary = "Export compared version as PDF", description = "Exports the comparison between two document versions as a PDF file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF exported successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/export-compared-version-as-PDF/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> exportComparedVersionAsPDF(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Download compared version request") @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest);

    @Operation(summary = "Download compared version as Docuwrite", description = "Downloads the comparison between two document versions in Docuwrite format")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Docuwrite downloaded successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @RequestMapping(value = "/download-compared-version-as-docuwrite/{documentType}/{documentRef}", method = RequestMethod.POST)
    @ResponseBody
    ResponseEntity<Object> downloadComparedVersionAsDocuwrite(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Download compared version request") @RequestBody DownloadComparedVersionRequest downloadComparedVersionRequest);

    @Operation(summary = "Double compare", description = "Performs a double comparison between three document versions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comparison completed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/double-compare/{documentType}/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> doubleCompare(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Double compare request") @RequestBody DoubleCompareRequest doubleCompareRequest);

    @Operation(summary = "Fetch reference label", description = "Retrieves the display label for document references")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Label fetched successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/fetch-reference-label/{documentRef}", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    ResponseEntity<Object> fetchReferenceLabel(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "References") @RequestParam List<String> references,
            @Parameter(description = "Current element ID") @RequestParam String currentElementId,
            @Parameter(description = "Capital") @RequestParam boolean capital);

    @Operation(summary = "Request element", description = "Retrieves a specific element from the document by ID and tag name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Element fetched successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/request-element/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> requestElement(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element ID") @RequestParam String elementId,
            @Parameter(description = "Element tag name") @RequestParam String elementTagName);

    @Operation(summary = "Change base version", description = "Changes the base version of the document for comparison purposes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Base version changed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentType}/{documentRef}/baseVersion/{documentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> changeBaseVersion(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Document ID") @PathVariable("documentId") String documentId,
            @Parameter(description = "Version label") @RequestParam String versionLabel,
            @Parameter(description = "Version comment") @RequestParam String versionComment);

    @Operation(summary = "Get stored annotations from ID", description = "Retrieves stored annotations for a document using leg file ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Annotations retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/stored-annotations/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getStoredAnnotationsFromId(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "LEG file ID") @RequestParam("legFileId") String legFileId,
            @Parameter(description = "Remove revision prefix") @RequestParam("removeRevisionPrefix") Boolean removeRevisionPrefix);

    @Operation(summary = "Get stored annotations", description = "Retrieves stored annotations for a document using leg file name")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Annotations retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{legFileName}/{proposalRef}/stored-annotations/{documentRef}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getStoredAnnotations(
            @Parameter(description = "LEG file name") @PathVariable("legFileName") String legFileName,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "Remove revision prefix") @RequestParam("removeRevisionPrefix") Boolean removeRevisionPrefix);

    @Operation(summary = "Get stored annotations from versioned reference", description = "Retrieves stored annotations for a document using versioned reference")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Annotations retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{proposalRef}/stored-annotations", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getStoredAnnotationsFromVersionedRef(
            @Parameter(description = "Proposal reference") @PathVariable("proposalRef") String proposalRef,
            @Parameter(description = "LEG file name") @RequestParam(required = false, value = "legFileName") String legFileName,
            @Parameter(description = "Versioned reference") @RequestParam("versionedReference") String versionedReference,
            @Parameter(description = "Remove revision prefix") @RequestParam("removeRevisionPrefix") Boolean removeRevisionPrefix);

    @Operation(summary = "Fetch TOC and ancestors", description = "Retrieves the table of contents and ancestor elements for specified element IDs")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "TOC and ancestors retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/{documentRef}/fetch-toc-ancestors", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> fetchTocAndAncestors(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Element IDs") @RequestParam(value = "elementIds", required = false) List<String> elementIds);

    @Operation(summary = "Archive version", description = "Archives a specific version of the document")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Version archived successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/archive-version/{documentRef}/{version}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> archiveVersion(
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Version") @PathVariable("version") String version);

    @Operation(summary = "Get document version", description = "Retrieves a specific version of the document with its content and metadata")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Document version retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping(value = "/document-version/{documentType}/{documentRef}/{version}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Object> getDocumentVersion(
            @Parameter(description = "Document type") @PathVariable("documentType") String documentType,
            @Parameter(description = "Document reference") @PathVariable("documentRef") String documentRef,
            @Parameter(description = "Version") @PathVariable("version") String version);
}
