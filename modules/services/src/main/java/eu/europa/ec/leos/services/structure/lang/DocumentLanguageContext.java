package eu.europa.ec.leos.services.structure.lang;

import eu.europa.ec.leos.i18n.LanguageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Locale;

@Component
@RequestScope
public class DocumentLanguageContext {

    private String documentLanguage;
    private final LanguageHelper languageHelper;

    public DocumentLanguageContext(LanguageHelper languageHelper) {
        this.languageHelper = languageHelper;
    }

    public String getDocumentLanguage() {
        return documentLanguage;
    }

    public void setDocumentLanguage(String documentLanguage) {
        this.documentLanguage = documentLanguage;
        this.languageHelper.setProposalLanguageTag(documentLanguage.toLowerCase());
    }
}
