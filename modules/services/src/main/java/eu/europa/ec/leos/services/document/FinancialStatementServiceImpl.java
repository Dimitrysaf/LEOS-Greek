package eu.europa.ec.leos.services.document;

import com.google.common.base.Stopwatch;
import cool.graph.cuid.Cuid;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.vo.CloneDocumentMetadataVO;
import eu.europa.ec.leos.domain.vo.CloneProposalMetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.FinancialStatement.FinancialStatementStructureType;
import eu.europa.ec.leos.model.action.VersionVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.document.FinancialStatementRepository;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.services.collection.CollectionContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.collection.document.FinancialStatementContextService;
import eu.europa.ec.leos.services.document.util.DocumentVOProvider;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor.createValueMap;
import static eu.europa.ec.leos.services.support.XmlHelper.DOC;
import static eu.europa.ec.leos.services.support.XmlHelper.DOC_FILE_NAME_SEPARATOR;
import static eu.europa.ec.leos.services.support.XmlHelper.LEVEL;
import static eu.europa.ec.leos.services.support.XmlHelper.STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX;

@Service
public class FinancialStatementServiceImpl implements FinancialStatementService {

    private static final Logger LOG = LoggerFactory.getLogger(FinancialStatementServiceImpl.class);

    public static final String XML_DOC_EXTENSION = ".xml";

    private final FinancialStatementRepository financialStatementRepository;
    private final PackageRepository packageRepository;
    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlContentProcessor xmlContentProcessor;
    private final NumberService numberService;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;
    private final DocumentVOProvider documentVOProvider;
    private final ValidationService validationService;
    private final MessageHelper messageHelper;
    private final XPathCatalog xPathCatalog;
    private final ProposalService proposalService;
    private final Provider<CollectionContextService> proposalContextProvider;
    private final TableOfContentProcessor tableOfContentProcessor;
    private final PackageService packageService;
    private final Provider<FinancialStatementContextService> financialStatementContextProvider;
    private TrackChangesContext trackChangesContext;
    private final DocumentLanguageContext documentLanguageContext;

    @Value("${leos.clone.originRef}")
    private String cloneOriginRef;

    @Autowired
    FinancialStatementServiceImpl(FinancialStatementRepository financialStatementRepository,
                                  PackageRepository packageRepository,
                                  XmlNodeProcessor xmlNodeProcessor,
                                  XmlContentProcessor xmlContentProcessor,
                                  NumberService numberService,
                                  XmlNodeConfigProcessor xmlNodeConfigProcessor,
                                  ValidationService validationService,
                                  DocumentVOProvider documentVOProvider,
                                  TableOfContentProcessor tableOfContentProcessor,
                                  MessageHelper messageHelper,
                                  XPathCatalog xPathCatalog,
                                  ProposalService proposalService,
                                  Provider<CollectionContextService> proposalContextProvider,
                                  PackageService packageService,
                                  Provider<FinancialStatementContextService> financialStatementContextProvider,
                                  TrackChangesContext trackChangesContext, DocumentLanguageContext documentLanguageContext) {
        this.financialStatementRepository = financialStatementRepository;
        this.packageRepository = packageRepository;
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xmlContentProcessor = xmlContentProcessor;
        this.xmlNodeConfigProcessor = xmlNodeConfigProcessor;
        this.validationService = validationService;
        this.documentVOProvider = documentVOProvider;
        this.messageHelper = messageHelper;
        this.tableOfContentProcessor = tableOfContentProcessor;
        this.numberService = numberService;
        this.xPathCatalog = xPathCatalog;
        this.proposalService = proposalService;
        this.proposalContextProvider = proposalContextProvider;
        this.packageService = packageService;
        this.financialStatementContextProvider = financialStatementContextProvider;
        this.trackChangesContext = trackChangesContext;
        this.documentLanguageContext = documentLanguageContext;
    }

