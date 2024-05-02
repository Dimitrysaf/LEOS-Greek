package eu.europa.ec.leos.services.dto.response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MilestoneViewResponse {

    private final List<MilestoneDocumentView> documents;
    private final boolean isPdfRenditionsPresent;
    private final HashMap<String, Boolean> annexComparison;
    private final Map<String, Object> annexAddedMap;
    private final Map<String, Object> annexDeletedMap;

    public MilestoneViewResponse(List<MilestoneDocumentView> documents, boolean isPdfRenditionsPresent
            , Map<String, Object> annexAddedMap, Map<String, Object> annexDeletedMap, HashMap<String, Boolean> annexComparison) {
        this.documents = documents;
        this.isPdfRenditionsPresent = isPdfRenditionsPresent;
        this.annexComparison = annexComparison;
        this.annexAddedMap = annexAddedMap;
        this.annexDeletedMap = annexDeletedMap;
    }

    public List<MilestoneDocumentView> getDocuments() {
        return documents;
    }

    public HashMap<String, Boolean> getAnnexComparison() {return annexComparison; }

    public boolean isPdfRenditionsPresent() {
        return isPdfRenditionsPresent;
    }

    public Map<String, Object> getAnnexDeletedMap() { return annexDeletedMap; }

    public Map<String, Object> getAnnexAddedMap() { return annexAddedMap; }
}
