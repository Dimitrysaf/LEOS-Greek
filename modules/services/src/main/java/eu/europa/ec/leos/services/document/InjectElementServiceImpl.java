package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.operation.OperationStrategy;
import eu.europa.ec.leos.services.document.operation.OperationStrategyFactory;
import eu.europa.ec.leos.services.dto.request.DocumentLinesRequest;
import eu.europa.ec.leos.services.dto.request.SectionRequest;
import eu.europa.ec.leos.services.store.WorkspaceService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.inject.Provider;

@Service
@Slf4j
public class InjectElementServiceImpl implements InjectElementService {

    private final WorkspaceService workspaceService;
    private final DocumentContentService documentContentService;
    private final OperationStrategyFactory strategyFactory;
    private final Provider<StructureContext> structureContextProvider;
    private final DocumentLanguageContext documentLanguageContext;
    private final SecurityContext securityContext;

    @Autowired
    public InjectElementServiceImpl(WorkspaceService workspaceService,
                                    DocumentContentService documentContentService,
                                    OperationStrategyFactory strategyFactory,
                                    Provider<StructureContext> structureContextProvider,
                                    DocumentLanguageContext documentLanguageContext,
                                    SecurityContext securityContext) {
        this.workspaceService = workspaceService;
        this.documentContentService = documentContentService;
        this.strategyFactory = strategyFactory;
        this.structureContextProvider = structureContextProvider;
        this.documentLanguageContext = documentLanguageContext;
        this.securityContext = securityContext;
    }

    @Override
    public void injectElements(DocumentLinesRequest request) {
        if (request.getSections() == null || request.getSections().isEmpty()) {
            throw new IllegalArgumentException("Request must contain at least one section");
        }
        try {
            XmlDocument document = workspaceService.findDocumentByRef(request.getDocumentId(), XmlDocument.class);
            if (!securityContext.hasPermission(document, LeosPermission.CAN_UPDATE)) {
                throw new SecurityException("User does not have permission to modify document: " + request.getDocumentId());
            }
            byte[] content = document.getContent().get().getSource().getBytes();
            structureContextProvider.get().useDocumentTemplate(document.getMetadata().get().getDocTemplate());
            documentLanguageContext.setDocumentLanguage(document.getMetadata().get().getLanguage());

            String docCollectionName = document.getMetadata().get().getDocumentCollectionName();
            for (SectionRequest section : request.getSections()) {
                OperationStrategy strategy = strategyFactory.getStrategy(section.getOperation());
                content = strategy.execute(content, section, docCollectionName);
            }

            String operations = request.getSections().stream()
                    .map(s -> s.getOperation().toString())
                    .distinct()
                    .collect(java.util.stream.Collectors.joining(", "));
            documentContentService.updateDocument(document, content, "Inject elements - " + operations);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error injecting elements: {}", e.getMessage(), e);
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}
