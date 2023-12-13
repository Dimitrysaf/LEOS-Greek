package eu.europa.ec.leos.services.dto.response;

public class SaveCoverPageElementResponse extends SaveElementResponse {
    private final String updatedTitle;

    public SaveCoverPageElementResponse(final String elementId, final String elementTagName,
                                        final String elementFragment,
                                        final String updatedTitle) {
        super(elementId, elementTagName, elementFragment);
        this.updatedTitle = updatedTitle;
    }

    public String getUpdatedTitle() {
        return updatedTitle;
    }
}
