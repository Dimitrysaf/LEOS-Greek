package eu.europa.ec.digit.userdata.mappers;

import eu.europa.ec.digit.userdata.dto.UserAuthDto;
import eu.europa.ec.digit.userdata.dto.UserDto;
import eu.europa.ec.digit.userdata.dto.UserUpdateDto;
import eu.europa.ec.digit.userdata.entities.*;
import org.mapstruct.*;

import java.util.*;

@Mapper(componentModel = "spring",
        uses = {EntityMapper.class, StringTrimMapper.class, RoleMapper.class},
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
    @Mapping(target = "roleEntities", source = "roles")
    @Mapping(target = "roles", ignore = true)
    SpecialUser mapToSpecial(UserDto dto, @Context Map<String, Role> contextRoles);

    @Mapping(target = "special", constant = "true")
    UserDto mapToDto(SpecialUser entity, @Context Map<String, Role> contextRoles);

    @Mapping(target = "entities", source = "user")
    UserDto mapToDto(User user, @Context Map<String, Role> contextRoles);

    @Mapping(target = "perId", constant = "0L")
    @Mapping(target = "roleEntities", source = "roles")
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "entities", ignore = true) // To be handled separately
    @Mapping(target = "dateCreated", ignore = true) // Automatically set on insert
    SpecialUser merge(UserUpdateDto dto, @MappingTarget SpecialUser user, @Context Map<String, Role> contextRoles);

    @Mapping(target = "entities", source = "user")
    UserAuthDto mapToAuthDto(User user);

    @AfterMapping
    default void fixSpecialUserEntities(final UserDto dto, @MappingTarget  final SpecialUser user) {
        if (user.getEntities() == null) return;
        user.getEntities().forEach(e -> {
            e.setId(new SpecialUserEntity.UserEntityId(dto.getLogin(), e.getEntity().getId()));
            e.setUser(user);
        });
    }

}
