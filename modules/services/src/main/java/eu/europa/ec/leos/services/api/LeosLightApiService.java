package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.dto.request.ExportDocumentOptions;
import eu.europa.ec.leos.services.exception.InvalidInputException;
import io.atlassian.fugue.Pair;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public interface LeosLightApiService {

    Pair<String, String> importDocument(String inputFileName, byte[] docContent, String locale, String callbackAddress) throws InvalidInputException;

    Pair<Boolean, File> exportDocument(String docRef, String callbackAddress, ExportDocumentOptions options);

    Pair<Object, Object> importProposal(MultipartFile file, String originProposalRef, String languageCode) throws IOException;
}
