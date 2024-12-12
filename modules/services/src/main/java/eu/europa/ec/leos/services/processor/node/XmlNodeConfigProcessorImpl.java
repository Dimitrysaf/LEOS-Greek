/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.processor.node;

import cool.graph.cuid.Cuid;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class XmlNodeConfigProcessorImpl implements XmlNodeConfigProcessor {

    private static final Map<LeosCategory, Map<String, XmlNodeConfig>> All_CONFIG_MAP = new HashMap<>();

    static {
        All_CONFIG_MAP.put(LeosCategory.PROPOSAL, createProposalConfig());
        All_CONFIG_MAP.put(LeosCategory.BILL, createBillConfig());
        All_CONFIG_MAP.put(LeosCategory.MEMORANDUM, createMemorandumConfig());
        All_CONFIG_MAP.put(LeosCategory.ANNEX, createAnnexConfig());
        All_CONFIG_MAP.put(LeosCategory.COUNCIL_EXPLANATORY, createExplanatoryConfig());
        All_CONFIG_MAP.put(LeosCategory.STAT_DIGIT_FINANC_LEGIS, createFinancialStatementConfig());
    }

    private static Map<String, XmlNodeConfig> createProposalConfig() {
        Map<String, XmlNodeConfig> proposalConfigMap = new HashMap<>();
        proposalConfigMap.putAll(populateMetadataConfigMap());

        final Map<String, XmlNodeConfig> coverPageConfig = new HashMap<>(4);
        coverPageConfig.put(DOC_STAGE_COVER, new XmlNodeConfig("//akn:coverPage/akn:longTitle/akn:p/akn:docStage", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docStage"))));
        coverPageConfig.put(DOC_TYPE_COVER, new XmlNodeConfig("//akn:coverPage/akn:longTitle/akn:p/akn:docType", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docType"))));
        coverPageConfig.put(DOC_PURPOSE_COVER, new XmlNodeConfig("//akn:coverPage/akn:longTitle/akn:p/akn:docPurpose", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docPurpose"))));
        coverPageConfig.put(DOC_LANGUAGE_COVER, new XmlNodeConfig("//akn:coverPage/akn:container[@name='language']/akn:p", false, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "container"))));
        coverPageConfig.put(DOC_EEA_RELEVANCE_COVER, new XmlNodeConfig("//akn:coverPage/akn:container[@name='eeaRelevance']/akn:p", true,
                Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "container"),
                new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "p")),
            true, "//akn:coverPage/akn:container[@name='eeaRelevance']"));

        proposalConfigMap.putAll(coverPageConfig);

        final Map<String, XmlNodeConfig> otherConfig = populateOtherConfig();
        proposalConfigMap.putAll(otherConfig);

        return proposalConfigMap;
    }

    private static Map<String, XmlNodeConfig> createBillConfig() {
        Map<String, XmlNodeConfig> billConfigMap = new HashMap<>();
        billConfigMap.putAll(populateMetadataConfigMap());

        final Map<String, XmlNodeConfig> prefaceConfig = new HashMap<>(4);
        prefaceConfig.put(DOC_STAGE_PREFACE, new XmlNodeConfig("//akn:preface/akn:longTitle/akn:p/akn:docStage", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docStage"))));
        prefaceConfig.put(DOC_TYPE_PREFACE, new XmlNodeConfig("//akn:preface/akn:longTitle/akn:p/akn:docType", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docType"))));
        prefaceConfig.put(DOC_PURPOSE_PREFACE, new XmlNodeConfig("//akn:preface/akn:longTitle/akn:p/akn:docPurpose", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docPurpose"))));
        prefaceConfig.put(DOC_EEA_RELEVANCE_PREFACE, new XmlNodeConfig("//akn:preface/akn:container[@name='eeaRelevance']/akn:p",
                true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "container"),
                new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "p")),
            true, "//akn:preface/akn:container[@name='eeaRelevance']"));
        billConfigMap.putAll(prefaceConfig);

        final Map<String, XmlNodeConfig> otherConfig = populateOtherConfig();
        billConfigMap.putAll(otherConfig);

        return billConfigMap;
    }

    private static Map<String, XmlNodeConfig> createMemorandumConfig() {
        Map<String, XmlNodeConfig> memorandumConfigMap = populateMetadataConfigMap();

        final Map<String, XmlNodeConfig> otherConfig = populateOtherConfig();
        memorandumConfigMap.putAll(otherConfig);

        return memorandumConfigMap;
    }

    private static Map<String, XmlNodeConfig> createExplanatoryConfig() {
        Map<String, XmlNodeConfig> explanatoryConfigMap = new HashMap<>();

        explanatoryConfigMap.putAll(populateMetadataConfigMap());

        final Map<String, XmlNodeConfig> prefaceConfig = new HashMap<>(4);
        prefaceConfig.put(EXPLANATORY_TITLE_PREFACE, new XmlNodeConfig("//akn:preface/akn:longTitle/akn:p/akn:docTitle", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docTitle"))));
        explanatoryConfigMap.putAll(prefaceConfig);

        final Map<String, XmlNodeConfig> otherConfig = populateOtherConfig();
        explanatoryConfigMap.putAll(otherConfig);

        return explanatoryConfigMap;
    }

    private static Map<String, XmlNodeConfig> createAnnexConfig() {
        Map<String, XmlNodeConfig> annexConfigMap = new HashMap<>();
        final Map<String, XmlNodeConfig> metadataConfig = populateMetadataConfigMap();

        metadataConfig.put(ANNEX_INDEX_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:annexIndex", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:annexIndex"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        metadataConfig.put(ANNEX_NUMBER_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:annexNumber", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:annexNumber"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        metadataConfig.put(ANNEX_TITLE_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:annexTitle", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:annexTitle"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        metadataConfig.put(ANNEX_CLONED_REF_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:clonedRef", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:clonedRef"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        annexConfigMap.putAll(metadataConfig);

        final Map<String, XmlNodeConfig> prefaceConfig = new HashMap<>(2);
        prefaceConfig.put(ANNEX_NUMBER_PREFACE, new XmlNodeConfig("//akn:preface/akn:container/akn:block[@name='num']", true, Arrays.asList(new XmlNodeConfig.Attribute("name", "headerOfAnnex", "container"), new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "container"), new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "block"))));
        prefaceConfig.put(ANNEX_TITLE_PREFACE, new XmlNodeConfig("//akn:preface/akn:container/akn:block[@name='heading']", true, Arrays.asList(new XmlNodeConfig.Attribute("name", "headerOfAnnex", "container"), new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "container"), new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "block"))));
        annexConfigMap.putAll(prefaceConfig);

        final Map<String, XmlNodeConfig> otherConfig = populateOtherConfig();
        annexConfigMap.putAll(otherConfig);

        return annexConfigMap;
    }

    private static Map<String, XmlNodeConfig> createFinancialStatementConfig() {
        Map<String, XmlNodeConfig> financialStatementConfigMap = new HashMap<>();

        financialStatementConfigMap.putAll(populateMetadataConfigMap());

        final Map<String, XmlNodeConfig> otherConfig = populateOtherConfig();
        financialStatementConfigMap.putAll(otherConfig);

        return financialStatementConfigMap;
    }

    public Map<String, XmlNodeConfig> getOldPrefaceOfAnnexConfig() {
        final Map<String, XmlNodeConfig> oldPrefaceConfig = new HashMap<>(2);
        oldPrefaceConfig.put(ANNEX_NUMBER_PREFACE, new XmlNodeConfig("//akn:preface/akn:longTitle/akn:p/akn:docType", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docType"))));
        oldPrefaceConfig.put(ANNEX_TITLE_PREFACE, new XmlNodeConfig("//akn:preface/akn:longTitle/akn:p/akn:docTitle", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "docTitle"))));
        return oldPrefaceConfig;
    }

    private static Map<String, XmlNodeConfig> populateMetadataConfigMap() {
        final Map<String, XmlNodeConfig> metadataConfig = new HashMap<>(9);
        metadataConfig.put(DOC_STAGE_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:docStage", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:docStage"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        metadataConfig.put(DOC_TYPE_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:docType", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:docType"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        metadataConfig.put(DOC_PURPOSE_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:docPurpose", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:docPurpose"), new XmlNodeConfig.Attribute("source", "~COM", "proprietary"))));
        metadataConfig.put(DOC_REF_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:ref", true, Collections.emptyList()));
        metadataConfig.put(DOC_OBJECT_ID, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:objectId", true, Collections.emptyList()));
        metadataConfig.put(DOC_TEMPLATE, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:template", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:template"))));
        metadataConfig.put(DOC_SPECIFIC_TEMPLATE, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:docTemplate", true, Arrays.asList(new XmlNodeConfig.Attribute("xml:id", Cuid.createCuid(), "leos:docTemplate"))));
        metadataConfig.put(DOC_LANGUAGE, new XmlNodeConfig("//akn:meta/akn:identification/akn:FRBRExpression/akn:FRBRlanguage/@language", false, Collections.emptyList()));
        metadataConfig.put(DOC_VERSION, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:docVersion", true, Collections.emptyList()));
        metadataConfig.put(DOC_EEA_RELEVANCE_META, new XmlNodeConfig("/akn:akomaNtoso//akn:meta/akn:proprietary/leos:eeaRelevance", true, Collections.emptyList(), true, "/akn:akomaNtoso//akn:meta/akn:proprietary/leos:eeaRelevance"));

        metadataConfig.put(FILE_CUID_PRESERVATION, new XmlNodeConfig("//akn:meta/akn:identification/akn:FRBRWork/akn:preservation/akn4eu:fileCUID/@value", false, Collections.emptyList()));
        metadataConfig.put(DOC_CUID_PRESERVATION, new XmlNodeConfig("//akn:meta/akn:identification/akn:FRBRWork/akn:preservation/akn4eu:docCUID/@value", false, Collections.emptyList()));

        return metadataConfig;
    }

    private static Map<String, XmlNodeConfig> populateOtherConfig() {
        final Map<String, XmlNodeConfig> otherConfig = new HashMap<>(4);
        otherConfig.put(PROPOSAL_DOC_COLLECTION, new XmlNodeConfig("//akn:documentCollection/@name", false, Collections.emptyList()));
        otherConfig.put(DOC_REF_COVER, new XmlNodeConfig("//akn:coverPage/@xml:id", false, Collections.emptyList()));
        return otherConfig;
    }

    public Map<String, XmlNodeConfig> getConfig(LeosCategory category) {
        Map<String, XmlNodeConfig> config = All_CONFIG_MAP.get(category);
        if (config == null) {
            throw new UnsupportedOperationException("There is no configuration present for category " + category);
        }
        return config;
    }

    public String getCollectionBodyComponent(String attributeName, List<String> refersToList) {
        List<String> xpathConditions = refersToList.stream().map(value -> "@refersTo='" + value + "'").collect(Collectors.toList());
        String xpathComponent = "//akn:documentCollection/akn:collectionBody/akn:component[";
        xpathComponent += String.join(" or ", xpathConditions);
        xpathComponent += "]/akn:documentRef/@" + attributeName;
        return xpathComponent;
    }
}