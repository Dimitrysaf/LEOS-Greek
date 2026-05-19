package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.user.UserEntity;
import eu.europa.ec.leos.permissions.Role;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMap;
import eu.europa.ec.leos.security.SecurityContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class WorkspaceOptionsTest {

    @Mock
    private SecurityContext securityContext;
    @Mock
    private LeosPermissionAuthorityMap authorityMap;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(securityContext.hasPermission(null, LeosPermission.CAN_CREATE_TEMPLATE)).thenReturn(false);
    }

    @Test
    public void GIVEN_user_with_EXTENDED_VIEWER_role_WHEN_initRoleFilter_THEN_creatorOrganization_filter_added() {
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ALL_DOCUMENTS)).thenReturn(false);
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ORGANIZATION_DOCUMENTS)).thenReturn(true);

        UserEntity entity = new UserEntity("1", "DG_UNIT", "DG_UNIT", true, "EXTENDED_VIEWER");
        User user = new User(1L, "testuser", "Test User", List.of(entity), "test@mail.com", List.of("EXTENDED_VIEWER"));
        when(securityContext.getUser()).thenReturn(user);
        when(authorityMap.getPermissions("EXTENDED_VIEWER"))
                .thenReturn(Set.of(LeosPermission.CAN_SEE_ORGANIZATION_DOCUMENTS));

        Role collaboratorRole = mock(Role.class);
        when(collaboratorRole.isCollaborator()).thenReturn(true);
        when(collaboratorRole.getName()).thenReturn("CONTRIBUTOR");
        when(authorityMap.getAllRoles()).thenReturn(List.of(collaboratorRole));

        WorkspaceOptions options = new WorkspaceOptions(authorityMap, securityContext);
        options.initializeOptions(Collections.emptyList(), null);
        QueryFilter filter = options.getQueryFilter();

        List<QueryFilter.Filter> filters = filter.getFilters();
        assertTrue(filters.stream().anyMatch(f -> QueryFilter.FilterType.creatorOrganization.name().equals(f.key)),
                "Expected creatorOrganization filter for EXTENDED_VIEWER user");
        QueryFilter.Filter orgFilter = filters.stream()
                .filter(f -> QueryFilter.FilterType.creatorOrganization.name().equals(f.key))
                .findFirst().orElseThrow();
        assertArrayEquals(new String[]{"DG_UNIT"}, orgFilter.value);


        assertTrue(filter.getFilters().stream().anyMatch(f -> QueryFilter.FilterType.role.name().equals(f.key)),
                "Expected role filter for regular user");
        QueryFilter.Filter roleFilter = filter.getFilters().stream()
                .filter(f -> QueryFilter.FilterType.role.name().equals(f.key))
                .findFirst().orElseThrow();
        assertTrue(Arrays.asList(roleFilter.value).contains("testuser::CONTRIBUTOR::DG_UNIT"),
                "Expected user::role::entity format in role filter values");
        assertTrue(Arrays.asList(roleFilter.value).contains("testuser::CONTRIBUTOR"),
                "Expected user::role format in role filter values");
    }

    @Test
    public void GIVEN_user_with_EXTENDED_VIEWER_role_but_entity_without_role_WHEN_initRoleFilter_THEN_no_creatorOrganization_filter_added() {
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ALL_DOCUMENTS)).thenReturn(false);
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ORGANIZATION_DOCUMENTS)).thenReturn(true);

        UserEntity entity = new UserEntity("1", "DG_UNIT", true, "DG_UNIT");
        User user = new User(1L, "testuser", "Test User", List.of(entity), "test@mail.com", List.of("EXTENDED_VIEWER"));
        when(securityContext.getUser()).thenReturn(user);

        WorkspaceOptions options = new WorkspaceOptions(authorityMap, securityContext);
        options.initializeOptions(Collections.emptyList(), null);
        QueryFilter filter = options.getQueryFilter();

        assertFalse(filter.getFilters().stream().anyMatch(f -> QueryFilter.FilterType.creatorOrganization.name().equals(f.key)),
                "Expected no creatorOrganization filter when entity has no role assigned");
    }

    @Test
    public void GIVEN_user_without_EXTENDED_VIEWER_role_WHEN_initRoleFilter_THEN_role_filter_added() {
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ALL_DOCUMENTS)).thenReturn(false);
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ORGANIZATION_DOCUMENTS)).thenReturn(false);

        UserEntity entity = new UserEntity("1", "DG_UNIT", true, "DG_UNIT");
        User user = new User(1L, "testuser", "Test User", List.of(entity), "test@mail.com", List.of("USER"));
        when(securityContext.getUser()).thenReturn(user);

        Role collaboratorRole = mock(Role.class);
        when(collaboratorRole.isCollaborator()).thenReturn(true);
        when(collaboratorRole.getName()).thenReturn("CONTRIBUTOR");
        when(authorityMap.getAllRoles()).thenReturn(List.of(collaboratorRole));

        WorkspaceOptions options = new WorkspaceOptions(authorityMap, securityContext);
        options.initializeOptions(Collections.emptyList(), null);
        QueryFilter filter = options.getQueryFilter();

        assertTrue(filter.getFilters().stream().anyMatch(f -> QueryFilter.FilterType.role.name().equals(f.key)),
                "Expected role filter for regular user");
        assertFalse(filter.getFilters().stream().anyMatch(f -> QueryFilter.FilterType.creatorOrganization.name().equals(f.key)),
                "Expected no creatorOrganization filter for regular user");

        QueryFilter.Filter roleFilter = filter.getFilters().stream()
                .filter(f -> QueryFilter.FilterType.role.name().equals(f.key))
                .findFirst().orElseThrow();
        assertTrue(Arrays.asList(roleFilter.value).contains("testuser::CONTRIBUTOR::DG_UNIT"),
                "Expected user::role::entity format in role filter values");
        assertTrue(Arrays.asList(roleFilter.value).contains("testuser::CONTRIBUTOR"),
                "Expected user::role format in role filter values");
    }

    @Test
    public void GIVEN_user_with_CAN_SEE_ALL_DOCUMENTS_WHEN_initRoleFilter_THEN_neither_role_nor_org_filter_added() {
        when(securityContext.hasPermission(null, LeosPermission.CAN_SEE_ALL_DOCUMENTS)).thenReturn(true);

        WorkspaceOptions options = new WorkspaceOptions(authorityMap, securityContext);
        options.initializeOptions(Collections.emptyList(), null);
        QueryFilter filter = options.getQueryFilter();

        assertFalse(filter.getFilters().stream().anyMatch(f -> QueryFilter.FilterType.role.name().equals(f.key)),
                "Expected no role filter for admin user");
        assertFalse(filter.getFilters().stream().anyMatch(f -> QueryFilter.FilterType.creatorOrganization.name().equals(f.key)),
                "Expected no creatorOrganization filter for admin user");
    }
}
