package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
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
    private final SecurityContext securityContext;
    private final OperationStrategyFactory strategyFactory;
    private final DocumentContentService documentContentService;
    private final DocumentContextInitializer documentContextInitializer;

    @Autowired
    public InjectElementServiceImpl(PackageService packageService,
                                    ProposalService proposalService,
                                    SecurityContext securityContext,
                                    OperationStrategyFactory strategyFactory,
                                    DocumentContentService documentContentService,
                                    DocumentContextInitializer documentContextInitializer) {
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.securityContext = securityContext;
        this.strategyFactory = strategyFactory;
        this.documentContentService = documentContentService;
        this.documentContextInitializer = documentContextInitializer;
    }

    @Override
    public void injectElements(DocumentLinesRequest request) {
        validateRequest(request);
        try {
            LeosPackage leosPackage = packageService.findPackageByDocumentRef(request.getDocumentId(), XmlDocument.class);
            XmlDocument document = resolveDocument(leosPackage, request.getDocumentId());
            Proposal proposal = resolveProposal(leosPackage);

            checkPermission(document, request.getDocumentId());
            documentContextInitializer.initializeFrom(document);

            byte[] content = applyStrategies(document, proposal, request);
            documentContentService.updateDocument(document, content, buildAuditMessage(request));
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

    private XmlDocument resolveDocument(LeosPackage leosPackage, String documentRef) {
        return packageService.findDocumentsByPackageId(leosPackage.getId(), XmlDocument.class, false, true)
                .stream()
                .filter(doc -> documentRef.equals(doc.getMetadata().get().getRef()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Document not found in package: " + documentRef));
    }

    private void checkPermission(XmlDocument document, String documentId) {
        if (!securityContext.hasPermission(document, LeosPermission.CAN_UPDATE)) {
            throw new SecurityException("User does not have permission to modify document: " + documentId);
        }
    }

    private Proposal resolveProposal(LeosPackage leosPackage) {
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposalService.populateProposalMetadataFromXml(proposal);
    }

    private byte[] applyStrategies(XmlDocument document, Proposal proposal, DocumentLinesRequest request) {
        byte[] content = document.getContent().get().getSource().getBytes();
        String docCollectionName = proposal.getMetadata().get().getDocumentCollectionName();
        for (SectionRequest section : request.getSections()) {
            OperationStrategy strategy = strategyFactory.getStrategy(section.getOperation());
            content = strategy.execute(content, section, docCollectionName, document.getCategory());
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
