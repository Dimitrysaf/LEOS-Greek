package eu.europa.ec.digit.userdata.mappers;

import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.dto.UserEntityDto;
import eu.europa.ec.digit.userdata.entities.*;
import org.mapstruct.*;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Mapper(componentModel = "spring",
        uses = {StringTrimMapper.class, RoleMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EntityMapper {

    EntityDto toDto(SpecialEntity entity);

    EntityDto toDto(Entity entity);

    @Mapping(target = "parentId", ignore = true)
    @Mapping(target = "organizationName", source = "entityDto", qualifiedByName = "organizationName")
    SpecialEntity toSpecialEntity(EntityDto entityDto);

    UserEntityDto map(Entity entity);

    @Mapping(target = "entity", source = "dto")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    SpecialUserEntity map(UserEntityDto dto, @Context Map<String, Role> contextRoles);

    @Mapping(target = ".", source = "entity")
    UserEntityDto map(SpecialUserEntity e);

    @Named("organizationName")
    default String organizationName(final EntityDto dto) {
        final String source = dto.getOrganizationName();
        return StringUtils.hasText(source) ? source : dto.getName();
    }

    default List<UserEntityDto> mapUserEntity(final User user) {
        return user.getEntities().stream()
                .map(this::map)
                .peek(e -> e.setRole(user.getUserEntities().stream()
                        .filter(ue -> ue.getEntityId().equals(e.getId()))
                        .map(UserEntity::getRole)
                        .filter(Objects::nonNull)
                        .map(Role::getRole)
                        .findFirst().orElse(null)))
                .toList();
    }

}
