package eu.europa.ec.leos.services.annotate;

import eu.europa.ec.leos.security.LeosPermission;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AnnotateService {

	String getAnnotations(String docName, String proposalRef);

	String getFeedbackAnnotations(String docName, String legFileName, String proposalRef);

	String createTemporaryAnnotations(byte[] legFile, String proposalRef);

	boolean sendUserPermissions(List<LeosPermission> permissions);
}
