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
import eu.europa.ec.leos.rest.support.model.LeosDocument;
import eu.europa.ec.leos.rest.support.model.Package;
import eu.europa.ec.leos.rest.support.requests.CreateDocumentRequest;
import eu.europa.ec.leos.rest.support.requests.CreatePackageRequest;
import eu.europa.ec.leos.rest.support.requests.FindDocumentsRequest;
import eu.europa.ec.leos.rest.support.requests.UpdateDocumentRequest;
import eu.europa.ec.leos.rest.support.response.ExceptionResponse;
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

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.web.util.UriUtils.encodeUriVariables;

@Repository
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Profile(value = {"rest"})
public class RestRepository {

    private static final Logger logger = LoggerFactory.getLogger(RestRepository.class);

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
    @Value("${leos.rest.repository.find.documents.package.name}")
    private String leosRestFindDocumentbyPackageNameURI;
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

    Package createPackage(final String name, final String userId) {
        logger.trace("Creating package... [name=" + name + "]");

        CreatePackageRequest createPackageRequest = new CreatePackageRequest();
        createPackageRequest.setUserId(userId);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestCreatePackageURI, createPackageRequest, Object.class,
                    encodeUriVariables(name));

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (Package) resp.getBody();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    void deletePackage(final String name) {
        logger.trace("Deleting package... [name=" + name + "]");

        try {
            restTemplate.delete(leosRestRepositoryURL + leosRestDeletePackageURI, encodeUriVariables(name));
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument createDocumentFromContent(final String packageName, final String name, Map<String, ?> properties, final String mimeType, byte[] contentBytes,
                                       String userId) {
        logger.trace("Creating document... [packageName=" + packageName + ", name=" + name + ", mimeType=" + mimeType + "]");

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

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (LeosDocument) resp.getBody();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument createDocumentFromSource(final String sourceId, String path, final String name, Map<String, ?> properties, String userId) {
        logger.trace("Creating document from source... [sourceId=" + sourceId + "]");

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

        HttpEntity<CreateDocumentRequest> request = new HttpEntity<>(createDocRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestCreateDocumentSourceURI, HttpMethod.PUT, request,
                    Object.class);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (LeosDocument) resp.getBody();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    void deleteDocumentByRef(final String ref) {
        logger.trace("Deleting document... [ref=" + ref + "]");
        try {
            restTemplate.delete(leosRestRepositoryURL + leosRestDeleteDocumentRefURI, ref);
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument updateDocument(final String id, Map<String, ?> properties, String userId) {
        return this.updateDocument(id, properties, true, userId);
    }

    LeosDocument updateDocument(final String ref, Map<String, ?> properties, boolean latest, String userId) {
        logger.trace("Updating document properties... [ref=" + ref + "]");

        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setComments(properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) != null ?
                (String) properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) : null);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setLabelVersion(getNextVersionLabel(VersionType.MINOR, null));
        updateDocumentRequest.setVersionType(VersionType.MINOR);
        updateDocumentRequest.setUserId(userId);

        HttpEntity<UpdateDocumentRequest> request = new HttpEntity<>(updateDocumentRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestUpdateDocumentMetadataURI, HttpMethod.PUT, request,
                    Object.class);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (LeosDocument) resp.getBody();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    public LeosDocument updateDocument(String ref, Map<String, ?> properties, byte[] updatedDocumentBytes, VersionType versionType, String comment,
                                       String userId) {
        logger.trace("Updating document properties and content... [ref={}]", ref);

        UpdateDocumentRequest updateDocumentRequest = new UpdateDocumentRequest();
        updateDocumentRequest.setComments(properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) != null ?
                (String) properties.get(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS)) : null);
        updateDocumentRequest.setContent(updatedDocumentBytes);
        updateDocumentRequest.setMetadata(properties);
        updateDocumentRequest.setLabelVersion(getNextVersionLabel(versionType, null));
        updateDocumentRequest.setVersionType(versionType);
        updateDocumentRequest.setUserId(userId);

        HttpEntity<UpdateDocumentRequest> request = new HttpEntity<>(updateDocumentRequest);

        try {
            ResponseEntity<Object> resp = restTemplate.exchange(leosRestRepositoryURL + leosRestUpdateDocumentContentURI, HttpMethod.PUT, request,
                    Object.class);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (LeosDocument) resp.getBody();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    List<LeosDocument> findDocumentsByPackagePath(final String packageName, final Set<LeosCategory> categories, final boolean descendants) {
        logger.trace("Finding documents by parent path... [packageName=" + packageName + ", categories=" + categories + ", descendants=" + descendants + ']');

        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestFindDocumentsbyPackageNameURI, findDocumentsRequest,
                    Object.class, encodeUriVariables(packageName), descendants);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return mapper.convertValue(resp.getBody(),
                        new TypeReference<List<LeosDocument>>() { });
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    List<LeosDocument> findDocumentsByPackageId(final String id, final Set<LeosCategory> categories, final boolean allVersion) {
        logger.trace("Finding documents by package Id... [pkgId=" + id + ", categories=" + categories + ", allVersion=" + allVersion + ']');

        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestFindDocumentsbyPackageIdURI, findDocumentsRequest,
                    Object.class, id);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return mapper.convertValue(resp.getBody(),
                        new TypeReference<List<LeosDocument>>() { });
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    Optional<LeosDocument> findDocumentByName(final String packageName, final String name) {
        logger.trace("Finding document by parent packageName... [packageName=" + packageName + ", name=" + name + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentbyPackageNameURI, Object.class, name);

            if (resp.getStatusCode().is2xxSuccessful()) {
                List<LeosDocument> docs = mapper.convertValue(resp.getBody(),
                        new TypeReference<List<LeosDocument>>() { });
                return docs.isEmpty() ? Optional.empty() : Optional.of(docs.get(0));
            } else if (resp.getStatusCode().value() == 404) {
                return Optional.empty();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument findDocumentById(final String versionId, final boolean latest) {
        logger.trace("Finding document by id... [id=" + versionId + ", latest=" + latest + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentByVersionIdURI +
                            "?latest={latest}",
                    Object.class ,versionId, latest);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (LeosDocument) resp.getBody();
            } else if (resp.getStatusCode().value() == 404) {
                return null;
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    LeosDocument findDocumentByRef(final String ref) {
        logger.trace("Finding document by ref... [ref=" + ref + ']');
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentbyRefURI ,
                    Object.class, ref);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (LeosDocument) resp.getBody();
            } else if (resp.getStatusCode().value() == 404) {
                return null;
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    List<LeosDocument> findDocumentsByStatus(LeosLegStatus status) {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindDocumentsByStatusURI,
                    Object.class, status);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return mapper.convertValue(resp.getBody(),
                        new TypeReference<List<LeosDocument>>() { });
            } else if (resp.getStatusCode().value() == 404) {
                return Arrays.asList();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    List<LeosDocument> findAllVersions(final String id) {
        throw new NotImplementedException();
    }

    @Cacheable(value = "restRepositoryFolderCache", key = "#name")
    public String findPackageIdByName(String name) throws IllegalStateException {
        return findPackageByName(name).getId();
    }

    Package findPackageByName(String name) throws IllegalStateException {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindPackageByNameURI,
                    Object.class, name);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (Package) resp.getBody();
            } else if (resp.getStatusCode().value() == 404) {
                return null;
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    private Package findPackageById(String id) {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindPackageByIdURI,
                    Object.class, id);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (Package) resp.getBody();
            } else if (resp.getStatusCode().value() == 404) {
                return null;
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    private String getNextVersionLabel(VersionType versionType, String oldVersion) {
        try {
            ResponseEntity<Object> resp = restTemplate.getForEntity(leosRestRepositoryURL + leosRestFindNextVersionURI,
                    Object.class, versionType.value(), oldVersion);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (String) resp.getBody();
            } else if (resp.getStatusCode().value() == 404) {
                return null;
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    List<LeosDocument> findPagedDocuments(Set<LeosCategory> categories, int startIndex,
                                                     int maxResults, QueryFilter workspaceFilter) {
        logger.trace("Finding documents by parent path... [path=$path, primaryType=$primaryType, categories=$categories, descendants=$descendants]");
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestFindDocumentsbyFilterURI, findDocumentsRequest,
                    Object.class, startIndex, maxResults);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return mapper.convertValue(resp.getBody(),
                        new TypeReference<List<LeosDocument>>() { });
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    int countDocuments(Set<LeosCategory> categories, QueryFilter workspaceFilter) {
        logger.trace("Counting documents by parent path... [categories=$categories]");
        Set<String> cats = categories.stream().map(c -> c.name()).collect(Collectors.toSet());
        FindDocumentsRequest findDocumentsRequest = new FindDocumentsRequest();
        findDocumentsRequest.setCategories(cats);
        findDocumentsRequest.setQueryFilter(workspaceFilter);

        try {
            ResponseEntity<Object> resp = restTemplate.postForEntity(leosRestRepositoryURL + leosRestCountDocumentsbyFilterURI, findDocumentsRequest,
                    Object.class);

            if (resp.getStatusCode().is2xxSuccessful()) {
                return (int) resp.getBody();
            } else {
                ExceptionResponse respException = (ExceptionResponse) resp.getBody();
                throw new IllegalStateException(respException.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }
}
