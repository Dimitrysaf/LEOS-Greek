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

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.*;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.document.AnnexContextService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.ExplanatoryContextService;
import eu.europa.ec.leos.services.collection.document.FinancialStatementContextService;
import eu.europa.ec.leos.services.collection.document.MemorandumContextService;
import eu.europa.ec.leos.services.document.ExplanatoryService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.document.SpecificDocumentInformationDTO;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import eu.europa.ec.leos.services.template.CustomTemplateService;
import eu.europa.ec.leos.services.utils.StructureConfigUtils;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import jakarta.inject.Provider;

import java.io.IOException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.domain.repository.LeosCategory.*;
import static eu.europa.ec.leos.domain.repository.LeosCategory.BILL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.MEMORANDUM;
import static eu.europa.ec.leos.domain.repository.LeosCategory.PROPOSAL;
import static eu.europa.ec.leos.domain.repository.LeosCategory.STAT_DIGIT_FINANC_LEGIS;

@Service
@Scope("prototype")
@Instance(instances = {InstanceType.OS, InstanceType.COMMISSION})
public class CollectionContextProposalService extends CollectionContextService {
    private static final Logger LOG = LoggerFactory.getLogger(CollectionContextProposalService.class);

    CollectionContextProposalService(CustomTemplateService customTemplateService, TemplateService templateService, PackageService packageService,
                                     ProposalService proposalService, CollectionUrlBuilder urlBuilder, Provider<MemorandumContextService> memorandumContextProvider,
                                     Provider<BillContextService> billContextProvider, SecurityContext securityContext, Provider<ExplanatoryContextService> explanatoryContextProvider,
                                     Provider<FinancialStatementContextService> financialStatementContextProvider, Provider<AnnexContextService> annexContextProvider,
                                     ExplanatoryService explanatoryService, MessageHelper messageHelper, XmlContentProcessor xmlContentProcessor) {
        super(customTemplateService, templateService, packageService, proposalService, urlBuilder, memorandumContextProvider, billContextProvider, securityContext,
                explanatoryContextProvider, financialStatementContextProvider, annexContextProvider, explanatoryService, messageHelper, xmlContentProcessor);
    }

