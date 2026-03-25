package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import jakarta.inject.Provider;
import org.springframework.stereotype.Component;

@Component
public class DocumentContextInitializer {

    private final Provider<StructureContext> structureContextProvider;
    private final DocumentLanguageContext documentLanguageContext;

    public DocumentContextInitializer(Provider<StructureContext> structureContextProvider,
                                      DocumentLanguageContext documentLanguageContext) {
        this.structureContextProvider = structureContextProvider;
        this.documentLanguageContext = documentLanguageContext;
    }

    public void initializeFrom(XmlDocument document) {
        structureContextProvider.get().useDocumentTemplate(document.getMetadata().get().getDocTemplate());
        documentLanguageContext.setDocumentLanguage(document.getMetadata().get().getLanguage());
    }
}
