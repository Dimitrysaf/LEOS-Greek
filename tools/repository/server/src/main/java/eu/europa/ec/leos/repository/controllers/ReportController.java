package eu.europa.ec.leos.repository.controllers;

import eu.europa.ec.leos.repository.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
public class ReportController implements ReportApi {

    @Autowired
    private ReportService reportService;

    @Override
    public ResponseEntity<String> getProposalsWithoutMilestonesReport(String applnUrl) {
        String csv = reportService.generateProposalReport(applnUrl);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"proposals_report.csv\"")
                .body(csv);
    }
}
