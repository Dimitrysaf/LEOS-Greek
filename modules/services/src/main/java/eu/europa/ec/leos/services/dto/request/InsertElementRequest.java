package eu.europa.ec.leos.services.dto.request;



public class InsertElementRequest {

    private Position position;

    public InsertElementRequest(Position position) {
        this.position = position;
    }

    public Position getPosition() {
        return this.position;
    }

}
