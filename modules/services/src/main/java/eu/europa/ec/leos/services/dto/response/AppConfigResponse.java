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
package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.model.user.User;

public class AppConfigResponse {

    private String mappingUrl;
    private boolean implicitSaveAndClose;
    private boolean isSpellCheckerEnabled;
    private String spellCheckerServiceUrl;
    private String spellCheckerSourceUrl;
    private boolean searchAndReplaceEnabled;
    private boolean sendForRevisionEnabled;
    private boolean coverPageSeparated;
    private String supportDocumentCatalogKey;
    private boolean supportDocumentEnabled;
    private String[] permissions;
    private User user;
    private String headerTitle;
    private String headerPath;
    private String annotateAuthority;
    private String annotateClientUrl;
    private String annotateHostUrl;
    private String annotateJwtIssuerClientId;
    private String annotatePopupDefaultStatus;

    public AppConfigResponse() {
    }

    //**** Getter & Setters ****//

    public String getMappingUrl() {
        return mappingUrl;
    }

    public void setMappingUrl(String mappingUrl) {
        this.mappingUrl = mappingUrl;
    }

    public boolean isImplicitSaveAndClose() {
        return implicitSaveAndClose;
    }

    public void setImplicitSaveAndClose(boolean implicitSaveAndClose) {
        this.implicitSaveAndClose = implicitSaveAndClose;
    }

    public boolean isSpellCheckerEnabled() {
        return isSpellCheckerEnabled;
    }

    public void setSpellCheckerEnabled(boolean spellCheckerEnabled) {
        isSpellCheckerEnabled = spellCheckerEnabled;
    }

    public String getSpellCheckerServiceUrl() {
        return spellCheckerServiceUrl;
    }

    public void setSpellCheckerServiceUrl(String spellCheckerServiceUrl) {
        this.spellCheckerServiceUrl = spellCheckerServiceUrl;
    }

    public String getSpellCheckerSourceUrl() {
        return spellCheckerSourceUrl;
    }

    public void setSpellCheckerSourceUrl(String spellCheckerSourceUrl) {
        this.spellCheckerSourceUrl = spellCheckerSourceUrl;
    }

    public boolean isSearchAndReplaceEnabled() {
        return searchAndReplaceEnabled;
    }

    public void setSearchAndReplaceEnabled(boolean searchAndReplaceEnabled) {
        this.searchAndReplaceEnabled = searchAndReplaceEnabled;
    }

    public boolean isSendForRevisionEnabled() {
        return sendForRevisionEnabled;
    }

    public void setSendForRevisionEnabled(boolean sendForRevisionEnabled) {
        this.sendForRevisionEnabled = sendForRevisionEnabled;
    }

    public boolean isCoverPageSeparated() {
        return coverPageSeparated;
    }

    public void setCoverPageSeparated(boolean coverPageSeparated) {
        this.coverPageSeparated = coverPageSeparated;
    }

    public String getSupportDocumentCatalogKey() {
        return supportDocumentCatalogKey;
    }

    public void setSupportDocumentCatalogKey(String supportDocumentCatalogKey) {
        this.supportDocumentCatalogKey = supportDocumentCatalogKey;
    }

    public boolean isSupportDocumentEnabled() {
        return supportDocumentEnabled;
    }

    public void setSupportDocumentEnabled(boolean supportDocumentEnabled) {
        this.supportDocumentEnabled = supportDocumentEnabled;
    }

    public String[] getPermissions() {
        return permissions;
    }

    public void setPermissions(String[] permissions) {
        this.permissions = permissions;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHeaderTitle() {
        return headerTitle;
    }

    public void setHeaderTitle(String headerTitle) {
        this.headerTitle = headerTitle;
    }

    public String getHeaderPath() {
        return headerPath;
    }

    public void setHeaderPath(String headerPath) {
        this.headerPath = headerPath;
    }

    public String getAnnotateAuthority() {
        return annotateAuthority;
    }

    public void setAnnotateAuthority(String annotateAuthority) {
        this.annotateAuthority = annotateAuthority;
    }

    public String getAnnotateClientUrl() {
        return annotateClientUrl;
    }

    public void setAnnotateClientUrl(String annotateClientUrl) {
        this.annotateClientUrl = annotateClientUrl;
    }

    public String getAnnotateHostUrl() {
        return annotateHostUrl;
    }

    public void setAnnotateHostUrl(String annotateHostUrl) {
        this.annotateHostUrl = annotateHostUrl;
    }

    public String getAnnotateJwtIssuerClientId() {
        return annotateJwtIssuerClientId;
    }

    public void setAnnotateJwtIssuerClientId(String annotateJwtIssuerClientId) {
        this.annotateJwtIssuerClientId = annotateJwtIssuerClientId;
    }

    public String getAnnotatePopupDefaultStatus() {
        return annotatePopupDefaultStatus;
    }

    public void setAnnotatePopupDefaultStatus(String annotatePopupDefaultStatus) {
        this.annotatePopupDefaultStatus = annotatePopupDefaultStatus;
    }
}
