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
package eu.europa.ec.leos.services.document;

import com.google.common.base.Strings;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategoryClass;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.security.LeosPermission;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.CollectionContextService;
import eu.europa.ec.leos.services.collection.document.ContextActionService;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.XmlDocumentService;
import eu.europa.ec.leos.services.support.LeosXercesUtils;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.util.VersionComparator;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.inject.Provider;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import static eu.europa.ec.leos.domain.repository.LeosCategory.STAT_FINANC_LEGIS;
import static eu.europa.ec.leos.services.support.XPathCatalog.NAMESPACE_AKN4EU_URI;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XmlHelper.UTF_8;

@Service
public abstract class DocumentContentServiceImpl implements DocumentContentService {

    protected static final Logger LOG = LoggerFactory.getLogger(DocumentContentServiceImpl.class);

    protected TransformationService transformationService;
    protected ContentComparatorService compareService;
    protected AnnexService annexService;
    protected BillService billService;
    protected MemorandumService memorandumService;
    protected ExplanatoryService explanatoryService;
    protected FinancialStatementService financialStatementService;
    protected ProposalService proposalService;
    protected XmlContentProcessor xmlContentProcessor;
    private final XmlDocumentService xmlDocumentService;
    protected XmlNodeProcessor xmlNodeProcessor;
    protected final XPathCatalog xPathCatalog;
    private Provider<CollectionContextService> proposalContextProvider;

    @Autowired
    public DocumentContentServiceImpl(TransformationService transformationService,
                                      ContentComparatorService compareService, AnnexService annexService,
                                      BillService billService, MemorandumService memorandumService, ExplanatoryService explanatoryService,
                                      FinancialStatementService financialStatementService, ProposalService proposalService,
                                      XmlContentProcessor xmlContentProcessor, XmlDocumentService xmlDocumentService,
                                        XmlNodeProcessor xmlNodeProcessor, XPathCatalog xPathCatalog, Provider<CollectionContextService> proposalContextProvider) {
        this.transformationService = transformationService;
        this.compareService = compareService;
        this.annexService = annexService;
        this.billService = billService;
        this.memorandumService = memorandumService;
        this.explanatoryService = explanatoryService;
        this.proposalService = proposalService;
        this.xmlContentProcessor = xmlContentProcessor;
        this.xmlDocumentService = xmlDocumentService;
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xPathCatalog = xPathCatalog;
        this.financialStatementService = financialStatementService;
        this.proposalContextProvider = proposalContextProvider;
    }

    protected boolean isComparisonRequired(XmlDocument xmlDocument, SecurityContext securityContext) {
        byte[] contentBytes = xmlDocument.getContent().get().getSource().getBytes();
        switch (xmlDocument.getCategory()) {
            case MEMORANDUM:
                return isMemorandumComparisonRequired(contentBytes);
            case COUNCIL_EXPLANATORY:
                return isCouncilExplanatoryComparisonRequired((Explanatory) xmlDocument, securityContext);
            case ANNEX:
                return isAnnexComparisonRequired((Annex) xmlDocument, securityContext);
            case BILL:
                return true;
            case STAT_FINANC_LEGIS:
                return isFinancialStatementComparisonRequired(contentBytes);
            case PROPOSAL:
                return true;
            default:
                throw new UnsupportedOperationException("No transformation supported for this category");
        }
    }

    @Override
    public XmlDocument getOriginalDocument(XmlDocument xmlDocument) {
        switch (xmlDocument.getCategory()) {
            case MEMORANDUM:
                return getOriginalMemorandum((Memorandum) xmlDocument);
            case COUNCIL_EXPLANATORY:
                return getOriginalExplanatory((Explanatory) xmlDocument);
            case ANNEX:
                return getOriginalAnnex((Annex) xmlDocument);
            case BILL:
                return getOriginalBill((Bill) xmlDocument);
            case PROPOSAL:
                return getOriginalProposal((Proposal) xmlDocument);
            case STAT_FINANC_LEGIS:
                return getOriginalFinancialStatement((FinancialStatement) xmlDocument);
            default:
                throw new UnsupportedOperationException("No transformation supported for this category");
        }
    }

