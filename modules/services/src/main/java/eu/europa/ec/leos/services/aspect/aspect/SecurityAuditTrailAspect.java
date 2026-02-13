package eu.europa.ec.leos.services.aspect.aspect;

import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.audit.service.AuditService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Component
@Aspect
@Slf4j
public class SecurityAuditTrailAspect {

    private static final String LOG_SUCCESS_FORMAT = "Completed %d ms - %s.%s(%s) for user %s";
    private static final String LOG_ERROR_FORMAT   = "ERROR after %d ms - %s.%s(%s) - Exception: %s, failed for user %s";

    @Autowired
    private SecurityContext securityContext;
    
    @Autowired(required = false)
    private AuditService auditService;

    @Pointcut("execution(* eu.europa.ec.leos.services.collection.CollaboratorServiceImpl.addCollaborator(..)) || " +
            "execution(* eu.europa.ec.leos.services.collection.CollaboratorServiceImpl.removeCollaborator(..)) ||" +
    "execution(* eu.europa.ec.leos.services.collection.CollaboratorServiceImpl.editCollaborator(..))")
    public void collaboratorMethods() {
    }

    @Pointcut("execution(* eu.europa.ec.leos.services.api.AnnexApiServiceImpl.changeAnnexStructureType(..)) || " +
            "execution(* eu.europa.ec.leos.services.api.AnnexApiServiceImpl.renumberAnnex(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.AnnexApiServiceImpl.renumberAnnex(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.createProposal(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.uploadProposal(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.validateLegFile(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.deleteCollection(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.updateExportDocument(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.exportProposal(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.createProposalAnnex(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.deleteAnnex(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.updateAnnexPosition(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.createMilestone(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.downloadMilestonePDF(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ApiServiceImpl.downloadMilestonePDFFromVersion(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.BillApiServiceImpl.importElements(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ContributionApiServiceImpl.createCloneProposal(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ContributionApiServiceImpl.updateClonedProposalRevisionStatus(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.DocumentApiServiceImpl.downloadVersion(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.DocumentApiServiceProposalImpl.doDownloadVersion(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.DocumentApiServiceProposalImpl.downloadXMLComparisonFiles(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.DocumentApiServiceProposalImpl.exportComparedVersionAsPDF(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ProposalApiServiceImpl.downloadProposal(..)) ||" +
            "execution(* eu.europa.ec.leos.services.api.ProposalApiServiceImpl.validateProposal(..)) ||" +
            "execution(* eu.europa.ec.leos.services.collection.CreateCollectionServiceImpl.updateOriginalProposalAfterRevisionDone(..)) ||" +
            "execution(* eu.europa.ec.leos.services.export.ProposalExportServiceImpl.exportToToolboxCoDe(..))")
    public void documentApiMethods() {}

    @Pointcut("collaboratorMethods() || documentApiMethods()")
    public void methodsToLog() {}

    @Around("methodsToLog()")
    public Object logExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        return logAround(joinPoint);  // centralized logic
    }

    private Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className  = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        Object[] args     = joinPoint.getArgs();

        long start = System.nanoTime();
        try {
            Object result = joinPoint.proceed();
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
            String message = String.format(LOG_SUCCESS_FORMAT, durationMs, className, methodName, Arrays.toString(args), securityContext.getUser().getLogin());
            if (auditService != null) {
                auditService.logSecurityEvent(message, "INFO", className, methodName, securityContext.getUser().getLogin());
            }
            return result;
        } catch (Exception ex) {
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
            String message = String.format(LOG_ERROR_FORMAT, durationMs, className, methodName, Arrays.toString(args), ex.getMessage(), securityContext.getUser().getLogin());
            if (auditService != null) {
                auditService.logSecurityEvent(message, "ERROR", className, methodName, securityContext.getUser().getLogin(), ex);
            }
            throw ex;
        }
    }
}
