package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.model.filter.QueryFilter;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.permissions.Role;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.LeosPermissionAuthorityMap;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import eu.europa.ec.leos.services.dto.request.FilterProposalsRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static eu.europa.ec.leos.model.filter.QueryFilter.FilterType;

public class WorkspaceOptions {
    private static final Logger LOG = LoggerFactory.getLogger(WorkspaceOptions.class);
    private static final List<Integer> LEVELS_TO_DISPLAY = Arrays.asList(2, 3, 4);
    private static final Map<Integer, FilterType> levelKind = new HashMap<>();

    static {
        //from catalog
        levelKind.put(0, FilterType.Root);             //unused
        levelKind.put(1, FilterType.actType);          //ex- legal acts
        levelKind.put(2, FilterType.procedureType);    //ex- olp
        levelKind.put(3, FilterType.docType);          //ex- reg,dir,
        levelKind.put(4, FilterType.template);         //ex- SJ-023
        levelKind.put(5, FilterType.docTemplate);      //Unused but reserved

        //non catalog
        levelKind.put(6, FilterType.category);         //ex- PROPOSAL/BILL/ANEX/MEMO
        levelKind.put(7, FilterType.language);         //ex- EN/FR
        levelKind.put(8, FilterType.role);             //John::OWNER
    }

    private Map<FilterType, List> optionsData = new HashMap<>();
    private QueryFilter workspaceFilter = new QueryFilter();
    private LeosPermissionAuthorityMap authorityMap;
    private SecurityContext securityContext;

    public WorkspaceOptions(LeosPermissionAuthorityMap authorityMap,
                            SecurityContext securityContext) {
        this.authorityMap = authorityMap;
        this.securityContext = securityContext;
    }

    public WorkspaceOptions() {
    }


    void initializeOptions(List<CatalogItem> catalogItems, FilterProposalsRequest.Filter[] filters) {
        if (filters != null && filters.length > 0) {
            initFilter(filters);
        } else {
            initRoleFilter();
        }
        initSortOrder();
    }

    private void initFilter(FilterProposalsRequest.Filter[] filters) {
        Arrays.stream(filters).forEach(filter -> {
            boolean nullCheck = false;
            String id = filter.getType();

            List<String> values = new ArrayList<>(Arrays.asList(filter.getValue()));
            if(id.equalsIgnoreCase(FilterType.role.name())) {
                List<String> appRoles = authorityMap.getAllRoles().stream()
                        .filter(Role::isApplicationRole)
                        .map(role->role.getName())
                        .collect(Collectors.toList());
                boolean appRoleSelected = values.stream()
                        .anyMatch(role -> appRoles.contains(role));

                if (!appRoleSelected) {
                    User user = securityContext.getUser();
                    List<String> roleCondition = values.stream()
                            .flatMap(role -> user.getEntities().stream()
                                    .map(entity -> user.getLogin() + "::" + role + "::" + entity.getName()))
                            .collect(Collectors.toList());
                    values.forEach(role -> roleCondition.add(user.getLogin() + "::" + role));
                    workspaceFilter.addFilter(new QueryFilter.Filter(id, "IN", false, roleCondition.toArray(new String[]{})));
                }
            } else if(id.equalsIgnoreCase(FilterType.title.name())) {
                workspaceFilter.removeFilter(FilterType.title.name());
                if (!values.isEmpty()) {
                    workspaceFilter.addFilter(new QueryFilter.Filter(FilterType.title.name(),
                            "LIKE", false,
                            "%" + values.get(0) + "%"));// Not escaping %/. are taken as matching chars
                }
            } else {
                workspaceFilter.removeFilter(id);
                initRoleFilter();
                workspaceFilter.addFilter(new QueryFilter.Filter(id, "IN", nullCheck,
                        values.toArray(new String[]{})));
            }
        });
    }

    private void initRoleFilter() {
        if (!securityContext.hasPermission(null, LeosPermission.CAN_SEE_ALL_DOCUMENTS)) {
            List<Role> roles = authorityMap.getAllRoles().stream()
                    .filter(Role::isCollaborator)
                    .collect(Collectors.toList());

            User user = securityContext.getUser();
            List<String> roleCondition = roles.stream()
                    .flatMap(role -> user.getEntities().stream()
                            .map(entity -> user.getLogin() + "::" + role.getName() + "::" + entity.getName()))
                    .collect(Collectors.toList());
            roles.forEach(role -> roleCondition.add(user.getLogin() + "::" + role.getName()));
            workspaceFilter.addFilter(new QueryFilter.Filter(FilterType.role.name(), "IN", false, roleCondition.toArray(new String[]{})));
        }
    }

    QueryFilter getQueryFilter() {
        return workspaceFilter;
    }

    private void initSortOrder() {
        workspaceFilter.removeSortOrder(FilterType.lastModificationDate.name());
        workspaceFilter.addSortOrder(
                new QueryFilter.SortOrder(FilterType.lastModificationDate.name(), QueryFilter.SORT_DESCENDING));
    }

    void setTitleSortOrder(boolean sortOrder) {
        workspaceFilter.removeSortOrder(FilterType.lastModificationDate.name());
        workspaceFilter.addSortOrder(
                new QueryFilter.SortOrder(FilterType.lastModificationDate.name(),
                        sortOrder ? QueryFilter.SORT_ASCENDING : QueryFilter.SORT_DESCENDING));
    }
}
