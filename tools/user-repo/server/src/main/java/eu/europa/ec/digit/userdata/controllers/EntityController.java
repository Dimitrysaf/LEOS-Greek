package eu.europa.ec.digit.userdata.controllers;

import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import eu.europa.ec.digit.userdata.services.EntityService;
import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.mappers.EntityMapper;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.User;
import eu.europa.ec.digit.userdata.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
public class EntityController implements EntityApi {

    private static final int MAX_RECORDS = 100;

    private final EntityService entityService;
    private final UserService userService;
    private final EntityMapper entityMapper;

    @Override
    @Transactional(readOnly = true)
    public Collection<String> getAllOrganizations() {
        return entityService.getAllOrganizations();
    }

    @Override
    @Transactional(readOnly = true)
    public Collection<User> searchUsersByOrganizationAndKey(final String organization, final String searchKey) {
        return userService.search(searchKey, organization, (long) MAX_RECORDS);
    }

    @Override
    @Transactional(readOnly = true)
    public Collection<Entity> getAllFullPathEntitiesForUser(final String userId) {
        User user = userService.getUser(userId);
        return entityService.getEntitiesForUser(user);
    }

    @Override
    @Transactional
    public EntityDto createEntity(final EntityDto dto) {
        final SpecialEntity entity = entityMapper.toSpecialEntity(dto);
        SpecialEntity savedEntity = entityService.createEntity(entity);
        return entityMapper.toDto(savedEntity);
    }

    @Override
    public Collection<EntityDto> special(final String orgName) {
        final Stream<EntityDto> all;
        if (StringUtils.isBlank(orgName)) {
            all = entityService.getAllSpecial().stream().map(entityMapper::toDto);
        } else {
            all = Stream.concat(
                    entityService.getOrganization(orgName).map(entityMapper::toDto).stream(),
                    entityService.getSpecialForOrganization(orgName).stream().map(entityMapper::toDto));
        }
        return all.collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public EntityDto updateEntity(final EntityDto dto) {
        final SpecialEntity savedEntity = entityService.updateEntityName(dto);
        return entityMapper.toDto(savedEntity);
    }

    @Override
    @Transactional
    public void deleteEntity(final String id) {
        entityService.deleteEntity(id);
    }

    @Override
    public EntityDto getEntity(final String entityId) {
        final SpecialEntity entity = entityService.getSpecial(entityId);
        return entityMapper.toDto(entity);
    }
}
