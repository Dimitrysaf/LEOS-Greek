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
package eu.europa.ec.leos.services.collection;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
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
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.inject.Provider;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.domain.repository.LeosCategory.BILL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.MEMORANDUM;
import static eu.europa.ec.leos.domain.repository.LeosCategory.PROPOSAL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.STAT_DIGIT_FINANC_LEGIS;

@Service
@Scope("prototype")
@Instance(instances = {InstanceType.OS, InstanceType.COMMISSION})
public class CollectionContextProposalService extends CollectionContextService {
    private static final Logger LOG = LoggerFactory.getLogger(CollectionContextProposalService.class);

    CollectionContextProposalService(TemplateService templateService, PackageService packageService, ProposalService proposalService, CollectionUrlBuilder urlBuilder, Provider<MemorandumContextService> memorandumContextProvider, Provider<BillContextService> billContextProvider, SecurityContext securityContext, Provider<ExplanatoryContextService> explanatoryContextProvider, Provider<FinancialStatementContextService> financialStatementContextProvider, ExplanatoryService explanatoryService, MessageHelper messageHelper) {
        super(templateService, packageService, proposalService, urlBuilder, memorandumContextProvider, billContextProvider, securityContext, explanatoryContextProvider, financialStatementContextProvider, explanatoryService, messageHelper);
    }

    @Override
    public Proposal executeCreateProposal() {
        LOG.trace("Executing 'Create Proposal' use case...");

        this.packageService.useLanguage(this.language);
        this.packageService.useTranslated(this.translated);
        LeosPackage leosPackage = this.packageService.createPackage();

        List<CatalogItem> catalogItems;
        Map<String, String> templatePropertiesMap = new HashMap<>();
        templatePropertiesMap.put(DOCUMENT_MANDATORY_TEMPLATES, "");
        templatePropertiesMap.put(DOCUMENT_DEFAULT_TRUE_TEMPLATES, "");
        templatePropertiesMap.put(DOCUMENT_DEFAULT_FALSE_TEMPLATES, "");
        try {
            catalogItems = templateService.getTemplatesCatalog();
            getTemplateProperties(templatePropertiesMap, catalogItems, templateKey, false);
        } catch (IOException e) {
            LOG.error("Error occurred while retrieving catalog items " + e.getMessage());
        }

        loadTemplates(templatePropertiesMap, DOCUMENT_MANDATORY_TEMPLATES);
        loadTemplates(templatePropertiesMap, DOCUMENT_DEFAULT_TRUE_TEMPLATES);

        Proposal proposalTemplate = cast(categoryTemplateMap.get(PROPOSAL));
        Validate.notNull(proposalTemplate, "Proposal template is required!");

        Option<ProposalMetadata> metadataOption = proposalTemplate.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), "Proposal metadata is required!");

        Validate.notNull(purpose, "Proposal purpose is required!");
        ProposalMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withType(metadataOption.get().getType())
                .withActType(templatePropertiesMap.get(ACT_TYPE))
                .withProcedureType(templatePropertiesMap.get(PROCEDURE_TYPE))
                .withEeaRelevance(eeaRelevance)
                .build();

        String creationOptions = createJsonCreationOptions(templatePropertiesMap);
        metadata.setCreationOptions(creationOptions);

        Proposal proposal = proposalService.createProposal(proposalTemplate.getId(), leosPackage.getPath(), metadata, null);

        Memorandum memorandum = cast(categoryTemplateMap.get(MEMORANDUM));
        if (memorandum != null) {
            MemorandumContextService memorandumContext = memorandumContextProvider.get();
            memorandumContext.usePackage(leosPackage);
            memorandumContext.useTemplate(memorandum);
            memorandumContext.usePurpose(purpose);
            memorandumContext.useActionMessageMap(actionMsgMap);
            memorandumContext.useType(metadata.getType());
            memorandumContext.usePackageTemplate(metadata.getTemplate());
            memorandumContext.usePackageRef(proposal.getMetadata().get().getRef());
            Memorandum memorandumCreated = memorandumContext.executeCreateMemorandum();
            proposal = proposalService.addComponentRef(proposal, memorandumCreated.getName(), LeosCategory.MEMORANDUM);
        }

        Bill bill = cast(categoryTemplateMap.get(BILL));
        if(bill != null) {
            BillContextService billContext = billContextProvider.get();
            billContext.usePackage(leosPackage);
            billContext.useTemplate(bill);
            billContext.usePurpose(purpose);
            billContext.useActionMessageMap(actionMsgMap);
            billContext.usePackageRef(proposal.getMetadata().get().getRef());
            Bill billCreated = billContext.executeCreateBill();
            proposal = proposalService.addComponentRef(proposal, billCreated.getName(), LeosCategory.BILL);
        }

        FinancialStatement financialStatement = cast(categoryTemplateMap.get(STAT_DIGIT_FINANC_LEGIS));
        if (financialStatement != null) {
            FinancialStatementContextService financialStatementContext = financialStatementContextProvider.get();
            financialStatementContext.usePackage(leosPackage);
            String financialStatementTemplate = categoryTemplateMap.get(STAT_DIGIT_FINANC_LEGIS).getName();
            financialStatementContext.useDocTemplate(financialStatementTemplate);
            financialStatementContext.useTitle(messageHelper.getMessage("document.default.financial.statement.title.default." + financialStatementTemplate));
            financialStatementContext.usePurpose(purpose);
            financialStatementContext.useActionMessageMap(actionMsgMap);
            financialStatementContext.useType(metadata.getType());
            financialStatementContext.usePackageTemplate(metadata.getTemplate());
            financialStatementContext.usePackageRef(proposal.getMetadata().get().getRef());
            financialStatementContext.useCollaborators(proposal.getCollaborators());
            FinancialStatement financialStatementCreated = financialStatementContext.executeCreateFinancialStatement();
            proposal = proposalService.addComponentRef(proposal, financialStatementCreated.getName(), LeosCategory.STAT_DIGIT_FINANC_LEGIS);
        }
        return proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    @Override
    protected void executeUpdateExplanatory(LeosPackage leosPackage, String purpose, Map<ContextActionService, String> actionMsgMap) {
    }

}