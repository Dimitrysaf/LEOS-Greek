/*
 * Copyright 2023 European Commission
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMapHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.dto.response.AppConfigResponse;
import eu.europa.ec.leos.services.toc.StructureContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

@Service
public class ConfigServiceImpl implements ConfigService {

    private final Properties applicationProperties;
    private final SecurityContext securityContext;
    private final LeosPermissionAuthorityMapHelper authorityMapHelper;
    private final Provider<StructureContext> structureContextProvider;

    private final MessageHelper messageHelper;

    @Autowired
    public ConfigServiceImpl(Properties applicationProperties, SecurityContext securityContext, LeosPermissionAuthorityMapHelper authorityMapHelper,
            Provider<StructureContext> structureContextProvider, MessageHelper messageHelper) {
        this.applicationProperties = applicationProperties;
        this.securityContext = securityContext;
        this.authorityMapHelper = authorityMapHelper;
        this.structureContextProvider = structureContextProvider;
        this.messageHelper = messageHelper;
    }

    @Override
    public AppConfigResponse getApplicationConfig() {
        AppConfigResponse appConfigResponse = new AppConfigResponse();

        String mappingUrl = applicationProperties.getProperty("leos.mapping.url");
        boolean implicitSaveEnabled = Boolean.valueOf(applicationProperties.getProperty("implicitSaveAndClose.enabled"));
        boolean isSpellCheckerEnabled = Boolean.valueOf(applicationProperties.getProperty("leos.spell.checker.enabled"));
        String spellCheckServiceUrl = applicationProperties.getProperty("leos.spell.checker.service.url");
        String spellCheckSourceUrl = applicationProperties.getProperty("leos.spell.checker.source.url");
        boolean searchAndReplaceEnabled = Boolean.valueOf(applicationProperties.getProperty("leos.searchAndReplace.enabled"));
        boolean sendForRevisionEnabled = Boolean.valueOf(applicationProperties.getProperty("leos.sendForRevision.enabled"));
        boolean coverPageSeparated = Boolean.valueOf(applicationProperties.getProperty("leos.coverpage.separated"));
        String supportDocumentCatalogKey = applicationProperties.getProperty("leos.supporting.documents.catalog.key");
        boolean supportDocumentEnabled = Boolean.valueOf(applicationProperties.getProperty("leos.supporting.documents.enable"));
        Map<String, Set<LeosPermission>> permissionsMap = authorityMapHelper.getPermissionsMap();
        String headerTitle = messageHelper.getMessage("leos.ui.header.title");
        String annotateAuthority = applicationProperties.getProperty("annotate.authority");
        String annotateClientUrl = applicationProperties.getProperty("annotate.client.url");
        String annotateHostUrl = applicationProperties.getProperty("annotate.server.url");
        String annotateJwtIssuerClientId = applicationProperties.getProperty("annotate.jwt.issuer.client.id");
        String annotatePopupDefaultStatus = applicationProperties.getProperty("annotate.popup.default.status");

        appConfigResponse.setMappingUrl(mappingUrl);
        appConfigResponse.setImplicitSaveAndClose(implicitSaveEnabled);
        appConfigResponse.setSpellCheckerEnabled(isSpellCheckerEnabled);
        appConfigResponse.setSpellCheckerServiceUrl(spellCheckServiceUrl);
        appConfigResponse.setSpellCheckerSourceUrl(spellCheckSourceUrl);
        appConfigResponse.setSearchAndReplaceEnabled(searchAndReplaceEnabled);
        appConfigResponse.setSendForRevisionEnabled(sendForRevisionEnabled);
        appConfigResponse.setCoverPageSeparated(coverPageSeparated);
        appConfigResponse.setSupportDocumentCatalogKey(supportDocumentCatalogKey);
        appConfigResponse.setSupportDocumentEnabled(supportDocumentEnabled);
        appConfigResponse.setPermissionsMap(permissionsMap);
        appConfigResponse.setUser(securityContext.getUser());
        appConfigResponse.setHeaderTitle(headerTitle);
        appConfigResponse.setAnnotateAuthority(annotateAuthority);
        appConfigResponse.setAnnotateClientUrl(annotateClientUrl);
        appConfigResponse.setAnnotateHostUrl(annotateHostUrl);
        appConfigResponse.setAnnotateJwtIssuerClientId(annotateJwtIssuerClientId);
        appConfigResponse.setAnnotatePopupDefaultStatus(annotatePopupDefaultStatus);

        return appConfigResponse;
    }
}
