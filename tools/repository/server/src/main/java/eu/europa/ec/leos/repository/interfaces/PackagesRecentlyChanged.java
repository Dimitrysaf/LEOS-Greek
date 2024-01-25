package eu.europa.ec.leos.repository.interfaces;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;

public interface PackagesRecentlyChanged {
    String getRank();
    BigDecimal getPackageId();
    String getGreatestLastDate();
    BigDecimal getDocumentId();
    String getRef();
    String getTitle();
}