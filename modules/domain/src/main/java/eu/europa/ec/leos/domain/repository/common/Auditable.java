package eu.europa.ec.leos.domain.repository.common;

import java.io.Serializable;
import java.time.Instant;

public interface Auditable extends Serializable {
    String getCreatedBy();

    Instant getCreationInstant();

    String getLastModifiedBy();

    Instant getLastModificationInstant();
}
