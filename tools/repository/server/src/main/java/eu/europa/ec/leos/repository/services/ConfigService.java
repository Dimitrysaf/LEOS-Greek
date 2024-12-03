package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.math.BigDecimal;
import java.util.List;

public interface ConfigService {
    List<LeosDocument> findConfigByName(final String name) throws RepositoryException;

    List<LeosDocument> findConfigByName(final String name, final boolean withContent) throws RepositoryException;

    LeosDocument findConfigById(final String id) throws RepositoryException;

    LeosDocument findConfigByVersionId(final BigDecimal id) throws RepositoryException;

    public void saveNotifications(String content) throws RepositoryException;

    public String fetchNotifications() throws RepositoryException;
}
