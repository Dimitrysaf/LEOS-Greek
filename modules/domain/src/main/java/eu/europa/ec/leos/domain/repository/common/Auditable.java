package eu.europa.ec.leos.domain.repository.common;

import java.time.Instant;

public interface Auditable {
    String getCreatedBy();

    Instant getCreationInstant();

    String getLastModifiedBy();

    Instant getLastModificationInstant();
}
