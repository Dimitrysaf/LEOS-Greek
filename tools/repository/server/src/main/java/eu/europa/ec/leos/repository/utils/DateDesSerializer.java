package eu.europa.ec.leos.repository.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static eu.europa.ec.leos.repository.utils.ConversionUtils.LEOS_REPO_DATE_FORMAT;
import static eu.europa.ec.leos.repository.utils.ConversionUtils.getDateFromString;

public class DateDesSerializer extends StdDeserializer<Date> {

    protected DateDesSerializer() {
        this(null);
    }

    protected DateDesSerializer(Class<Date> t) {
        super(t);
    }

    @Override
    public Date deserialize(JsonParser jsonparser, DeserializationContext context)
            throws IOException {
        return getDateFromString(jsonparser.getText(), LEOS_REPO_DATE_FORMAT);
    }
}
