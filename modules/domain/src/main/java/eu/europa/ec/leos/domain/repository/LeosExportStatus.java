package eu.europa.ec.leos.domain.repository;

import java.io.Serializable;

public enum LeosExportStatus implements Serializable {
    FILE_READY,
    NOTIFIED,
    PROCESSED_OK,
    PROCESSED_ERROR
}
