package eu.europa.ec.leos.domain.repository;

import java.io.Serializable;

public enum LeosLegStatus implements Serializable {
    IN_PREPARATION,
    FILE_READY,
    FILE_ERROR,
    SENT_TO_CONSULTATION,
    CONTRIBUTION_SENT,
    EXPORTED,
    IN_CONSULTATION,
    IMPORTED
}
