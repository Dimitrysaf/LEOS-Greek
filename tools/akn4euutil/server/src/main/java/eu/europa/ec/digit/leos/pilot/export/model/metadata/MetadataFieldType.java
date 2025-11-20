package eu.europa.ec.digit.leos.pilot.export.model.metadata;

import java.lang.IllegalArgumentException;
import java.util.List;

public enum MetadataFieldType {
    PACKAGE_TITLE("packageTitle"),
    INTERNAL_REF("internalRef"),
    AUTHENTIC_LANG("authenticLang"),
    COVERPAGE_TYPE("coverPageType"),
    ADOPTION_DATE("adoptionDate"),
    ADOPTION_LOCATION("adoptionLocation"),
    EMISSION_DATE("emissionDate"),
    INTERINSTITUTIONAL_COTE("interinstitutionalCote"),
    COTE("cote"),
    FINAL_COTE("finalCote"),
    LINKED_DOCUMENTS("linkedDocuments"),
    STAMP("stamp"),
    COMMISSIONER("commissioner"),
    CORRIGENDUM_ADDENDUM("corrigendumAddendum"),

    // Following keys will be ignored at the moment
    STATUS("status"),
    DELETE_INTERNAL_REFERENCE("deleteInternalReference"),
    START_PAGE_NUMBER("startPageNumber"),
    CLEANUP_HEADER_AND_FOOTER("cleanupHeaderAndFooter"),
    FREEZE_NUMBERING("freezeNumbering"),
    DELETE_COMMENTS("deleteComments"),
    DELETE_VERSIONS("deleteVersions"),
    DELETE_HIDDEN_TEXT("deleteHiddenText"),
    DELETE_USER_PROPERTIES("deleteUserProperties"),
    CLEAR_MARKER("clearMarker"),
    ADJUST_SIGNATURE_LAYOUT("adjustSignatureLayout"),
    REMOVE_SENSITIVITY("removeSensitivity"),
    UPDATE_COVER_PAGE("updateCoverPage");

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

    public static boolean isValidTypeName(final String typeName) {
        try {
            MetadataFieldType.valueOfTypeName(typeName);
            return true;
        } catch(IllegalArgumentException e) {
            return false;
        }
    }

    public static boolean isCommissioner(final String value) {
        try {
            return valueOfTypeName(value).equals(MetadataFieldType.COMMISSIONER);
        } catch(IllegalArgumentException ex) {
            return false;
        }
    }

    public static MetadataFieldType valueOfTypeName(final String typeName) throws IllegalArgumentException {
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
        if (MetadataFieldType.ADOPTION_DATE.getTypeName().equals(typeName)){
            return MetadataFieldType.ADOPTION_DATE;
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
        if(MetadataFieldType.STATUS.getTypeName().equals(typeName)){
            return MetadataFieldType.STATUS;
        }
        if(MetadataFieldType.COMMISSIONER.getTypeName().equals(typeName)){
            return MetadataFieldType.COMMISSIONER;
        }
        if(MetadataFieldType.CORRIGENDUM_ADDENDUM.getTypeName().equals(typeName)){
            return MetadataFieldType.CORRIGENDUM_ADDENDUM;
        }
        if(MetadataFieldType.DELETE_INTERNAL_REFERENCE.getTypeName().equals(typeName)){
            return MetadataFieldType.DELETE_INTERNAL_REFERENCE;
        }
        if(MetadataFieldType.START_PAGE_NUMBER.getTypeName().equals(typeName)){
            return MetadataFieldType.START_PAGE_NUMBER;
        }
        if(MetadataFieldType.CLEANUP_HEADER_AND_FOOTER.getTypeName().equals(typeName)){
            return MetadataFieldType.CLEANUP_HEADER_AND_FOOTER;
        }
        if(MetadataFieldType.FREEZE_NUMBERING.getTypeName().equals(typeName)){
            return MetadataFieldType.FREEZE_NUMBERING;
        }
        if(MetadataFieldType.DELETE_COMMENTS.getTypeName().equals(typeName)){
            return MetadataFieldType.DELETE_COMMENTS;
        }
        if(MetadataFieldType.DELETE_VERSIONS.getTypeName().equals(typeName)){
            return MetadataFieldType.DELETE_VERSIONS;
        }
        if(MetadataFieldType.DELETE_HIDDEN_TEXT.getTypeName().equals(typeName)){
            return MetadataFieldType.DELETE_HIDDEN_TEXT;
        }
        if(MetadataFieldType.DELETE_USER_PROPERTIES.getTypeName().equals(typeName)){
            return MetadataFieldType.DELETE_USER_PROPERTIES;
        }
        if(MetadataFieldType.CLEAR_MARKER.getTypeName().equals(typeName)){
            return MetadataFieldType.CLEAR_MARKER;
        }
        if(MetadataFieldType.ADJUST_SIGNATURE_LAYOUT.getTypeName().equals(typeName)){
            return MetadataFieldType.ADJUST_SIGNATURE_LAYOUT;
        }
        if(MetadataFieldType.REMOVE_SENSITIVITY.getTypeName().equals(typeName)){
            return MetadataFieldType.REMOVE_SENSITIVITY;
        }
        if(MetadataFieldType.UPDATE_COVER_PAGE.getTypeName().equals(typeName)){
            return MetadataFieldType.UPDATE_COVER_PAGE;
        }
        throw new IllegalArgumentException("Invalid metadata type name");
    }
}