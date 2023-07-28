package eu.europa.ec.leos.repository.controllers.requests;

import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class QueryFilter {

    public static final String SORT_DESCENDING = "DESC";
    public static final String SORT_ASCENDING = "ASC";

    public QueryFilter() {

    }

    private final List<Filter> filters = new ArrayList<>();
    private final List<SortOrder> sortOrders = new ArrayList<>();

    public List<Filter> getFilters() {
        return Collections.unmodifiableList(filters);
    }

    public void addFilter(Filter filter) {
        filters.add(filter);
    }

    public boolean removeFilter(String filterKey) {
        return filters.removeIf(filter -> Objects.equals(filter.key, filterKey));
    }

    public void removeAllFilters() {
        filters.clear();
    }

    public List<SortOrder> getSortOrders() {
        return Collections.unmodifiableList(sortOrders);
    }

    public void addSortOrder(SortOrder sortOrder) {
        sortOrders.add(sortOrder);
    }

    public boolean removeSortOrder(String key) {
        return sortOrders.removeIf(sortOrder -> Objects.equals(sortOrder.key, key));
    }

    public enum FilterType {
        actType("actType"),
        procedureType("procedureType"),
        docType("docType"),
        ref("ref"),
        template("template"),
        docTemplate("docTemplate"),

        category("category"),
        language("language"),
        role("collaborators", true),
        title("title"),
        versionLabel("versionLabel"),
        versionType("versionType"),
        containedDocuments("containedDocuments", true),

        creationDate("createdOn", Date.class),
        lastModificationDate("updatedOn", Date.class);

        private String columnName;
        private Boolean complex = false;
        private Class type = String.class;

        FilterType(String columnName) {
            this.columnName = columnName;
        }

        FilterType(String columnName, Class type) {
            this.columnName = columnName;
            this.type = type;
        }

        FilterType(String columnName, Boolean complex) {
            this.columnName = columnName;
            this.complex = complex;
        }

        public static Boolean isComplex(String uiName) {
            for (FilterType column : values()) {
                if (column.name().equals(uiName)) {
                    return column.complex;
                }
            }
            throw new IllegalArgumentException("No Column Name found for the UI Name : " + uiName);
        }

        public static String getColumnName(String uiName) {
            for (FilterType column : values()) {
                if (column.name().equals(uiName)) {
                    return column.columnName;
                }
            }
            throw new IllegalArgumentException("No Column Name found for the UI Name : " + uiName);
        }
    }

    public static class Filter {
        public String key;
        public String[] value;
        public String operator;
        public boolean nullCheck;

        public Filter() {
            value = new String[0];
        }

        public Filter(String key, String operator, boolean nullCheck, String... value) {
            this.key = key;
            this.value = value;
            this.operator = operator;
            this.nullCheck = nullCheck;
        }

        public String getKey() {
            return key;
        }

        public String[] getValue() {
            return value;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public void setValue(String[] value) {
            this.value = value;
        }

        public String getOperator() {
            return operator;
        }

        public void setOperator(String operator) {
            this.operator = operator;
        }

        public boolean isNullCheck() {
            return nullCheck;
        }

        public void setNullCheck(boolean nullCheck) {
            this.nullCheck = nullCheck;
        }
    }

    public static class SortOrder {
        public String key;
        public String direction;

        public SortOrder() {
        }

        public SortOrder(String key, String direction) {
            this.key = key;
            this.direction = direction;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    public static String getWhereClauseFromQueryFilter(QueryFilter queryFilter, Class objectClass) {
        StringBuilder whereClauseFilter = new StringBuilder();
        for (QueryFilter.Filter filter : queryFilter.getFilters()) {
            try {
                Field field = objectClass.getDeclaredField(QueryFilter.FilterType.getColumnName(filter.key));
                if (QueryFilter.FilterType.isComplex(filter.key)) {
                    continue;
                }
                if (whereClauseFilter.length() != 0) {
                    whereClauseFilter.append(" AND ");
                }
                if(filter.nullCheck) {
                    whereClauseFilter.append("(");
                    whereClauseFilter.append(QueryFilter.FilterType.getColumnName(filter.key) );
                    whereClauseFilter.append(" IS NULL OR ");
                    whereClauseFilter.append(QueryFilter.FilterType.getColumnName(filter.key) );
                    whereClauseFilter.append("='-' OR ");
                }
                StringBuilder value = new StringBuilder("'");
                value.append(StringUtils.join(filter.value, "', '"));
                value.append("'");

                String operation;
                if ("IN".equalsIgnoreCase(filter.operator)) {
                    operation = String.format("%s IN (%s)",
                            QueryFilter.FilterType.getColumnName(filter.key),
                            value);
                } else {
                    operation = String.format("%s %s %s",
                            QueryFilter.FilterType.getColumnName(filter.key),
                            filter.operator,
                            value);
                }
                whereClauseFilter.append(operation);
                if(filter.nullCheck) {
                    whereClauseFilter.append(")");
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
        }
        return whereClauseFilter.toString();
    }

    public static String formSortClause(QueryFilter queryFilter, Class objectClass) {
        StringBuilder orderByClauseFilter = new StringBuilder();
        for (int i = 0; i < queryFilter.getSortOrders().size(); i++) {
            QueryFilter.SortOrder sortOrder = queryFilter.getSortOrders().get(i);
            try {
                Field field = objectClass.getDeclaredField(QueryFilter.FilterType.getColumnName(sortOrder.key));
                orderByClauseFilter.append(FilterType.getColumnName(sortOrder.key) + " " + sortOrder.direction);
                if(i < queryFilter.getSortOrders().size() - 1) {
                    orderByClauseFilter.append(" ,");
                }
            } catch (NoSuchFieldException e) {
                continue;
            }
        }
        return orderByClauseFilter.toString();
    }
}

