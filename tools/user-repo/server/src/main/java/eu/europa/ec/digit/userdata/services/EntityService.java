package eu.europa.ec.digit.userdata.services;

import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.exception.BadRequestException;
import eu.europa.ec.digit.userdata.repositories.EntityRepository;
import eu.europa.ec.digit.userdata.repositories.SpecialEntityRepository;
import eu.europa.ec.digit.userdata.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntityService {
    private final EntityRepository entityRepository;
    private final SpecialEntityRepository specialEntityRepository;
    private final UserRepository userRepository;

    @Transactional
    public SpecialEntity createEntity(final SpecialEntity entity) {
        if (entity.getId() != null) {
            throw new BadRequestException("Cannot create entity with existing ID");
        }
        final String name = entity.getName();
        if (!specialEntityRepository.findByNameIgnoreCase(name).isEmpty()) {
            throw new BadRequestException(
                    "An entity with the same name already exists",
                    "page.workspace.administration.entity-info.entity-name-conflict");
        }
        return specialEntityRepository.save(entity);
    }

    public Collection<Entity> getEntitiesForUser(final User user) {
        return entityRepository
                .findAllFullPathEntities(user.getEntities().stream()
                        .map(Entity::getId).collect(Collectors.toList()))
                .collect(Collectors.toList());
    }

    public Collection<String> getAllOrganizations() {
        return entityRepository.findAllOrganizations()
                .collect(Collectors.toList());
    }

    /**
     * Returns all the special entities.
     * @return collection of SpecialEntity
     */
    public Collection<SpecialEntity> getAllSpecial() {
        return specialEntityRepository.findAll();
    }

    /**
     * Returns all the special entities for the given organization.
     * @param orgName the organization name;
     * @return collection of SpecialEntity for the given orgName
     */
    public Collection<SpecialEntity> getSpecialForOrganization(@Nullable final String orgName) {
        return specialEntityRepository.findAllByOrganizationName(orgName);
    }

    /**
     * Get an Entity (LEOS_ENTITY) record matching the following criteria:
     * <ol>
     *     <li>entity.organizationName = entity.name = name</li>
     *     <li>parentId = null</li>
     * </ol>
     * @param name the organization name
     * @return Optional of Entity
     * @see EntityRepository#findFirstByNameAndOrganizationNameAndParentIdIsNull(String, String)
     */
    public Optional<Entity> getOrganization(final String name) {
        return entityRepository.findFirstByNameAndOrganizationNameAndParentIdIsNull(name, name);
    }

    /**
     * Update the name for the special entity with the given ID. All other attributes are ignored.
     * @param dto the special entity
     * @return the saved special entity
     * @throws BadRequestException if there is no special entity with the given id,
     *                              or the updated name conflicts with an existing entity.
     */
    @Transactional
    public SpecialEntity updateEntityName(final EntityDto dto) {
        final SpecialEntity current = specialEntityRepository.findById(dto.getId()).orElseThrow(() ->
                new BadRequestException(
                        "SpecialEntity with the given ID does not exist.",
                        "page.workspace.administration.entity-info.special-entity-not-found"));
        final String name = dto.getName().trim();
        if (!entityRepository.findByNameIgnoreCase(name).isEmpty()) {
            throw new BadRequestException(
                    "Cannot update SpecialEntity(%s): Entity with the same name (case-insensitive) already exists".formatted(dto.getId()),
                    "page.workspace.administration.entity-info.entity-name-conflict");
        }
        current.setName(name);
        return specialEntityRepository.save(current);
    }

    /**
     * Delete the special entity with the given id.
     * Note that for all the child entities, the parentId will be replaced with the parent of the deleted entity.
     * @param id entity id
     * @throws BadRequestException if the entity has users associated with it, or if there is no special entity with the given id
     */
    @Transactional
    public void deleteEntity(final String id) {
        final SpecialEntity entity = getSpecial(id);
        if (hasUsers(id)) {
            throw new BadRequestException(
                    "Cannot delete SpecialEntity(%s): Entity has users associated with it.",
                    "page.workspace.administration.entity-info.entity-has-users");
        }
        specialEntityRepository.replaceParents(id, entity.getParentId());
        specialEntityRepository.deleteById(id);
    }

    /**
     * Count the users associated with the given entity apart from the fake entity user.
     * @param entityId the entity ID
     * @return true if there are users associated with the given entity; false otherwise
     */
    public boolean hasUsers(final String entityId) {
        return userRepository.countByEntitiesIdAndPerIdNotAndEmailNot(entityId, -1L, "entity@mail.com") > 0;
    }

    public SpecialEntity getSpecial(String id) {
        return specialEntityRepository.findById(id).orElseThrow(() ->
                new BadRequestException(
                        "SpecialEntity with the given ID does not exist.",
                        "page.workspace.administration.entity-info.special-entity-not-found"));
    }
}
