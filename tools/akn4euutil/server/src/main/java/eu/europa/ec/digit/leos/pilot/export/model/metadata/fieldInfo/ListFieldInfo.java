package eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo;

import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;

import java.util.List;

public class ListFieldInfo extends MetadataFieldInfo {
    private final List<String> values;

    public ListFieldInfo(final List<String> values,
                         final MetadataFieldType fieldType) {
        super(fieldType);
        this.values = values;
    }

    public List<String> getValue() {
        return this.values;
    }

    @Override
    public String toString() {
        return String.format("SimpleFieldInfo(value: %s / fieldType: %s)", this.values.toString(), this.fieldType.toString());
    }
}