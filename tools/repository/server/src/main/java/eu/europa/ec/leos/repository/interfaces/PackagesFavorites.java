package eu.europa.ec.leos.repository.interfaces;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;

public interface PackagesFavorites {
    String getCreationDate();
    BigDecimal getPackageId();
    BigDecimal getDocumentId();
    String getRef();
    String getTitle();
}