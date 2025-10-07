package eu.europa.ec.leos.services.ai;

import eu.europa.ec.leos.domain.ai.AnalysisResultDataFlowsGeneration;
import eu.europa.ec.leos.domain.ai.AnalysisResultDataGeneration;
import eu.europa.ec.leos.domain.ai.AnalysisResultDescriptionGeneration;
import eu.europa.ec.leos.domain.ai.AnalysisResultInteroperabilityGeneration;
import eu.europa.ec.leos.domain.ai.AnalysisResultSolutionsGeneration;
import eu.europa.ec.leos.domain.ai.AnalysisResults;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.integration.AIProvider;
import eu.europa.ec.leos.repository.document.BillRepository;
import eu.europa.ec.leos.services.document.FinancialStatementService;
import eu.europa.ec.leos.services.label.ReferenceLabelService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.IdGenerator;
import eu.europa.ec.leos.services.support.XercesUtils;
import org.apache.commons.lang.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

import static eu.europa.ec.leos.services.support.XmlHelper.ID;
import static eu.europa.ec.leos.services.support.XmlHelper.MREF;
import static eu.europa.ec.leos.services.support.XmlHelper.REF;

@Service
public class AIServiceImpl implements AIService {
    private AIProvider provider;
    private final PackageService packageService;
    private final BillRepository billRepository;
    private final ReferenceLabelService referenceLabelService;
    private final FinancialStatementService financialStatementService;
    private final Properties applicationProperties;

    @Autowired
    AIServiceImpl(Optional<AIProvider> provider, PackageService packageService, BillRepository billRepository, ReferenceLabelService referenceLabelService,
                  FinancialStatementService financialStatementService, Properties applicationProperties) {
        this.applicationProperties = applicationProperties;
        provider.ifPresent(p -> this.provider = p);
        this.packageService = packageService;
        this.billRepository = billRepository;
        this.referenceLabelService = referenceLabelService;
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
        Validate.notNull(leosPackage, "leosPackage must not be null");
        List<Bill> docs = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Bill.class,false);
        Validate.isTrue(!docs.isEmpty(), "docs must not be empty");
        Bill bill = billRepository.findBillById(docs.get(0).getId(), Bill.class, true);
        Validate.notNull(bill, "bill must not be null");

        byte[] billContent = bill.getContent().get().getSource().getBytes();
        Document billDoc = XercesUtils.createXercesDocument(billContent, true);
        provider.prepareAnalysis(billContent, bill.getMetadata().get().getRef(), billDoc);
    }

    @Override
    public void prepareAnalysis(final Bill bill) {
        Validate.notNull(bill, "bill must not be null");
        Boolean isFeatureEnabled = applicationProperties.getProperty("leos.ai.enabled", "false").equals("true");
        if (provider == null || !isFeatureEnabled) {
            return;
        }

        byte[] billContent = bill.getContent().get().getSource().getBytes();
        Document billDoc = XercesUtils.createXercesDocument(billContent, true);
        provider.prepareAnalysis(billContent, bill.getMetadata().get().getRef(), billDoc);
    }

    @Override
    public AnalysisResults prefillDigitalDimensionsLFDS(final String proposalRef) {
        Validate.notNull(proposalRef, "proposalRef must not be null");
        Boolean isFeatureEnabled = applicationProperties.getProperty("leos.ai.enabled", "false").equals("true");
        if (provider == null || !isFeatureEnabled) {
            return new AnalysisResults();
        }

        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Validate.notNull(leosPackage, "leosPackage must not be null");
        List<Bill> docs = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Bill.class,false);
        Validate.isTrue(!docs.isEmpty(), "docs must not be empty");
        Bill bill = billRepository.findBillById(docs.get(0).getId(), Bill.class, true);
        Validate.notNull(bill, "bill must not be null");
        List<FinancialStatement> financialStatements = financialStatementService.findFinancialStatementByPackagePath(leosPackage.getPath());
        Validate.notEmpty(financialStatements, "financialStatements must not be empty");
        AnalysisResults analysisResults = provider.prefillDigitalDimensionsLFDS(bill.getMetadata().get().getRef(),
                bill.getLastModificationInstant());

        return generateReferences(analysisResults, bill, financialStatements.get(0).getMetadata().get().getRef());
    }

    private AnalysisResults generateReferences(AnalysisResults analysisResults, Bill bill, String ref) {
        for (AnalysisResultDataFlowsGeneration result : analysisResults.getDataFlowsGenerationResults()) {
            List<String> eIds = new ArrayList<>();
            for (String id :result.eId) {
                final String updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(id),
                        bill.getMetadata().get().getRef(), bill.getContent().get().getSource().getBytes()).get();
                eIds.add(generateMref(bill.getMetadata().get().getRef(), id, updatedLabel));
            }
            result.eId = eIds;
        }
        for (AnalysisResultDescriptionGeneration result : analysisResults.getDescGenerationResults()) {
            final String updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(result.eId),
                    bill.getMetadata().get().getRef(), bill.getContent().get().getSource().getBytes()).get();
            result.eId = generateMref(bill.getMetadata().get().getRef(), result.eId, updatedLabel);
        }
        for (AnalysisResultDataGeneration result : analysisResults.getDataGenerationResults()) {
            List<String> eIds = new ArrayList<>();
            for (String id : result.eId) {
                final String updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(id),
                        bill.getMetadata().get().getRef(), bill.getContent().get().getSource().getBytes()).get();
                eIds.add(generateMref(bill.getMetadata().get().getRef(), id, updatedLabel));
            }
            result.eId = eIds;
        }
        for (AnalysisResultSolutionsGeneration result : analysisResults.getSolutionsGenerationResults()) {
            List<String> eIds = new ArrayList<>();
            for (String id :result.eId) {
                final String updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(id),
                        bill.getMetadata().get().getRef(), bill.getContent().get().getSource().getBytes()).get();
                eIds.add(generateMref(bill.getMetadata().get().getRef(), id, updatedLabel));
            }
            result.eId = eIds;
        }
        for (AnalysisResultInteroperabilityGeneration result : analysisResults.getInterGenerationResults()) {
            List<String> eIds = new ArrayList<>();
            for (String id :result.eId) {
                final String updatedLabel = referenceLabelService.generateLabelStringRef(Arrays.asList(id),
                        bill.getMetadata().get().getRef(), bill.getContent().get().getSource().getBytes()).get();
                eIds.add(generateMref(bill.getMetadata().get().getRef(), id, updatedLabel));
            }
            result.eId = eIds;
        }
        return analysisResults;
    }

    private String generateMref(String billRef, String id, String label) {
        String mref =
                "<" + MREF + " " + ID + "=\"" + IdGenerator.generateId() + "\"><" + REF + " " + ID + "=\"" + IdGenerator.generateId() + "\" href=\"/document" +
                        "/" + billRef
                        + ".xml/~" + id + "\">" + label + "</" + REF + "></" + MREF + ">";
        return mref;
    }
}
