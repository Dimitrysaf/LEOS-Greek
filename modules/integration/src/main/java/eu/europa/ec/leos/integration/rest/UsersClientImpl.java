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
package eu.europa.ec.leos.integration.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import eu.europa.ec.leos.domain.repository.metadata.LeosJobTitle;
import eu.europa.ec.leos.integration.UsersProvider;
import eu.europa.ec.leos.integration.dto.EntityDTO;
import eu.europa.ec.leos.integration.dto.UserDTO;
import eu.europa.ec.leos.integration.dto.UserUpdateDTO;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.*;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;

@Component
class UsersClientImpl implements UsersProvider {
    private static final String SEARCH_KEY_MUST_NOT_BE_NULL = "Search Key must not be null!";
    private static final String QUERY_PARAM_SEARCH_KEY = "searchKey";
    private static final String QUERY_PARAM_ENTITY_ID = "entityId";
    private static final String QUERY_PARAM_ORG_NAME = "orgName";
    private static final String QUERY_PARAM_USER_LOGIN = "userLogin";
    private static final Logger LOG = LoggerFactory.getLogger(UsersClientImpl.class);


    @Value("#{integrationProperties['leos.user.repository.url']}")
    private String repositoryUrl;

    @Value("#{integrationProperties['leos.user.repository.findbylogin.uri']}")
    private String findByLoginUri;

    @Value("#{integrationProperties['leos.user.repository.searchbykey.uri']}")
    private String searchByKeyUri;

    @Value("#{integrationProperties['leos.user.repository.searchbyentitykey.uri']}")
    private String findByEntityKeyUri;

    @Value("#{integrationProperties['leos.user.repository.searchbyJobTitle.uri']}")
    private String findByJobTitleUri;

    @Value("#{integrationProperties['leos.user.repository.entities.create_update.uri']}")
    private String createEntityUri;

    @Value("#{integrationProperties['leos.user.repository.users.search.uri']}")
    private String searchSpecialUsersUri;

    @Value("#{integrationProperties['leos.user.repository.users.create_update.uri']}")
    private String createUpdateUserUri;

    @Value("#{integrationProperties['leos.user.repository.users.get_delete.uri']}")
    private String getDeleteUserUri;

    @Value("#{integrationProperties['leos.user.repository.entities.special.uri']}")
    private String specialEntitiesUri;

    @Value("#{integrationProperties['leos.user.repository.entities.get_delete.uri']}")
    private String getDeleteEntityUri;

    @Autowired
    private RestOperations restTemplate;
    
    @Override
    public List<UserJSON> searchUsers(String searchKey)
    {
        Validate.notNull(searchKey, SEARCH_KEY_MUST_NOT_BE_NULL);

        final String uri = repositoryUrl +  searchByKeyUri;
        Map<String, String> params = new HashMap<>();
        params.put(QUERY_PARAM_SEARCH_KEY, searchKey);

        List<UserJSON> results = null;
        try {
            ResponseEntity<List<UserJSON>> entity = restTemplate.exchange(uri, HttpMethod.GET, null, new ParameterizedTypeReference<List<UserJSON>>() {}, params);
            results = entity.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to search for user. Failed calling:" + uri, e);
        }
        return results;
    }

