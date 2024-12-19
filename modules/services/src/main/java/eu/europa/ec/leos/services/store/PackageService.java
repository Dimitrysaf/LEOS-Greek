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
package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.vo.CollaboratorVO;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;
import java.util.Map;

public interface PackageService {

    String NOT_AVAILABLE = "Not available";

    LeosPackage createPackage();

    void deletePackage(LeosPackage leosPackage);

    LeosPackage findPackageByDocumentId(String documentId);

    LeosPackage findPackageByPackageId(String packageId);

    List<LinkedPackage> findLinkedPackagesByPackageId(String pkgId);

    LinkedPackage findLinkedPackageByLinkedPkgId(String linkedPkgId);

    <T extends LeosDocument> LeosPackage findPackageByDocumentRef(String documentRef, Class<? extends T> type);

    FavouritePackageResponse getFavouritePackage(String ref, String userId);

    <T extends LeosDocument> List<T> findDocumentsByPackagePath(String path, Class<T> filterType, Boolean fetchContent);
    
    <T extends LeosDocument> T findDocumentByPackagePathAndName(String path, String name, Class<T> filterType);

    <T extends LeosDocument> List<T> findDocumentsByPackageId(String id, Class<T> filterType, Boolean allVersions, Boolean fetchContent);
    
    <T extends LeosDocument> List<T> findDocumentsByUserId(String userId, Class<T> filterType, String leosAuthority);

    Map<String, List<TableOfContentItemVO>> getTableOfContent(String documentId, TocMode mode);

    List<LeosMetadata> getDocumentsMetadata(String documentId);

    void useLanguage(String language);

    void useTranslated(Boolean isTranslated);

    void useOriginRef(String originRef);

    List<CollaboratorVO> getPackageCollaborators(String packageId);
}
