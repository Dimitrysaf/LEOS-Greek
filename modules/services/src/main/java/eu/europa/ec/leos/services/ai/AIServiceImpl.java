package eu.europa.ec.leos.services.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.domain.ai.AnalysisResults;
import eu.europa.ec.leos.domain.ai.AnalysisStatus;
import eu.europa.ec.leos.domain.ai.LFDSSections;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.integration.AIProvider;
import eu.europa.ec.leos.repository.document.BillRepository;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.document.util.DocumentViewService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.utils.AIUtils;
import io.atlassian.fugue.Pair;
import org.apache.commons.lang.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

@Service
public class AIServiceImpl implements AIService {
    private static final Logger LOG = LoggerFactory.getLogger(AIServiceImpl.class);

    private AIProvider provider;
    private final PackageService packageService;
    private final ProposalService proposalService;
    private final BillRepository billRepository;
    private final FinancialStatementService financialStatementService;
    private final Properties applicationProperties;
    private final AIUtils aiUtils;

    @Autowired
    AIServiceImpl(Optional<AIProvider> provider, PackageService packageService, BillRepository billRepository,
                  FinancialStatementService financialStatementService, Properties applicationProperties, ProposalService proposalService, AIUtils aiUtils) {
        this.applicationProperties = applicationProperties;
        this.aiUtils = aiUtils;
        provider.ifPresent(p -> this.provider = p);
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.billRepository = billRepository;
        this.financialStatementService = financialStatementService;
    }

    @Override
    public void prepareAnalysis(final String proposalRef) {
        Validate.notNull(proposalRef, "proposalRef must not be null");
        Boolean isFeatureEnabled = applicationProperties.getProperty("leos.ai.enabled", "false").equals("true");
        if (provider == null || !isFeatureEnabled) {
            return;
        }

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        Validate.notNull(leosPackage, "leosPackage must not be null");
        List<Bill> docs = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Bill.class,false);
        Validate.isTrue(!docs.isEmpty(), "docs must not be empty");
        Bill bill = billRepository.findBillById(docs.get(0).getId(), Bill.class, true);
        Validate.notNull(bill, "bill must not be null");
        ProposalMetadata proposalMetadata = proposal.getMetadata().get();
        proposalMetadata.setAiValues("-");
        proposalService.updateProposal(proposal, proposalMetadata);

        byte[] billContent = bill.getContent().get().getSource().getBytes();
        Document billDoc = XercesUtils.createXercesDocument(billContent, true);
        provider.prepareAnalysis(billContent, bill.getMetadata().get().getRef(), billDoc);
    }

    @Override
    public AnalysisStatus getAnalysisStatus(final String proposalRef) {
        Boolean isFeatureEnabled = applicationProperties.getProperty("leos.ai.enabled", "false").equals("true");
        if (provider == null || !isFeatureEnabled) {
            return AnalysisStatus.NOT_YET_IMPORTED;
        }

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String aiMetadata = proposal.getMetadata().get().getAiValues();
        Validate.notNull(leosPackage, "leosPackage must not be null");
        List<Bill> docs = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Bill.class,false);
        Validate.isTrue(!docs.isEmpty(), "docs must not be empty");
        Bill bill = billRepository.findBillById(docs.get(0).getId(), Bill.class, true);
        Validate.notNull(bill, "bill must not be null");
        Pair<AnalysisStatus, LinkedHashMap<String, String>> result = provider.getAnalysisStatus(bill.getMetadata().get().getRef(), aiMetadata);
        try {
            String resultAiMetadata = new ObjectMapper().writer().withDefaultPrettyPrinter().writeValueAsString(result.right());
            if (!resultAiMetadata.equals(aiMetadata)) {
                ProposalMetadata proposalMetadata = proposal.getMetadata().get();
                proposalMetadata.setAiValues(new ObjectMapper().writer().withDefaultPrettyPrinter().writeValueAsString(result.right()));
                proposalService.updateProposal(proposal, proposalMetadata);
            }
        } catch (JsonProcessingException e) {
            LOG.debug("Couldn't update metadata ai values");
        }
        return result.left();
    }

    @Override
    public FinancialStatement prefillDigitalDimensionsLFDS(final String proposalRef, final String analysisType) throws Exception {
        Validate.notNull(proposalRef, "proposalRef must not be null");

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Proposal proposal = proposalService.findProposalByRef(proposalRef);
        String aiMetadata = proposal.getMetadata().get().getAiValues();
        Validate.notNull(leosPackage, "leosPackage must not be null");
        List<Bill> docs = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Bill.class,false);
        Validate.isTrue(!docs.isEmpty(), "docs must not be empty");
        Bill bill = billRepository.findBillById(docs.get(0).getId(), Bill.class, true);
        Validate.notNull(bill, "bill must not be null");
        List<FinancialStatement> financialStatements = financialStatementService.findFinancialStatementByPackagePath(leosPackage.getPath());
        Validate.notEmpty(financialStatements, "financialStatements must not be empty");
        FinancialStatement financialStatement = financialStatements.get(0);
        Boolean isFeatureEnabled = applicationProperties.getProperty("leos.ai.enabled", "false").equals("true");
        if (provider == null || !isFeatureEnabled) {
            return financialStatement;
        }
        AnalysisResults analysisResults;
        if (analysisType != null) {
            LFDSSections section = LFDSSections.valueOf(analysisType);
            analysisResults = provider.prefillDigitalDimensionsLFDS(bill.getMetadata().get().getRef(), section, aiMetadata);
        } else {
            analysisResults = provider.prefillAllDigitalDimensionsLFDS(bill.getMetadata().get().getRef(), aiMetadata);
        }

        byte[] newContent = this.aiUtils.insertPrefillElementsInXml(analysisResults, financialStatement.getContent().get().getSource().getBytes(), bill,
                financialStatement.getMetadata().get().getRef());
        financialStatement = this.financialStatementService.updateFinancialStatement(financialStatement.getId(), newContent);
        return financialStatement;
    }
}
