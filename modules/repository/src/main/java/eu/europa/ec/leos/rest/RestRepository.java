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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.handlers.RestTemplateResponseErrorHandler;
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
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.annotation.PostConstruct;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.web.util.UriUtils.encodeUriVariables;

@Repository
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Profile(value = {"rest"})
public class RestRepository {

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

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private RepositoryPropertiesMapper repositoryPropertiesMapper;

    private ObjectMapper mapper = new ObjectMapper();

    private final RestRepository self;

    @Autowired
    public RestRepository(RestRepository restRepository) {
        this.self = restRepository;
    }

    @PostConstruct
    private void init() {
        restTemplate.setErrorHandler(new RestTemplateResponseErrorHandler());
    }

    Package createPackage(final String name, final String userId) {
        LOGGER.trace("Creating package... [name=" + name + "]");

        CreatePackageRequest createPackageRequest = new CreatePackageRequest();
        createPackageRequest.setUserId(userId);

        try {
            HttpEntity<CreateDocumentRequest> request = new HttpEntity(createPackageRequest);

            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestCreatePackageURI, HttpMethod.PUT, request,
                    Object.class,
                    encodeUriVariables(name)[0]);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<Package>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    void deletePackage(final String name) {
        LOGGER.trace("Deleting package... [name=" + name + "]");

        try {
            restTemplate.delete(leosRestRepositoryURL + leosRestDeletePackageURI, encodeUriVariables(name)[0]);
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument createDocumentFromContent(final String packageName, final String name, Map<String, ?> properties, final String mimeType, byte[] contentBytes,
                                           String userId) {
        LOGGER.trace("Creating document... [packageName=" + packageName + ", name=" + name + ", mimeType=" + mimeType + "]");

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

        HttpEntity<CreateDocumentRequest> request = new HttpEntity<>(createDocRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestCreateDocumentContentURI, HttpMethod.PUT, request,
                    Object.class);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument createDocumentFromSource(final String sourceId, String path, final String name, Map<String, ?> properties, String userId) {
        LOGGER.trace("Creating document from source... [sourceId=" + sourceId + "]");

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

        HttpEntity<CreateDocumentRequest> request = new HttpEntity<>(createDocRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestCreateDocumentSourceURI, HttpMethod.PUT, request,
                    Object.class);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    void deleteDocumentByRef(final String ref) {
        LOGGER.trace("Deleting document... [ref=" + ref + "]");
        try {
            restTemplate.delete(leosRestRepositoryURL + leosRestDeleteDocumentRefURI, ref);
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument updateDocument(final String ref, Map<String, ?> properties, String userId) {
        return this.updateDocument(ref, properties, true, userId);
    }

    LeosDocument updateDocument(final String ref, Map<String, ?> properties, boolean latest, String userId) {
        LOGGER.trace("Updating document properties... [ref=" + ref + "]");

        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setComments(properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) != null ?
                (String) properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) : null);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setVersionType(VersionType.MINOR);
        updateDocumentRequest.setUserId(userId);

        HttpEntity<UpdateDocumentRequest> request = new HttpEntity<>(updateDocumentRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestUpdateDocumentMetadataURI, HttpMethod.PUT, request,
                    Object.class, ref);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    public LeosDocument updateDocument(String ref, Map<String, ?> properties, byte[] updatedDocumentBytes, VersionType versionType, String comment,
                                       String userId) {
        LOGGER.trace("Updating document properties and content... [ref={}]", ref);

        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setContent(updatedDocumentBytes);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setVersionType(versionType);
        updateDocumentRequest.setComments(comment);
        updateDocumentRequest.setUserId(userId);

        HttpEntity<UpdateDocumentRequest> request = new HttpEntity<>(updateDocumentRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestUpdateDocumentContentURI, HttpMethod.PUT, request,
                    Object.class, ref);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocumentList findDocumentsByPackagePath(final String packageName, final Set<LeosCategory> categories, final boolean descendants) {
        LOGGER.trace("Finding documents by parent path... [packageName=" + packageName + ", categories=" + categories + ", descendants=" + descendants + ']');

        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestFindDocumentsbyPackageNameURI, findDocumentsRequest,
                    Object.class, encodeUriVariables(packageName)[0], descendants);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocumentList findDocumentsByPackageId(final String id, final Set<LeosCategory> categories, final boolean allVersion) {
        LOGGER.trace("Finding documents by package Id... [pkgId=" + id + ", categories=" + categories + ", allVersion=" + allVersion + ']');

        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestFindDocumentsbyPackageIdURI, findDocumentsRequest,
                    Object.class, id);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    Optional<LeosDocument> findDocumentByName(final String packageName, final String name) {
        LOGGER.trace("Finding document by parent packageName... [packageName=" + packageName + ", name=" + name + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentbyNameURI, Object.class, name);
            LeosDocument doc = mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
            return doc == null ? Optional.empty() : Optional.of(doc);
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return Optional.empty();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocument findDocumentById(final String versionId, final boolean latest) {
        LOGGER.trace("Finding document by id... [id=" + versionId + ", latest=" + latest + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentByVersionIdURI +
                            "?latest={latest}",
                    Object.class, versionId, latest);
            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocument findDocumentByRef(final String ref) {
        LOGGER.trace("Finding document by ref... [ref=" + ref + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentbyRefURI,
                    Object.class, ref);
            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocumentList findDocumentsByStatus(LeosLegStatus status) {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentsByStatusURI,
                    Object.class, status);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocumentList findAllVersions(final String id) {
        throw new NotImplementedException();
    }

    @Cacheable(value = "restRepositoryFolderCache", key = "#name")
    public String findPackageIdByName(String name) throws IllegalStateException {
        return findPackageByName(name).getId();
    }

    Package findPackageByName(String name) throws IllegalStateException {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindPackageByNameURI,
                    Object.class, encodeUriVariables(name)[0]);
            return mapper.convertValue(resp.getBody(),
                    new TypeReference<Package>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    private Package findPackageById(String id) {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindPackageByIdURI,
                    Object.class, id);
            return mapper.convertValue(resp.getBody(),
                    new TypeReference<Package>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    private String getNextVersionLabel(VersionType versionType, String oldVersion) {
        try {
            ResponseEntity<String> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindNextVersionURI,
                    String.class, versionType.name(), oldVersion);

            return resp.getBody();
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocumentList findPagedDocuments(String packageName, Set<LeosCategory> categories, int startIndex,
                                        int maxResults, QueryFilter workspaceFilter) {
        LOGGER.trace("Finding documents by parent path... [path=$path, primaryType=$primaryType, categories=$categories, descendants=$descendants]");
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestFindDocumentsbyFilterURI, findDocumentsRequest,
                    Object.class, encodeUriVariables(packageName)[0], startIndex, maxResults);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    int countDocuments(String packageName, Set<LeosCategory> categories, QueryFilter workspaceFilter) {
        LOGGER.trace("Counting documents by parent path... [categories=$categories]");
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestCountDocumentsbyFilterURI, findDocumentsRequest,
                    Object.class, encodeUriVariables(packageName)[0]);

            return (int) resp.getBody();
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocumentList findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults) {
        LOGGER.trace("Finding all minors for intermediate. [docRef={}, currIntVersion={}, startIndex={}, maxResults={}]", docRef, currIntVersion, startIndex, maxResults);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindAllMinorsForIntermediateRefURI
                            + "?currIntVersion={currIntVersion}&startIndex={startIndex}&maxResults={maxResults}",
                    Object.class, docRef, currIntVersion, startIndex, maxResults);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }


    LeosDocumentList findAllMajors(String docRef, int startIndex, int maxResults) {
        LOGGER.trace("Finding all majors. [docRef={}, startIndex={}, maxResults={}]", docRef, startIndex, maxResults);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindAllMajorsURI
                            + "?startIndex={startIndex}&maxResults={maxResults}",
                    Object.class, docRef, startIndex, maxResults);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    Integer getAllMajorsCount(String docRef) {
        LOGGER.trace("Finding count all majors [docRef={}]", docRef);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestGetAllMajorsCountURI,
                    Object.class, docRef);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<Integer>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocumentList findRecentMinorVersions(String docRef, String versionLabel, int startIndex, int maxResults) {
        LOGGER.trace("Finding all majors. [docRef={}, versionLabel={}, startIndex={}, maxResults={}]", docRef, versionLabel, startIndex, maxResults);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindRecentMinorVersionsURI
                            + "?startIndex={startIndex}&maxResults={maxResults}",
                    Object.class, docRef, startIndex, maxResults);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });

        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocumentList findDocumentsByUserId(String userId, String role) {
        LOGGER.trace("Finding Documents By UserId  [userId={}, role={}]", userId, role);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentsByUserIdURI
                            + "?role={role}",
                    Object.class, userId, role);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocumentList>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return new LeosDocumentList();
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    Integer getAllMinorsCountForIntermediate(String docRef, String currIntVersion) {
        LOGGER.trace("Get all minors Count for Intermediate [docRef={}, currIntVersion={} ]", docRef, currIntVersion);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestGetAllMinorsCountForIntermediateURI
                            + "?currIntVersion={currIntVersion}",
                    Object.class, docRef, currIntVersion);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<Integer>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    Integer getRecentMinorVersionsCount(String docRef, String versionLabel) {
        LOGGER.trace("Get all minors Count for Intermediate [docRef={}, versionLabel={} ]", docRef, versionLabel);

        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestGetRecentMinorVersionsCountURI
                            + "?versionLabel={versionLabel}",
                    Object.class, docRef, versionLabel);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<Integer>() {
                    });
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument findFirstVersion(final String ref) {
        LOGGER.trace("Finding document by ref... [ref={}]", ref);
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindFirstVersionURI,
                    Object.class, ref);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocument findDocumentByVersion(String documentRef, String versionLabel) {
        LOGGER.trace("Finding document by ref and version... [docRef={}, versionLabel={} ]", documentRef, versionLabel);
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentByVersionURI,
                    Object.class, documentRef, versionLabel);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    LeosDocument findLatestMajorVersionByRef(final String ref) {
        LOGGER.trace("Finding document by ref... [ref=" + ref + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentByLatestMajorVersionRefURI,
                    Object.class, ref);

            return mapper.convertValue(resp.getBody(),
                    new TypeReference<LeosDocument>() {
                    });
        } catch (Exception e) {
            if (e.getMessage().contains(Integer.toString(NOT_FOUND))) {
                return null;
            } else {
                throw new IllegalStateException(e.getMessage());
            }
        }
    }

    Package findPackageByDocumentRef(String documentRef) throws IllegalStateException {
        LOGGER.trace("Finding package by document ref and version... [docRef={} ]", documentRef);
        ResponseEntity<Package> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindPackageByDocumentRefURI,
                Package.class, documentRef);
        return resp.getBody();
    }
}
