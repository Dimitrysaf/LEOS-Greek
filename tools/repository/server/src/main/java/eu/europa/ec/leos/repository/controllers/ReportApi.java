package eu.europa.ec.leos.repository.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Report", description = "Report management API")
@Validated
@RequestMapping("/report")
public interface ReportApi {

    @Operation(summary = "Generate CSV report for proposals without milestones")
    @GetMapping(value = "/proposals", produces = "text/csv")
    ResponseEntity<String> getProposalsWithoutMilestonesReport(@RequestParam("applnUrl") String applnUrl);
}
