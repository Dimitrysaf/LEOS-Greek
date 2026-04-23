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
package eu.europa.ec.leos.integration;

import eu.europa.ec.leos.integration.dto.EntityDTO;
import eu.europa.ec.leos.integration.dto.UserDTO;
import eu.europa.ec.leos.integration.dto.UserUpdateDTO;
import eu.europa.ec.leos.integration.rest.UserJSON;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityUserProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import java.util.List;

public interface UsersProvider extends SecurityUserProvider {
    List<UserJSON> searchUsers(String searchKey);

    List<UserJSON> searchUsersInContext(String searchKey, String searchContext, String searchReference);

    User getUserByLogin(String userId);

    List<String> searchUsersByEntityIdAndKey(String entity, String searchKey);

    List<String> getAllOrganizations();

    List<UserJSON> searchUsersByJobTitle(String jobTitle);

    EntityDTO createEntity(EntityDTO entity);

    Page<UserDTO> searchSpecialUsers(@Nullable String searchKey, @Nullable String entityId, Pageable pageable);

    UserDTO addSpecialUser(UserDTO userDTO);

    UserDTO updateSpecialUser(UserUpdateDTO userDTO);

    List<EntityDTO> specialEntities(String orgName);

    ResponseEntity<Void> deleteSpecialUser(String userId);

    EntityDTO updateEntity(EntityDTO entity);

    ResponseEntity<Void> deleteEntity(String entityId);

    UserDTO getUserDetails(String userLogin);
}
