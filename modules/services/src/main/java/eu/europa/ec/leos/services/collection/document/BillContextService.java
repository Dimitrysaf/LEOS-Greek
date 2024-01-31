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
package eu.europa.ec.leos.services.collection.document;

import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.vo.CloneDocumentMetadataVO;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.MetadataVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.support.url.CollectionIdsAndUrlsHolder;
import eu.europa.ec.leos.services.support.url.CollectionUrlBuilder;
import io.atlassian.fugue.Option;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.inject.Provider;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.domain.repository.LeosCategory.ANNEX;
import static eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor.createValueMap;
import static eu.europa.ec.leos.services.support.XmlHelper.XML_DOC_EXT;

@Component
@Scope("prototype")
public class BillContextService {

    private static final Logger LOG = LoggerFactory.getLogger(BillContextService.class);
    private static final String BILL_PACKAGE_IS_REQUIRED = "Bill package is required!";
    private static final String BILL_TEMPLATE_IS_REQUIRED = "Bill template is required!";
    private static final String BILL_PURPOSE_IS_REQUIRED = "Bill purpose is required!";
    private static final String BILL_METADATA_IS_REQUIRED = "Bill metadata is required!";

    private final BillService billService;
    private final ProposalService proposalService;
    private final PackageService packageService;
    private final AnnexService annexService;
    private final TemplateService templateService;
    private final XmlContentProcessor xmlContentProcessor;
    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;
    private final MessageHelper messageHelper;
    private final CollectionUrlBuilder urlBuilder;
    private final RepositoryPropertiesMapper repositoryPropertiesMapper;
    private XPathCatalog xPathCatalog;

    private final Provider<AnnexContextService> annexContextProvider;

    private LeosPackage leosPackage = null;
    private Bill bill = null;
    private String versionComment;
    private String milestoneComment;
    private String purpose = null;
    private String moveDirection = null;
    private String annexId;
    private String annexRef;
    private boolean cloneProposal;
    private boolean eeaRelevance;
    private String originRef;

    private DocumentVO billDocument;
    private DocumentVO annexDocument;
    private String annexTemplate;
    private CollectionIdsAndUrlsHolder idsAndUrlsHolder;
    private final Map<ContextActionService, String> actionMsgMap;

    @Autowired
    BillContextService(BillService billService,
                       PackageService packageService,
                       ProposalService proposalService,
                       AnnexService annexService,
                       TemplateService templateService,
                       XmlContentProcessor xmlContentProcessor,
                       XmlNodeProcessor xmlNodeProcessor,
                       XmlNodeConfigProcessor xmlNodeConfigProcessor,
                       MessageHelper messageHelper, CollectionUrlBuilder urlBuilder,
                       Provider<AnnexContextService> annexContextProvider, XPathCatalog xPathCatalog, RepositoryPropertiesMapper repositoryPropertiesMapper) {
        this.billService = billService;
        this.packageService = packageService;
        this.proposalService = proposalService;
        this.annexService = annexService;
        this.templateService = templateService;
        this.xmlContentProcessor = xmlContentProcessor;
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xmlNodeConfigProcessor = xmlNodeConfigProcessor;
        this.messageHelper = messageHelper;
        this.urlBuilder = urlBuilder;
        this.annexContextProvider = annexContextProvider;
        this.actionMsgMap = new EnumMap<>(ContextActionService.class);
        this.xPathCatalog = xPathCatalog;
        this.repositoryPropertiesMapper = repositoryPropertiesMapper;
    }

    public void usePackage(LeosPackage leosPackage) {
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        LOG.trace("Using Bill package... [id={}, path={}]", leosPackage.getId(), leosPackage.getPath());
        this.leosPackage = leosPackage;
    }

    public void useTemplate(Bill bill) {
        Validate.notNull(bill, BILL_TEMPLATE_IS_REQUIRED);
        LOG.trace("Using Bill template... [id={}, name={}]", bill.getId(), bill.getName());
        this.bill = bill;
    }

