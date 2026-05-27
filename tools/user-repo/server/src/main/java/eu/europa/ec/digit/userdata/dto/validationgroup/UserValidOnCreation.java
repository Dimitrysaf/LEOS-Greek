package eu.europa.ec.digit.userdata.dto.validationgroup;

import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = {UserCreationValidator.class})
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserValidOnCreation {
    String message() default "Invalid user";
    Class<?>[] groups() default {};
    Class<?>[] payload() default {};
}
