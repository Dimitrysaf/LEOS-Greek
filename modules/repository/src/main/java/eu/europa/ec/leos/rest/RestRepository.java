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
package eu.europa.ec.leos.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.vo.CollaboratorVO;
import eu.europa.ec.leos.domain.vo.WorkflowCollaboratorConfigVO;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.support.model.LeosDocument;
import eu.europa.ec.leos.rest.support.model.LeosDocumentList;
import eu.europa.ec.leos.rest.support.model.LinkedPackageList;
import eu.europa.ec.leos.rest.support.model.Package;
import eu.europa.ec.leos.rest.support.requests.CreateDocumentRequest;
import eu.europa.ec.leos.rest.support.requests.CreatePackageRequest;
import eu.europa.ec.leos.rest.support.requests.FindDocumentsRequest;
import eu.europa.ec.leos.rest.support.requests.UpdateDocumentRequest;
import eu.europa.ec.leos.vo.response.FavouritePackageResponse;
import eu.europa.ec.leos.vo.response.LeosClientResponse;
import eu.europa.ec.leos.vo.response.RecentPackageResponse;
import org.apache.cxf.common.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Repository;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.web.util.UriUtils.encodeUriVariables;

@Repository
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RestRepository extends AbstractRestClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(RestRepository.class);
    public static final String CLIENT_NAME = "clientName";

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
    @Value("${leos.rest.repository.delete.document.id}")
    private String leosRestDeleteDocumentIdURI;
    @Value("${leos.rest.repository.update.document.content}")
    private String leosRestUpdateDocumentContentURI;
    @Value("${leos.rest.repository.update.document.metadata}")
    private String leosRestUpdateDocumentMetadataURI;
    @Value("${leos.rest.repository.find.package.name.uri}")
    private String leosRestFindPackageByNameURI;
    @Value("${leos.rest.repository.find.package.id.uri}")
    private String leosRestFindPackageByIdURI;
    @Value("${leos.rest.repository.find.linked.package.id.uri}")
    private String leosRestFindLinkedPackageByPkgIdURI;
    @Value("${leos.rest.repository.find.linked.package.linked.id.uri}")
    private String leosRestFindLinkedPackageByLinkedPkgIdURI;
    @Value("${leos.rest.repository.find.package.document.id.uri}")
    private String leosRestFindPackageByDocumentIdURI;
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
    @Value("${leos.rest.repository.find.package.by.document.ref.uri}")
    private String leosRestFindPackageByDocumentRefURI;
    @Value("${leos.rest.repository.archive.document}")
    private String leosRestArchiveDocumentURI;
    @Value("${leos.rest.repository.find.document.search.versions}")
    private String leosRestSearchVersionsURI;
    @Value("${leos.rest.repository.find.recent.packages.uri}")
    private String leosRestRecentPackagesURI;
    @Value("${leos.rest.repository.find.favourite.packages.uri}")
    private String leosRestFavouritePackagesURI;

    @Value("${leos.rest.repository.get.favourite.package}")
    private String leosRestFavouritePackageDocument;

    @Value("${leos.rest.repository.toggle.favourite.package}")
    private String leosRestToggleFavouritePackageDocument;

    @Value("${leos.rest.repository.config.notifications.upload}")
    private String leosRestRepositoryConfigNotificationsUpload;

    @Value("${leos.rest.repository.config.notifications.fetch}")
    private String leosRestRepositoryConfigNotificationsFetch;

    @Value("${leos.rest.repository.config.workflow-collaborator-config}")
    private String leosRestRepositoryWorkflowCollaboratorConfig;

    @Value("${leos.rest.repository.config.leos-client}")
    private String leosRestRepositoryLeosClient;

    @Value("${leos.rest.repository.package.collaborators}")
    private String leosRestpackageCollaborators;

    @Autowired
    private RepositoryPropertiesMapper repositoryPropertiesMapper;

    private String getUrl(String resourceUrl) {
        return leosRestRepositoryURL + resourceUrl;
    }

    Package createPackage(final String name, final String userId, String originRef, String language, Boolean isTranslated) {
        LOGGER.trace("Creating package... [name={}, userId={}]", name, userId);
        String url = getUrl(leosRestCreatePackageURI);
        CreatePackageRequest createPackageRequest = new CreatePackageRequest();
        createPackageRequest.setUserId(userId);
        createPackageRequest.setLanguage(language);
        createPackageRequest.setTranslated(isTranslated);
        createPackageRequest.setOriginRef(originRef);
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

    void deleteDocumentById(final String id) {
        LOGGER.trace("Deleting document... [id={}]", id);
        String url = getUrl(leosRestDeleteDocumentIdURI);
        delete(url, id);
    }

    LeosDocument updateDocument(String ref, final String versionId, Map<String, ?> properties, String userId) {
        return this.updateDocument(ref, versionId, properties, true, userId);
    }

    LeosDocument updateDocument(String ref, final String versionId, Map<String, ?> properties, boolean latest, String userId) {
        LOGGER.trace("Updating document properties... [versionId=" + versionId + "]");

        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setUserId(userId);

        String url = getUrl(leosRestUpdateDocumentMetadataURI);
        LeosDocument resp = putEntity(url, updateDocumentRequest, LeosDocument.class, ref, versionId, latest);
        return resp;
    }

    public LeosDocument updateDocument(String versionId, Map<String, ?> properties, byte[] updatedDocumentBytes,
            VersionType versionType, String category, String comment, String userId) {
        LOGGER.trace("Updating document properties and content... [ref={}]", versionId);
        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setContent(updatedDocumentBytes);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setVersionType(versionType);
        updateDocumentRequest.setCategory(category);
        updateDocumentRequest.setComments(comment);
        updateDocumentRequest.setUserId(userId);

        String url = getUrl(leosRestUpdateDocumentContentURI);
        LeosDocument resp = putEntity(url, updateDocumentRequest, LeosDocument.class, versionId);
        return resp;
    }

    LeosDocumentList findDocumentsByPackagePath(final String packageName, final Set<LeosCategory> categories, final boolean descendants,
                                                final boolean fetchContent) {
        LOGGER.trace("Finding documents by parent path... [packageName=" + packageName + ", categories=" + categories + ", descendants=" + descendants + ']');

        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        String url = getUrl(leosRestFindDocumentsbyPackageNameURI);
        LeosDocumentList resp;
        if (StringUtils.isEmpty(packageName)) {
            resp = postEntity(url, findDocumentsRequest, LeosDocumentList.class, descendants, fetchContent);
        } else {
            resp = postEntity(url + "&name=" + encodeUriVariables(packageName)[0], findDocumentsRequest, LeosDocumentList.class, descendants,
                    fetchContent);
        }
        return resp;
    }

    LeosDocumentList findDocumentsByPackageId(final String id, final Set<LeosCategory> categories, final boolean allVersion, final boolean fetchContent) {
        LOGGER.trace("Finding documents by package Id... [pkgId=" + id + ", categories=" + categories + ", allVersion=" + allVersion + ']');

        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        String url = getUrl(leosRestFindDocumentsbyPackageIdURI);
        LeosDocumentList resp = postEntity(url, findDocumentsRequest, LeosDocumentList.class, id, fetchContent);
        return resp;
    }

    Optional<LeosDocument> findDocumentByName(final String name) {
        LOGGER.trace("Finding document by parent packageName... [name={}]", name);
        String url = getUrl(leosRestFindDocumentbyNameURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, name);
        return resp == null ? Optional.empty() : Optional.of(resp);
    }

    LeosDocument findDocumentById(final String versionId, String category, final boolean latest) {
        LOGGER.trace("Finding document by id... [versionId={}, latest={}]", versionId, latest);
        String url = leosRestRepositoryURL + leosRestFindDocumentByVersionIdURI + "?category={category}&latest={latest}";
        LeosDocument resp = getEntity(url, LeosDocument.class, versionId, category, latest);
        return resp;
    }

    LeosDocument findDocumentByRef(final String ref, String category) {
        LOGGER.trace("Finding document by ref... [ref={}]", ref);
        String url = getUrl(leosRestFindDocumentbyRefURI + "?category={category}");
        LeosDocument resp = getEntity(url, LeosDocument.class, ref, category);
        return resp;
    }

    LeosDocument findConfigByName(final String name) {
        LOGGER.trace("Finding config by name... [name={}]", name);
        String url = getUrl(leosRestFindDocumentbyRefURI + "?category={category}");
        LeosDocument resp = getEntity(url, LeosDocument.class, name, "TEMPLATE");
        return resp;
    }

    LeosDocumentList findDocumentsByStatus(LeosLegStatus status) {
        String url = getUrl(leosRestFindDocumentsByStatusURI);
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, status);
        return resp;
    }

    LeosDocumentList findAllVersions(final String ref, boolean fetchContent) {
        String url = getUrl(leosRestGetAllVersionsURI);
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, ref, fetchContent);
        return resp;
    }

    public String findPackageIdByName(String name) throws IllegalStateException {
        return findPackageByName(name).getId();
    }

    Package findPackageByName(String name) {
        String url = getUrl(leosRestFindPackageByNameURI);
        Package resp = getEntity(url, Package.class, encodeUriVariables(name)[0]);
        return resp;
    }

    LinkedPackageList findLinkedPackageByPkgId(String pkgId) {
        String url = getUrl(leosRestFindLinkedPackageByPkgIdURI);
        LinkedPackageList resp = getEntity(url, LinkedPackageList.class, encodeUriVariables(pkgId)[0]);
        return resp;
    }

    LinkedPackageList findLinkedPackageByLinkedPkgId(String linkedPkgId) {
        String url = getUrl(leosRestFindLinkedPackageByLinkedPkgIdURI);
        LinkedPackageList resp = getEntity(url, LinkedPackageList.class, encodeUriVariables(linkedPkgId)[0]);
        return resp;
    }

    Package findPackageByDocumentId(String id) {
        String url = getUrl(leosRestFindPackageByDocumentIdURI);
        Package resp = getEntity(url, Package.class, id);
        return resp;
    }

    Package findPackageByPackageId(String id) {
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
                                        int maxResults, QueryFilter workspaceFilter, boolean fetchContent) {
        LOGGER.trace("findPagedDocuments [packageName={}, startIndex={}, maxResults={}]", packageName, startIndex, maxResults);
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        String url = getUrl(leosRestFindDocumentsbyFilterURI);
        LeosDocumentList resp;
        if (StringUtils.isEmpty(packageName)) {
            resp = postEntity(url, findDocumentsRequest, LeosDocumentList.class, startIndex, maxResults, fetchContent);
        } else {
            resp = postEntity(url + "&packageName" + encodeUriVariables(packageName)[0], findDocumentsRequest, LeosDocumentList.class, startIndex, maxResults, fetchContent);
        }
        return resp;
    }

    int countDocuments(String packageName, Set<LeosCategory> categories, QueryFilter workspaceFilter) {
        LOGGER.trace("Counting documents by parent path... [packageName={}]", packageName);
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        String url = getUrl(leosRestCountDocumentsbyFilterURI);
        Integer resp;
        if (StringUtils.isEmpty(packageName)) {
            resp = postEntity(url, findDocumentsRequest, Integer.class);
        } else {
            resp = postEntity(url + "?packageName" + encodeUriVariables(packageName)[0], findDocumentsRequest, Integer.class);
        }
        return resp == null ? 0 : resp;
    }

    LeosDocumentList findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults) {
        LOGGER.trace("Finding all minors for intermediate. [docRef={}, currIntVersion={}, startIndex={}, maxResults={}]", docRef, currIntVersion, startIndex, maxResults);
        String url = getUrl(leosRestFindAllMinorsForIntermediateRefURI + "?currIntVersion={currIntVersion}&startIndex={startIndex}&maxResults={maxResults}");
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, docRef, currIntVersion, startIndex, maxResults);
        return resp;
    }

    LeosDocumentList searchVersions(String docRef, List<String> logins, String versionType) {
        LOGGER.trace("Search in all versions. [docRef={}, logins={}, versionType={}]", docRef, logins, versionType);
        String url = getUrl(leosRestSearchVersionsURI);
        return postEntity(url, logins, LeosDocumentList.class, docRef, versionType);
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

    LeosDocument archiveDocument(final String docRef, final String userId) {
        LOGGER.trace("Archive document [docRef={}, userId={}]", docRef, userId);
        String url = getUrl(leosRestArchiveDocumentURI);
        LeosDocument resp = getEntity(url, LeosDocument.class, docRef, userId);
        return resp;
    }

    LeosDocumentList findDocumentsByUserId(String userId, String role, String category) {
        LOGGER.trace("Finding Documents By UserId  [userId={}, role={}, category={}]", userId, role, category);
        String url = getUrl(leosRestFindDocumentsByUserIdURI + "?role={role}&category={category}");
        LeosDocumentList resp = getEntity(url, LeosDocumentList.class, userId, role, category);
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

    List<RecentPackageResponse> findRecentPackagesForUser(final String userId, String numberOfResults) {
        LOGGER.trace("Finding recent packages by userId... [userId =" + userId + ", numberOfResults =" + numberOfResults + ']');
        String url = getUrl(leosRestRecentPackagesURI);
        RecentPackageResponse[] respFromRepo = getEntity(url, RecentPackageResponse[].class, userId, numberOfResults);
        List<RecentPackageResponse> resp = Arrays.asList(respFromRepo);
        return resp;
    }

    List<FavouritePackageResponse> findFavouritePackagesForUser(final String userId) {
        LOGGER.trace("Finding recent packages by userId... [userId =" + userId + ']');
        String url = getUrl(leosRestFavouritePackagesURI);
        FavouritePackageResponse[] respFromRepo = getEntity(url, FavouritePackageResponse[].class, userId);
        List<FavouritePackageResponse> resp = Arrays.asList(respFromRepo);
        return resp;
    }

    FavouritePackageResponse getFavouritePackage(final String ref, final String userId) {
        LOGGER.trace("Finding favourite package... [ref =" + ref + ']');
        String url = getUrl(leosRestFavouritePackageDocument);
        return getEntity(url, FavouritePackageResponse.class, ref, userId);
    }

    FavouritePackageResponse toggleFavouritePackage(final String ref, final String userId) {
        LOGGER.trace("Toggle favourite package... [ref =" + ref + ']');
        String url = getUrl(leosRestToggleFavouritePackageDocument);
        return putEntity(url, null, FavouritePackageResponse.class, ref, userId);
    }

    Integer createOrUpdateWorkflowCollaboratorConfig(String clientName, String packageName, String aclCallbackUrl, String userCheckCallbackUrl) {
        LOGGER.trace("createOrUpdateWorkflowCollaboratorConfig ... [packageName = {}, clientId = {}]", packageName, clientName);
        String url = getUrl(leosRestRepositoryWorkflowCollaboratorConfig);
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
                .encode()
                .toUriString();
        Map<String, Object> dynamicPayload = new HashMap<>();
        dynamicPayload.put("packageName", packageName);
        dynamicPayload.put(CLIENT_NAME, clientName);
        dynamicPayload.put("aclCallbackUrl", aclCallbackUrl);
        dynamicPayload.put("userCheckCallbackUrl", userCheckCallbackUrl);

        return postEntity(urlTemplate, dynamicPayload, Integer.class, packageName, clientName);
    }

    WorkflowCollaboratorConfigVO getWorkflowCollaboratorConfig(final String packageName, final String clientName) {
        LOGGER.trace("getWorkflowCollaboratorConfig ... [packageName = {}, clientId = {}]", packageName, clientName);
        String url = getUrl(leosRestRepositoryWorkflowCollaboratorConfig);
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("packageName", "{packageName}")
                .queryParam(CLIENT_NAME, "{clientName}")
                .encode()
                .toUriString();
        return getEntity(urlTemplate, WorkflowCollaboratorConfigVO.class, packageName, clientName);
    }

    Optional<LeosClientResponse> getLeosClient(String clientName) {
        LOGGER.trace("getLeosClient ... [ clientId = {}]", clientName);
        String url = getUrl(leosRestRepositoryLeosClient);
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam(CLIENT_NAME, "{clientName}")
                .encode()
                .toUriString();
        final LeosClientResponse entity = getEntity(urlTemplate, LeosClientResponse.class, clientName);
        return Optional.ofNullable(entity);
    }

    Object configNotificationsUpload(String content) throws JsonProcessingException {
        LOGGER.trace("Upload config notifications... ");
        String url = getUrl(leosRestRepositoryConfigNotificationsUpload);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(content);
        return postEntity(url, jsonNode, Object.class);
    }

    String configNotificationsFetch() {
        LOGGER.trace("Fetch config notifications... ");
        String url = getUrl(leosRestRepositoryConfigNotificationsFetch);
        return getEntity(url, String.class);
    }

    public void deleteWorkflowCollaborator(BigInteger id) {
        LOGGER.trace("delete WorkflowCollaboratorConfig ... [id = {}]", id);
        String url = getUrl(leosRestRepositoryWorkflowCollaboratorConfig);
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
                .path("/{id}")
                .encode()
                .toUriString();
        delete(urlTemplate, id);
    }

    public List<CollaboratorVO> getPackageCollaborators(BigDecimal packageId) {
        LOGGER.trace("getPackageCollaborators ... packageId = {}", packageId);
        String url = getUrl(leosRestpackageCollaborators);
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("packageId", packageId)
                .encode()
                .toUriString();
        List<LinkedHashMap<String, Object>> response = (List<LinkedHashMap<String, Object>>) getEntity(urlTemplate, Object.class, packageId);
        List<CollaboratorVO> collaboratorVOList = new ArrayList<>();
        for (LinkedHashMap<String, Object> map : response) {
            CollaboratorVO collaborator = new CollaboratorVO();
            collaborator.setRole((String) map.get("role"));
            collaborator.setLogin((String) map.get("login"));
            collaboratorVOList.add(collaborator);
        }
        return collaboratorVOList;
    }
}