    public void useActionMessage(ContextActionService action, String actionMsg) {
        Validate.notNull(actionMsg, "Action message is required!");
        Validate.notNull(action, "Context Action not found! [name=%s]", action);

        LOG.trace("Using action message... [action={}, name={}]", action, actionMsg);
        actionMsgMap.put(action, actionMsg);
    }

    public void useActionMessageMap(Map<ContextActionService, String> messages) {
        Validate.notNull(messages, "Action message map is required!");

        actionMsgMap.putAll(messages);
    }

    public void usePurpose(String purpose) {
        Validate.notNull(purpose, BILL_PURPOSE_IS_REQUIRED);
        LOG.trace("Using Bill purpose... [purpose={}]", purpose);
        this.purpose = purpose;
    }

    public void useMoveDirection(String moveDirection) {
        Validate.notNull(moveDirection, "Bill 'moveDirection' is required!");
        LOG.trace("Using Bill 'move direction'... [moveDirection={}]", moveDirection);
        this.moveDirection = moveDirection;
    }

    public void useAnnex(String annexId) {
        Validate.notNull(annexId, "Bill 'annexId' is required!");
        LOG.trace("Using Bill 'move direction'... [annexId={}]", annexId);
        this.annexId = annexId;
    }

    public void useDocument(DocumentVO document) {
        Validate.notNull(document, "Bill document is required!");
        billDocument = document;
    }

    public void useAnnexwithRef(String annexRef) {
        Validate.notNull(annexRef, "Bill 'annexRef' is required!");
        LOG.trace("Using Bill ... [annexRef={}]", annexRef);
        this.annexRef = annexRef;
    }

    public void useAnnexDocument(DocumentVO document) {
        Validate.notNull(document, "Annex document is required!");
        annexDocument = document;
    }

    public void useAnnexTemplate(String templateName) {
        Validate.notNull(templateName, "Annex template is required!");
        annexTemplate = templateName;
    }

    public void useVersionComment(String comment) {
        Validate.notNull(comment, "Version comment is required!");
        this.versionComment = comment;
    }

    public void useMilestoneComment(String milestoneComment) {
        Validate.notNull(milestoneComment, "milestoneComment is required!");
        this.milestoneComment = milestoneComment;
    }
    
    public void useIdsAndUrlsHolder(CollectionIdsAndUrlsHolder idsAndUrlsHolder) {
        Validate.notNull(idsAndUrlsHolder, "idsAndUrlsHolder is required!");
        this.idsAndUrlsHolder = idsAndUrlsHolder;
    }

    public void useCloneProposal(boolean cloneProposal) {
        this.cloneProposal = cloneProposal;
    }

    public void useEeaRelevance(boolean eeaRelevance) {
        LOG.trace("Using Proposal eeaRelevance... [eeaRelevance={}]", eeaRelevance);
        this.eeaRelevance = eeaRelevance;
    }

