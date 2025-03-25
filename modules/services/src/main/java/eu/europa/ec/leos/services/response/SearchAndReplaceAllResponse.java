package eu.europa.ec.leos.services.response;

import java.util.Base64;

public class SearchAndReplaceAllResponse {

    String updatedContentToSaveAfterReplace;
    int count;

    public SearchAndReplaceAllResponse(String updatedContentToSaveAfterReplace, int count) {
        this.updatedContentToSaveAfterReplace = updatedContentToSaveAfterReplace;
        this.count = count;
    }

    public String getUpdatedContentToSaveAfterReplace() {
        return updatedContentToSaveAfterReplace;
    }

    public void setUpdatedContentToSaveAfterReplace(String updatedContentToSaveAfterReplace) {
        this.updatedContentToSaveAfterReplace = updatedContentToSaveAfterReplace;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