    protected String[] getContentsToCompare(XmlDocument xmlDocument, String contextPath, SecurityContext securityContext,
                                            byte[] coverPageContent) {
        String currentDocumentEditableXml = getEditableXml(xmlDocument, contextPath, securityContext, coverPageContent);
        XmlDocument originalDocument;
        byte[] contentBytes;

        switch (xmlDocument.getCategory()) {
            case MEMORANDUM:
                contentBytes = xmlDocument.getContent().get().getSource().getBytes();
                if (isMemorandumComparisonRequired(contentBytes)) {
                    originalDocument = getOriginalMemorandum((Memorandum) xmlDocument);
                } else {
                    return new String[]{currentDocumentEditableXml};
                }
                break;
            case COUNCIL_EXPLANATORY:
                if (isCouncilExplanatoryComparisonRequired((Explanatory) xmlDocument, securityContext)) {
                    originalDocument = getOriginalExplanatory((Explanatory) xmlDocument);
                } else {
                    return new String[]{currentDocumentEditableXml};
                }
                break;
            case ANNEX:
                if (isAnnexComparisonRequired((Annex) xmlDocument, securityContext)) {
                    originalDocument = getOriginalAnnex((Annex) xmlDocument);
                } else {
                    return new String[]{currentDocumentEditableXml};
                }
                break;
            case STAT_FINANC_LEGIS:
                if (isComparisonRequired(xmlDocument, securityContext)) {
                    originalDocument = getOriginalFinancialStatement((FinancialStatement) xmlDocument);
                } else {
                    return new String[]{currentDocumentEditableXml};
                }
                break;
            case BILL:
                originalDocument = getOriginalBill((Bill) xmlDocument);
                break;
            case PROPOSAL:
                originalDocument = getOriginalProposal((Proposal) xmlDocument);
                break;
            default:
                throw new UnsupportedOperationException("No transformation supported for this category");
        }
        String originalDocumentEditableXml = getEditableXml(originalDocument, contextPath, securityContext,
                coverPageContent != null && coverPageContent.length > 0 ? getCoverPageContent(originalDocument.getContent().get().getSource().getBytes()) : coverPageContent);
        return new String[]{currentDocumentEditableXml, originalDocumentEditableXml};
    }

    protected String getEditableXml(XmlDocument xmlDocument, String contextPath, SecurityContext securityContext,
                                    byte[] coverPageContent) {
        String content = transformationService.toEditableXml(getContentInputStream(xmlDocument), contextPath, xmlDocument.getCategory(),
                securityContext.getPermissions(xmlDocument), getContentInputStream(coverPageContent));
        if (STAT_FINANC_LEGIS.equals(xmlDocument.getCategory())) {
            final Document document = XercesUtils.createXercesDocument(content.getBytes(XmlHelper.UTF_8));
            final byte[] node = LeosXercesUtils.wrapWithPageOrientationDivs(document);
            content = new String(node, XmlHelper.UTF_8);
        }
        return content;
    }

    @Override
    public XmlDocument getOriginalMemorandum(Memorandum memorandum) {
        return memorandumService.findFirstVersion(memorandum.getMetadata().get().getRef());
    }

    @Override
    public XmlDocument getOriginalProposal(Proposal proposal) {
        return proposalService.findFirstVersion(proposal.getMetadata().get().getRef());
    }

    @Override
    public XmlDocument getOriginalExplanatory(Explanatory explanatory) {
        return explanatoryService.findFirstVersion(explanatory.getMetadata().get().getRef());
    }

    @Override
    public XmlDocument getOriginalFinancialStatement(FinancialStatement financialStatement) {
        return financialStatementService.findFirstVersion(financialStatement.getMetadata().get().getRef());
    }

    @Override
    public XmlDocument getOriginalAnnex(Annex annex) {
        return annexService.findFirstVersion(annex.getMetadata().get().getRef());
    }

    @Override
    public XmlDocument getOriginalBill(Bill bill) {
        return billService.findFirstVersion(bill.getMetadata().get().getRef());
    }

    @Override
    public boolean isAnnexComparisonRequired(Annex annex, SecurityContext securityContext) {
        return !isRevisionAnnex(annex) || (securityContext.hasPermission(annex, LeosPermission.CAN_TOGGLE_LIVE_DIFFING) && annex.isLiveDiffingRequired());
    }

    @Override
    public boolean isAnnexComparisonRequired(byte[] contentBytes) {
        return xmlContentProcessor.isAnnexComparisonRequired(contentBytes);
    }

