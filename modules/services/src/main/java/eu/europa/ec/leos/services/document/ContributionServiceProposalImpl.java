package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.common.ErrorCode;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.common.Result;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.ContributionsUtil;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.util.LeosDomainUtil;
import eu.europa.ec.leos.vo.contribution.ContributionLegDocumentVO;
import io.atlassian.fugue.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static eu.europa.ec.leos.services.support.XmlHelper.ANNEX;
import static eu.europa.ec.leos.services.support.XmlHelper.BILL;
import static eu.europa.ec.leos.services.support.XmlHelper.FINANCIAL_STATEMENT;
import static eu.europa.ec.leos.services.support.XmlHelper.MEMORANDUM;
import static eu.europa.ec.leos.services.support.XmlHelper.PROPOSAL;
import static eu.europa.ec.leos.services.support.XmlHelper.STAT_FINANC_LEGIS;
import static eu.europa.ec.leos.util.LeosDomainUtil.CMIS_PROPERTY_SPLITTER;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ContributionServiceProposalImpl<T> implements ContributionService {

    private static final Logger LOG = LoggerFactory.getLogger(ContributionServiceProposalImpl.class);

    private final ProposalService proposalService;
    private PackageService packageService;
    private BillService billService;
    private AnnexService annexService;
    private MemorandumService memorandumService;
    private LegService legService;
    private final LeosRepository leosRepository;
    private final MessageHelper messageHelper;
    private final XmlContentProcessor xmlContentProcessor;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;

    List<String> BILL_DOC_TYPES = new ArrayList<>(Arrays.asList("REG", "DIR", "DEC"));
    private static final String ANNEX_DOC_TYPE = "ANNEX";
    private static final String MEMORANDUM_DOC_TYPE = "EXPL_MEMORANDUM";

    @Autowired
    public ContributionServiceProposalImpl(LeosRepository leosRepository, MessageHelper messageHelper,
                                           ProposalService proposalService, PackageService packageService,
                                           BillService billService, AnnexService annexService,
                                           MemorandumService memorandumService, LegService legService, XmlContentProcessor xmlContentProcessor, RepositoryPropertiesMapper repositoryPropertiesMapper) {
        this.leosRepository = leosRepository;
        this.messageHelper = messageHelper;
        this.proposalService = proposalService;
        this.packageService = packageService;
        this.billService = billService;
        this.annexService = annexService;
        this.memorandumService = memorandumService;
        this.legService = legService;
        this.xmlContentProcessor = xmlContentProcessor;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
    }

    @Override
    public <T extends LeosDocument> T findVersionByVersionedReference(String versionedReference, Class<T> filterType) {
        return this.findVersionByVersionedReference(versionedReference, filterType, true);
    }

    private <T extends LeosDocument> T findVersionByVersionedReference(String versionedReference, Class<T> filterType, boolean filterVersion) {
        int lastIndex = versionedReference.lastIndexOf(filterVersion? "_" : ".");
        if (lastIndex != -1) {
            String ref = versionedReference.substring(0, lastIndex);
            String versionLabel = versionedReference.substring(lastIndex + 1);
            return leosRepository.findDocumentByVersion(filterType, ref, versionLabel);
        }
        throw new RuntimeException("Unable to retrieve the version's document");
    }

    private String getDocumentName(String versionedReference) {
        int lastIndex = versionedReference.lastIndexOf("-");
        if (lastIndex != -1) {
            return versionedReference.substring(0, lastIndex).concat(".xml");
        }
        throw new RuntimeException("Unable to retrieve the document name");
    }

    @Override
    public <T extends XmlDocument> List<ContributionVO> getDocumentContributions(String documentRef, int annexIndex, Class<T> filterType) {
        List<ContributionLegDocumentVO<T>> documentVersions = new ArrayList<>();
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(documentRef, filterType);
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        final List<String> clonedMilestoneIds = proposal.getClonedMilestoneIds();
        for (String clonedMilestoneId : clonedMilestoneIds) {
            String proposalRef = clonedMilestoneId.split(LeosDomainUtil.CMIS_PROPERTY_SPLITTER)[0];
            String legName = clonedMilestoneId.split(LeosDomainUtil.CMIS_PROPERTY_SPLITTER)[1];
            Proposal clonedProposal;
            try {
                clonedProposal = leosRepository.findDocumentByRef(proposalRef, Proposal.class);
            } catch (Exception e) {
                LOG.error("Error retrieving cloned proposal with reference " + proposalRef, e.getMessage());
                continue;
            }
            LeosPackage clonedPackage = packageService.findPackageByDocumentRef(clonedProposal.getMetadata().get().getRef(), Proposal.class);
            LegDocument legDocument = packageService.findDocumentByPackagePathAndName(clonedPackage.getPath(), legName, LegDocument.class);
            List<String> containedDocuments = legDocument.getContainedDocuments();
            Map<String, Object> legContent;
            try {
                legContent = ZipPackageUtil.unzipByteArray(legDocument.getContent().getOrNull().getSource().getBytes());
            } catch (IOException e) {
                LOG.error("Error unzipping leg file " + legName + " for cloned proposal with reference " + proposalRef, e);
                continue;
            }
            if (filterType.getSimpleName().equalsIgnoreCase(ANNEX)) {
                Stream<String> filesToFind = containedDocuments.stream()
                        .filter(containedFile -> containedFile.startsWith(ANNEX_DOC_TYPE + "-"));
                filesToFind.forEach(annexVersionAndName -> {
                    Annex annex = (Annex) findVersionByVersionedReference(annexVersionAndName, filterType);
                    if (annex != null && annex.getMetadata().get().getIndex() == annexIndex) {
                        String annexName = annex.getName();
                        byte[] annexContent = (byte[]) legContent.get(annexName);
                        ContributionLegDocumentVO<Annex> annexContributionLegDocumentVO = new ContributionLegDocumentVO<>(clonedProposal.getOriginRef(), annex,
                                annexContent, legName, annexName);
                        documentVersions.add((ContributionLegDocumentVO<T>) annexContributionLegDocumentVO);
                    }
                });
            } else if(filterType.getSimpleName().equalsIgnoreCase(BILL)) {
                Optional<String> fileToFind = containedDocuments.stream()
                        .filter(containedFile-> {
                            String fileType = containedFile.substring(0, containedFile.indexOf("-"));
                            return BILL_DOC_TYPES.contains(fileType);
                        }).findFirst();
                if (fileToFind.isPresent()) {
                    Bill doc = (Bill) findVersionByVersionedReference(fileToFind.get(), filterType);
                    if (doc != null) {
                        String documentName = doc.getName();
                        byte[] docContent = (byte[])legContent.get(documentName);
                        ContributionLegDocumentVO<Bill> billContributionLegDocumentVO = new ContributionLegDocumentVO<>(clonedProposal.getOriginRef(), doc,
                                docContent, legName, documentName);
                        documentVersions.add((ContributionLegDocumentVO<T>) billContributionLegDocumentVO);
                    }
                }
            } else if(filterType.getSimpleName().equalsIgnoreCase(MEMORANDUM)) {
                Optional<String> fileToFind = containedDocuments.stream()
                        .filter(containedFile -> containedFile.startsWith(MEMORANDUM_DOC_TYPE + "-"))
                        .findFirst();
                if (fileToFind.isPresent()) {
                    Memorandum doc = (Memorandum) findVersionByVersionedReference(fileToFind.get(), filterType);
                    if (doc != null) {
                        String documentName = doc.getName();
                        byte[] docContent = (byte[])legContent.get(documentName);
                        ContributionLegDocumentVO<Memorandum> contributionLegDocumentVO = new ContributionLegDocumentVO<>(clonedProposal.getOriginRef(), doc,
                                docContent, legName, documentName);
                        documentVersions.add((ContributionLegDocumentVO<T>)contributionLegDocumentVO);
                    }
                }
            } else if(filterType.getSimpleName().equalsIgnoreCase(FINANCIAL_STATEMENT)) {
                Optional<String> fileToFind = containedDocuments.stream()
                        .filter(containedFile -> containedFile.startsWith(STAT_FINANC_LEGIS + "-"))
                        .findFirst();
                if (fileToFind.isPresent()) {
                    FinancialStatement doc = (FinancialStatement) findVersionByVersionedReference(fileToFind.get(), filterType);
                    if (doc != null) {
                        String documentName = doc.getName();
                        byte[] docContent = (byte[])legContent.get(documentName);
                        ContributionLegDocumentVO<FinancialStatement> financialStatementContributionLegDocumentVO = new ContributionLegDocumentVO<>(clonedProposal.getOriginRef(), doc,
                                docContent, legName, documentName);
                        documentVersions.add((ContributionLegDocumentVO<T>) financialStatementContributionLegDocumentVO);
                    }
                }
            }else if(filterType.getSimpleName().equalsIgnoreCase(PROPOSAL)) {
                Proposal doc = clonedProposal;
                if (doc != null) {
                    String documentName = doc.getName();
                    byte[] docContent = (byte[]) legContent.get(documentName);
                    XPathCatalog catalog = new XPathCatalog();
                    doc = proposalService.findProposalVersion(xmlContentProcessor.getElementValue(docContent, catalog.getXPathObjectId(), true));
                    ContributionLegDocumentVO<Proposal> proposalContributionLegDocumentVO = new ContributionLegDocumentVO<>(clonedProposal.getOriginRef(), doc,
                            docContent, legName, documentName);
                    documentVersions.add((ContributionLegDocumentVO<T>) proposalContributionLegDocumentVO);
                }
            }
        }
        return ContributionsUtil.buildContributionsVO(documentVersions, messageHelper);
    }

    @Override
    public Result<?> updateContributionStatusAfterContributionDone(String cloneProposalRef, String cloneLegFileName,
                                                                   CloneProposalMetadataVO cloneProposalMetadataVO) {
        Proposal updatedProposal;
        LegDocument updatedLegDocument;
        try {
            Proposal clonedProposal = proposalService.findProposalByRef(cloneProposalRef);
            Proposal originalProposal = proposalService.findProposalByRef(clonedProposal.getClonedFrom());
            LeosPackage clonedPackage = packageService.findPackageByDocumentRef(clonedProposal.getMetadata().get().getRef(), Proposal.class);
            LegDocument legDocument = packageService.findDocumentByPackagePathAndName(clonedPackage.getPath(), cloneLegFileName,
                    LegDocument.class);
            List<String> containedDocuments = legDocument.getContainedDocuments();

            //update cloned proposal properties
            Map<String, Object> clonedProperties = new HashMap<>();
            clonedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.REVISION_STATUS), cloneProposalMetadataVO.getRevisionStatus());
            proposalService.updateProposal(clonedProposal.getMetadata().get().getRef(), clonedProposal.getId(), clonedProperties);

            //update Bill metadata
            clonedProperties = new HashMap<>();
            Optional<String> billFile = containedDocuments.stream()
                    .filter(containedFile-> {
                        String fileType = containedFile.substring(0, containedFile.indexOf("-"));
                        return BILL_DOC_TYPES.contains(fileType);
                    }).findFirst();
            if(billFile.isPresent()) {
                Bill clonedBill = findVersionByVersionedReference(billFile.get(), Bill.class);
                clonedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS),
                        ContributionVO.ContributionStatus.RECEIVED.getValue());
                billService.updateBill(clonedBill.getMetadata().get().getRef(), clonedBill.getId(), clonedProperties, true);
            }
            //update Memorandum metadata
            clonedProperties = new HashMap<>();
            Optional<String> memorandumFile = containedDocuments.stream()
                    .filter(containedFile-> containedFile.startsWith(MEMORANDUM_DOC_TYPE)).findFirst();
            if(memorandumFile.isPresent()) {
                Memorandum clonedMemo = findVersionByVersionedReference(memorandumFile.get(), Memorandum.class);
                clonedProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS),
                        ContributionVO.ContributionStatus.RECEIVED.getValue());
                memorandumService.updateMemorandum(clonedMemo.getMetadata().get().getRef(), clonedMemo.getId(), clonedProperties, true);
            }
            //update Annex metadata
            Stream<String> annexFile = containedDocuments.stream()
                    .filter(containedFile -> containedFile.startsWith(ANNEX_DOC_TYPE));
            annexFile.forEach(annexVersionAndName -> {
                Annex clonedAnnex = findVersionByVersionedReference(annexVersionAndName, Annex.class);
                Map<String, Object>  annexProperties = new HashMap<>();
                annexProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS),
                        ContributionVO.ContributionStatus.RECEIVED.getValue());
                annexService.updateAnnex(clonedAnnex.getMetadata().get().getRef(), clonedAnnex.getId(), annexProperties, true);
            });

            // Update cloned proposal
            proposalService.updateProposal(clonedProposal.getMetadata().get().getRef(), clonedProposal.getId(), clonedProperties, true);

            //update original proposal properties
            Map<String, Object> properties = new HashMap<>();
            List<String> clonedMilestoneIds = originalProposal.getClonedMilestoneIds();
            clonedMilestoneIds.add(getClonedMilestoneId(cloneProposalRef, cloneLegFileName));
            properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_MILESTONE_ID), clonedMilestoneIds);
            updatedProposal = proposalService.updateProposal(originalProposal.getMetadata().get().getRef(), originalProposal.getId(), properties);
            updatedLegDocument = legService.updateLegDocument(legDocument.getMilestoneRef(), legDocument.getId(), LeosLegStatus.CONTRIBUTION_SENT);
        } catch(Exception e) {
            LOG.error("Unexpected error occurred while updating the proposal after revision", e);
            return new Result<>(e.getMessage(), ErrorCode.EXCEPTION);
        }
        return new Result<>(new Pair(updatedProposal, updatedLegDocument), null);
    }

    @Override
    public void updateContributionMergeActions(String cloneDocumentId, String legFileName, String documentName,
                                               byte[] xmlContent)
            throws IOException {
        //TODO: change to findPackageByDocumentRef
        LeosPackage clonedPackage = packageService.findPackageByDocumentId(cloneDocumentId);
        LegDocument legDocument = packageService.findDocumentByPackagePathAndName(clonedPackage.getPath(), legFileName,
                LegDocument.class);
        Map<String, Object> legContent = ZipPackageUtil.unzipByteArray(legDocument.getContent().get().
                getSource().getBytes());
        legContent.put(documentName, xmlContent);
        byte[] updatedLegContent = ZipPackageUtil.zipByteArray(legContent);
        legService.updateLegDocument(legDocument.getId(), updatedLegContent);
    }

    private String getClonedMilestoneId(String proposalRef, String legDocumentName) {
        return proposalRef + CMIS_PROPERTY_SPLITTER + legDocumentName;
    }
}
