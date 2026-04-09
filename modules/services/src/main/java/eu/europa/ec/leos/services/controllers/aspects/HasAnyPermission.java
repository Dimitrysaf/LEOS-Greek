package eu.europa.ec.leos.services.controllers.aspects;

import eu.europa.ec.leos.security.LeosPermission;

import java.lang.annotation.*;

/**
 * Annotation for custom permission checking.
 * <p>
 * When an annotated method is invoked, the user from the SecurityContext is checked against the permissions specified.
 * </p><p>
 * For each of the supplied HasAnyPermission annotations, the user must have at least one of the specified permissions.
 * </p>
 * TODO: Could be replaced with @PostAuthorize when configured in the project.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Repeatable(HasPermissions.class)
public @interface HasAnyPermission {
    /**
     * Should match any of these permissions to pass.
     */
    LeosPermission[] value();
}
