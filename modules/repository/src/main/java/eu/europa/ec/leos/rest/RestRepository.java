/*
 * Copyright 2018 European Commission
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
package eu.europa.ec.leos.rest;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.support.model.LeosDocument;
import eu.europa.ec.leos.rest.support.model.LeosDocumentList;
import eu.europa.ec.leos.rest.support.model.Package;
import eu.europa.ec.leos.rest.support.requests.CreateDocumentRequest;
import eu.europa.ec.leos.rest.support.requests.CreatePackageRequest;
import eu.europa.ec.leos.rest.support.requests.FindDocumentsRequest;
import eu.europa.ec.leos.rest.support.requests.UpdateDocumentRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.web.util.UriUtils.encodeUriVariables;

@Repository
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RestRepository extends AbstractRestClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(RestRepository.class);
    private static final int NOT_FOUND = 404;

    @Value("${leos.rest.repository.url}")
    private String leosRestRepositoryURL;
    @Value("${leos.rest.repository.create.package.uri}")
    private String leosRestCreatePackageURI;
    @Value("${leos.rest.repository.delete.package.uri}")
    private String leosRestDeletePackageURI;
    @Value("${leos.rest.repository.create.document.content}")
    private String leosRestCreateDocumentContentURI;
    @Value("${leos.rest.repository.create.document.source}")
    private String leosRestCreateDocumentSourceURI;
    @Value("${leos.rest.repository.delete.document.ref}")
    private String leosRestDeleteDocumentRefURI;
    @Value("${leos.rest.repository.update.document.content}")
    private String leosRestUpdateDocumentContentURI;
    @Value("${leos.rest.repository.update.document.metadata}")
    private String leosRestUpdateDocumentMetadataURI;
    @Value("${leos.rest.repository.find.package.name.uri}")
    private String leosRestFindPackageByNameURI;
    @Value("${leos.rest.repository.find.package.id.uri}")
    private String leosRestFindPackageByIdURI;
    @Value("${leos.rest.repository.find.documents.package.name.uri}")
    private String leosRestFindDocumentsbyPackageNameURI;
    @Value("${leos.rest.repository.find.documents.package.id.uri}")
    private String leosRestFindDocumentsbyPackageIdURI;
    @Value("${leos.rest.repository.find.document.name}")
    private String leosRestFindDocumentbyNameURI;
    @Value("${leos.rest.repository.find.document.version.id}")
    private String leosRestFindDocumentByVersionIdURI;
    @Value("${leos.rest.repository.find.document.status}")
    private String leosRestFindDocumentsByStatusURI;
    @Value("${leos.rest.repository.find.next.version}")
    private String leosRestFindNextVersionURI;
    @Value("${leos.rest.repository.find.by.filter}")
    private String leosRestFindDocumentsbyFilterURI;
    @Value("${leos.rest.repository.count.by.filter}")
    private String leosRestCountDocumentsbyFilterURI;
    @Value("${leos.rest.repository.find.last.version.document}")
    private String leosRestFindDocumentbyRefURI;
    @Value("${leos.rest.repository.find.document.all.versions}")
    private String leosRestGetAllVersionsURI;
    @Value("${leos.rest.repository.count.recent.minor.versions}")
    private String leosRestGetRecentMinorVersionsCountURI;
    @Value("${leos.rest.repository.find.document.first.version}")
    private String leosRestFindFirstVersionURI;
    @Value("${leos.rest.repository.find.document.by.version}")
    private String leosRestFindDocumentByVersionURI;
    @Value("${leos.rest.repository.find.documents.latest.major.version.ref}")
    private String leosRestFindDocumentByLatestMajorVersionRefURI;
    @Value("${leos.rest.repository.find.document.all.minors.intermediate}")
    private String leosRestFindAllMinorsForIntermediateRefURI;
    @Value("${leos.rest.repository.find.document.all.majors}")
    private String leosRestFindAllMajorsURI;
    @Value("${leos.rest.repository.count.all.majors}")
    private String leosRestGetAllMajorsCountURI;
    @Value("${leos.rest.repository.find.document.recent.minor}")
    private String leosRestFindRecentMinorVersionsURI;
    @Value("${leos.rest.repository.find.documents.user.id}")
    private String leosRestFindDocumentsByUserIdURI;
    @Value("${leos.rest.repository.count.all.minors.intermediate}")
    private String leosRestGetAllMinorsCountForIntermediateURI;
    @Value("${leos.rest.repository.find.package.by.document.id.uri}")
    private String leosRestFindPackageByDocumentRefURI;
    @Value("${leos.rest.repository.move.document}")
    private String leosRestMoveDocumentURI;

    @Autowired
    private RepositoryPropertiesMapper repositoryPropertiesMapper;

    private String getUrl(String resourceUrl) {
        return leosRestRepositoryURL + resourceUrl;
    }

    Package createPackage(final String name, final String userId) {
        LOGGER.trace("Creating package... [name={}, userId={}]", name, userId);
        String url = getUrl(leosRestCreatePackageURI);
        CreatePackageRequest createPackageRequest = new CreatePackageRequest();
        createPackageRequest.setUserId(userId);
        Package resp = postEntity(url, createPackageRequest, Package.class, encodeUriVariables(name)[0]);
        return resp;
    }

    void deletePackage(final String name) {
        LOGGER.trace("Deleting package... [name={}]", name);
        String url = getUrl(leosRestDeletePackageURI);
        delete(url, encodeUriVariables(name)[0]);
    }

    LeosDocument createDocumentFromContent(final String packageName, final String name, Map<String, ?> properties,
                                           final String mimeType, byte[] contentBytes, String userId) {

        LOGGER.trace("Creating document... [packageName={}, name={}, mimeType={}]", packageName, name, mimeType);
        Map<String, Object> updatedProperties = new LinkedHashMap<>();
        updatedProperties.putAll(properties);
        updatedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_TYPE), VersionType.MINOR.value());
        updatedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_LABEL), getNextVersionLabel(VersionType.MINOR, null));

        CreateDocumentRequest createDocRequest = new CreateDocumentRequest();
        createDocRequest.setContent(contentBytes);
        createDocRequest.setComments(updatedProperties.get(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_LABEL)) != null ?
                (String) updatedProperties.get(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_LABEL)) :
                null);
        createDocRequest.setMetadata(updatedProperties);
        createDocRequest.setLabelVersion(getNextVersionLabel(VersionType.MINOR, null));
        createDocRequest.setVersionType(VersionType.MINOR);
        createDocRequest.setName(name);
        createDocRequest.setPackageName(packageName);
        createDocRequest.setUserId(userId);

        String url = getUrl(leosRestCreateDocumentContentURI);
        LeosDocument resp = putEntity(url, createDocRequest, LeosDocument.class);
        return resp;
    }

    LeosDocument createDocumentFromSource(final String sourceId, String path, final String name, Map<String, ?> properties, String userId) {
        LOGGER.trace("Creating document from source... [sourceId={}]", sourceId);
        Map<String, Object> updatedProperties = new LinkedHashMap<>();
        updatedProperties.putAll(properties);
        updatedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_TYPE), VersionType.MINOR.value());
        updatedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_LABEL), getNextVersionLabel(VersionType.MINOR, null));

        CreateDocumentRequest createDocRequest = new CreateDocumentRequest();
        createDocRequest.setComments(updatedProperties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) != null ?
                (String) updatedProperties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) : null);
        createDocRequest.setMetadata(updatedProperties);
        createDocRequest.setLabelVersion(getNextVersionLabel(VersionType.MINOR, null));
        createDocRequest.setVersionType(VersionType.MINOR);
        createDocRequest.setName(name);
        createDocRequest.setPackageName(path);
        createDocRequest.setUserId(userId);
        createDocRequest.setSourceDocumentId(sourceId);

        String url = getUrl(leosRestCreateDocumentSourceURI);
        LeosDocument resp = putEntity(url, createDocRequest, LeosDocument.class);
        return resp;
    }

    void deleteDocumentByRef(final String ref) {
        LOGGER.trace("Creating document... [ref={}]", ref);
        delete(leosRestDeleteDocumentRefURI, ref);
    }

    LeosDocument updateDocument(final String ref, Map<String, ?> properties, String userId) {
        return this.updateDocument(ref, properties, true, userId);
    }

    LeosDocument updateDocument(final String ref, Map<String, ?> properties, boolean latest, String userId) {
        LOGGER.trace("Updating document properties... [ref={}]", ref);
        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setComments(properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) != null ?
                (String) properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) : null);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setVersionType(VersionType.MINOR);
        updateDocumentRequest.setUserId(userId);

        String url = getUrl(leosRestUpdateDocumentMetadataURI);
        LeosDocument resp = putEntity(url, updateDocumentRequest, LeosDocument.class, ref);
        return resp;
    }

    public LeosDocument updateDocument(String ref, Map<String, ?> properties, byte[] updatedDocumentBytes,
                                       VersionType versionType, String comment, String userId) {
        LOGGER.trace("Updating document properties and content... [ref={}]", ref);
        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setContent(updatedDocumentBytes);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setVersionType(versionType);
        updateDocumentRequest.setComments(comment);
        updateDocumentRequest.setUserId(userId);

        String url = getUrl(leosRestUpdateDocumentContentURI);
        LeosDocument resp = putEntity(url, updateDocumentRequest, LeosDocument.class, ref);
        return resp;
    }

    LeosDocumentList findDocumentsByPackagePath(final String packageName, final Set<LeosCategory> categories, final boolean descendants) {
        LOGGER.trace("Finding documents by parent path... [packageName={}, categories={}, descendants={}]", packageName, categories, descendants);
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        String url = getUrl(leosRestFindDocumentsbyPackageNameURI);
        LeosDocumentList resp = postEntity(url, findDocumentsRequest, LeosDocumentList.class, encodeUriVariables(packageName)[0], descendants);
        return resp;
    }

    LeosDocumentList findDocumentsByPackageId(final String id, final Set<LeosCategory> categories, final boolean allVersion) {
        LOGGER.trace("Finding documents by package Id... [pkgId={}, categories={}, allVersion={}]", id, categories, allVersion);
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        String url = getUrl(leosRestFindDocumentsbyPackageIdURI);
        LeosDocumentList resp = postEntity(url, findDocumentsRequest, LeosDocumentList.class, id);
        return resp;
    }

    Optional<LeosDocument> findDocumentByName(final String name) {
        LOGGER.trace("Finding document by parent packageName... [name={}]", name);
        String url = getUrl(leosRestFindDocumentbyNameURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, name);
        return resp == null ? Optional.empty() : Optional.of(resp);
    }

    LeosDocument findDocumentById(final String versionId, final boolean latest) {
        LOGGER.trace("Finding document by id... [versionId={}, latest={}]", versionId, latest);
        String url = leosRestRepositoryURL + leosRestFindDocumentByVersionIdURI + "?latest={latest}";
        LeosDocument resp = getEntity(url, LeosDocument.class, versionId, latest);
        return resp;
    }

    LeosDocument findDocumentByRef(final String ref) {
        LOGGER.trace("Finding document by ref... [ref={}]", ref);
        String url = getUrl(leosRestFindDocumentbyRefURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, ref);
        return resp;
    }

    LeosDocumentList findDocumentsByStatus(LeosLegStatus status) {
        String url = getUrl(leosRestFindDocumentsByStatusURI);
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, status);
        return resp;
    }

    public LeosDocumentList findAllVersions(final String ref) {
        String url = getUrl(leosRestGetAllVersionsURI);
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, ref);
        return resp;
    }

    @Cacheable(value = "restRepositoryFolderCache", key = "#name")
    public String findPackageIdByName(String name) {
        return findPackageByName(name).getId();
    }

    Package findPackageByName(String name) {
        String url = getUrl(leosRestFindPackageByNameURI);
        Package resp = getEntity(url, Package.class, encodeUriVariables(name)[0]);
        return resp;
    }

    private Package findPackageById(String id) {
        String url = getUrl(leosRestFindPackageByIdURI);
        Package resp = getEntity(url, Package.class, id);
        return resp;
    }

    private String getNextVersionLabel(VersionType versionType, String oldVersion) {
        String url = getUrl(leosRestFindNextVersionURI);
        String resp = getEntity(url, String.class, versionType.name(), oldVersion);
        return resp;
    }

    LeosDocumentList findPagedDocuments(String packageName, Set<LeosCategory> categories, int startIndex,
                                        int maxResults, QueryFilter workspaceFilter) {
        LOGGER.trace("findPagedDocuments [packageName={}, startIndex={}, maxResults={}]", packageName, startIndex, maxResults);
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        String url = getUrl(leosRestFindDocumentsbyFilterURI);
        LeosDocumentList resp = postEntity(url, findDocumentsRequest, LeosDocumentList.class, encodeUriVariables(packageName)[0], startIndex, maxResults);
        return resp;
    }

    int countDocuments(String packageName, Set<LeosCategory> categories, QueryFilter workspaceFilter) {
        LOGGER.trace("Counting documents by parent path... [packageName={}]", packageName);
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        String url = getUrl(leosRestCountDocumentsbyFilterURI);
        Integer resp = postEntity(url, findDocumentsRequest, Integer.class, encodeUriVariables(packageName)[0]); //TODO Ermal
        return resp == null ? 0 : resp;
    }

    LeosDocumentList findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults) {
        LOGGER.trace("Finding all minors for intermediate. [docRef={}, currIntVersion={}, startIndex={}, maxResults={}]", docRef, currIntVersion, startIndex, maxResults);
        String url = getUrl(leosRestFindAllMinorsForIntermediateRefURI + "?currIntVersion={currIntVersion}&startIndex={startIndex}&maxResults={maxResults}");
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, docRef, currIntVersion, startIndex, maxResults);
        return resp;
    }


    LeosDocumentList findAllMajors(String docRef, int startIndex, int maxResults) {
        LOGGER.trace("Finding all majors. [docRef={}, startIndex={}, maxResults={}]", docRef, startIndex, maxResults);
        String url = getUrl(leosRestFindAllMajorsURI + "?startIndex={startIndex}&maxResults={maxResults}");
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, docRef, startIndex, maxResults);
        return resp;
    }

    Integer getAllMajorsCount(String docRef) {
        LOGGER.trace("Finding count all majors [docRef={}]", docRef);
        String url = getUrl(leosRestGetAllMajorsCountURI);
        Integer resp = getEntity(url, Integer.class, docRef);
        return resp;
    }

    LeosDocumentList findRecentMinorVersions(String docRef, String versionLabel, int startIndex, int maxResults) {
        LOGGER.trace("Finding all majors. [docRef={}, versionLabel={}, startIndex={}, maxResults={}]", docRef, versionLabel, startIndex, maxResults);
        String url = getUrl(leosRestFindRecentMinorVersionsURI + "?lastMajorVersion={versionLabel}&startIndex={startIndex}&maxResults={maxResults}");
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, docRef, versionLabel, startIndex, maxResults);
        return resp;
    }

    LeosDocument moveDocument(final String docRef, final String newPackageName, final String userId) {
        LOGGER.trace("Move document in a new package. [docRef={}, newPackageName={}, userId={}]", docRef, newPackageName, userId);
        String url = getUrl(leosRestMoveDocumentURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, docRef, encodeUriVariables(newPackageName)[0], userId);
        return resp;
    }

    LeosDocumentList findDocumentsByUserId(String userId, String role) {
        LOGGER.trace("Finding Documents By UserId  [userId={}, role={}]", userId, role);
        String url = getUrl(leosRestFindDocumentsByUserIdURI + "?role={role}");
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, userId, role);
        return resp;
    }

    Integer getAllMinorsCountForIntermediate(String docRef, String currIntVersion) {
        LOGGER.trace("Get all minors Count for Intermediate [docRef={}, currIntVersion={} ]", docRef, currIntVersion);
        String url = getUrl(leosRestGetAllMinorsCountForIntermediateURI + "?currIntVersion={currIntVersion}");
        Integer resp = getEntity(url, Integer.class, docRef, currIntVersion);
        return resp;
    }

    Integer getRecentMinorVersionsCount(String docRef, String versionLabel) {
        LOGGER.trace("Get all minors Count for Intermediate [docRef={}, versionLabel={} ]", docRef, versionLabel);
        String url = getUrl(leosRestGetRecentMinorVersionsCountURI + "?versionLabel={versionLabel}");
        Integer resp = getEntity(url, Integer.class, docRef, versionLabel);
        return resp;
    }

    LeosDocument findFirstVersion(final String ref) {
        LOGGER.trace("Finding document version by ref... [ref={}]", ref);
        String url = getUrl(leosRestFindFirstVersionURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, ref);
        return resp;
    }

    LeosDocument findDocumentByVersion(String documentRef, String versionLabel) {
        LOGGER.trace("Finding document by ref and version... [docRef={}, versionLabel={} ]", documentRef, versionLabel);
        String url = getUrl(leosRestFindDocumentByVersionURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, documentRef, versionLabel);
        return resp;
    }

    LeosDocument findLatestMajorVersionByRef(final String ref) {
        LOGGER.trace("Finding lastMajorVersion document by ref... [ref={}]", ref);
        String url = getUrl(leosRestFindDocumentByLatestMajorVersionRefURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, ref);
        return resp;
    }

    Package findPackageByDocumentRef(String documentRef) throws IllegalStateException {
        LOGGER.trace("Finding package by document ref and version... [docRef={} ]", documentRef);
        String url = getUrl(leosRestFindPackageByDocumentRefURI);
        Package resp = getEntity(url, Package.class, documentRef);
        return resp;
    }
}
