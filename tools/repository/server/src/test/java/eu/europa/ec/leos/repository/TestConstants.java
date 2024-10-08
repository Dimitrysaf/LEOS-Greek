package eu.europa.ec.leos.repository;

import eu.europa.ec.leos.repository.controllers.requests.WorkflowCollaboratorConfigRequest;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TestConstants {
    public final String ISCCLIENTID = "iscClientId";
    public final String DECISIONCLIENTID = "DECISIONClientId";
    public final String PACKAGE_LEOS = "package_leos";
    public final String SAMPLE_ACL_CALLBACK_URL = "https://intragate.ec.europa.eu/consultation?dossier=abc";
    public final String SAMPLE_ACL_CALLBACK_URL2 = "https://intragate.ec.europa.eu/consultation?dossier=abc2";
    public final String SAMPLE_USER_CHECK_CALLBACK_URL = SAMPLE_ACL_CALLBACK_URL+"&userId=${userId}";

    public WorkflowCollaboratorConfigRequest getMockWorkflowCollaboratoRequestrConfig(){
        return WorkflowCollaboratorConfigRequest.builder()
                        .clientName(ISCCLIENTID)
                        .packageName(PACKAGE_LEOS)
                        .aclCallbackUrl(SAMPLE_ACL_CALLBACK_URL)
                        .userCheckCallbackUrl(SAMPLE_USER_CHECK_CALLBACK_URL)
                        .build()
        ;
    }

}
