package eu.europa.ec.leos.services.response;

import eu.europa.ec.leos.domain.cmis.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.cmis.metadata.ProposalMetadata;
import eu.europa.ec.leos.vo.toc.AlternateConfig;
import eu.europa.ec.leos.vo.toc.Attribute;
import eu.europa.ec.leos.vo.toc.Level;
import eu.europa.ec.leos.vo.toc.NumberingConfig;
import eu.europa.ec.leos.vo.toc.TocItem;
import eu.europa.ec.leos.vo.toc.TocItemTypeName;

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

    public DocumentConfigResponse(List<LeosMetadata> documentsMetadata, List<NumberingConfig> numberingConfig, List<TocItem> tocItems,
                                  List<AlternateConfig> alternateConfigs, Map<TocItemTypeName, List<Level>> listNumberConfigJsonArray,
                                  Map<String, Attribute> articleTypesConfig, String internalRef, ProposalMetadata proposalMetadata) {
        this.documentsMetadata = documentsMetadata;
        this.numberingConfig = numberingConfig;
        this.tocItems = tocItems;
        this.listNumberConfigJsonArray = listNumberConfigJsonArray;
        this.articleTypesConfig = articleTypesConfig;
        this.alternateConfigs = alternateConfigs;
        this.internalRef = internalRef;
        this.proposalMetadata = proposalMetadata;
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
}