    @Override
    public String getDocumentAsHtml(XmlDocument xmlDocument, String contextPath, List<LeosPermission> permissions) {
        String documentAsHtml = this.getDocumentAsHtml(xmlDocument, contextPath, permissions, false);
        Document document = XercesUtils.createXercesDocument(documentAsHtml.getBytes(UTF_8));
        documentAsHtml = new String(LeosXercesUtils.wrapWithPageOrientationDivs(document), UTF_8);
        return documentAsHtml;
    }

    @Override
    public String getDocumentAsHtml(XmlDocument xmlDocument, String contextPath, List<LeosPermission> permissions, boolean includeCoverPage) {
        return transformationService.formatToHtml(xmlDocument, contextPath, permissions,
                        includeCoverPage ? new ByteArrayInputStream(getCoverPageContent(xmlDocument.getContent().get().getSource().getBytes()))
                                : null)

                .replaceAll("(?i)(href|onClick)=\".*?\"", "");
    }

    @Override
    public String getCleanDocumentAsHtml(XmlDocument xmlDocument, String contextPath, List<LeosPermission> permissions) {
        return this.getCleanDocumentAsHtml(xmlDocument, contextPath, permissions, false);
    }

    @Override
    public String getCleanDocumentAsHtml(XmlDocument xmlDocument, String contextPath, List<LeosPermission> permissions, boolean includeCoverPage) {
        byte[] xmlContent = xmlContentProcessor.cleanSoftActions(xmlDocument.getContent().get().getSource().getBytes());
        xmlContent = xmlContentProcessor.cleanTrackChanges(xmlContent);
        return transformationService.formatToHtml(new ByteArrayInputStream(xmlContent), contextPath, permissions,
                        includeCoverPage ? new ByteArrayInputStream(getCoverPageContent(xmlDocument.getContent().get().getSource().getBytes()))
                                : null)
                .replaceAll("(?i)(href|onClick)=\".*?\"", "");
    }

    @Override
    public String getDocumentForContributionAsHtml(byte[] content, String contextPath, List<LeosPermission> permissions) {
        return getDocumentForContributionAsHtml(content, contextPath, permissions, false);
    }

    @Override
    public String getDocumentForContributionAsHtml(byte[] content, String contextPath, List<LeosPermission> permissions, boolean includeCoverPage) {
        content = xmlContentProcessor.cleanMiscAttributes(content);
        return transformationService.formatToHtml(new ByteArrayInputStream(content), contextPath, permissions,
                        includeCoverPage ? new ByteArrayInputStream(getCoverPageContent(content))
                                : null)
                .replaceAll("(?i)(href|onClick)=\".*?\"", "");
    }

    @Override
    public byte[] getCoverPageContent(byte[] xmlContent) {
        String coverPageContent = "";
        String coverPageXPath = xPathCatalog.getXPathCoverPage();
        boolean coverPagePresent = xmlContentProcessor.evalXPath(xmlContent, coverPageXPath, true);
        if (coverPagePresent) {
            coverPageContent = Strings.nullToEmpty(xmlContentProcessor.getElementFragmentByPath(xmlContent,
                    coverPageXPath, true));
        }
        return coverPageContent.getBytes(StandardCharsets.UTF_8);
    }

    private String getAkn4euVersion(byte[] xmlContent) {
        String akn4euVersionContent = "";
        String akn4euVersionXPath = xPathCatalog.getXPathAkn4euVersion();
        boolean akn4euVersionPresent = xmlContentProcessor.evalXPath(xmlContent, akn4euVersionXPath, true);
        if (akn4euVersionPresent) {
            akn4euVersionContent = xmlContentProcessor.getElementValue(xmlContent, akn4euVersionXPath, true);
        }
        return akn4euVersionContent;
    }

    private String getLeosTemplateVersion(byte[] xmlContent) {
        String leosTemplateVersionContent = "";
        String leosTemplateVersionXPath = xPathCatalog.getLeosTemplateVersion();
        boolean leosTemplateVersionPresent = xmlContentProcessor.evalXPath(xmlContent, leosTemplateVersionXPath, true);
        if (leosTemplateVersionPresent) {
            leosTemplateVersionContent = xmlContentProcessor.getElementValue(xmlContent, leosTemplateVersionXPath, true);
        }
        return leosTemplateVersionContent;
    }

