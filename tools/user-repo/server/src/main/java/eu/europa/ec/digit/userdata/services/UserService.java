package eu.europa.ec.digit.userdata.services;

import eu.europa.ec.digit.userdata.dto.UserEntityDto;
import eu.europa.ec.digit.userdata.entities.*;
import eu.europa.ec.digit.userdata.exception.BadRequestException;
import eu.europa.ec.digit.userdata.mappers.PageMapper;
import eu.europa.ec.digit.userdata.mappers.UserMapper;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialUserEntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialUserRepository;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    public static final String DEFAULT_SORT_COLUMN = "USER_LASTNAME";
    private final UserRepository userRepository;

    private final SpecialUserRepository specialUserRepository;
    private final SpecialEntityRepository specialEntityRepository;
    private final SpecialUserEntityRepository specialUserEntityRepository;

    private final PageMapper pageMapper;
    private final RoleService roleService;

    public User getUser(final String userId) {
        final List<User> users = userRepository.findByLogin(userId);
        if (users.isEmpty()) {
            return null;
        }
        for (User u : users) {
            if (!Boolean.TRUE.equals(u.getSpecial())) {
                return u;
            }
        }
        return users.getFirst();
    }

    public Collection<User> search(@NonNull final String searchKey, @NonNull final String organization, final Long limit) {
        return userRepository
                .findUsersByKeyAndOrganization(
                        searchKey.trim().replace(" ", "%").concat("%"),
                        organization)
                .limit(limit != null && limit > 0 ? limit : Long.MAX_VALUE).collect(Collectors.toList());
    }

    /**
     * Search users by the passed search key. The key match criteria is firstName OR lastName OR email OR login.
     * @param searchKey the search key. Could be null - then all users are returned (paginated).
     * @param pageable pagination parameters. Could be null - then default sorting is applied and page size is Integer.MAX_VALUE
     *                 The first sorting field is considered only (if any).
     *                 Both class field and column name are supported.
     * @return a {@link Page} of {@link SpecialUser} objects.
     */
    public Page<User> search(@Nullable final String searchKey, @Nullable final Pageable pageable) {
        return this.search(searchKey, null, pageable);
    }

    /**
     * Search users by the passed search key. The key match criteria is firstName OR lastName OR email OR login.
     * @param searchKey the search key. Could be null - then all users are returned (paginated).
     * @param entityId optional entity ID. If passed, then only the users with a relationship to the given entity are returned
     * @param pageable pagination parameters. Could be null - then default sorting is applied and page size is Integer.MAX_VALUE
     *                 The first sorting field is considered only (if any).
     *                 Both class field and column name are supported.
     * @return a {@link Page} of {@link SpecialUser} objects.
     */
    public Page<User> search(@Nullable final String searchKey, @Nullable final String entityId, @Nullable final Pageable pageable) {
        final Pageable mappedPageable = pageMapper.map(pageable, UserMapper.SORT_COLUMN_MAPPING, DEFAULT_SORT_COLUMN);
        final String decodedKey = StringUtils.isBlank(searchKey)
                ? null
                : URLDecoder.decode(searchKey, StandardCharsets.UTF_8).trim();
        final String term = StringUtils.isBlank(decodedKey)
                ? "%"
                : "%" + decodedKey.replaceAll("\\s+", "% %") + "%";
        final Page<User> page = StringUtils.isBlank(entityId)
                ? userRepository.findByKey(term, mappedPageable)
                : userRepository.findByKeyAndEntity(term, entityId, mappedPageable);
        page.forEach(u -> u.setEntities(
                u.getEntities().stream().filter(Entity::getSpecial).toList()
        ));
        return page;
    }

    /**
     * Adds a new special user to the repository if no existing user with the same login is found.
     *
     * @param user the special user to be added; must not be null.
     * @return the saved special user.
     * @throws BadRequestException if a user with the same login (case-insensitive) already exists,
     *                              or if the user cannot be associated to any entity.
     */
    @Transactional
    public User addSpecialUser(@NonNull final SpecialUser user) {
        if (!specialUserRepository.findByLoginIgnoreCase(user.getLogin()).isEmpty()) {
            throw new BadRequestException(
                    "Cannot create SpecialUser(%s): User with the same login (case-insensitive) already exists"
                            .formatted(user.getLogin()),
                    "page.workspace.administration.user-info.user-login-conflict");
        }
        if (user.getEntities() != null && !user.getEntities().isEmpty()) {
            user.getEntities().forEach(sue -> {
                if (!specialEntityRepository.existsById(sue.getEntity().getId())) {
                    throw new BadRequestException(
                            "Cannot create SpecialUser(%s): Cannot associate to Entity(%s): Entity does not exist."
                                    .formatted(user.getLogin(), sue.getEntity().getId()),
                            "page.workspace.administration.user-info.entity-not-found");
                }
            });
        } else {
            if (userRepository.countByLoginWithEntities(user.getLogin()) == 0) {
                throw new BadRequestException(
                        "User should have at least one associated entity.",
                        "page.workspace.administration.user-info.user-has-no-entities");
            }
        }
        specialUserRepository.saveAndFlush(user);
        return userRepository.findFirstByLoginAndSpecialIsTrue(user.getLogin());
    }

    @Transactional
    public User updateSpecialUser(@NonNull final SpecialUser user, final Set<UserEntityDto> addedEntities, final Set<String> removedEntities) {
        final SpecialUser existing = specialUserRepository.getByLogin(user.getLogin());
        if (existing == null) {
            throw new BadRequestException(
                    "Cannot update SpecialUser(%s): User does not exist.".formatted(user.getLogin()),
                    "page.workspace.administration.user-info.cannot-update");
        }
        final Set<SpecialUserEntity> userEntities = existing.getEntities().stream()
                .filter(e -> removedEntities == null || !removedEntities.contains(e.getEntity().getId()))
                .collect(Collectors.toSet());
        if (addedEntities != null && !addedEntities.isEmpty()) {
            final Map<String, Role> roles = roleService.getRoles();
            final Map<String, Role> userEntityRoleMap = addedEntities.stream()
                    .filter(e -> e.getRole() != null && roles.containsKey(e.getRole()))
                    .collect(Collectors.toMap(UserEntityDto::getId, ue -> roles.get(ue.getRole())));
            final List<SpecialEntity> entities = specialEntityRepository
                    .findByIdIn(addedEntities.stream()
                    .map(UserEntityDto::getId)
                    .toList());
            final Map<SpecialEntity, SpecialUserEntity> userEntityMap = specialUserEntityRepository
                    .findByIdIn(addedEntities.stream().map(sue
                            -> new SpecialUserEntity.UserEntityId(user.getLogin(), sue.getId())).toList()).stream()
                    .collect(Collectors.toMap(SpecialUserEntity::getEntity, e -> e));
            for (SpecialEntity entity : entities) {
                final SpecialUserEntity sue = userEntityMap.getOrDefault(entity, new SpecialUserEntity(user, entity));
                sue.setRole(userEntityRoleMap.get(entity.getId()));
                userEntities.add(sue);
            }
        }
        existing.getEntities().clear();
        existing.getEntities().addAll(userEntities);
        specialUserRepository.saveAndFlush(existing);
        return userRepository.findFirstByLoginAndSpecialIsTrue(user.getLogin());
    }

    @Transactional
    public void deleteSpecialUser(@NonNull final String login) {
        final SpecialUser existing = specialUserRepository.getByLogin(login);
        if (existing == null) {
            throw new BadRequestException(
                    "Cannot delete SpecialUser(%s): User does not exist.".formatted(login),
                    "page.workspace.administration.user-info.cannot-delete");
        }
        if (existing.getEntities() != null && !existing.getEntities().isEmpty()) {
            throw new BadRequestException(
                    "Cannot delete SpecialUser(%s): User has entities associated with her.".formatted(login),
                    "page.workspace.administration.user-info.user-has-entities");
        }
        specialUserRepository.delete(existing);
    }

    public Optional<SpecialUser> getSpecialUser(String userId) {
        return specialUserRepository.findByLogin(userId);
    }
}
