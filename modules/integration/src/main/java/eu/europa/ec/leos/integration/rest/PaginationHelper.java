package eu.europa.ec.leos.integration.rest;

import lombok.NonNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.util.StringUtils;

import java.util.Iterator;
import java.util.Map;

public class PaginationHelper {
    private static final String PAGE = "page";
    private static final String PAGE_SIZE = "size";
    private static final String SORT = "sort";
    private static final String SORT_DIRECTION = "direction";

    /**
     * Creates and returns a Pageable object for pagination with optional sorting.
     *
     * @param page the page number to request. If null, defaults to 0.
     * @param size the size of the page. If null, defaults to the maximum integer value.
     * @param sort the sort parameter in the format "field,direction".
     *             The direction is optional and can be "asc" or "desc".
     *             If omitted, no sorting is applied.
     * @return a Pageable object based on the provided pagination and sorting parameters.
     */
    public static Pageable preparePaginationObject(@Nullable final Integer page, @Nullable final Integer size, @Nullable final String sort) {
        final PageRequest pageable;
        if (StringUtils.hasText(sort)) {
            final String[] sortParts = sort.split(",", 2);
            final String sortField = sortParts[0];
            final String sortDirection = sortParts.length > 1 ? sortParts[1] : null;
            final Sort.Direction direction = Sort.Direction.fromOptionalString(sortDirection).orElse(Sort.Direction.ASC);
            final Sort _sort = Sort.by(direction, sortField);
            pageable = PageRequest.of(page != null ? page : 0, size != null ? size : Integer.MAX_VALUE, _sort);
        } else {
            pageable = PageRequest.of(page != null ? page : 0, size != null ? size : Integer.MAX_VALUE);
        }
        return pageable;
    }

    /**
     * Prepares pagination parameters by extracting paging and sorting information
     * from the given {@link Pageable} object and populating the provided map.
     *
     * @param pageable the Pageable object containing pagination and sorting settings. Must not be null.
     * @param params a map in which the pagination parameters (page, size, sort, direction)
     *               will be inserted. Must not be null.
     */
    public static void preparePagingParams(@NonNull final Pageable pageable, @NonNull final Map<String, Object> params) {
        params.put(PAGE, pageable.getPageNumber());
        params.put(PAGE_SIZE, pageable.getPageSize());
        final Iterator<Sort.Order> sortIterator;
        if ((sortIterator = pageable.getSort().iterator()).hasNext()) {
            final Sort.Order sort = sortIterator.next();
            params.put(SORT, sort.getProperty());
            params.put(SORT_DIRECTION, sort.getDirection().name().toLowerCase());
        } else {
            params.put(SORT, "");
            params.put(SORT_DIRECTION, "");
        }
    }
}
