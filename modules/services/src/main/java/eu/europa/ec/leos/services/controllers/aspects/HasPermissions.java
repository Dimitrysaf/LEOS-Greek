package eu.europa.ec.leos.services.controllers.aspects;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

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
@Target({java.lang.annotation.ElementType.METHOD})
public @interface HasPermissions {
    HasAnyPermission[] value();
}
