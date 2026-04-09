package eu.europa.ec.leos.services.controllers.aspects;

import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.exception.ForbiddenException;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private SecurityContext securityContext;

    @Before("@annotation(annotation)")
    public void checkPermission(HasAnyPermission annotation) throws ForbiddenException {
        boolean hasAnyPermission = Arrays.stream(annotation.value())
                .anyMatch(permission -> securityContext.hasPermission(null, permission));

        if (!hasAnyPermission) {
            throw new ForbiddenException("User does not have required permissions");
        }
    }

    @Before("@annotation(annotation)")
    public void checkPermission(HasPermissions annotation) throws ForbiddenException {
        for (HasAnyPermission hasPermission : annotation.value()) {
            checkPermission(hasPermission);
        }
    }
}
