package eu.europa.ec.leos.repository.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.Date;

import static eu.europa.ec.leos.repository.utils.ConversionUtils.LEOS_REPO_DATE_FORMAT;
import static eu.europa.ec.leos.repository.utils.ConversionUtils.getLeosDateAsString;

public class CollaboratorSerializer extends StdSerializer<Date> {
    protected CollaboratorSerializer(Class<Date> t) {
        super(t);
    }

    protected CollaboratorSerializer() {
        this(null);
    }

    @Override
    public void serialize(Date value, JsonGenerator gen, SerializerProvider sp)
            throws IOException {
        gen.writeString(getLeosDateAsString(value, LEOS_REPO_DATE_FORMAT));
    }
}
