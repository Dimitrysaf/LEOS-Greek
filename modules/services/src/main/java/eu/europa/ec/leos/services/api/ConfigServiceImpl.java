/*
 * Copyright 2024 European Union
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
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.dto.response.AppConfigResponse;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.structure.profile.ProfileService;
import eu.europa.ec.leos.vo.light.Profile;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Properties;
import java.util.Set;

@Service
public class ConfigServiceImpl implements ConfigService {

    private final Properties applicationProperties;
    private final Properties integrationProperties;
    private final SecurityContext securityContext;
    private final LeosPermissionAuthorityMapHelper authorityMapHelper;
    private final MessageHelper messageHelper;
    private final ProfileService profileService;
    private final TokenService tokenService;
    private final LanguageGroupService languageGroupService;

    @Autowired
    public ConfigServiceImpl(Properties applicationProperties, Properties integrationProperties, SecurityContext securityContext, LeosPermissionAuthorityMapHelper authorityMapHelper,
            MessageHelper messageHelper, ProfileService profileService,
            TokenService tokenService, LanguageGroupService languageGroupService) {
        this.applicationProperties = applicationProperties;
        this.integrationProperties = integrationProperties;
        this.securityContext = securityContext;
        this.authorityMapHelper = authorityMapHelper;
        this.messageHelper = messageHelper;
        this.profileService = profileService;
        this.tokenService = tokenService;
        this.languageGroupService = languageGroupService;
    }

    @Override
    public AppConfigResponse getApplicationConfig(String clientContextToken) {
        AppConfigResponse appConfigResponse = new AppConfigResponse();

        //load language map
        languageGroupService.getLanguageMap();

        String mappingUrl = applicationProperties.getProperty("leos.mapping.url");
        boolean implicitSaveEnabled = Boolean.parseBoolean(applicationProperties.getProperty("implicitSaveAndClose.enabled"));
        String spellCheckerName = integrationProperties.getProperty("leos.spell.checker");
        String spellCheckServiceUrl = integrationProperties.getProperty("leos.spell.checker.service.url");
        String spellCheckSourceUrl = integrationProperties.getProperty("leos.spell.checker.source.url");
        boolean searchAndReplaceEnabled = Boolean.parseBoolean(applicationProperties.getProperty("leos.searchAndReplace.enabled"));
        boolean sendForRevisionEnabled = Boolean.parseBoolean(applicationProperties.getProperty("leos.sendForRevision.enabled"));
        boolean coverPageSeparated = Boolean.parseBoolean(applicationProperties.getProperty("leos.coverpage.separated"));
        String supportDocumentCatalogKey = applicationProperties.getProperty("leos.supporting.documents.catalog.key");
        boolean supportDocumentEnabled = Boolean.parseBoolean(applicationProperties.getProperty("leos.supporting.documents.enable"));
        Map<String, Set<LeosPermission>> permissionsMap = authorityMapHelper.getPermissionsMap();
        String headerTitle = messageHelper.getMessage("leos.ui.header.title");
        String annotateAuthority = applicationProperties.getProperty("annotate.authority");
        String annotateClientUrl = applicationProperties.getProperty("annotate.client.url");
        String annotateHostUrl = applicationProperties.getProperty("annotate.server.url");
        String annotateJwtIssuerClientId = applicationProperties.getProperty("annotate.jwt.issuer.client.id");
        String annotatePopupDefaultStatus = applicationProperties.getProperty("annotate.popup.default.status");
        boolean collectionCloseButtonEnabled = Boolean.parseBoolean(applicationProperties.getProperty("leos.collection.close.button.enabled"));
        boolean showRevisionEnabled = Boolean.parseBoolean(applicationProperties.getProperty("leos.view.revision.milestone"));
        String contextRole = null;
        Profile profile = null;
        /*if(StringUtils.isNotBlank(clientContextToken) && tokenService.validateClientContextToken(clientContextToken)) {
            contextRole = tokenService.extractUserRoleFromToken(clientContextToken);
            profile = profileService.getProfile(tokenService.extractUserSystemNameFromToken(clientContextToken));
        }*/
        boolean leosSwitchLevelArticle = Boolean.parseBoolean(applicationProperties.getProperty("leos.switch.level.article"));
        int minSearchChar = Integer.parseInt(applicationProperties.getProperty("leos.search.on.minimum.characters"));

        appConfigResponse.setMappingUrl(mappingUrl);
        appConfigResponse.setImplicitSaveAndClose(implicitSaveEnabled);
        appConfigResponse.setSpellCheckerName(spellCheckerName);
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
        appConfigResponse.setCollectionCloseButtonEnabled(collectionCloseButtonEnabled);
        appConfigResponse.setShowRevisionEnabled(showRevisionEnabled);
        appConfigResponse.setContextRole(contextRole);
        appConfigResponse.setProfile(profile);
        appConfigResponse.setLeosSwitchLevelArticle(leosSwitchLevelArticle);
        appConfigResponse.setSearchOnMinimumCharacter(minSearchChar);

        return appConfigResponse;
    }
}
