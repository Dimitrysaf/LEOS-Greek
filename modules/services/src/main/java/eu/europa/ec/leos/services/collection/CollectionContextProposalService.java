/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.ExplanatoryContextService;
import eu.europa.ec.leos.services.collection.document.FinancialStatementContextService;
import eu.europa.ec.leos.services.collection.document.MemorandumContextService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Provider;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.domain.repository.LeosCategory.BILL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.MEMORANDUM;
import static eu.europa.ec.leos.domain.repository.LeosCategory.PROPOSAL;

@Service
@Instance(instances = {InstanceType.OS, InstanceType.COMMISSION})
public class CollectionContextProposalService extends CollectionContextService {
    private static final Logger LOG = LoggerFactory.getLogger(CollectionContextProposalService.class);
    private static final String TEMPLATE = "template";
    private static final String ACT_TYPE = "actType";
    private static final String PROCEDURE_TYPE = "procedureType";

    CollectionContextProposalService(TemplateService templateService, PackageService packageService, ProposalService proposalService, CollectionUrlBuilder urlBuilder, Provider<MemorandumContextService> memorandumContextProvider, Provider<BillContextService> billContextProvider, SecurityContext securityContext, Provider<ExplanatoryContextService> explanatoryContextProvider, Provider<FinancialStatementContextService> financialStatementContextProvider, ExplanatoryService explanatoryService, MessageHelper messageHelper) {
        super(templateService, packageService, proposalService, urlBuilder, memorandumContextProvider, billContextProvider, securityContext, explanatoryContextProvider, financialStatementContextProvider, explanatoryService, messageHelper);
    }

    @Override
    public Proposal executeCreateProposal() {
        LOG.trace("Executing 'Create Proposal' use case...");

        LeosPackage leosPackage = this.packageService.createPackage();
        List<CatalogItem> catalogItems;
        Map<String, String> templatePropertiesMap = new HashMap<>();

        Proposal proposalTemplate = cast(categoryTemplateMap.get(PROPOSAL));
        Validate.notNull(proposalTemplate, "Proposal template is required!");

        Option<ProposalMetadata> metadataOption = proposalTemplate.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), "Proposal metadata is required!");

        try {
            catalogItems = templateService.getTemplatesCatalog();
            getTemplateProperties(templatePropertiesMap, catalogItems, metadataOption.get().getTemplate());
        } catch (IOException e) {
            LOG.error("Error occurred while retrieving catalog items " + e.getMessage());
        }

        Validate.notNull(purpose, "Proposal purpose is required!");
        ProposalMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withType(metadataOption.get().getType())
                .withActType(templatePropertiesMap.get(ACT_TYPE))
                .withProcedureType(templatePropertiesMap.get(PROCEDURE_TYPE))
                .withEeaRelevance(eeaRelevance)
                .build();

        Proposal proposal = proposalService.createProposal(proposalTemplate.getId(), leosPackage.getPath(), metadata, null);

        if (cast(categoryTemplateMap.get(MEMORANDUM)) != null) {
            MemorandumContextService memorandumContext = memorandumContextProvider.get();
            memorandumContext.usePackage(leosPackage);
            memorandumContext.useTemplate(cast(categoryTemplateMap.get(MEMORANDUM)));
            memorandumContext.usePurpose(purpose);
            memorandumContext.useActionMessageMap(actionMsgMap);
            memorandumContext.useType(metadata.getType());
            memorandumContext.usePackageTemplate(metadata.getTemplate());
            Memorandum memorandum = memorandumContext.executeCreateMemorandum();
            proposal = proposalService.addComponentRef(proposal, memorandum.getName(), LeosCategory.MEMORANDUM);
        }

        BillContextService billContext = billContextProvider.get();
        billContext.usePackage(leosPackage);
        billContext.useTemplate(cast(categoryTemplateMap.get(BILL)));
        billContext.usePurpose(purpose);
        billContext.useActionMessageMap(actionMsgMap);
        Bill bill = billContext.executeCreateBill();
        proposalService.addComponentRef(proposal, bill.getName(), LeosCategory.BILL);
        return proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    private Map<String, String> getTemplateProperties(Map<String, String> tp, List<CatalogItem> catalogItems, String templateId) {
        CatalogItem matchingItem = catalogItems.stream()
                .filter(item -> item.getKey().equalsIgnoreCase(templateId))
                .findFirst()
                .orElse(null);

        if (matchingItem != null) {
            tp.put(TEMPLATE, matchingItem.getKey());
            return tp;
        }

        boolean skipItr = false;
        for (CatalogItem item : catalogItems) {
            tp = getTemplateProperties(tp, item.getItems(), templateId);
            if (tp.containsKey(TEMPLATE) && !tp.containsKey(ACT_TYPE)) {
                tp.put(ACT_TYPE, item.getKey());
                skipItr = true;
            } else if (tp.containsKey(TEMPLATE) && tp.containsKey(ACT_TYPE) && !tp.containsKey(PROCEDURE_TYPE)) {
                tp.put(PROCEDURE_TYPE, item.getKey());
                skipItr = true;
            }
            if(skipItr) {
                break;
            }
        }
        return tp;
    }

    @Override
    protected void executeUpdateExplanatory(LeosPackage leosPackage, String purpose, Map<ContextActionService, String> actionMsgMap) {
    }

}