    public Bill executeCreateBill() {
        LOG.trace("Executing 'Create Bill' use case...");
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        Validate.notNull(bill, BILL_TEMPLATE_IS_REQUIRED);

        Option<BillMetadata> metadataOption = bill.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), BILL_METADATA_IS_REQUIRED);

        Validate.notNull(purpose, BILL_PURPOSE_IS_REQUIRED);
        BillMetadata metadata = metadataOption.get()
                .builder()
                .withPurpose(purpose)
                .build();

        Bill billCreated = billService.createBill(bill.getId(), leosPackage.getPath(), metadata, actionMsgMap.get(ContextActionService.METADATA_UPDATED),
                getContent(bill));
        return billService.createVersion(billCreated.getId(), VersionType.INTERMEDIATE, actionMsgMap.get(ContextActionService.DOCUMENT_CREATED));
    }

    public Bill executeImportBill() {
        LOG.trace("Executing 'Create Bill' use case...");
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        Validate.notNull(bill, BILL_TEMPLATE_IS_REQUIRED);
        Validate.notNull(purpose, BILL_PURPOSE_IS_REQUIRED);
        Validate.notNull(billDocument.getSource(), "Bill xml is required!");
        Validate.isTrue(bill.getMetadata().isDefined(), BILL_METADATA_IS_REQUIRED);

        final String newRef = createRefForBillAndUpdateContext();
        BillMetadata metadata = getBillMetadata();
        createRefForAnnexes(metadata);

        final String oldRef;
        if(cloneProposal) {
            oldRef = xmlContentProcessor.getElementValue(billDocument.getSource(), xPathCatalog.getXPathRefOriginForCloneRefAttr(), true);
        } else {
            oldRef = xmlContentProcessor.getElementValue(billDocument.getSource(), xPathCatalog.getXPathRefOrigin(), true);
        }

        updateBillRefsWithNewValue(newRef, oldRef);
        updateAnnexesRefsWithRefOrigin();

        final String updateComment = actionMsgMap.get(ContextActionService.METADATA_UPDATED);

        if (cloneProposal) {
            CloneDocumentMetadataVO cloneDocumentMetadataVO = new CloneDocumentMetadataVO(oldRef, originRef);
            bill = billService.createClonedBillFromContent(leosPackage.getPath(), metadata, cloneDocumentMetadataVO, updateComment, billDocument.getSource(), billDocument.getName());
        } else {
            bill = billService.createBillFromContent(leosPackage.getPath(), metadata, updateComment, billDocument.getSource(), billDocument.getName());
        }

        List<Annex> annexes = new ArrayList<>();
        for (DocumentVO docChild : billDocument.getChildDocuments()) {
            if (docChild.getCategory() == ANNEX) {
                useAnnexDocument(docChild);
                Annex annex = executeImportBillAnnex();
                annexes.add(annex);
            }
        }
    
        final String updateRefsComment = messageHelper.getMessage("internal.ref.updatedOnImport");
        final byte[] updatedBytes = xmlContentProcessor.doXMLPostProcessing(bill.getContent().get().getSource().getBytes()); //updateRefs
        bill = billService.updateBill(bill, updatedBytes, updateRefsComment);

        for (Annex annex : annexes) {
            DocumentVO docChild = billDocument.getChildDocuments().stream()
                    .filter(p -> Integer.parseInt(p.getMetadata().getIndex()) == annex.getMetadata().get().getIndex())
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Annex not found index " + annex.getMetadata().get().getIndex()));
            byte[] updatedAnnexBytes = xmlContentProcessor.doXMLPostProcessing(docChild.getSource());  //updateRefs
            annexService.updateAnnex(annex, updatedAnnexBytes, annex.getMetadata().get(), VersionType.MINOR, updateRefsComment);
        }
    
        final String createComment = actionMsgMap.get(ContextActionService.DOCUMENT_CREATED);
        return billService.createVersion(bill.getId(), VersionType.INTERMEDIATE, createComment);
    }

    private BillMetadata getBillMetadata() {
        return (BillMetadata) billDocument.getMetadataDocument();
    }
    
    private void updateAnnexesRefsWithRefOrigin() {
        for (DocumentVO docChild : billDocument.getChildDocuments()) {
            if (docChild.getCategory() == ANNEX) {
                final byte[] updatedAnnexBytes = docChild.getSource();
                final String newRef = docChild.getMetadataDocument().getRef();
                final String oldRef;
                if (cloneProposal) {
                    oldRef = xmlContentProcessor.getElementValue(updatedAnnexBytes, xPathCatalog.getXPathRefOriginForCloneRefAttr(), true);
                } else {
                    oldRef = xmlContentProcessor.getElementValue(updatedAnnexBytes, xPathCatalog.getXPathRefOrigin(), true);
                }
                updateBillRefsWithNewValue(newRef, oldRef);
                docChild.setSource(xmlContentProcessor.updateRefsWithRefOrigin(updatedAnnexBytes, newRef, oldRef));
                for (DocumentVO docChild_ : billDocument.getChildDocuments()) {
                    if (docChild_.getCategory() == ANNEX && !docChild_.getId().equals(docChild.getId())) {
                        docChild_.setSource(xmlContentProcessor.updateRefsWithRefOrigin(docChild_.getSource(), newRef, oldRef));
                    }
                }
            }
        }
    }

    private void updateBillRefsWithNewValue(String newRef, String oldRef) {
        billDocument.setSource(xmlContentProcessor.updateRefsWithRefOrigin(billDocument.getSource(), newRef, oldRef));
        for (DocumentVO docChild : billDocument.getChildDocuments()) {
            if (docChild.getCategory() == ANNEX) {
                docChild.setSource(xmlContentProcessor.updateRefsWithRefOrigin(docChild.getSource(), newRef, oldRef));
            }
        }
    }

    private String createRefForBillAndUpdateContext() {
        Validate.notNull(billDocument.getSource(), "Bill xml is required!");
        Validate.isTrue(bill.getMetadata().isDefined(), BILL_METADATA_IS_REQUIRED);

        final String ref = billService.generateBillReference(bill.getContent().get().getSource().getBytes(), bill.getMetadata().get().getLanguage());
        final BillMetadata updatedBillMetadata = bill.getMetadata().get()
                .builder()
                .withPurpose(purpose)
                .withRef(ref)
                .withEeaRelevance(eeaRelevance)
                .build();
        final byte[] updatedSource = xmlNodeProcessor.setValuesInXml(billDocument.getSource(), createValueMap(updatedBillMetadata), xmlNodeConfigProcessor.getConfig(updatedBillMetadata.getCategory()));
        
        billDocument.setName(ref + XML_DOC_EXT);
        billDocument.setMetadataDocument(updatedBillMetadata);
        billDocument.setSource(updatedSource);
        
        return ref;
    }

    private void createRefForAnnexes(BillMetadata metadata) {
        for (DocumentVO docChild : billDocument.getChildDocuments()) {
            if (docChild.getCategory() == ANNEX) {
                useAnnexDocument(docChild);
                createRefForAnnex(metadata);
            }
        }
    }

    public void executeUpdateBill() {
        LOG.trace("Executing 'Update Bill' use case...");
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        
        Bill billByPackagePath = billService.findBillByPackagePath(leosPackage.getPath());
        if(billByPackagePath != null) {
            Option<BillMetadata> metadataOption = billByPackagePath.getMetadata();
            Validate.isTrue(metadataOption.isDefined(), BILL_METADATA_IS_REQUIRED);
            Validate.notNull(purpose, BILL_PURPOSE_IS_REQUIRED);
            BillMetadata metadata = metadataOption.get()
                    .builder()
                    .withPurpose(purpose)
                    .withEeaRelevance(eeaRelevance)
                    .build();
            billService.updateBill(billByPackagePath, metadata, VersionType.MINOR, actionMsgMap.get(ContextActionService.METADATA_UPDATED));
            // We dont need to fetch the content here, the executeUpdateAnnexMetadata gets the latest version of the annex by id
            List<Annex> annexes = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
            annexes.forEach(annex -> {
                AnnexContextService annexContext = annexContextProvider.get();
                annexContext.usePurpose(purpose);
                annexContext.useAnnexId(annex.getId());
                annexContext.useActionMessageMap(actionMsgMap);
                annexContext.useEeaRelevance(eeaRelevance);
                annexContext.executeUpdateAnnexMetadata();
            });
        }
    }

    public void executeRemoveBillAnnex() {
        LOG.trace("Executing 'Remove Bill Annex' use case...");

        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);

        Bill billByPackagePath = billService.findBillByPackagePath(leosPackage.getPath());

        Annex deletedAnnex = annexService.findAnnex(annexId, true);
        int currentIndex = deletedAnnex.getMetadata().get().getIndex();

        annexService.deleteAnnex(deletedAnnex);

        String href = deletedAnnex.getName();
        billByPackagePath = billService.removeAttachment(billByPackagePath, href, actionMsgMap.get(ContextActionService.ANNEX_DELETED));

        // Renumber remaining annexes
        List<Annex> annexes = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
        HashMap<String, String> attachments = new HashMap<>();
        annexes.forEach(annex -> {
            int index = annex.getMetadata().get().getIndex();
            if (index > currentIndex || annexes.size() == 1) {
                AnnexContextService affectedAnnexContext = annexContextProvider.get();
                affectedAnnexContext.useAnnexId(annex.getId());
                affectedAnnexContext.useIndex(index == 1 ? index : index - 1);
                affectedAnnexContext.useActionMessageMap(actionMsgMap);
                String affectedAnnexNumber = AnnexNumberGenerator.getAnnexNumber(annexes.size() == 1 ? 0 : index - 1);
                affectedAnnexContext.useAnnexNumber(affectedAnnexNumber);
                affectedAnnexContext.executeUpdateAnnexIndex();
                attachments.put(annex.getName(), affectedAnnexNumber);
            }
        });

        billService.updateAttachments(billByPackagePath, attachments, actionMsgMap.get(ContextActionService.ANNEX_BLOCK_UPDATED));
    }

    public void executeCreateBillAnnex() {
        LOG.trace("Executing 'Create Bill Annex' use case...");

        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        Validate.notNull(bill, "Bill is required!");
        Validate.notNull(purpose, "Purpose is required!");
        AnnexContextService annexContext = annexContextProvider.get();
        annexContext.usePackage(leosPackage);
        annexContext.usePurpose(purpose);
        annexContext.useTemplate(annexTemplate);
        // we are using the same template for the annexes for sj-23 and sj19, the only change is this type. that's why we get it form the bill.
        Option<BillMetadata> metadataOption = bill.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), BILL_METADATA_IS_REQUIRED);
        BillMetadata metadata = metadataOption.get();
        annexContext.useType(metadata.getType());
        // We dont need to fetch the content here, the executeUpdateAnnexMetadata gets the latest version of the annex by id
        List<Annex> annexes = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
        int annexIndex = annexes.size() + 1;
        String annexNumber = AnnexNumberGenerator.getAnnexNumber(annexes.isEmpty() ? annexes.size() : annexIndex);
        annexContext.useIndex(annexIndex);
        annexContext.useCollaborators(bill.getCollaborators());
        annexContext.useActionMessageMap(actionMsgMap);
        annexContext.useAnnexNumber(annexNumber);
        annexContext.useCloneProposal(cloneProposal);
        annexContext.useOriginRef(originRef);
        Annex annex = annexContext.executeCreateAnnex();

        String href = annex.getName();
        String showAs = annexNumber; //createdAnnex.getMetadata().get().getNumber(); //ShowAs attribute is not used so it is kept as blank as of now.
        bill = billService.addAttachment(bill, href, showAs, actionMsgMap.get(ContextActionService.ANNEX_ADDED));

        //updating the first annex number if not done already
        Annex firstAnnex = getFirstIndexAnnex(annexes);
        String annexTitlePrefix = messageHelper.getMessage("document.annex.title.prefix");
        if (firstAnnex != null && annexTitlePrefix.equals(firstAnnex.getMetadata().get().getNumber())) {
            int firstIndex = firstAnnex.getMetadata().get().getIndex();
            annexContext.useAnnexId(firstAnnex.getId());
            annexContext.useIndex(firstIndex);
            annexContext.useCollaborators(bill.getCollaborators());
            annexContext.useActionMessageMap(actionMsgMap);
            String firstAnnexNumber = AnnexNumberGenerator.getAnnexNumber(firstIndex);
            annexContext.useAnnexNumber(firstAnnexNumber);
            annexContext.executeUpdateAnnexIndex();
            HashMap<String, String> attachmentsElements = new HashMap<>();
            attachmentsElements.put(firstAnnex.getName(), firstAnnexNumber);
            billService.updateAttachments(bill, attachmentsElements, actionMsgMap.get(ContextActionService.ANNEX_BLOCK_UPDATED));
        }
    }

    public Annex executeImportBillAnnex() {
        LOG.trace("Executing 'Import Bill Annex' use case...");
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        AnnexContextService annexContext = annexContextProvider.get();
        annexContext.usePackage(leosPackage);

        bill = billService.findBillByPackagePath(leosPackage.getPath());

        Option<BillMetadata> metadataOption = bill.getMetadata();
        Validate.isTrue(metadataOption.isDefined(), BILL_METADATA_IS_REQUIRED);
        BillMetadata metadata = metadataOption.get();
        annexContext.usePurpose(metadata.getPurpose());
        annexContext.useType(metadata.getType());
        annexContext.useEeaRelevance(eeaRelevance);

        MetadataVO annexMeta = annexDocument.getMetadata();
        annexContext.useTemplate(annexMeta.getDocTemplate());
        annexContext.useIndex(Integer.parseInt(annexDocument.getMetadata().getIndex()));
        annexContext.useCollaborators(bill.getCollaborators());
        annexContext.useDocument(annexDocument);
        annexContext.useActionMessageMap(actionMsgMap);
        annexContext.useAnnexNumber(annexMeta.getNumber());
        annexContext.useCloneProposal(cloneProposal);
        annexContext.useOriginRef(originRef);
        Annex annex = annexContext.executeImportAnnex();
        String ref = annex.getMetadata().get().getRef();
        idsAndUrlsHolder.addAnnexIdAndUrl(ref, urlBuilder.buildAnnexViewUrl(ref));
        if(cloneProposal) {
            idsAndUrlsHolder.addDocCloneAndOriginIdMap(ref, annexDocument.getRef());
        }

        String href = annex.getName();
        String showAs = annexMeta.getNumber(); //createdAnnex.getMetadata().get().getNumber(); //ShowAs attribute is not used so it is kept as blank as of now.
        bill = billService.addAttachment(bill, href, showAs, actionMsgMap.get(ContextActionService.ANNEX_ADDED));
        return annex;
    }

    public void createRefForAnnex(BillMetadata billMetadata) {
        LOG.trace("Executing 'Import Bill Annex' use case...");
        Validate.notNull(billMetadata.getType(), "Bill type is required!");
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        Validate.notNull(purpose, "Annex purpose is required!");
        
        MetadataVO annexMetadataVO = annexDocument.getMetadata();
        Annex annex = (Annex) templateService.getTemplate(annexMetadataVO.getDocTemplate());
        int annexIndex;
        if (annexMetadataVO.getIndex() != null) {
            annexIndex = Integer.parseInt(annexMetadataVO.getIndex());
        } else {
            // We dont need to fetch the content here, the executeUpdateAnnexMetadata gets the latest version of the annex by id
            List<Annex> annexes = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
            annexIndex = annexes.size() + 1;
        }

        final String ref = annexService.generateAnnexReference(annex.getContent().get().getSource().getBytes(), annexMetadataVO.getLanguage());
        final AnnexMetadata updatedAnnexMetadata = annex.getMetadata().getOrError(() -> "Annex metadata is required")
                .builder()
                .withPurpose(purpose)
                .withIndex(annexIndex)
                .withNumber(annexMetadataVO.getNumber())
                .withTitle(annexMetadataVO.getTitle())
                .withType(billMetadata.getType())
                .withTemplate(annexMetadataVO.getTemplate())
                .withRef(ref)
                .build();
        final byte[] updatedSource = xmlNodeProcessor.setValuesInXml(annexDocument.getSource(), createValueMap(updatedAnnexMetadata),
                xmlNodeConfigProcessor.getConfig(updatedAnnexMetadata.getCategory()), xmlNodeConfigProcessor.getOldPrefaceOfAnnexConfig());

        annexDocument.setName(ref + XML_DOC_EXT);
        annexDocument.setMetadataDocument(updatedAnnexMetadata);
        annexDocument.setSource(updatedSource);
    }

    public void executeMoveAnnex() {
        LOG.trace("Executing 'Update Bill Move Annex' use case...");

        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        Validate.notNull(moveDirection, "Bill moveDirection is required");
        Bill billByPackagePath = billService.findBillByPackagePath(leosPackage.getPath());
        Annex operatedAnnex = annexService.findAnnex(annexRef, true);
        int currentIndex = operatedAnnex.getMetadata().get().getIndex();
        Annex affectedAnnex = findAffectedAnnex(moveDirection.equalsIgnoreCase("UP"), currentIndex);

        AnnexContextService operatedAnnexContext = annexContextProvider.get();
        operatedAnnexContext.useAnnexId(operatedAnnex.getId());
        operatedAnnexContext.useIndex(affectedAnnex.getMetadata().get().getIndex());
        operatedAnnexContext.useActionMessageMap(actionMsgMap);
        String operatedAnnexNumber = AnnexNumberGenerator.getAnnexNumber(affectedAnnex.getMetadata().get().getIndex());
        operatedAnnexContext.useAnnexNumber(operatedAnnexNumber);
        operatedAnnexContext.executeUpdateAnnexIndex();

        AnnexContextService affectedAnnexContext = annexContextProvider.get();
        affectedAnnexContext.useAnnexId(affectedAnnex.getId());
        affectedAnnexContext.useIndex(currentIndex);
        affectedAnnexContext.useActionMessageMap(actionMsgMap);
        String affectedAnnexNumber = AnnexNumberGenerator.getAnnexNumber(currentIndex);
        affectedAnnexContext.useAnnexNumber(affectedAnnexNumber);
        affectedAnnexContext.executeUpdateAnnexIndex();

        //Update bill xml
        HashMap<String, String> attachments = new HashMap<>();
        attachments.put(operatedAnnex.getName(), operatedAnnexNumber);
        attachments.put(affectedAnnex.getName(), affectedAnnexNumber);

        billService.updateAttachments(billByPackagePath, attachments, actionMsgMap.get(ContextActionService.ANNEX_BLOCK_UPDATED));
    }

    private Annex findAffectedAnnex(boolean before, int index) {
        Validate.notNull(leosPackage, BILL_PACKAGE_IS_REQUIRED);
        // We dont need to fetch the content here, the executeUpdateAnnexMetadata gets the latest version of the annex by id
        List<Annex> annexes = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
        int targetIndex = index + (before ? -1 : 1); //index start with 0
        if (targetIndex < 0 || targetIndex > annexes.size()) {
            throw new UnsupportedOperationException("Invalid index requested");
        }

        for (Annex annex : annexes) {//assuming unsorted annex list
            annex = annexService.findAnnex(annex.getId(), true);
            if (annex.getMetadata().get().getIndex() == targetIndex) {
                return annex;
            }
        }
        throw new UnsupportedOperationException("Invalid index for annex");
    }


    /**
     * @param annexes list of Annexes currently added
     * @return result if first Annex is numbered or not
     */
    private Annex getFirstIndexAnnex(List<Annex> annexes) {
        Annex firstAnnex = null;
        for (Annex annex : annexes) {
            if (annex.getMetadata().get().getIndex() == 1) {
                firstAnnex = annex;
            }
        }
        return firstAnnex;
    }

    public void executeCreateMilestone() {
        Bill billByPackagePath = billService.findBillByPackagePath(leosPackage.getPath());
        if (billByPackagePath != null) {
            List<String> milestoneComments = billByPackagePath.getMilestoneComments();
            milestoneComments.add(milestoneComment);
            if (billByPackagePath.getVersionType().equals(VersionType.MAJOR)) {
                billByPackagePath = billService.updateBillWithMilestoneComments(billByPackagePath.getMetadata().get().getRef(), billByPackagePath.getId(), milestoneComments);
                LOG.info("Major version {} already present. Updated only milestoneComment for [bill={}]", billByPackagePath.getVersionLabel(), billByPackagePath.getId());
            } else {
                billByPackagePath = billService.updateBillWithMilestoneComments(billByPackagePath, milestoneComments, VersionType.MAJOR, versionComment);
                LOG.info("Created major version {} for [bill={}]", billByPackagePath.getVersionLabel(), billByPackagePath.getId());
            }
        }

        final List<Annex> annexes = packageService.findDocumentsByPackagePath(leosPackage.getPath(), Annex.class, false);
        annexes.forEach(annex -> {
            AnnexContextService annexContext = annexContextProvider.get();
            annexContext.useAnnexId(annex.getId());
            annexContext.useVersionComment(versionComment);
            annexContext.useMilestoneComment(milestoneComment);
            annexContext.executeCreateMilestone();
        });
    }
    
    public String getProposalId() {
        Proposal proposal = proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal != null ? proposal.getId() : null;
    }

    public void useOriginRef(String originRef) {
        this.originRef = originRef;
    }

    private byte[] getContent(Bill bill) {
        final Content content = bill.getContent().getOrError(() -> "Bill content is required!");
        return content.getSource().getBytes();
    }
}