    public byte[] setAkn4euVersion(byte[] xmlContent, String akn4euVersion) {
        String akn4euVersionXPath = xPathCatalog.getXPathAkn4euVersion();
        String akn4euAttributeXPath = xPathCatalog.getXPathAkn4euAttribute();
        String existingAkn4euVersion = getAkn4euVersion(xmlContent);
        VersionComparator comparator = new VersionComparator();
        if (comparator.compare(existingAkn4euVersion, akn4euVersion) < 0) {
            if (StringUtils.isBlank(existingAkn4euVersion)) {
                xmlContent = xmlNodeProcessor.setValuesInXml(xmlContent, akn4euAttributeXPath, NAMESPACE_AKN4EU_URI);
            }
            xmlContent = xmlNodeProcessor.setValuesInXml(xmlContent, akn4euVersionXPath, akn4euVersion);
        }
        return xmlContent;
    }

    public byte[] setLeosTemplateVersion(byte[] xmlContent, String leosTemplateVersion) {
        String leosTemplateVersionXPath = xPathCatalog.getLeosTemplateVersion();
        String existingLeosTemplateVersion = getLeosTemplateVersion(xmlContent);
        VersionComparator comparator = new VersionComparator();
        if (comparator.compare(existingLeosTemplateVersion, leosTemplateVersion) < 0) {
            xmlContent = xmlNodeProcessor.setValuesInXml(xmlContent, leosTemplateVersionXPath, leosTemplateVersion);
        }
        return xmlContent;
    }

    @Override
    public void akn4euVersionDocumentConversion(List<XmlDocument> documents, String versionComment, String akn4euVersionValue, String templateVersionValue) {
        for (XmlDocument doc : documents) {
            byte[] xmlContent = getDocumentContent(doc);
            xmlContent = akn4euVersionDocumentConversion(xmlContent, akn4euVersionValue, templateVersionValue);
            updateDocumentContent(doc, xmlContent, versionComment);
        }
    }

    @Override
    public byte[] akn4euVersionDocumentConversion(byte[] xmlContent, String akn4euVersionValue, String templateVersionValue) {
        xmlContent = setAkn4euVersion(xmlContent, akn4euVersionValue);
        xmlContent = setLeosTemplateVersion(xmlContent, templateVersionValue);
        xmlContent = xmlContentProcessor.convertAlineasInDocumentContent(xmlContent);
        return xmlContent;
    }

    @Override
    public boolean isDeprecatedDocument(XmlDocument xmlDocument, String akn4euVersionValue, String templateVersionValue) {
        // Should be temporary as for performance reason, getting content for each document while opening proposal screen is not good
        byte[] xmlContent = getDocumentContent(xmlDocument);
        return isDeprecatedDocument(xmlContent, akn4euVersionValue, templateVersionValue);
    }

    @Override
    public boolean isDeprecatedDocument(byte[] xmlContent, String akn4euVersionValue, String templateVersionValue) {
        Document document = createXercesDocument(xmlContent);
        if (!xmlContentProcessor.containsAlineas(document)) {
            String akn4euVersion = getAkn4euVersion(xmlContent);
            String leosTemplateVersion = getLeosTemplateVersion(xmlContent);
            VersionComparator comparator = new VersionComparator();
            return comparator.compare(akn4euVersion, akn4euVersionValue) < 0
                    || comparator.compare(leosTemplateVersion, templateVersionValue) < 0;
        } else {
            return false;
        }
    }

    @Override
    public boolean isCoverPageExists(byte[] xmlContent) {
        String coverPageXPath = xPathCatalog.getXPathCoverPage();
        boolean coverPagePresent = xmlContentProcessor.evalXPath(xmlContent, coverPageXPath, true);
        return coverPagePresent;
    }