    @Override
    public List<UserJSON> searchUsersInContext(String searchKey, String searchContext, String searchReference) {
        Validate.notNull(searchKey, SEARCH_KEY_MUST_NOT_BE_NULL);

        final String uri = repositoryUrl +  "/users";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(uri)
                .queryParam(QUERY_PARAM_SEARCH_KEY, searchKey)
                .queryParam("searchContext", searchContext.replace(" ",""))
                .queryParam("searchReference", searchReference);

        List<UserJSON> results;
        try {
            ResponseEntity<List<UserJSON>> entity = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, null, new ParameterizedTypeReference<List<UserJSON>>() {});
            results = entity.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to search for user. Failed calling: " + uri, e);
        }
        return results;
    }

    @Override
    @Cacheable(value = "users")
    public UserJSON getUserByLogin(String userId) {
        final String uri = repositoryUrl + findByLoginUri;
        Validate.notNull(userId, "User ID must not be null!");
        Map<String, String> params = new HashMap<>();
        params.put("userId", userId);
        UserJSON result = null;
        try {
            LOG.debug("Searching for user: {}", userId);
            result = restTemplate.getForObject(uri, UserJSON.class, params);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to look at user with login Failed calling: " + uri, e);
        }
        return result;
    }

    @Override
    public List<String> searchUsersByEntityIdAndKey(String entity, String searchKey)
    {
        final String uri = repositoryUrl + findByEntityKeyUri;

        Validate.notNull(entity, "Entity must not be null!");
        Validate.notNull(searchKey, SEARCH_KEY_MUST_NOT_BE_NULL);

        Map<String, String> params = new HashMap<>();
        params.put("entity", entity);
        params.put(QUERY_PARAM_SEARCH_KEY, searchKey);

        List<String> results = null;
        try {
            results = restTemplate.exchange(uri, HttpMethod.GET, null, new ParameterizedTypeReference<List<String>>() {}).getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to search for users in an entity. Failed calling: " + uri, e);
        }

        return results;
    }

    @Override
    public List<String> getAllOrganizations() {
        final String uri = repositoryUrl + "/entities";

        List<String> results;
        try {
            results = restTemplate.exchange(uri, HttpMethod.GET, null, new ParameterizedTypeReference<List<String>>() {}).getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to get organizations. Failed calling: " + uri, e);
        }

        return results;
    }

    @Override
    public List<UserJSON> searchUsersByJobTitle(String jobTitle) {
        Validate.notNull(jobTitle, "Job title must not be null");
        final String uri = repositoryUrl + findByJobTitleUri;
        Map<String, String> params = new HashMap<>();
        LeosJobTitle leosJobTitle = LeosJobTitle.caseInsensitiveValueOf(jobTitle);
        if (leosJobTitle == null) { return new ArrayList<UserJSON>(); }
        params.put("jobTitle", leosJobTitle.getTitle());

        try {
            ResponseEntity<List<UserJSON>> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<UserJSON>>() {},
                    params
            );
            return response.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to search for user. Failed calling: " + uri, e);
        }
    }

    @Override
    public EntityDTO createEntity(EntityDTO entity) {
        final String uri = repositoryUrl + createEntityUri;
        try {
            return restTemplate.postForObject(uri, entity, EntityDTO.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to create entity with name " + entity.getName() + ". Failed calling: " + uri, e);
        }
    }

    @Override
    public Page<UserDTO> searchSpecialUsers(String searchKey, String entityId, Pageable pageable) {
        final String uri = repositoryUrl + searchSpecialUsersUri;
        final Map<String, Object> params = new HashMap<>();
        params.put(QUERY_PARAM_SEARCH_KEY, searchKey);
        params.put(QUERY_PARAM_ENTITY_ID, entityId);
        PaginationHelper.preparePagingParams(pageable, params);
        final UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri).uriVariables(params);

        try {
            // Use ParameterizedTypeReference with our RestPageImpl until spring-data integration is configured
            ResponseEntity<RestPageImpl<UserDTO>> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            return response.getBody();
        } catch (RestClientException e) {
                throw new RuntimeException("Unable to get users", e);
        }
    }

    @Override
    public UserDTO addSpecialUser(final UserDTO userDTO) {
        final String uri = repositoryUrl + createUpdateUserUri;
        try {
            return restTemplate.postForObject(uri, userDTO, UserDTO.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to create user with login " + userDTO.getLogin() + ". Failed calling: " + uri, e);
        }
    }

    @Override
    @CacheEvict(value = "users", key = "#userDTO.login")
    public UserDTO updateSpecialUser(final UserUpdateDTO userDTO) {
        final String uri = repositoryUrl + createUpdateUserUri;
        try {
            return restTemplate.patchForObject(uri, userDTO, UserDTO.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to update user with login " + userDTO.getLogin() + ". Failed calling: " + uri, e);
        }
    }

    @Override
    public List<EntityDTO> specialEntities(String orgName) {
        final String uri = repositoryUrl + specialEntitiesUri;
        final Map<String, Object> params = Collections.singletonMap(QUERY_PARAM_ORG_NAME, orgName);
        final UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri).uriVariables(params);
        try {
            return restTemplate.exchange(builder.toUriString(), HttpMethod.GET, null,
                    new ParameterizedTypeReference<List<EntityDTO>>() {}).getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to get special entities. Failed calling: " + uri, e);
        }
    }

    @Override
    @CacheEvict(value = "users", key = "#userLogin")
    public ResponseEntity<Void> deleteSpecialUser(final String userLogin) {
        final String uri = repositoryUrl + getDeleteUserUri;
        final Map<String, Object> params = Collections.singletonMap(QUERY_PARAM_USER_LOGIN, userLogin);
        final UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri).uriVariables(params);
        try {
            return restTemplate.exchange(builder.toUriString(), HttpMethod.DELETE, null, Void.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to delete user with login " + userLogin + ". Failed calling: " + uri, e);
        }
    }

    @Override
    public EntityDTO updateEntity(final EntityDTO entityDto) {
        final String uri = repositoryUrl + createEntityUri;
        try {
            return restTemplate.patchForObject(uri, entityDto, EntityDTO.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to update entity " + entityDto.getId() + ". Failed calling: " + uri, e);
        }
    }

    @Override
    public ResponseEntity<Void> deleteEntity(String entityId) {
        final String uri = repositoryUrl + getDeleteEntityUri;
        final Map<String, Object> params = Collections.singletonMap(QUERY_PARAM_ENTITY_ID, entityId);
        final UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri).uriVariables(params);
        try {
            return restTemplate.exchange(builder.toUriString(), HttpMethod.DELETE, null, Void.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to delete entity " + entityId + ". Failed calling: " + uri, e);
        }
    }

    @Override
    public UserDTO getUserDetails(String userLogin) {
        final String uri = repositoryUrl + getDeleteUserUri;
        final Map<String, Object> params = Collections.singletonMap(QUERY_PARAM_USER_LOGIN, userLogin);
        final UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(uri).uriVariables(params);
        try {
            return restTemplate.getForObject(builder.toUriString(), UserDTO.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Unable to fetch user details for login " + userLogin + ". Failed calling: " + uri, e);
        }
    }
}
