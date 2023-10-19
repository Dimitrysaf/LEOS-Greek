/*
 * Copyright 2017 European Commission
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
package eu.europa.ec.leos.repository.mapping;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.document.*;

import java.util.*;

import static eu.europa.ec.leos.domain.repository.LeosCategory.*;
import static java.util.Collections.singleton;

public class LeosMapper {

    private static final Map<Class<? extends LeosDocument>, Set<LeosCategory>> documentCategoryMap;
    private static final Map<Class<? extends LeosDocument>, String> documentPrimaryTypeMap;
    private static final Map<LeosCategory, Class<? extends LeosDocument>> categoryDocumentMap;

    static {
        documentCategoryMap = new HashMap<>();

        // FIXME move this mapping somewhere else or implement in better way?!!!
        documentCategoryMap.put(LeosDocument.class, EnumSet.of(PROPOSAL, MEMORANDUM, COUNCIL_EXPLANATORY, BILL, ANNEX, MEDIA, CONFIG, LEG, EXPORT, STAT_FINANC_LEGIS));
        documentCategoryMap.put(XmlDocument.class, EnumSet.of(PROPOSAL, MEMORANDUM, COUNCIL_EXPLANATORY, BILL, ANNEX, STAT_FINANC_LEGIS));
        documentCategoryMap.put(Proposal.class, singleton(PROPOSAL));
        documentCategoryMap.put(Memorandum.class, singleton(MEMORANDUM));
        documentCategoryMap.put(Explanatory.class, singleton(COUNCIL_EXPLANATORY));
        documentCategoryMap.put(Bill.class, singleton(BILL));
        documentCategoryMap.put(Annex.class, singleton(ANNEX));
        documentCategoryMap.put(FinancialStatement.class, singleton(STAT_FINANC_LEGIS));
        documentCategoryMap.put(MediaDocument.class, singleton(MEDIA));
        documentCategoryMap.put(ConfigDocument.class, singleton(CONFIG));
        documentCategoryMap.put(LegDocument.class, singleton(LEG));
        documentCategoryMap.put(ExportDocument.class, singleton(EXPORT));

        categoryDocumentMap = new HashMap<>();
        // FIXME move this mapping somewhere else or implement in better way?!!!
        categoryDocumentMap.put(PROPOSAL, Proposal.class);
        categoryDocumentMap.put(MEMORANDUM, Memorandum.class);
        categoryDocumentMap.put(COUNCIL_EXPLANATORY, Explanatory.class);
        categoryDocumentMap.put(BILL, Bill.class);
        categoryDocumentMap.put(ANNEX, Annex.class);
        categoryDocumentMap.put(STAT_FINANC_LEGIS, FinancialStatement.class);
        categoryDocumentMap.put(MEDIA, MediaDocument.class);
        categoryDocumentMap.put(CONFIG, ConfigDocument.class);
        categoryDocumentMap.put(LEG, LegDocument.class);
        categoryDocumentMap.put(EXPORT, ExportDocument.class);

        // FIXME move this mapping somewhere else or implement in better way?!!!
        documentPrimaryTypeMap = new HashMap<>();
        documentPrimaryTypeMap.put(LeosDocument.class, "leos:document");
        documentPrimaryTypeMap.put(XmlDocument.class, "leos:xml");
        documentPrimaryTypeMap.put(Proposal.class, "leos:xml");
        documentPrimaryTypeMap.put(Memorandum.class, "leos:xml");
        documentPrimaryTypeMap.put(Explanatory.class, "leos:xml");
        documentPrimaryTypeMap.put(Bill.class, "leos:xml");
        documentPrimaryTypeMap.put(Annex.class, "leos:xml");
        documentPrimaryTypeMap.put(FinancialStatement.class, "leos:xml");
        documentPrimaryTypeMap.put(MediaDocument.class, "leos:media");
        documentPrimaryTypeMap.put(ConfigDocument.class, "leos:config");
        documentPrimaryTypeMap.put(LegDocument.class, "leos:leg");
        documentPrimaryTypeMap.put(ExportDocument.class, "leos:export");
    }

    // FIXME move this mapping somewhere else or implement in better way?!!!
    public static String leosPrimaryType(Class<? extends LeosDocument> type) {
        String result = documentPrimaryTypeMap.get(type);
        if (result == null) {
            throw new IllegalArgumentException("Unknown primary type!");
        }
        return result;
    }

    // FIXME move this mapping somewhere else or implement in better way?!!!
    public static Set<LeosCategory> leosCategories(Class<? extends LeosDocument> type) {
        return documentCategoryMap.getOrDefault(type, Collections.emptySet());
    }

    public static Class<? extends LeosDocument> leosType(LeosCategory category) {
        return categoryDocumentMap.getOrDefault(category, LeosDocument.class);
    }
}