    @Override
    public byte[] getOriginalContentToCompare(XmlDocument xmlDocument) {
        byte[] contentBytes;
        XmlDocument originalDocument;
        switch (xmlDocument.getCategory()) {
            case MEMORANDUM:
                contentBytes = xmlDocument.getContent().get().getSource().getBytes();
                if (isMemorandumComparisonRequired(contentBytes)) {
                    originalDocument = getOriginalMemorandum((Memorandum) xmlDocument);
                    contentBytes = getContent(originalDocument);
                }
                break;
            case ANNEX:
                contentBytes = xmlDocument.getContent().get().getSource().getBytes();
                if (isAnnexComparisonRequired(contentBytes)) {
                    originalDocument = getOriginalAnnex((Annex) xmlDocument);
                    contentBytes = getContent(originalDocument);
                }
                break;
            case BILL:
                originalDocument = getOriginalBill((Bill) xmlDocument);
                contentBytes = getContent(originalDocument);
                break;
            case PROPOSAL:
                contentBytes = xmlDocument.getContent().get().getSource().getBytes();
                if (isProposalComparisonRequired(contentBytes)) {
                    originalDocument = getOriginalProposal((Proposal) xmlDocument);
                    contentBytes = getCoverPageContent(getContent(originalDocument));
                }
                break;
            case STAT_FINANC_LEGIS:
                originalDocument = getOriginalFinancialStatement((FinancialStatement) xmlDocument);
                contentBytes = getContent(originalDocument);
                break;
            default:
                throw new UnsupportedOperationException("Category not supported");
        }
        return contentBytes;
    }

    private byte[] getDocumentContent(XmlDocument xmlDocument) {
        byte[] contentBytes;
        if (xmlDocument.getContent().isEmpty()) {
            switch (xmlDocument.getCategory()) {
                case MEMORANDUM:
                    contentBytes =
                            getContent(memorandumService.findMemorandumByRef(xmlDocument.getMetadata().get().getRef()));
                    break;
                case COUNCIL_EXPLANATORY:
                    contentBytes = getContent(explanatoryService.findExplanatoryByRef(xmlDocument.getMetadata().get().getRef()));
                    break;
                case ANNEX:
                    contentBytes = getContent(annexService.findAnnexByRef(xmlDocument.getMetadata().get().getRef()));
                    break;
                case BILL:
                    contentBytes = getContent(billService.findBillByRef(xmlDocument.getMetadata().get().getRef()));
                    break;
                case STAT_FINANC_LEGIS:
                    contentBytes = getContent(financialStatementService.findFinancialStatementByRef(xmlDocument.getMetadata().get().getRef()));
                    break;
                case PROPOSAL:
                    contentBytes = getContent(proposalService.findProposalByRef(xmlDocument.getMetadata().get().getRef()));
                    break;
                default:
                    throw new UnsupportedOperationException("No transformation supported for this category");
            }
        } else {
            contentBytes = getContent(xmlDocument);
        }
        return contentBytes;
    }

    private void updateDocumentContent(XmlDocument xmlDocument, byte[] xmlContent, String versionComment) {
        switch (xmlDocument.getCategory()) {
            case MEMORANDUM:
                memorandumService.updateMemorandum((Memorandum) xmlDocument, xmlContent, VersionType.MINOR, versionComment);
                break;
            case COUNCIL_EXPLANATORY:
                explanatoryService.updateExplanatory((Explanatory) xmlDocument, xmlContent, VersionType.MINOR, versionComment);
                break;
            case ANNEX:
                annexService.updateAnnex((Annex) xmlDocument, xmlContent, VersionType.MINOR, versionComment);
                break;
            case BILL:
                billService.updateBill((Bill) xmlDocument, xmlContent, versionComment);
                break;
            case STAT_FINANC_LEGIS:
                financialStatementService.updateFinancialStatement((FinancialStatement) xmlDocument, xmlContent, VersionType.MINOR, versionComment);
                break;
            case PROPOSAL:
                proposalService.updateProposal((Proposal) xmlDocument, xmlContent, VersionType.MINOR, versionComment);
                break;
            default:
                throw new UnsupportedOperationException("No transformation supported for this category");
        }
    }

    private byte[] getContent(XmlDocument xmlDocument) {
        final Content content = xmlDocument.getContent().getOrError(() -> "Document content is required!");
        return content.getSource().getBytes();
    }

    @Override
    public boolean isCouncilExplanatoryComparisonRequired(Explanatory explanatory, SecurityContext securityContext) {
        return securityContext.hasPermission(explanatory, LeosPermission.CAN_TOGGLE_LIVE_DIFFING) && explanatory.isLiveDiffingRequired();
    }

    @Override
    public boolean isRevisionAnnex(XmlDocument xmlDocument) {
        return xmlContentProcessor.isRevisionAnnex(xmlDocument.getContent().get().getSource().getBytes());
    }

