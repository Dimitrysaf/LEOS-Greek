package eu.europa.ec.leos.rest.support.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.Date;

import static eu.europa.ec.leos.rest.support.util.ConversionUtils.LEOS_REPO_DATE_FORMAT;
import static eu.europa.ec.leos.rest.support.util.ConversionUtils.getLeosDateAsString;

public class DateSerializer extends StdSerializer<Date> {
    protected DateSerializer(Class<Date> t) {
        super(t);
    }

    protected DateSerializer() {
        this(null);
    }

    @Override
    public void serialize(Date value, JsonGenerator gen, SerializerProvider sp)
            throws IOException {
        gen.writeString(getLeosDateAsString(value, LEOS_REPO_DATE_FORMAT));
    }
}
