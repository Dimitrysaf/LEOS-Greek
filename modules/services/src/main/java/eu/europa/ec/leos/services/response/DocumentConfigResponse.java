package eu.europa.ec.leos.services.response;

import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.light.Profile;
import eu.europa.ec.leos.vo.structure.AlternateConfig;
import eu.europa.ec.leos.vo.structure.Attribute;
import eu.europa.ec.leos.vo.structure.Level;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.NumberingType;
import eu.europa.ec.leos.vo.structure.RefConfig;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DocumentConfigResponse {
    private ProposalMetadata proposalMetadata;
    private List<LeosMetadata> documentsMetadata;
    private List<NumberingConfig> numberingConfig;
    private List<AlternateConfig> alternateConfigs;
    private List<RefConfig> refConfigs;
    private List<TocItem> tocItems;
    private Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray;
    private Map<String, Attribute> articleTypesConfig;
    private String internalRef;
    private Map<String, List<TocItem>> tocRules;
    private boolean isTrackChangesEnabled;
    private boolean isTrackChangesShowed;
    private boolean isClonedProposal;
    private String langGroup;
    private Profile profile;
    private String contextRole;

    public DocumentConfigResponse(List<LeosMetadata> documentsMetadata, List<NumberingConfig> numberingConfig, List<TocItem> tocItems,
                                  List<AlternateConfig> alternateConfigs, List<RefConfig> refConfigs, Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray,
                                  Map<String, Attribute> articleTypesConfig, String internalRef, ProposalMetadata proposalMetadata,
                                  Map<TocItem, List<TocItem>> tocRules, boolean isTrackChangesEnabled, boolean isTrackChangesShowed,
                                  boolean isClonedProposal, String langGroup, String language, Profile profile, String contextRole) {
        this.documentsMetadata = documentsMetadata;
        this.numberingConfig = numberingConfig;
        this.tocItems = tocItems;
        this.listNumberConfigJsonArray = listNumberConfigJsonArray;
        this.articleTypesConfig = articleTypesConfig;
        this.alternateConfigs = alternateConfigs;
        this.refConfigs = refConfigs;
        this.internalRef = internalRef;
        this.proposalMetadata = proposalMetadata;
        this.tocRules = transformMap(tocRules, language);
        this.isTrackChangesEnabled = isTrackChangesEnabled;
        this.isTrackChangesShowed = isTrackChangesShowed;
        this.isClonedProposal = isClonedProposal;
        this.langGroup = langGroup;
        this.profile = profile;
        this.contextRole = contextRole;
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

    public List<RefConfig> getRefConfigs() {
        return refConfigs;
    }

    public void setRefConfigs(List<RefConfig> refConfigs) {
        this.refConfigs = refConfigs;
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

    private Map<String, List<TocItem>> transformMap(Map<TocItem, List<TocItem>> originalMap, String language) {
        Map<String, List<TocItem>> transformedMap = new HashMap<>();

        for (Map.Entry<TocItem, List<TocItem>> entry : originalMap.entrySet()) {
            TocItem tocItem = entry.getKey();
            List<TocItem> tocItemList = entry.getValue();
            NumberingType numberingType = StructureConfigUtils.getNumberingTypeByLanguage(tocItem, language);
            String key = tocItem.getAknTag().toString().toUpperCase() + "_" + numberingType.toString();
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

    public String getLangGroup() {
        return langGroup;
    }

    public void setLangGroup(String langGroup) {
        this.langGroup = langGroup;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getContextRole() {
        return contextRole;
    }

    public void setContextRole(String contextRole) {
        this.contextRole = contextRole;
    }
}