    @Override
    public FinancialStatement createFinancialStatement(String templateId, String path, FinancialStatementMetadata metadata,
                                                       String actionMessage, byte[] content) {
        LOG.trace("Creating FinancialStatement... [templateId={}, path={}, metadata={}]", templateId, path, metadata);
        final String FinancialStatementUid = Cuid.createCuid();
        final String language = metadata.getLanguage();
        StringBuilder refBuilder = new StringBuilder(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX).
                append(DOC_FILE_NAME_SEPARATOR).
                append(FinancialStatementUid).append(DOC_FILE_NAME_SEPARATOR).
                append(language.toLowerCase());
        final String ref = refBuilder.toString();
        final String fileName = refBuilder.append(XML_DOC_EXTENSION).toString();
        metadata = metadata
                .builder()
                .withRef(ref)
                .build();
        FinancialStatement financialStatement = financialStatementRepository.createFinancialStatement(templateId, path, fileName, metadata);
        byte[] updatedBytes = updateDataInXml((content == null) ? getContent(financialStatement) : content, metadata);
        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), metadata, updatedBytes, VersionType.MINOR, actionMessage);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement createClonedFinancialStatement(String templateId, String path, FinancialStatementMetadata metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO,
                                                       String actionMessage, byte[] content) {
        LOG.trace("Creating cloned FinancialStatement... [templateId={}, path={}, metadata={}]", templateId, path, metadata);
        final String FinancialStatementUid = Cuid.createCuid();
        final String language = metadata.getLanguage();
        StringBuilder refBuilder = new StringBuilder(STAT_DIGIT_FINANC_LEGIS_FILE_PREFIX).
                append(DOC_FILE_NAME_SEPARATOR).
                append(FinancialStatementUid).append(DOC_FILE_NAME_SEPARATOR).
                append(language.toLowerCase());
        final String ref = refBuilder.toString();
        final String fileName = refBuilder.append(XML_DOC_EXTENSION).toString();
        metadata = metadata
                .builder()
                .withRef(ref)
                .build();
        FinancialStatement financialStatement = financialStatementRepository.createClonedFinancialStatement(templateId, path, fileName, metadata,
                cloneDocumentMetadataVO);
        byte[] updatedBytes = updateDataInXml((content == null) ? getContent(financialStatement) : content, metadata);
        updatedBytes = xmlContentProcessor.addTrackChangesAttributes(updatedBytes);
        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), metadata, updatedBytes, VersionType.MINOR,
                actionMessage);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement createFinancialStatementFromContent(String path, FinancialStatementMetadata metadata, String actionMessage,
                                                                  byte[] content, String name) {
        LOG.trace("Creating FinancialStatement From Content... [path={}, metadata={}]", path, metadata);
        FinancialStatement financialStatement = financialStatementRepository.createFinancialStatementFromContent(path, name, metadata, content);
        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), metadata, content, VersionType.MINOR, actionMessage);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement createClonedFinancialStatementFromContent(String path, FinancialStatementMetadata metadata, CloneDocumentMetadataVO cloneDocumentMetadataVO, String actionMessage,
                                                                        byte[] content, String name) {
        LOG.trace("Creating cloned FinancialStatement From Content... [path={}, metadata={}]", path, metadata);
        FinancialStatement financialStatement = financialStatementRepository.createClonedFinancialStatementFromContent(path, name, metadata,
                cloneDocumentMetadataVO, content);
        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), metadata, content, VersionType.MINOR,
                actionMessage);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public void createFinancialStatementFromProposal(String proposalRef) {
        Objects.requireNonNull(proposalRef);
        Proposal proposal = Objects.requireNonNull(this.proposalService.findProposalByRef(proposalRef));
        populateTrackChangesContext(proposal);
        ProposalMetadata metadata = proposal.getMetadata().getOrError(() -> "Proposal metadata is required!");
        CollectionContextService context = proposalContextProvider.get();
        String template = "FS-001";
        context.useTemplate(template);
        context.usePurpose(metadata.getPurpose());
        context.useProposalId(proposal.getId());
        boolean useCloneProposal = Optional.of(proposal.getContent())
                .filter(content -> content.exists(c -> Objects.nonNull(c.getSource())))
                .map(content -> content.get().getSource().getBytes())
                .map(this.proposalService::getClonedProposalMetadata)
                .filter(CloneProposalMetadataVO::isClonedProposal)
                .isPresent();
        context.useCloneProposal(useCloneProposal);
        context.useOriginRef(cloneOriginRef);
        String actionMessage = messageHelper.getMessage("collection.block.financial.statement.added");
        context.useActionMessage(ContextActionService.STAT_DIGIT_FINANC_LEGIS_ADDED, actionMessage);
        context.executeCreateFinancialStatement();
    }

    @Override
    public void deleteFinancialStatement(FinancialStatement financialStatement) {
        LOG.trace("Deleting FinancialStatement... [id={}]", financialStatement.getId());
        financialStatementRepository.deleteFinancialStatement(financialStatement.getId());
    }

    @Override
    public void deleteFinancialStatement(String proposalRef, String financialStatementRef) {
        Proposal proposal = this.proposalService.findProposalByRef(proposalRef);
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposal.getMetadata().get().getRef(), Proposal.class);
        FinancialStatement financialStatement = this.financialStatementRepository.findFinancialStatementByRef(financialStatementRef);

        FinancialStatementContextService financialStatementContext = this.financialStatementContextProvider.get();
        financialStatementContext.useFinancialStatement(financialStatement.getId());
        financialStatementContext.usePackage(leosPackage);
        financialStatementContext.executeDeleteFinancialStatement();
    }

    @Override
    public FinancialStatement findFinancialStatement(String id) {
        LOG.trace("Finding FinancialStatement... [id={}]", id);
        FinancialStatement financialStatement = financialStatementRepository.findFinancialStatementById(id, FinancialStatement.class, true);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    @Cacheable(value = "docVersions")
    public FinancialStatement findFinancialStatementVersion(String id) {
        LOG.trace("Finding FinancialStatement version... [it={}]", id);
        FinancialStatement financialStatement = financialStatementRepository.findFinancialStatementById(id, FinancialStatement.class, false);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatement(FinancialStatement financialStatement, byte[] updatedFinancialStatementContent,
                                                       VersionType versionType, String comment) {
        LOG.trace("Updating FinancialStatement Xml Content... [id={}]", financialStatement.getId());

        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), updatedFinancialStatementContent, versionType, comment);

        //call validation on document with updated content
        validationService.validateDocumentAsync(documentVOProvider.createDocumentVO(financialStatement, updatedFinancialStatementContent));

        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatement(FinancialStatement financialStatement, FinancialStatementMetadata updatedMetadata,
                                                       VersionType versionType, String comment) {
        LOG.trace("Updating FinancialStatement... [id={}, updatedMetadata={}, versionType={}, comment={}]", financialStatement.getId(), updatedMetadata, versionType, comment);
        Stopwatch stopwatch = Stopwatch.createStarted();
        byte[] updatedBytes = updateDataInXml(getContent(financialStatement), updatedMetadata);

        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), updatedMetadata, updatedBytes, versionType, comment);

        //call validation on document with updated content
        validationService.validateDocumentAsync(documentVOProvider.createDocumentVO(financialStatement, updatedBytes));

        LOG.trace("Updated FinancialStatement ...({} milliseconds)", stopwatch.elapsed(TimeUnit.MILLISECONDS));
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatement(String id, byte[] updatedFinancialStatementContent) {
        LOG.trace("Updating FinancialStatement content... [id={}]", id);
        FinancialStatement financialStatement = financialStatementRepository.updateFinancialStatement(id, updatedFinancialStatementContent, VersionType.MINOR, "Content updated");
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatement(FinancialStatement financialStatement, byte[] updatedFinancialStatementContent,
                                                       FinancialStatementMetadata metadata, VersionType versionType, String comment) {
        LOG.trace("Updating FinancialStatement... [id={}, updatedMetadata={}, versionType={}, comment={}]", financialStatement.getId(), metadata, versionType, comment);
        Stopwatch stopwatch = Stopwatch.createStarted();
        updatedFinancialStatementContent = updateDataInXml(updatedFinancialStatementContent, metadata);

        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), metadata, updatedFinancialStatementContent, versionType, comment);

        //call validation on document with updated content
        validationService.validateDocumentAsync(documentVOProvider.createDocumentVO(financialStatement, updatedFinancialStatementContent));

        LOG.trace("Updated FinancialStatement ...({} milliseconds)", stopwatch.elapsed(TimeUnit.MILLISECONDS));
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatement(FinancialStatement financialStatement, byte[] updatedFinancialStatementContent, String comment) {
        LOG.trace("Updating FinancialStatement... [id={}, updatedMetadata={} , comment={}]", financialStatement.getId(), updatedFinancialStatementContent, comment);
        Stopwatch stopwatch = Stopwatch.createStarted();
        financialStatement = financialStatementRepository.updateFinancialStatement(financialStatement.getId(), updatedFinancialStatementContent, VersionType.MINOR, comment);
        LOG.trace("Updated FinancialStatement ...({} milliseconds)", stopwatch.elapsed(TimeUnit.MILLISECONDS));
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatement(String ref, String id, Map<String, Object> properties, boolean latest) {
        LOG.trace("Updating FinancialStatement metadata properties... [id={}]", id);
        FinancialStatement financialStatement = financialStatementRepository.updateFinancialStatement(ref, id, properties, latest);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatementWithMilestoneComments(FinancialStatement financialStatement, List<String> milestoneComments, VersionType versionType, String comment) {
        LOG.trace("Updating FinancialStatement... [id={}, milestoneComments={}, versionType={}, comment={}]", financialStatement.getId(), milestoneComments, versionType, comment);
        final byte[] updatedBytes = getContent(financialStatement);
        financialStatement = financialStatementRepository.updateMilestoneComments(financialStatement.getId(), milestoneComments, updatedBytes, versionType, comment);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement updateFinancialStatementWithMilestoneComments(String ref, String financialStatementId, List<String> milestoneComments) {
        LOG.trace("Updating FinancialStatement... [id={}, milestoneComments={}]", financialStatementId, milestoneComments);
        FinancialStatement financialStatement = financialStatementRepository.updateMilestoneComments(ref, financialStatementId, milestoneComments);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public List<FinancialStatement> findVersions(String id) {
        LOG.trace("Finding FinancialStatement versions... [id={}]", id);
        //LEOS-2813 We have memory issues is we fetch the content of all versions.
        return financialStatementRepository.findFinancialStatementVersions(id, false);
    }

    @Override
    public FinancialStatement createVersion(String id, VersionType versionType, String comment) {
        LOG.trace("Creating FinancialStatement version... [id={}, versionType={}, comment={}]", id, versionType, comment);
        final FinancialStatement FinancialStatement = findFinancialStatement(id);
        final FinancialStatementMetadata metadata = FinancialStatement.getMetadata().getOrError(() -> "FinancialStatement metadata is required!");
        final Content content = FinancialStatement.getContent().getOrError(() -> "FinancialStatement content is required!");
        final byte[] contentBytes = content.getSource().getBytes();
        FinancialStatement financialStatement = financialStatementRepository.updateFinancialStatement(id, metadata, contentBytes, versionType, comment);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public List<TableOfContentItemVO> getTableOfContent(FinancialStatement financialStatement, TocMode mode) {
        Validate.notNull(financialStatement, "financialStatement is required");
        final Content content = financialStatement.getContent().getOrError(() -> "financialStatement content is required!");
        final byte[] financialStatementContent = content.getSource().getBytes();
        return tableOfContentProcessor.buildTableOfContent(DOC, financialStatementContent, mode);
    }

    @Override
    public FinancialStatement saveTableOfContent(FinancialStatement financialStatement, List<TableOfContentItemVO> tocList,
                                                 FinancialStatementStructureType financialStatementStructureType, String actionMsg, User user) {
        Validate.notNull(financialStatement, "FinancialStatement is required");
        Validate.notNull(tocList, "Table of content list is required");
        byte[] newXmlContent = xmlContentProcessor.createDocumentContentWithNewTocList(tocList, getContent(financialStatement), user,
                financialStatement.isTrackChangesEnabled());
        String language = financialStatement.getMetadata().get().getLanguage();
        documentLanguageContext.setDocumentLanguage(language);
        if (financialStatementStructureType != null && LEVEL.equals(financialStatementStructureType.getType())) {
            newXmlContent = numberService.renumberLevel(newXmlContent);
        }
        newXmlContent = numberService.renumberParagraph(newXmlContent);
        newXmlContent = numberService.renumberDivisions(newXmlContent);
        newXmlContent = xmlContentProcessor.doXMLPostProcessing(newXmlContent);

        return updateFinancialStatement(financialStatement, newXmlContent, VersionType.MINOR, actionMsg);
    }

    private byte[] getContent(FinancialStatement financialStatement) {
        final Content content = financialStatement.getContent().getOrError(() -> "FinancialStatement content is required!");
        return content.getSource().getBytes();
    }

    private byte[] updateDataInXml(final byte[] content, FinancialStatementMetadata dataObject) {
        documentLanguageContext.setDocumentLanguage(dataObject.getLanguage());
        byte[] updatedBytes = xmlNodeProcessor.setValuesInXml(content, createValueMap(dataObject), xmlNodeConfigProcessor.getConfig(dataObject.getCategory()));
        return xmlContentProcessor.doXMLPostProcessing(updatedBytes);
    }

    @Override
    public FinancialStatement findFinancialStatementByRef(String ref) {
        LOG.trace("Finding FinancialStatement by ref... [ref=" + ref + "]");
        FinancialStatement financialStatement = financialStatementRepository.findFinancialStatementByRef(ref);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public FinancialStatement getFinancialStatementByRef(String ref) {
        LOG.trace("Finding FinancialStatement by ref... [ref=" + ref + "]");
        FinancialStatement financialStatement = financialStatementRepository.getFinancialStatementByRef(ref);
        trackChangesContext.setTrackChangesEnabled(financialStatement.isTrackChangesEnabled());
        return financialStatement;
    }

    @Override
    public List<VersionVO> getAllVersions(String documentId, String docRef, int pageIndex, int pageSize) {
        // TODO temporary call. paginated loading will be implemented in the future Story
        List<FinancialStatement> majorVersions = findAllMajors(docRef, pageIndex, pageSize);
        LOG.trace("Found {} majorVersions for [id={}]", majorVersions.size(), documentId);

        List<VersionVO> majorVersionsVO = VersionsUtil.buildVersionVO(majorVersions, messageHelper);
        return majorVersionsVO;
    }

    @Override
    public List<FinancialStatement> findAllMinorsForIntermediate(String docRef, String currIntVersion, int startIndex, int maxResults) {
        return financialStatementRepository.findAllMinorsForIntermediate(docRef, currIntVersion, startIndex, maxResults);
    }

    @Override
    public int findAllMinorsCountForIntermediate(String docRef, String currIntVersion) {
        return financialStatementRepository.findAllMinorsCountForIntermediate(docRef, currIntVersion);
    }

    @Override
    public Integer findAllMajorsCount(String docRef) {
        return financialStatementRepository.findAllMajorsCount(docRef);
    }

    @Override
    public List<FinancialStatement> findAllMajors(String docRef, int startIndex, int maxResults) {
        return financialStatementRepository.findAllMajors(docRef, startIndex, maxResults);
    }

    @Override
    public List<FinancialStatement> findRecentMinorVersions(String documentId, String documentRef, int startIndex, int maxResults) {
        return financialStatementRepository.findRecentMinorVersions(documentId, documentRef, startIndex, maxResults);
    }

    @Override
    public Integer findRecentMinorVersionsCount(String documentId, String documentRef) {
        return financialStatementRepository.findRecentMinorVersionsCount(documentId, documentRef);
    }

    @Override
    public List<String> getAncestorsIdsForElementId(FinancialStatement financialStatement, List<String> elementIds) {
        Validate.notNull(financialStatement, "FinancialStatement is required");
        Validate.notNull(elementIds, "Element id is required");
        List<String> ancestorIds = new ArrayList<String>();
        byte[] content = getContent(financialStatement);
        for (String elementId : elementIds) {
            ancestorIds.addAll(xmlContentProcessor.getAncestorsIdsForElementId(content, elementId));
        }
        return ancestorIds;
    }

    @Override
    public FinancialStatement findFirstVersion(String documentRef) {
        return financialStatementRepository.findFirstVersion(documentRef);
    }

    @Override
    public List<FinancialStatement> findFinancialStatementByPackagePath(String path) {
        return packageRepository.findDocumentsByPackagePath(path, FinancialStatement.class, true);
    }

    @Override
    public String generateFinancialStatementReference(byte[] content, String language) {
        String docName = xmlContentProcessor.getDocReference(content);
        return docName.concat(DOC_FILE_NAME_SEPARATOR).concat(Cuid.createCuid())
                .concat(DOC_FILE_NAME_SEPARATOR).concat(language.toLowerCase());
    }

    private void populateTrackChangesContext(XmlDocument document) {
        this.trackChangesContext.setTrackChangesEnabled(document.isTrackChangesEnabled());
    }
}
