package eu.europa.ec.digit.userdata.mappers;

import eu.europa.ec.digit.userdata.dto.UserDto;
import eu.europa.ec.digit.userdata.dto.UserUpdateDto;
import eu.europa.ec.digit.userdata.entities.Role;
import eu.europa.ec.digit.userdata.entities.SpecialUser;
import eu.europa.ec.digit.userdata.entities.User;
import org.mapstruct.*;

import java.util.*;

@Mapper(componentModel = "spring",
        uses = {EntityMapper.class, StringTrimMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    Map<String, String> SORT_COLUMN_MAPPING = new HashMap<>(){{
        this.put("login", "USER_LOGIN");
        this.put("lastName", "USER_LASTNAME");
        this.put("firstName", "USER_FIRSTNAME");
        this.put("email", "USER_EMAIL");
        this.put("dateCreated", "DATE_CREATED");
        this.put("USER_LOGIN", "USER_LOGIN");
        this.put("USER_LASTNAME", "USER_LASTNAME");
        this.put("USER_FIRSTNAME", "USER_FIRSTNAME");
        this.put("USER_EMAIL", "USER_EMAIL");
        this.put("DATE_CREATED", "DATE_CREATED");
    }};

    @Mapping(target = "perId", constant = "0L")
    @Mapping(target = "roleEntities", source = "roles", qualifiedByName = "mapRoles")
    @Mapping(target = "roles", ignore = true)
    SpecialUser mapToSpecial(UserDto dto, @Context Map<String, Role> contextRoles);

    @Mapping(target = "special", constant = "true")
    @Mapping(target = "jobTitle", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User mapToUser(SpecialUser entity);

    @Mapping(target = "special", constant = "true")
    UserDto mapToDto(SpecialUser entity);

    UserDto mapToDto(User entity);

    @Mapping(target = "perId", constant = "0L")
    @Mapping(target = "roleEntities", source = "roles", qualifiedByName = "mapRoles")
    @Mapping(target = "roles", ignore = true)
    SpecialUser merge(UserUpdateDto dto, @MappingTarget SpecialUser user, @Context Map<String, Role> contextRoles);

    @Named("mapRoles")
    default List<Role> mapRoles(List<String> roles, @Context Map<String, Role> rolesMap) {
        return roles != null
                ? roles.stream().filter(rolesMap::containsKey).map(rolesMap::get).toList()
                : null;
    }
}
