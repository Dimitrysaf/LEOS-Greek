/*
 * Copyright 2018 European Commission
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

import cool.graph.cuid.Cuid;
import eu.europa.ec.leos.domain.cmis.LeosCategory;
import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.common.VersionType;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Explanatory;
import eu.europa.ec.leos.domain.cmis.document.FinancialStatement;
import eu.europa.ec.leos.domain.cmis.document.Memorandum;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.cmis.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
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
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.domain.cmis.LeosCategory.BILL;
import static eu.europa.ec.leos.domain.cmis.LeosCategory.COUNCIL_EXPLANATORY;
import static eu.europa.ec.leos.domain.cmis.LeosCategory.MEMORANDUM;
import static eu.europa.ec.leos.domain.cmis.LeosCategory.PROPOSAL;
import static eu.europa.ec.leos.domain.cmis.LeosCategory.STAT_FINANC_LEGIS;

@Service
@Instance(InstanceType.COUNCIL)
public class CollectionContextMandateService extends CollectionContextService {
    private static final Logger LOG = LoggerFactory.getLogger(CollectionContextMandateService.class);

    CollectionContextMandateService(TemplateService templateService, PackageService packageService, ProposalService proposalService, CollectionUrlBuilder urlBuilder, Provider<MemorandumContextService> memorandumContextProvider, Provider<BillContextService> billContextProvider, SecurityContext securityContext, Provider<ExplanatoryContextService> explanatoryContextProvider, Provider<FinancialStatementContextService> financialStatementContextProvider, ExplanatoryService explanatoryService, MessageHelper messageHelper) {
        super(templateService, packageService, proposalService, urlBuilder, memorandumContextProvider, billContextProvider, securityContext, explanatoryContextProvider, financialStatementContextProvider, explanatoryService, messageHelper);
    }

    @Override
    public Proposal executeCreateProposal() {
        LOG.trace("Executing 'Create Proposal' use case...");
        LeosPackage leosPackage = packageService.createPackage();
        Proposal proposalTemplate = cast(categoryTemplateMap.get(PROPOSAL));
        proposal = proposal == null ? proposalTemplate : proposal;
        Validate.notNull(proposalTemplate, "Proposal template is required!");
        Option<ProposalMetadata> metadataOption = proposalTemplate.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), "Proposal metadata is required!");
        Validate.notNull(purpose, "Proposal purpose is required!");
        ProposalMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .withEeaRelevance(eeaRelevance)
                .build();

        String explanatoryTemplate = categoryTemplateMap.get(COUNCIL_EXPLANATORY).getName();
        ExplanatoryContextService explanatoryContext = explanatoryContextProvider.get();
        explanatoryContext.usePackage(leosPackage);
        explanatoryContext.useCollaborators(proposalTemplate.getCollaborators());
        Explanatory explanatory = getExplanatory(metadata, explanatoryContext, explanatoryTemplate, true);

        Proposal proposal = proposalService.createProposal(proposalTemplate.getId(), leosPackage.getPath(), metadata, null);
        proposalService.addComponentRef(proposal, explanatory.getName(), COUNCIL_EXPLANATORY);
        return proposalService.createVersion(proposal.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    private Explanatory getExplanatory(ProposalMetadata metadata, ExplanatoryContextService explanatoryContext, String template,
                                       boolean createProposal) {
        explanatoryContext.useTemplate(template);
        explanatoryContext.usePurpose(purpose);
        explanatoryContext.useType(metadata.getType());
        explanatoryContext.useTitle(messageHelper.getMessage("document.default.explanatory.title.default." + template));
        explanatoryContext.useActionMessageMap(actionMsgMap);
        explanatoryContext.useCollaborators(proposal.getCollaborators());
        Explanatory explanatory = explanatoryContext.executeCreateExplanatory();
        return explanatory;
    }


}