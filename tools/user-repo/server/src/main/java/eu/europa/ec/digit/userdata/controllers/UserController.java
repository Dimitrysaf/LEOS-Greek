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
package eu.europa.ec.digit.userdata.controllers;

import eu.europa.ec.digit.userdata.dto.UserDto;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.SpecialUser;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.exception.BadRequestException;
import eu.europa.ec.digit.userdata.mappers.UserMapper;
import eu.europa.ec.digit.userdata.repositories.EntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialUserRepository;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import eu.europa.ec.digit.userdata.request.SpecialEntityRequest;
import eu.europa.ec.digit.userdata.services.RoleService;
import eu.europa.ec.digit.userdata.services.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);
    private static final int MAX_RECORDS = 100;

    private final UserRepository userRepository;
    private final SpecialEntityRepository specialEntityRepository;
    private final SpecialUserRepository specialUserRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final RoleService roleService;

    @Transactional(readOnly = true)
    @Override
    public Collection<User> searchUsers(String searchKey, String searchContext, String searchReference) {
        return userRepository
                .findUsersByKey(searchKey.trim().replace(" ", "%").concat("%"))
                .limit(MAX_RECORDS).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public User getUser(String userId) {
        return userRepository.findByLogin(userId);
    }

    @Transactional(readOnly = true)
    @Override
    public Collection<User> getUsersForJobTitle(String jobTitle) {
        return userRepository.findByJobTitle(jobTitle).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public Boolean addSpecialEntityForUser(SpecialEntityRequest request) {
        LOG.debug("Adding special entity to LEOS_SPECIAL_ENTITY table in ud-repo ---Started");
        SpecialUser specialUser = specialUserRepository.getByLogin(request.getUserId());
        if (specialUser == null) {
            LOG.debug("Special user does not exists, adding to the special user table");
            User user = userRepository.findByLogin(request.getUserId());
            specialUser = new SpecialUser(user.getLogin(), user.getPerId(), user.getLastName(), user.getFirstName(),
                    user.getEmail());
            specialUser = specialUserRepository.save(specialUser);
            LOG.debug("Added special user to LEOS_SPECIAL_USER table in ud-repo");
        }
        if (specialUser != null) {
            LOG.debug("Searching special entity in LEOS_SPECIAL_ENTITY table");
            SpecialEntity specialEntity = specialEntityRepository.findByName(request.getEntity());
            if (specialEntity == null) {
                LOG.debug("Special entity in LEOS_SPECIAL_ENTITY table not found, adding to the table");
                Random random = new Random();
                // generate random number from 0 to 10000
                int number = random.nextInt(10000);
                specialEntity = new SpecialEntity(String.valueOf(number), request.getEntity(), null,
                        request.getEntity());
                SpecialEntity insertedEntity = specialEntityRepository.save(specialEntity);
                LOG.debug("Adding special entity to LEOS_SPECIAL_ENTITY table in ud-repo ---Finished");
                return insertedEntity != null;
            } else {
                return true;
            }
        }
        return false;
    }

    @Override
    public Page<UserDto> searchUsers(String searchKey, String entityId, Pageable pageable) {
        return userService.search(searchKey, entityId, pageable).map(userMapper::mapToDto);
    }

    @Transactional
    @Override
    public UserDto createUser(UserDto userDto) {
        final SpecialUser specialUser = userMapper.mapToSpecial(userDto, roleService.getRoles());
        final SpecialUser created = this.userService.addSpecialUser(specialUser);
        return userMapper.mapToDto(created);
    }

    @Transactional
    @Override
    public UserDto updateUser(UserDto userDto) {
        final SpecialUser specialUser = userService.getSpecialUser(userDto.getLogin())
                .map(user -> userMapper.merge(userDto, user, roleService.getRoles()))
                .orElseThrow(BadRequestException::new);
        return userMapper.mapToDto(userService.updateSpecialUser(specialUser));
    }

    @Transactional
    @Override
    public ResponseEntity<Void> deleteUser(String userLogin) {
        userService.deleteSpecialUser(userLogin);
        return ResponseEntity.noContent().build();
    }
}