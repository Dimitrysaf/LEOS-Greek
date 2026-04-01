package eu.europa.ec.digit.userdata.mappers;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StringTrimMapper {
    default String map(String value) {
        return value != null ? value.trim() : null;
    }
}
