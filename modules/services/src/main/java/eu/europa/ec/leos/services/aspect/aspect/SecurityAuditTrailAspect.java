package eu.europa.ec.leos.services.aspect.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.services.utils.LogMarkers.SECURITY;

@Component
@Aspect
@Slf4j
public class SecurityAuditTrailAspect {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityAuditTrailAspect.class);
    private static final String LOG_SUCCESS_FORMAT = "Completed {} ms - {}.{}({})";
    private static final String LOG_ERROR_FORMAT   = "ERROR after {} ms - {}.{}({}) - Exception: {}";

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
            LOGGER.info(SECURITY,
                    LOG_SUCCESS_FORMAT,
                    durationMs,
                    className,
                    methodName,
                    Arrays.toString(args)
            );
            return result;
        } catch (Exception ex) {
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
            LOGGER.error(SECURITY,
                    LOG_ERROR_FORMAT,
                    durationMs,
                    className,
                    methodName,
                    Arrays.toString(args),
                    ex.getMessage(),
                    ex
            );
            throw ex;
        }
    }
}
