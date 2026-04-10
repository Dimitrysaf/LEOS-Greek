package eu.europa.ec.digit.userdata.mappers;

import org.mapstruct.Mapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;

import java.util.Map;

@Mapper(componentModel = "spring")
public interface PageMapper {
    /**
     * Maps a given {@link Pageable} object to a new {@link Pageable} object with custom column mapping.
     *
     * @param pageable the original {@link Pageable} object containing pagination and sort information;
     *                 could be null, in which case default pagination is applied.
     * @param columnMapping a mapping of field names to column names; used to translate sorting
     *                      properties from the input {@link Pageable} to the output {@link Pageable}.
     * @param defaultSortColumn the default column name to use for sorting when either the input
     *                          {@link Pageable} if the sort property cannot be mapped using the provided columnMapping.
     * @return a new {@link Pageable} object with translated sorting properties and pagination settings.
     */
    default Pageable map(@Nullable final Pageable pageable,
                         @Nullable final Map<String, String> columnMapping,
                         @Nullable final String defaultSortColumn) {
        final int page = pageable != null && pageable.isPaged() ? pageable.getPageNumber() : 0;
        final int size = pageable != null && pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;

        final PageRequest mappedPageable;
        if (pageable != null && pageable.getSort().isSorted()) {
            final Sort.Direction direction = pageable.getSort().iterator().next().getDirection();
            final String field = pageable.getSort().iterator().next().getProperty();
            mappedPageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(direction, columnMapping != null
                            ? columnMapping.getOrDefault(field, defaultSortColumn)
                            : field));
        } else {
            mappedPageable = PageRequest.of(page, size);
        }
        return mappedPageable;
    }
}
