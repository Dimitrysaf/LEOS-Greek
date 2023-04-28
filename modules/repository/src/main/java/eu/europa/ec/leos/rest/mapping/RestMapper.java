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
package eu.europa.ec.leos.rest.mapping;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.ConfigDocument;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.MediaDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;

import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static eu.europa.ec.leos.domain.repository.LeosCategory.ANNEX;
import static eu.europa.ec.leos.domain.repository.LeosCategory.BILL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.CONFIG;
import static eu.europa.ec.leos.domain.repository.LeosCategory.COUNCIL_EXPLANATORY;
import static eu.europa.ec.leos.domain.repository.LeosCategory.EXPORT;
import static eu.europa.ec.leos.domain.repository.LeosCategory.LEG;
import static eu.europa.ec.leos.domain.repository.LeosCategory.MEDIA;
import static eu.europa.ec.leos.domain.repository.LeosCategory.MEMORANDUM;
import static eu.europa.ec.leos.domain.repository.LeosCategory.PROPOSAL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.STAT_FINANC_LEGIS;
import static java.util.Collections.singleton;

public class RestMapper {

    private static final Map<Class<? extends LeosDocument>, Set<LeosCategory>> documentCategoryMap;

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
    }

    // FIXME move this mapping somewhere else or implement in better way?!!!
    public static Set<LeosCategory> restCategories(Class<? extends LeosDocument> type) {
        return documentCategoryMap.getOrDefault(type, Collections.emptySet());
    }
}
