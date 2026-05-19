package eu.europa.ec.digit.userdata.mappers;

import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.dto.UserEntityDto;
import eu.europa.ec.digit.userdata.entities.*;
import org.mapstruct.*;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        uses = {StringTrimMapper.class, RoleMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EntityMapper {

    @Mapping(target = "special", constant = "true")
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
    @Mapping(target = "special", constant = "true")
    UserEntityDto map(SpecialUserEntity e);

    @Named("organizationName")
    default String organizationName(final EntityDto dto) {
        final String source = dto.getOrganizationName();
        return StringUtils.hasText(source) ? source : dto.getName();
    }

    default List<UserEntityDto> mapUserEntity(final User user) {
        final Map<String, UserEntity> ueMap = user.getUserEntities().stream()
                .collect(Collectors.toMap(UserEntity::getEntityId, ue -> ue));
        final Map<String, Entity> eMap = user.getEntities().stream()
                .collect(Collectors.toMap(Entity::getId, ue -> ue));
        return user.getEntities().stream()
                .map(this::map)
                .peek(e -> {
                    UserEntity ue = ueMap.get(e.getId());
                    e.setRole(ue.getRole() != null ? ue.getRole().getRole() : null);
                    e.setSpecial(eMap.get(e.getId()).getSpecial());
                })
                .toList();
    }

}
