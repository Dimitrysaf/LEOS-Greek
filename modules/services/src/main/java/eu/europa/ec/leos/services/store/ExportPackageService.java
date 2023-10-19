package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;

import java.util.List;

public interface ExportPackageService {

    ExportDocument findExportDocumentById(String id);

    ExportDocument findExportDocumentById(String id, boolean latest);

    ExportDocument createExportDocument(String proposalId, List<String> comments, byte[] content);

    ExportDocument updateExportDocument(String id, byte[] content);

    ExportDocument updateExportDocument(String ref, String id, LeosExportStatus status);

    ExportDocument updateExportDocument(String ref, String id, List<String> comments);

    void deleteExportDocument(String id);
}
