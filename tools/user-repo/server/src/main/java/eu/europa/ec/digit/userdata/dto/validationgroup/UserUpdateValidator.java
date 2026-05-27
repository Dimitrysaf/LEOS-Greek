package eu.europa.ec.digit.userdata.dto.validationgroup;

import eu.europa.ec.digit.userdata.dto.UserUpdateDto;
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
public class UserUpdateValidator implements ConstraintValidator<UserValidOnUpdate, UserUpdateDto> {

    private final UserService userService;
    private final UserMapper userMapper;
    private final RoleService roleService;


    @Override
    public boolean isValid(UserUpdateDto value, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        final SpecialUser specialUser = userService.getSpecialUser(value.getLogin())
                .map(user -> userMapper.merge(value, user, roleService.getRoles()))
                .orElse(null);
        if(specialUser == null) {
            return true;
        }
        Map<String, String> errors = userService.validateUserBeforeUpdate(specialUser);
        if (errors.isEmpty()) {
            return true;
        }
        for (Map.Entry<String, String> e : errors.entrySet()) {
            context.buildConstraintViolationWithTemplate(e.getValue()).addPropertyNode(e.getKey()).addConstraintViolation();
        }

        return false;
    }
}
