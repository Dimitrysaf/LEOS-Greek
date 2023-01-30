package eu.europa.ec.leos.services.request;

import java.util.List;

public class CollaboratorsRequest {

    private List<CollaboratorRequest> collaborators;

    public CollaboratorsRequest() {
    }

    public CollaboratorsRequest(List<CollaboratorRequest> collaborators) {
        this.collaborators = collaborators;
    }

    public List<CollaboratorRequest> getCollaborators() {
        return collaborators;
    }

    public void setCollaborator(List<CollaboratorRequest> collaborators) {
        this.collaborators = collaborators;
    }

    @Override
    public String toString() {
        return "CollaboratorsRequest{" +
                "collaborators=" + collaborators +
                '}';
    }
}
