package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.operation.OperationStrategy;
import eu.europa.ec.leos.services.document.operation.OperationStrategyFactory;
import eu.europa.ec.leos.services.dto.request.DocumentLinesRequest;
import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.store.PackageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Slf4j
public class InjectElementServiceImpl implements InjectElementService {

    private final PackageService packageService;
    private final ProposalService proposalService;
    private final BillService billService;
    private final SecurityContext securityContext;
    private final OperationStrategyFactory strategyFactory;
    private final DocumentContentService documentContentService;
    private final DocumentContextInitializer documentContextInitializer;

    @Autowired
    public InjectElementServiceImpl(PackageService packageService,
                                    ProposalService proposalService,
                                    BillService billService,
                                    SecurityContext securityContext,
                                    OperationStrategyFactory strategyFactory,
                                    DocumentContentService documentContentService,
                                    DocumentContextInitializer documentContextInitializer) {
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.billService = billService;
        this.securityContext = securityContext;
        this.strategyFactory = strategyFactory;
        this.documentContentService = documentContentService;
        this.documentContextInitializer = documentContextInitializer;
    }

    @Override
    public void injectElements(DocumentLinesRequest request) {
        validateRequest(request);
        try {
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(request.getDocumentId(), Proposal.class);
            Proposal proposal = resolveProposal(leosPackage);
            Bill bill = resolveBill(leosPackage);

            checkPermission(bill, request.getDocumentId());
            documentContextInitializer.initializeFrom(bill);

            byte[] content = applyStrategies(bill, proposal, request);
            documentContentService.updateDocument(bill, content, buildAuditMessage(request));
        } catch (IllegalArgumentException | SecurityException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error injecting elements: {}", e.getMessage(), e);
            throw new InjectElementException(e.getMessage(), e);
        }
    }

    private void validateRequest(DocumentLinesRequest request) {
        if (request.getSections() == null || request.getSections().isEmpty()) {
            throw new IllegalArgumentException("Request must contain at least one section");
        }
    }

    private Proposal resolveProposal(LeosPackage leosPackage) {
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposalService.populateProposalMetadataFromXml(proposal);
    }

    private Bill resolveBill(LeosPackage leosPackage) {
        return billService.findBillByPackagePath(leosPackage.getPath());
    }

    private void checkPermission(Bill bill, String documentId) {
        if (!securityContext.hasPermission(bill, LeosPermission.CAN_UPDATE)) {
            throw new SecurityException("User does not have permission to modify document: " + documentId);
        }
    }

    private byte[] applyStrategies(Bill bill, Proposal proposal, DocumentLinesRequest request) {
        byte[] content = bill.getContent().get().getSource().getBytes();
        String docCollectionName = proposal.getMetadata().get().getDocumentCollectionName();
        for (SectionRequest section : request.getSections()) {
            OperationStrategy strategy = strategyFactory.getStrategy(section.getOperation());
            content = strategy.execute(content, section, docCollectionName);
        }
        return content;
    }

    private String buildAuditMessage(DocumentLinesRequest request) {
        String operations = request.getSections().stream()
                .map(s -> s.getOperation().toString())
                .distinct()
                .collect(Collectors.joining(", "));
        return "Inject elements - " + operations;
    }
}
