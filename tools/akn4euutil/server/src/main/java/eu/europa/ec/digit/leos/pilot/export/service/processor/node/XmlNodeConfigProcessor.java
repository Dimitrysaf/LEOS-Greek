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
package eu.europa.ec.digit.leos.pilot.export.service.processor.node;

import eu.europa.ec.digit.leos.pilot.export.model.LeosCategory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface XmlNodeConfigProcessor {

    String DOC_LANGUAGE = "docLanguage";
    String DOC_TEMPLATE = "docTemplate";
    String DOC_SPECIFIC_TEMPLATE = "docSpecificTemplate";

    String DOC_REF_META = "docRef";
    String DOC_OBJECT_ID = "objectId";
    String DOC_PURPOSE_META = "docPurposeMeta";
    String DOC_STAGE_META = "docStageMeta";
    String DOC_TYPE_META = "docTypeMeta";
    String DOC_EEA_RELEVANCE_META = "eeaRelevanceMeta";

    String DOC_PURPOSE_COVER = "docPurposeCover";
    String DOC_STAGE_COVER = "docStageCover";
    String DOC_TYPE_COVER = "docTypeCover";
    String DOC_LANGUAGE_COVER = "docLanguageCover";
    String DOC_EEA_RELEVANCE_COVER = "eeaRelevanceCover";

    String DOC_PURPOSE_PREFACE = "docPurposePreface";
    String DOC_STAGE_PREFACE = "docStagePreface";
    String DOC_TYPE_PREFACE = "docTypePreface";
    String DOC_EEA_RELEVANCE_PREFACE = "eeaRelevancePreface";

    String FILE_CUID_PRESERVATION = "fileCUID";
    String DOC_CUID_PRESERVATION = "docCUID";

    String DOC_VERSION = "docVersion";
    String DOC_REF_COVER = "coverPage";

    String PROPOSAL_DOC_COLLECTION = "docCollectionName";

    String ANNEX_INDEX_META = "annexIndexMeta";
    String ANNEX_NUMBER_META = "annexNumberMeta";
    String ANNEX_TITLE_META = "annexTitleMeta";
    String ANNEX_CLONED_REF_META = "annexClonedRef";
    String ANNEX_NUMBER_PREFACE = "annexNumberPreface";
    String ANNEX_TITLE_PREFACE = "annexTitlePreface";

    List<String> docEEATagList = Arrays.asList(DOC_EEA_RELEVANCE_COVER, DOC_EEA_RELEVANCE_PREFACE, DOC_EEA_RELEVANCE_META);

    Map<String, XmlNodeConfig> getConfig(LeosCategory proposal);

    String getCollectionBodyComponent(String attributeName, List<String> refersToList);

    default Map<String, XmlNodeConfig> getProposalComponentsConfig(LeosCategory leosCategory, String attributeName) {

        Map<String, XmlNodeConfig> componentRefConfig = new HashMap<>();
        String showAs;
        List<String> refersToList = new ArrayList<String>() {{ add("#" + leosCategory.name().toLowerCase()); add("#_" + leosCategory.name().toLowerCase()); }};

        //A better way to set showAs as it might be dependent of lang and docType.
        switch (leosCategory) {
            case BILL:
                showAs = "Regulation of the European Parliament and of the Council";
                refersToList.addAll(Arrays.asList("~DEC", "~REG", "~DIR"));
                break;
            case MEMORANDUM:
                showAs = "Explanatory Memorandum";
                refersToList.add("~EXPL_MEMORANDUM");
                break;
            case STAT_DIGIT_FINANC_LEGIS:
                showAs = "Legislative Financial Statement";
                refersToList.add("~STAT_DIGIT_FINANC_LEGIS");
                break;
            default:
                throw new IllegalArgumentException("Invalid configuration");
        }
        componentRefConfig.put(leosCategory.name() + "_" + attributeName,
                new XmlNodeConfig(getCollectionBodyComponent(attributeName, refersToList), true,
                        Arrays.asList(new XmlNodeConfig.Attribute("showAs", showAs, "documentRef"))));
        return componentRefConfig;
    }

    static List<String> getDocEEATagList() {
        return docEEATagList;
    }
}
