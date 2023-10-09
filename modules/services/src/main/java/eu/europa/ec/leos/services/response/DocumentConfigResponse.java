package eu.europa.ec.leos.services.response;

import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.vo.toc.AlternateConfig;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.Level;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemTypeName;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DocumentConfigResponse {
    private ProposalMetadata proposalMetadata;
    private List<LeosMetadata> documentsMetadata;
    private List<NumberingConfig> numberingConfig;
    private List<AlternateConfig> alternateConfigs;
    private List<TocItem> tocItems;
    private Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray;
    private Map<String, Attribute> articleTypesConfig;
    private String internalRef;
    private Map<String, List<TocItem>> tocRules;
    private boolean isTrackChangesEnabled;
    private boolean isTrackChangesShowed;
    private boolean isClonedProposal;

    public DocumentConfigResponse(List<LeosMetadata> documentsMetadata, List<NumberingConfig> numberingConfig, List<TocItem> tocItems,
                                  List<AlternateConfig> alternateConfigs, Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray,
                                  Map<String, Attribute> articleTypesConfig, String internalRef, ProposalMetadata proposalMetadata,
                                  Map<TocItem, List<TocItem>> tocRules, boolean isTrackChangesEnabled, boolean isTrackChangesShowed,
                                  boolean isClonedProposal) {
        this.documentsMetadata = documentsMetadata;
        this.numberingConfig = numberingConfig;
        this.tocItems = tocItems;
        this.listNumberConfigJsonArray = listNumberConfigJsonArray;
        this.articleTypesConfig = articleTypesConfig;
        this.alternateConfigs = alternateConfigs;
        this.internalRef = internalRef;
        this.proposalMetadata = proposalMetadata;
        this.tocRules = transformMap(tocRules);
        this.isTrackChangesEnabled = isTrackChangesEnabled;
        this.isTrackChangesShowed = isTrackChangesShowed;
        this.isClonedProposal = isClonedProposal;
    }

    public List<LeosMetadata> getDocumentsMetadata() {
        return documentsMetadata;
    }

    public void setDocumentsMetadata(List<LeosMetadata> documentsMetadata) {
        this.documentsMetadata = documentsMetadata;
    }

    public List<NumberingConfig> getNumberingConfig() {
        return numberingConfig;
    }

    public void setNumberingConfig(List<NumberingConfig> numberingConfig) {
        this.numberingConfig = numberingConfig;
    }

    public List<TocItem> getTocItems() {
        return tocItems;
    }

    public void setTocItems(List<TocItem> tocItems) {
        this.tocItems = tocItems;
    }

    public Map<TocItemTypeName, List<Level>> getListNumberConfigJsonArray() {
        return listNumberConfigJsonArray;
    }

    public void setListNumberConfigJsonArray(Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray) {
        this.listNumberConfigJsonArray = listNumberConfigJsonArray;
    }

    public Map<String, Attribute> getArticleTypesConfig() {
        return articleTypesConfig;
    }

    public void setArticleTypesConfig(Map<String, Attribute> articleTypesConfig) {
        this.articleTypesConfig = articleTypesConfig;
    }

    public String getInternalRef() {
        return internalRef;
    }

    public void setInternalRef(String internalRef) {
        this.internalRef = internalRef;
    }

    public List<AlternateConfig> getAlternateConfigs() {
        return alternateConfigs;
    }

    public void setAlternateConfigs(List<AlternateConfig> alternateConfigs) {
        this.alternateConfigs = alternateConfigs;
    }

    public ProposalMetadata getProposalMetadata() {
        return proposalMetadata;
    }

    public void setProposalMetadata(ProposalMetadata proposalMetadata) {
        this.proposalMetadata = proposalMetadata;
    }

    public Map<String, List<TocItem>> getTocRules() {
        return tocRules;
    }

    public void setTocRules(Map<String, List<TocItem>> tocRules) {
        this.tocRules = tocRules;
    }

    private Map<String, List<TocItem>> transformMap(Map<TocItem, List<TocItem>> originalMap) {
        Map<String, List<TocItem>> transformedMap = new HashMap<>();

        for (Map.Entry<TocItem, List<TocItem>> entry : originalMap.entrySet()) {
            TocItem tocItem = entry.getKey();
            List<TocItem> tocItemList = entry.getValue();

            String key = tocItem.getAknTag().toString().toUpperCase() + "_" + tocItem.getNumberingType().toString();
            transformedMap.put(key, tocItemList);
        }

        return transformedMap;
    }

    public boolean isTrackChangesEnabled() {
        return isTrackChangesEnabled;
    }

    public void setTrackChangesEnabled(boolean trackChangesEnabled) {
        isTrackChangesEnabled = trackChangesEnabled;
    }

    public boolean isTrackChangesShowed() {
        return isTrackChangesShowed;
    }

    public void setTrackChangesShowed(boolean trackChangesShowed) {
        isTrackChangesShowed = trackChangesShowed;
    }

    public boolean isClonedProposal() {
        return isClonedProposal;
    }

    public void setClonedProposal(boolean clonedProposal) {
        isClonedProposal = clonedProposal;
    }

}
