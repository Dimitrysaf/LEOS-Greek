package eu.europa.ec.leos.rest;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.repository.RepositoryContext;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

@Component
@Scope(WebApplicationContext.SCOPE_APPLICATION)
@Profile(value = {"rest"})
public class RestRepositoryContext implements RepositoryContext {
    @Override
    public Map<String, String> getVersionsWithoutVersionLabel() {
        return new HashMap();
    }

    @Override
    public <D extends LeosDocument> void populateVersionsWithoutVersionLabel(Class<? extends D> type, String documentRef) {
    }
}
