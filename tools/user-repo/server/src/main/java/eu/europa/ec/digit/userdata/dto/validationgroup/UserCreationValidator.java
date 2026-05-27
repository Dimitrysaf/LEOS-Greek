package eu.europa.ec.digit.userdata.dto.validationgroup;

import eu.europa.ec.digit.userdata.dto.UserDto;
import eu.europa.ec.digit.userdata.entities.SpecialUser;
import eu.europa.ec.digit.userdata.mappers.UserMapper;
import eu.europa.ec.digit.userdata.services.RoleService;
import eu.europa.ec.digit.userdata.services.UserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class UserCreationValidator implements ConstraintValidator<UserValidOnCreation, UserDto> {

    private final UserService userService;
    private final UserMapper userMapper;
    private final RoleService roleService;


    @Override
    public boolean isValid(UserDto value, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        SpecialUser specialUser = userMapper.mapToSpecial(value, roleService.getRoles());
        Map<String, String> errors = userService.validateUserBeforeCreation(specialUser);
        if (errors.isEmpty()) {
            return true;
        }
        for (Map.Entry<String, String> e : errors.entrySet()) {
            context.buildConstraintViolationWithTemplate(e.getValue()).addPropertyNode(e.getKey()).addConstraintViolation();
        }

        return false;
    }
}
