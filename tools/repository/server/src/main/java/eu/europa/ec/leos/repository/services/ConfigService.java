package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;

import java.util.List;

public interface ConfigService {
    List<LeosDocument> findConfigByName(final String name) throws RepositoryException;

    LeosDocument findConfigById(final String id) throws RepositoryException;
}
