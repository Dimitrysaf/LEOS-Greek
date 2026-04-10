package eu.europa.ec.digit.userdata.mappers;

import eu.europa.ec.digit.userdata.dto.EntityDto;
import eu.europa.ec.digit.userdata.entities.Entity;
import eu.europa.ec.digit.userdata.entities.SpecialEntity;
import org.mapstruct.*;
import org.springframework.util.StringUtils;

@Mapper(componentModel = "spring",
        uses = StringTrimMapper.class,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EntityMapper {

    EntityDto toDto(SpecialEntity entity);

    EntityDto toDto(Entity entity);

    @Mapping(target = "organizationName", source = ".", qualifiedByName = "organizationName")
    SpecialEntity toSpecialEntity(EntityDto entityDto);

    @Named("organizationName")
    default String organizationName(EntityDto dto) {
        final String source = dto.getOrganizationName();
        return StringUtils.hasText(source) ? source : dto.getName();
    }
}