    @Override
    public Proposal executeCreateProposal() {
        LOG.trace("Executing 'Create Proposal' use case...");

        List<CatalogItem> catalogItems;
        Map<String, String> templatePropertiesMap = new HashMap<>();
        templatePropertiesMap.put(DOCUMENT_MANDATORY_TEMPLATES, "");
        templatePropertiesMap.put(DOCUMENT_DEFAULT_TRUE_TEMPLATES, "");
        templatePropertiesMap.put(DOCUMENT_DEFAULT_FALSE_TEMPLATES, "");
        try {
            catalogItems = templateKey.contains(StructureConfigUtils.CUSTOM_TEMPLATE_SEPARATOR) ?
                    customTemplateService.getCustomTemplatesCatalog(securityContext.getUser().getDefaultEntity().getOrganizationName()) :
                    templateService.getTemplatesCatalog();
            getTemplateProperties(templatePropertiesMap, catalogItems, templateKey, false);
        } catch (IOException e) {
            LOG.error("Error occurred while retrieving catalog items " + e.getMessage());
        }

        loadTemplates(templatePropertiesMap, DOCUMENT_MANDATORY_TEMPLATES);
        loadTemplates(templatePropertiesMap, DOCUMENT_DEFAULT_TRUE_TEMPLATES);

        this.packageService.useLanguage(this.language);
        this.packageService.useTranslated(this.translated);
        this.packageService.useOriginRef(this.originRef);
        LeosPackage leosPackage = this.packageService.createPackage();

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
                .withConfidentiality(confidentiality)
                .withNonSensitivityTitle(nonSensitivityTitle)
                .withCustomTemplateAct(customTemplateAct)
                .withFromCustomTemplate(fromCustomTemplate)
                .withRef(this.originRef)
                .build();

        String creationOptions = createJsonCreationOptions(templatePropertiesMap);
        metadata.setCreationOptions(creationOptions);

        Proposal proposal = proposalService.createProposal(proposalTemplate.getId(), leosPackage.getPath(), metadata, getContent(proposalTemplate));

        Memorandum memorandum = cast(categoryTemplateMap.get(MEMORANDUM));
        if (memorandum != null && isToCreateDocument(categoryTemplateMap.get(MEMORANDUM).getName(), templatePropertiesMap)) {
            MemorandumContextService memorandumContext = memorandumContextProvider.get();
            memorandumContext.usePackage(leosPackage);
            memorandumContext.useTemplate(memorandum);
            memorandumContext.usePurpose(purpose);
            memorandumContext.useActionMessageMap(actionMsgMap);
            memorandumContext.useType(metadata.getType());
            memorandumContext.usePackageTemplate(metadata.getTemplate());
            memorandumContext.usePackageRef(proposal.getMetadata().get().getRef());
            memorandumContext.useCustomTemplateAct(customTemplateAct);
            memorandumContext.useFromCustomTemplate(fromCustomTemplate);
            memorandumContext.useOriginRef(idsAndUrlsHolder.getMemorandumId());

            //Repetitive Acts
            List<XmlDocument> doc = categoryExistingDocuments.get(MEMORANDUM);
            if (doc != null && !doc.isEmpty() && doc.get(0).getContent().isDefined()) {
                memorandumContext.useExistingContent(doc.get(0).getContent().get().getSource().getBytes(), true);
            }

            Memorandum memorandumCreated = memorandumContext.executeCreateMemorandum();

            SpecificDocumentInformationDTO specificDocumentInformation = xmlContentProcessor.getSpecificDocumentInformation(memorandumCreated.getContent().get().getSource().getBytes());

            proposal = proposalService.addComponentRef(proposal, memorandumCreated.getName(), LeosCategory.MEMORANDUM, specificDocumentInformation.getRefersToOfDocument(), specificDocumentInformation.getShowAs());
            String memorandumRef = memorandumCreated.getMetadata().get().getRef();
            this.idsAndUrlsHolder.setMemorandumId(memorandumRef);
        }

        Bill bill = cast(categoryTemplateMap.get(BILL));
        if(bill != null && isToCreateDocument(categoryTemplateMap.get(BILL).getName(), templatePropertiesMap)) {
            BillContextService billContext = billContextProvider.get();
            billContext.usePackage(leosPackage);
            billContext.useTemplate(bill);
            billContext.usePurpose(purpose);
            billContext.useEeaRelevance(eeaRelevance);
            billContext.useActionMessageMap(actionMsgMap);
            billContext.useCustomTemplateAct(customTemplateAct);
            billContext.useFromCustomTemplate(fromCustomTemplate);
            billContext.usePackageRef(proposal.getMetadata().get().getRef());
            billContext.useOriginRef(idsAndUrlsHolder.getBillId());

            // Repetitive Acts
            List<XmlDocument> sourceDocuments = categoryExistingDocuments.get(BILL);
            if (sourceDocuments != null && !sourceDocuments.isEmpty()) {
                XmlDocument firstDocument = sourceDocuments.get(0);
                if (firstDocument != null && firstDocument.getContent().isDefined()) {
                    billContext.useExistingContent(firstDocument.getContent().get().getSource().getBytes(), true);
                }
            }

            Bill billCreated = billContext.executeCreateBill();

            SpecificDocumentInformationDTO specificDocumentInformation = xmlContentProcessor.getSpecificDocumentInformation(billCreated.getContent().get().getSource().getBytes());
            String billRef = billCreated.getMetadata().get().getRef();
            this.idsAndUrlsHolder.setBillId(billRef);

            // Repetitive Acts - Annexes
            List<XmlDocument> annex = categoryExistingDocuments.get(ANNEX);
            if (annex != null && !annex.isEmpty()) {
                BillMetadata billMetadata = billCreated.getMetadata().getOrError(() -> "Bill metadata is required!");
                billContext.useTemplate(billCreated);

                annex.sort(Comparator.comparingInt(doc ->
                        ((AnnexMetadata) doc.getMetadata().get()).getIndex()
                ));

                for (XmlDocument xmlDocument : annex) {
                    CatalogItem templateItem;
                    try {
                        templateItem = templateService.getTemplateItem(billMetadata.getDocTemplate());
                        billContext.useAnnexTemplate(templateItem.getItems().get(0).getId());
                        billContext.useExistingAnnexTitle(((AnnexMetadata) xmlDocument.getMetadata().get()).getTitle());
                        billContext.useExistingAnnexOrder(((AnnexMetadata) xmlDocument.getMetadata().get()).getIndex());
                        billContext.useExistingAnnexContent(xmlDocument.getContent().get().getSource().getBytes());
                        billContext.executeCreateBillAnnex();
                    } catch (IOException e) {
                        LOG.error("Error occurred while retrieving template " + metadata.getDocTemplate());
                    }
                }
            }

            proposal = proposalService.addComponentRef(proposal, billCreated.getName(), LeosCategory.BILL, specificDocumentInformation.getRefersToOfDocument(), specificDocumentInformation.getShowAs());
        }

        // Financial Statement
        FinancialStatement financialStatement = cast(categoryTemplateMap.get(STAT_DIGIT_FINANC_LEGIS));
        List<XmlDocument> sourceFinancialDocuments = categoryExistingDocuments.get(STAT_DIGIT_FINANC_LEGIS);

        if ((sourceFinancialDocuments != null && !sourceFinancialDocuments.isEmpty() && canDocumentBeAdded(sourceFinancialDocuments.get(0).getMetadata().get().getDocTemplate(), templatePropertiesMap))
                || (financialStatement != null && isToCreateDocument(categoryTemplateMap.get(STAT_DIGIT_FINANC_LEGIS).getName(), templatePropertiesMap))) {
            FinancialStatementContextService financialStatementContext = financialStatementContextProvider.get();
            financialStatementContext.usePackage(leosPackage);
            String financialStatementTemplate = financialStatement == null ? sourceFinancialDocuments.get(0).getMetadata().get().getDocTemplate() : categoryTemplateMap.get(STAT_DIGIT_FINANC_LEGIS).getName();
            financialStatementContext.useDocTemplate(financialStatementTemplate);
            financialStatementContext.useTitle(messageHelper.getMessage("document.default.financial.statement.title.default." + financialStatementTemplate));
            financialStatementContext.usePurpose(purpose);
            financialStatementContext.useActionMessageMap(actionMsgMap);
            financialStatementContext.useType(metadata.getType());
            financialStatementContext.usePackageTemplate(metadata.getTemplate());
            financialStatementContext.usePackageRef(proposal.getMetadata().get().getRef());
            financialStatementContext.useCollaborators(proposal.getCollaborators());
            financialStatementContext.useCustomTemplateAct(customTemplateAct);
            financialStatementContext.useFromCustomTemplate(fromCustomTemplate);
            financialStatementContext.useOriginRef(idsAndUrlsHolder.getFinancialStatementId());

            // Repetitive Act
            List<XmlDocument> sourceDocuments = categoryExistingDocuments.get(STAT_DIGIT_FINANC_LEGIS);
            if (sourceDocuments != null && !sourceDocuments.isEmpty()) {
                XmlDocument firstDocument = sourceDocuments.get(0);
                if (firstDocument != null && firstDocument.getContent().isDefined()) {
                    financialStatementContext.useExistingContent(firstDocument.getContent().get().getSource().getBytes(), true);
                }
            }

            FinancialStatement financialStatementCreated = financialStatementContext.executeCreateFinancialStatement();

            SpecificDocumentInformationDTO specificDocumentInformation = xmlContentProcessor.getSpecificDocumentInformation(financialStatementCreated.getContent().get().getSource().getBytes());

            proposal = proposalService.addComponentRef(proposal, financialStatementCreated.getName(), LeosCategory.STAT_DIGIT_FINANC_LEGIS, specificDocumentInformation.getRefersToOfDocument(), specificDocumentInformation.getShowAs());
            String financialStatementRef = financialStatementCreated.getMetadata().get().getRef();
            this.idsAndUrlsHolder.setFinancialStatementId(financialStatementRef);
        }
        return proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    private boolean isToCreateDocument(String templateName, Map<String, String> templatePropertiesMap) {
        return templatePropertiesMap.get(DOCUMENT_MANDATORY_TEMPLATES).contains(templateName)
                || templatePropertiesMap.get(DOCUMENT_DEFAULT_TRUE_TEMPLATES).contains(templateName)
                || categoryTemplateMap.values().stream().anyMatch(doc -> templateName.equals(doc.getName()));
    }

    private boolean canDocumentBeAdded(String templateName, Map<String, String> templatePropertiesMap) {
        if (templatePropertiesMap.get(DOCUMENT_MANDATORY_TEMPLATES).contains(templateName)) {
            return true;
        }
        if (templatePropertiesMap.get(DOCUMENT_DEFAULT_TRUE_TEMPLATES).contains(templateName)) {
            return true;
        }
        if (templatePropertiesMap.get(DOCUMENT_DEFAULT_FALSE_TEMPLATES).contains(templateName)) {
            return true;
        }
        return false;
    }

    @Override
    protected void executeUpdateExplanatory(LeosPackage leosPackage, String purpose, Map<ContextActionService, String> actionMsgMap) {
    }

}
