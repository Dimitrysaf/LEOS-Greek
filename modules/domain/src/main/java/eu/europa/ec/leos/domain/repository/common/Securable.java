package eu.europa.ec.leos.domain.repository.common;

import eu.europa.ec.leos.model.user.Collaborator;

import java.io.Serializable;
import java.util.List;

public interface Securable extends Serializable {
    List<Collaborator> getCollaborators();
}
