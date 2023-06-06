package eu.europa.ec.leos.repository.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import eu.europa.ec.leos.repository.model.Collaborator;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import static eu.europa.ec.leos.repository.utils.ConversionUtils.getLeosCollaboratorsFromString;

public class CollaboratorDesSerializer extends StdDeserializer<List<Collaborator>> {

    protected CollaboratorDesSerializer() {
        this(null);
    }

    protected CollaboratorDesSerializer(Class<Date> t) {
        super(t);
    }

    @Override
    public List<Collaborator> deserialize(JsonParser jsonparser, DeserializationContext context)
            throws IOException {
        return getLeosCollaboratorsFromString(jsonparser.getText());
    }
}
