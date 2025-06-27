package eu.europa.ec.digit.leos.pilot.export.model.metadata;

import java.lang.IllegalArgumentException;

public enum MetadataFieldType {
    PACKAGE_TITLE("packageTitle"),
    INTERNAL_REF("internalRef"),
    AUTHENTIC_LANG("authenticLang"),
    COVERPAGE_TYPE("coverPageType"),
    // Prefinalization fields' types
    ADOPTION_DATE("adoptionDate"),
    ADOPTION_LOCATION("adoptionLocation"),
    EMISSION_DATE("emissionDate"),
    INTERINSTITUTIONAL_COTE("interinstitutionalCote"),
    COTE("cote"),
    FINAL_COTE("finalCote"),
    LINKED_DOCUMENTS("linkedDocuments"),
    STAMP("stamp");


    private final String typeName;

    private MetadataFieldType(String typeName){
        this.typeName = typeName;
    }

    private String getTypeName(){
        return this.typeName;
    }

    @Override
    public String toString(){
        return this.typeName;
    }

    public static MetadataFieldType valueOfTypeName(String typeName) throws IllegalArgumentException {
        if (MetadataFieldType.PACKAGE_TITLE.getTypeName().equals(typeName)){
            return MetadataFieldType.PACKAGE_TITLE;
        }
        if (MetadataFieldType.INTERNAL_REF.getTypeName().equals(typeName)){
            return MetadataFieldType.INTERNAL_REF;
        }
        if (MetadataFieldType.AUTHENTIC_LANG.getTypeName().equals(typeName)){
            return MetadataFieldType.AUTHENTIC_LANG;
        }
        if (MetadataFieldType.COVERPAGE_TYPE.getTypeName().equals(typeName)){
            return MetadataFieldType.COVERPAGE_TYPE;
        }
        if (MetadataFieldType.ADOPTION_LOCATION.getTypeName().equals(typeName)){
            return MetadataFieldType.ADOPTION_LOCATION;
        }
        if (MetadataFieldType.EMISSION_DATE.getTypeName().equals(typeName)){
            return MetadataFieldType.EMISSION_DATE;
        }
        if (MetadataFieldType.INTERINSTITUTIONAL_COTE.getTypeName().equals(typeName)){
            return MetadataFieldType.INTERINSTITUTIONAL_COTE;
        }
        if (MetadataFieldType.COTE.getTypeName().equals(typeName)){
            return MetadataFieldType.COTE;
        }
        if (MetadataFieldType.LINKED_DOCUMENTS.getTypeName().equals(typeName)){
            return MetadataFieldType.LINKED_DOCUMENTS;
        }
        if(MetadataFieldType.FINAL_COTE.getTypeName().equals(typeName)){
            return MetadataFieldType.FINAL_COTE;
        }
        if(MetadataFieldType.STAMP.getTypeName().equals(typeName)){
            return MetadataFieldType.STAMP;
        }
        if(MetadataFieldType.ADOPTION_DATE.getTypeName().equals(typeName)){
            return MetadataFieldType.ADOPTION_DATE;
        }
        throw new IllegalArgumentException("Invalid metadata type name");
    }
}