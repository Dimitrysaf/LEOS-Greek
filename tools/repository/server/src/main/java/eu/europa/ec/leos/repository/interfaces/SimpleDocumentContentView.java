package eu.europa.ec.leos.repository.interfaces;

public interface SimpleDocumentContentView {
    String getOriginalFilename();
    Long getBinaryContentSize();
    String getForeignRenditionOriginalFilename();
    Long getForeignRenditionOriginalFileSize();
}