    @Override
    public XmlDocument getDocumentByRef(String documentRef, LeosCategoryClass category) {
        XmlDocument document;
        switch (category) {
            case BILL:
                document = billService.findBillByRef(documentRef);
                break;
            case ANNEX:
                document = annexService.findAnnexByRef(documentRef);
                break;
            case MEMORANDUM:
                document = memorandumService.findMemorandumByRef(documentRef);
                break;
            case COUNCIL_EXPLANATORY:
                document = explanatoryService.findExplanatoryByRef(documentRef);
                break;
            case PROPOSAL:
            case COVERPAGE:
                document = proposalService.findProposalByRef(documentRef);
                break;
            case STAT_FINANC_LEGIS:
                document = financialStatementService.findFinancialStatementByRef(documentRef);
                break;
            default:
                throw new IllegalArgumentException("Invalid document type");
        }
        return document;
    }

    @Override
    public XmlDocument getDocumentById(String documentId, LeosCategoryClass category) {
        XmlDocument document;
        switch (category) {
            case BILL:
                document = billService.findBill(documentId, true);
                break;
            case ANNEX:
                document = annexService.findAnnex(documentId, true);
                break;
            case MEMORANDUM:
                document = memorandumService.findMemorandum(documentId, true);
                break;
            case COUNCIL_EXPLANATORY:
                document = explanatoryService.findExplanatory(documentId);
                break;
            case PROPOSAL:
            case COVERPAGE:
                document = proposalService.findProposal(documentId);
                break;
            case STAT_FINANC_LEGIS:
                document = financialStatementService.findFinancialStatement(documentId);
                break;
            default:
                throw new IllegalArgumentException("Invalid document type");
        }
        return document;
    }

    @Override
    public XmlDocument updateDocument(XmlDocument document, byte[] xmlContent, String message) {
        switch (document.getCategory()) {
            case BILL:
                document = billService.updateBill((Bill) document, xmlContent, message);
                break;
            case MEMORANDUM:
                document = memorandumService.updateMemorandum((Memorandum) document, xmlContent, message);
                break;
            case ANNEX:
                document = annexService.updateAnnex((Annex) document, xmlContent, message);
                break;
            case COUNCIL_EXPLANATORY:
                document = explanatoryService.updateExplanatory((Explanatory) document, xmlContent, message);
                break;
            case PROPOSAL:
                document = proposalService.updateProposal((Proposal) document, xmlContent, message);
                udpateDocPurposeInChildDocuments((Proposal) document, message);
                break;
            case STAT_FINANC_LEGIS:
                document = financialStatementService.updateFinancialStatement((FinancialStatement) document, xmlContent, message);
            default:
                throw new UnsupportedOperationException("Invalid Document Type category : " + document.getCategory());
        }
        try {
            document = updateInternalReferencesAsync(document, LeosCategoryClass.caseInsensitiveValueOf(document.getCategory().name()));
        } catch (Exception e) {
            LOG.error("Error while updating internal references", e);
        }
        LOG.debug("updateInternalReferences processed for {}: ", document.getMetadata().get().getRef());
        return document;
    }

    private XmlDocument updateInternalReferencesAsync(XmlDocument document, LeosCategoryClass category) {
        try {
            xmlDocumentService.updateInternalReferencesAsync(new UpdateInternalReferencesMessage(document.getId(),
                    document.getMetadata().get().getRef()));
        } catch (Exception e) {
            LOG.error("Error while updating internal references", e);
        }
        LOG.debug("updateInternalReferences processed for {}: ", document.getMetadata().get().getRef());
        //fetch updated version
        return getDocumentById(document.getId(), category);
    }

    private void udpateDocPurposeInChildDocuments(Proposal proposal, String message) {
        byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
        List<Element> docPurposeElements = xmlContentProcessor.getElementsByTagName(proposalContent,
                Arrays.asList("docPurpose"), true);
        String docPurpose = docPurposeElements.get(0).getElementFragment();
        CollectionContextService context = proposalContextProvider.get();
        context.useProposal(proposal);
        context.usePurpose(docPurpose);
        context.useEeaRelevance(proposal.getMetadata().get().getEeaRelevance());
        context.useActionMessage(ContextActionService.METADATA_UPDATED, message);
        context.useActionComment(message);
        context.executeUpdateDocumentsAssociatedToProposal();
    }
}
