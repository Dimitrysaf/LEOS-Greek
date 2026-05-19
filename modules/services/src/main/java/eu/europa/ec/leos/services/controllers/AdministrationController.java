package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.integration.UsersProvider;
import eu.europa.ec.leos.integration.dto.EntityDTO;
import eu.europa.ec.leos.integration.dto.UserDTO;
import eu.europa.ec.leos.integration.dto.UserEntityDTO;
import eu.europa.ec.leos.integration.dto.UserUpdateDTO;
import eu.europa.ec.leos.integration.rest.PaginationHelper;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.exception.ForbiddenException;
import eu.europa.ec.leos.services.api.exception.LeosApiException;
import eu.europa.ec.leos.services.controllers.aspects.HasAnyPermission;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/secured/administration")
@RequiredArgsConstructor
public class AdministrationController {

    private final SecurityContext securityContext;
    private final UsersProvider usersClient;

    @GetMapping("/entities")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_ENTITIES, LeosPermission.CAN_MANAGE_OWN_ENTITIES})
    public List<EntityDTO> getEntities() throws LeosApiException {
        final User user = securityContext.getUser();
        final boolean canManageAll = securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES);
        if (user.getDefaultEntity() == null && !canManageAll) {
            throw new LeosApiException("User " + user.getLogin() + " has no default entity", HttpStatus.PRECONDITION_FAILED);
        }
        return usersClient.specialEntities(canManageAll ? null : user.getDefaultEntity().getOrganizationName());
    }

    @PostMapping("/entities")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_ENTITIES, LeosPermission.CAN_MANAGE_OWN_ENTITIES})
    public EntityDTO addEntity(@RequestBody final EntityDTO requestEntity) throws LeosApiException {
        final User user = securityContext.getUser();
        final EntityDTO entity= prepareEntityDTO(user, requestEntity);
        return usersClient.createEntity(entity);
    }

    @GetMapping("/users")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_USERS})
    public Page<UserDTO> getUsers(@RequestParam(required = false) final String query,
                                  @RequestParam(required = false) final String entityId,
                                  // TODO: Replace custom pagination params with Spring Pageable
                                  @RequestParam(required = false) final Integer page,
                                  @RequestParam(required = false) final Integer size,
                                  @RequestParam(required = false) final String sort) {

        final Pageable pageable = PaginationHelper.preparePaginationObject(page, size, sort);
        return usersClient.searchSpecialUsers(query, entityId, pageable);
    }

    @PostMapping("/users")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_USERS})
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_ENTITIES, LeosPermission.CAN_MANAGE_OWN_ENTITIES})
    public UserDTO addUser(@RequestBody @Validated final UserDTO dto) throws ForbiddenException {
        final User user = securityContext.getUser();
        final Set<EntityDTO> entitiesInDto = dto.getEntities() != null
                ? new HashSet<>(dto.getEntities())
                : null;
        if (!securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_USERS_ROLES)) {
            dto.setRoles(null);
        }
        if(!securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)
            && entitiesInDto != null
            && !entitiesInDto.isEmpty()
        ) {
            final Set<EntityDTO> allowedEntities = new HashSet<>(usersClient
                    .specialEntities(user.getDefaultEntity().getOrganizationName()));
            if(!allowedEntities.containsAll(entitiesInDto)) {
                throw new ForbiddenException(
                        "User " + user.getLogin() + " tried to add a user to an entity he/she cannot manage.");
            }
        }
        return usersClient.addSpecialUser(dto);
    }

    @PatchMapping("/users")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_USERS})
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_ENTITIES, LeosPermission.CAN_MANAGE_OWN_ENTITIES})
    public UserDTO updateUser(@RequestBody @Validated final UserUpdateDTO dto) {
        final User user = securityContext.getUser();
        final Set<UserEntityDTO> addedEntities;
        if(!securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)
                && (addedEntities = dto.getAddedEntities()) != null
                && !addedEntities.isEmpty()
        ) {
            final Set<String> allowedEntities = usersClient
                    .specialEntities(user.getDefaultEntity().getOrganizationName()).stream()
                    .map(EntityDTO::getId)
                    .collect(Collectors.toSet());
            if(!allowedEntities.containsAll(addedEntities.stream().map(EntityDTO::getId).collect(Collectors.toSet()))) {
                throw new ForbiddenException(
                        "User " + user.getLogin() + " tried to add a user to an entity he/she cannot manage.");
            }
        }
        return usersClient.updateSpecialUser(dto);
    }

    @DeleteMapping("/users/{userLogin}")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_USERS})
    public ResponseEntity<Void> deleteUser(@PathVariable final String userLogin) {
        usersClient.deleteSpecialUser(userLogin);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/entities")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_ENTITIES, LeosPermission.CAN_MANAGE_OWN_ENTITIES})
    public EntityDTO updateEntity(@RequestBody @Validated final EntityDTO requestEntity) throws LeosApiException {
        final User user = securityContext.getUser();
        checkAccessToEntity(user, requestEntity);
        final EntityDTO entity = prepareEntityDTO(user, requestEntity);
        return usersClient.updateEntity(entity);
    }

    @DeleteMapping("/entities/{entityId}")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_ENTITIES, LeosPermission.CAN_MANAGE_OWN_ENTITIES})
    public ResponseEntity<Void> deleteEntity(@PathVariable final String entityId) throws ForbiddenException {
        final User user = securityContext.getUser();
        final EntityDTO entity = usersClient.getEntityDetails(entityId);
        checkAccessToEntity(user, entity);
        usersClient.deleteEntity(entity);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/users/{userLogin}")
    @HasAnyPermission({LeosPermission.CAN_MANAGE_ALL_USERS})
    public UserDTO getUserDetails(@PathVariable String userLogin) {
        return usersClient.getUserDetails(userLogin);
    }

    private EntityDTO prepareEntityDTO(final User user, final EntityDTO requestEntity) throws LeosApiException {
        final Entity userEntity = user.getDefaultEntity();
        final String name;
        if (securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)) {
            name = requestEntity.getName();
        } else {
            if (userEntity == null) {
                throw new LeosApiException("User " + user.getLogin() + " has no default entity", HttpStatus.PRECONDITION_FAILED);
            }
            name = userEntity.getOrganizationName() + '.' + requestEntity.getName();
        }
        return new EntityDTO(requestEntity.getId(), name, userEntity.getOrganizationName(), requestEntity.getSpecial());
    }

    private void checkAccessToEntity(User user, EntityDTO requestEntity) throws ForbiddenException {
        if (!securityContext.hasPermission(null, LeosPermission.CAN_MANAGE_ALL_ENTITIES)) {
            final Set<EntityDTO> allowedEntities = new HashSet<>(usersClient
                    .specialEntities(user.getDefaultEntity().getOrganizationName()));
            if (!allowedEntities.contains(requestEntity)) {
                throw new ForbiddenException("User " + user.getLogin() + " tried to update an entity he/she cannot manage.");
            }
        }
    }
}
