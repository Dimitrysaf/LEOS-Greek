package eu.europa.ec.digit.userdata.mappers;

import eu.europa.ec.digit.userdata.entities.Role;
import org.mapstruct.Context;
import org.mapstruct.Mapper;

import java.util.Map;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    default Role map(String role, @Context Map<String, Role> rolesMap) {
        return rolesMap.get(role);
    }

    default String map(Role roleEntity) {
        return roleEntity != null ? roleEntity.getRole() : null;
    }
}
