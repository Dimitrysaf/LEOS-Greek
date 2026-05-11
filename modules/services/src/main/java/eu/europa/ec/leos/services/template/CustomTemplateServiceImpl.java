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
package eu.europa.ec.leos.services.template;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.LinkedPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.api.exception.LeosExceptionResponse;
import eu.europa.ec.leos.services.dto.response.CustomTemplateInfoResponse;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.utils.LanguageMapUtils;
import eu.europa.ec.leos.services.support.XmlUtils;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import eu.europa.ec.leos.vo.structure.TocItem;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import jakarta.inject.Provider;
import java.io.IOException;
import java.util.*;

import eu.europa.ec.leos.services.api.ApiService;
import eu.europa.ec.leos.services.api.exception.PendingTranslationException;

import static eu.europa.ec.leos.services.support.XmlUtils.createDocument;
import static eu.europa.ec.leos.services.support.XmlUtils.hasDescendantWithAttribute;
import static eu.europa.ec.leos.services.support.XmlHelper.*;

@Service
@RequiredArgsConstructor
class CustomTemplateServiceImpl implements CustomTemplateService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomTemplateServiceImpl.class);
    
    private final LeosRepository leosRepository;
    private final UserService userService;
    private final TemplateService templateService;
    private final SecurityContext securityContext;
    private final UserHelper userHelper;
    private final PackageService packageService;
    private final Provider<StructureContext> structureContext;
    private final MessageHelper messageHelper;
    private final NumberService numberService;
    private final XmlContentProcessor xmlContentProcessor;
    private final LanguageGroupService languageGroupService;
    private final DocumentLanguageContext documentLanguageContext;
    // Provider used to break circular dependency: ApiServiceImpl -> CustomTemplateService -> ApiService
    private final Provider<ApiService> apiServiceProvider;


    @Override
    public List<CatalogItem> getCustomTemplatesCatalog(String entityName) throws IOException {
        String customTemplatesCatalog = userHelper.getUserDgCustomTemplatesCatalog(entityName);
        return templateService.getTemplatesCatalog(customTemplatesCatalog);
    }

    @Override
    public void publishTemplate(String legFileId,String templateName, List<String> dgCodes) throws Exception {
        // Get all valid organizations from user repository for validation
        List<String> validOrganizations = userService.getAllOrganizations();
        Set<String> validOrgSet = new HashSet<>(validOrganizations);

        User user = userHelper.validateTemplateManager("This user is not allowed to publish.");
        String originalDg = "";
        // Add user's entity organizations to DG codes if not already present
        List<String> finalDgCodes = new ArrayList<>(dgCodes);
        if (user.getDefaultEntity() != null) {
            originalDg = user.getDefaultEntity().getOrganizationName();
            if (originalDg != null && !finalDgCodes.contains(originalDg)) {
                finalDgCodes.add(originalDg);
            }
        }
        
        // Validate all DG codes against valid organizations
        for (String dgCode : finalDgCodes) {
            if (!validOrgSet.contains(dgCode)) {
                throw new IllegalArgumentException("Invalid organization: " + dgCode);
            }
        }

        List<LinkedPackage> languagePackages = getLanguagePackages(legFileId);
        List<String> languageMilestoneLegIds = createMilestonesForLanguagePackages(languagePackages);

        // Publish template with validated DG codes
        leosRepository.publishCustomTemplate(legFileId, templateName, finalDgCodes, user.getLogin(), originalDg);
        for (String languageMilestoneLegId : languageMilestoneLegIds) {
            leosRepository.publishCustomTemplate(languageMilestoneLegId, templateName, finalDgCodes, user.getLogin(), originalDg);
        }
    }
    @Override
    public void updateTemplate(String packageId,String templateName, List<String> dgCodes) {
        // Get all valid organizations from user repository for validation
        List<String> validOrganizations = userService.getAllOrganizations();
        Set<String> validOrgSet = new HashSet<>(validOrganizations);

        // Validate authenticated user exists
        User user = securityContext.getUser();
        if (user == null) {
            throw new IllegalStateException("No authenticated user found");
        }

        //TODO check the user Role SUPPORT
        if (!user.getRoles().contains("TEMPLATE_MANAGER") && !user.getRoles().contains("SUPPORT")){
            throw new IllegalStateException("This user is not allowed to update template.");
        }
        String originalDg = "";
        // Add user's entity organizations to DG codes if not already present
        List<String> finalDgCodes = new ArrayList<>(dgCodes);
        if (user.getDefaultEntity() != null) {
            originalDg = user.getDefaultEntity().getOrganizationName();
            if (originalDg != null && !finalDgCodes.contains(originalDg)) {
                finalDgCodes.add(originalDg);
            }
        }

        // Validate all DG codes against valid organizations
        for (String dgCode : finalDgCodes) {
            if (!validOrgSet.contains(dgCode)) {
                throw new IllegalArgumentException("Invalid organization: " + dgCode);
            }
        }

        // Publish template with validated DG codes
        leosRepository.updateCustomTemplate(packageId, templateName, finalDgCodes, user.getLogin(), originalDg);
    }

    @Override
    public Boolean unPublishTemplate(String catalogKey) {
        CatalogItem templateItem = null;
        try {
             templateItem = templateService.getTemplateByKey(catalogKey);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        // Validate authenticated user exists
        User user = securityContext.getUser();
        if (user == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        if (templateItem == null) {
            throw new IllegalStateException("Unable to unpublish: template not found.");
        }

        if (!isAuthorizedToUnpublishTemplate(user, templateItem)) {
            throw new IllegalStateException("This user is not allowed to un publish.");
        }

        String[] parts = catalogKey.split("_");
        String packageId = parts[1];
        // Publish template with validated DG codes
        return leosRepository.unPublishCustomTemplate(packageId, user.getLogin());
    }

    private boolean isAuthorizedToUnpublishTemplate(User user, CatalogItem templateItem) {
        String defaultDg = user.getDefaultEntity().getOrganizationName();
        boolean isSupport = user.getRoles().contains("SUPPORT");
        boolean isTemplateManager = user.getRoles().contains("TEMPLATE_MANAGER");
        boolean isTemplateDgOwner = defaultDg.equals(templateItem.getOriginalDg());

        return isSupport || (isTemplateManager && isTemplateDgOwner);
    }

    @Override
    public CustomTemplateInfoResponse getTemplateInfo(String proposalRef) {
        LeosPackage leosPackage = packageService.findPackageByDocumentRef(proposalRef, Proposal.class);
        Map<String, Object> templateInfo = leosRepository.getTemplateInfo(leosPackage.getId());
        String templateName = (String) templateInfo.get("templateName");
        List<String> templateVisibility = (List<String>) templateInfo.get("templateVisibility");
        return new CustomTemplateInfoResponse(templateName, templateVisibility);
    }

    @Override
    public List<String> createMilestonesForLanguagePackages(List<LinkedPackage> languagePackages) throws Exception {
        validateNoPendingTranslations(languagePackages);
        List<String> milestoneLegIds = new ArrayList<>();
        for (LinkedPackage lp : languagePackages) {
            String proposalRef = apiServiceProvider.get().findDocumentRefByPackageIdAndCategory(lp.getLinkedPackageId(), LeosCategory.PROPOSAL.name());
            try {
                LegDocument languageLeg = apiServiceProvider.get().createMilestone(proposalRef, "");
                milestoneLegIds.add(languageLeg.getId());
            } catch (LeosExceptionResponse e) {
                LOG.info("Milestone already exists for proposal {}, using latest", proposalRef);
                packageService.findDocumentsByPackageId(lp.getLinkedPackageId(), LegDocument.class, false, false).stream()
                        .max(Comparator.comparing(LegDocument::getInitialCreationInstant))
                        .map(LegDocument::getId)
                        .ifPresent(milestoneLegIds::add);
            }
        }
        return milestoneLegIds;
    }

    private List<LinkedPackage> getLanguagePackages(String legFileId) throws PendingTranslationException {
        LeosPackage mainPackage = packageService.findPackageByLegFileId(legFileId);
        if (mainPackage == null) {
            throw new IllegalArgumentException("Package not found for leg file: " + legFileId);
        }
        return packageService.findLinkedPackagesByPackageId(mainPackage.getId());
    }

    private void validateNoPendingTranslations(List<LinkedPackage> languagePackages) throws PendingTranslationException {
        List<String> pendingLanguages = languagePackages.stream()
                .map(lp -> findPendingTranslationsInPackage(lp.getLinkedPackageId()))
                .flatMap(Optional::stream).toList();

        if (!pendingLanguages.isEmpty()) {
            throw new PendingTranslationException(String.join(", ", pendingLanguages));
        }
    }

    private Optional<String> findPendingTranslationsInPackage(String packageId) {
        return packageService.findDocumentsByPackageId(packageId, XmlDocument.class, false, true).stream()
                .filter(doc -> hasDescendantWithAttribute(XmlUtils.createDocument(doc), LEOS_UPDATE_TRANSLATION))
                .map(doc -> doc.getMetadata().get().getLanguage())
                .findFirst();
    }

    public void alignDocumentsFromBaseVersion(List<? extends XmlDocument> sourceXmlDocs, List<? extends XmlDocument> targetXmlDocs, DocumentVO documentToAlignWith ) {
        sourceXmlDocs.stream().filter(doc -> VersionsUtil.BASE_VERSION.equals(doc.getVersionLabel())).forEach(sourceXmlDoc -> {
            try {
                this.structureContext.get().useDocumentTemplate(sourceXmlDoc.getMetadata().get().getDocTemplate());
                XmlDocument targetXmlDoc = findMatchingTargetDocument(sourceXmlDoc.getCategory(), sourceXmlDoc.getMetadata().get().getRef(), targetXmlDocs);
                XmlDocument sourceXmlDocWithContent = leosRepository.findDocumentByVersion(XmlDocument.class, sourceXmlDoc.getMetadata().get().getRef(),
                        VersionsUtil.BASE_VERSION);
                XmlDocument alignedTargetBaseDocument = alignWithBaseVersion(targetXmlDoc, sourceXmlDocWithContent);
                alignWithLatestMilestoneIfDifferentFromBase(sourceXmlDocs, sourceXmlDocWithContent, alignedTargetBaseDocument, documentToAlignWith);
            } catch (IllegalArgumentException e) {
                String targetLanguage = targetXmlDocs.getFirst().getMetadata().get().getLanguage();
                LOG.error("{} in {} version", e.getMessage(), targetLanguage.toUpperCase());
            }
        });
    }

    private static XmlDocument findMatchingTargetDocument(LeosCategory category, String sourceRef, List<? extends XmlDocument> targetXmlDocs) {
        String targetLanguage = targetXmlDocs.getFirst().getMetadata().get().getLanguage();
        String translatedRef = LanguageMapUtils.getTranslatedProposalReference(sourceRef, targetLanguage);
        return targetXmlDocs.stream().filter(doc -> translatedRef.equals(doc.getMetadata().get().getRef())).findAny()
                .orElseThrow(() -> new IllegalArgumentException(category + " document with ref " + translatedRef + " not found"));
    }

    private XmlDocument alignWithBaseVersion(XmlDocument targetXmlDoc, XmlDocument sourceXmlDoc) {
        byte[] alignedTargetXmlContent = xmlContentProcessor.alignBaseVersionDocumentIds(sourceXmlDoc, targetXmlDoc);
        return this.leosRepository.updateDocument(
                targetXmlDoc.getId(),
                alignedTargetXmlContent,
                VersionType.TECHNICAL,
                this.messageHelper.getMessage("operation.document.aligned.base"),
                XmlDocument.class
        );
    }

    private void alignWithLatestMilestoneIfDifferentFromBase(List<? extends XmlDocument> sourceXmlDocs, XmlDocument sourceBaseXmlDoc, XmlDocument targetXmlDoc,
            DocumentVO documentToAlignWith) {
        String sourceRef = sourceBaseXmlDoc.getMetadata().get().getRef();
        if (versionExistsBetweenBaseAndLatestMilestone(sourceXmlDocs, sourceRef)) {
            DocumentVO sourceDocument = findDocumentVOForSource(documentToAlignWith, sourceBaseXmlDoc.getCategory(), sourceRef);
            if (sourceDocument != null) {
                byte[] sourceBaseXml = sourceBaseXmlDoc.getContent().get().getSource().getBytes();
                alignDocumentIdAndStructure(targetXmlDoc, sourceDocument.getSource(), sourceBaseXml);
            }
        }
    }

    private static DocumentVO findDocumentVOForSource(DocumentVO documentToAlignWith, LeosCategory category, String sourceRef) {
        return switch (category) {
            case MEMORANDUM -> documentToAlignWith.getChildDocument(LeosCategory.MEMORANDUM);
            case BILL -> documentToAlignWith.getChildDocument(LeosCategory.BILL);
            case ANNEX -> {
                DocumentVO bill = documentToAlignWith.getChildDocument(LeosCategory.BILL);
                yield bill != null ? bill.getChildDocuments(LeosCategory.ANNEX).stream()
                        .filter(a -> sourceRef.equals(a.getRef())).findFirst().orElse(null) : null;
            }
            default -> documentToAlignWith;
        };
    }

    private static boolean versionExistsBetweenBaseAndLatestMilestone(List<? extends XmlDocument> sourceXmlDocs, String sourceRef) {
        return sourceXmlDocs.stream().filter(doc -> doc.getMetadata().get().getRef().equals(sourceRef)
                && !doc.getVersionLabel().startsWith("0.0")).count() > 2;
    }

    @Override
    public void alignDocument(DocumentVO sourceBaseDocument, DocumentVO sourceDocument, List<XmlDocument> targetXmlDocs) {
        if (!sourceBaseDocument.equals(sourceDocument)) {
            this.structureContext.get().useDocumentTemplate(sourceDocument.getMetadata().getDocTemplate());
            byte[] sourceXml = sourceDocument.getSource();
            byte[] sourceBaseXml = sourceBaseDocument.getSource();
            XmlDocument targetXmlDoc = findMatchingTargetDocument(sourceDocument.getCategory(), sourceDocument.getRef(), targetXmlDocs);
            alignDocumentIdAndStructure(targetXmlDoc, sourceXml, sourceBaseXml);
        }
        alignChildDocuments(sourceBaseDocument, sourceDocument, targetXmlDocs);
    }

    private void alignDocumentIdAndStructure(XmlDocument targetXmlDoc, byte[] sourceXml, byte[] sourceBaseXml) {
        byte[] alignedTargetXmlContent = xmlContentProcessor.alignLatestVersionDocument(sourceXml, sourceBaseXml, targetXmlDoc);
        alignedTargetXmlContent = renumberDocument(targetXmlDoc, alignedTargetXmlContent);
        this.leosRepository.updateDocument(
                targetXmlDoc.getId(),
                alignedTargetXmlContent,
                VersionType.INTERMEDIATE,
                this.messageHelper.getMessage("operation.document.aligned.milestone"),
                XmlDocument.class
        );
    }

    private void alignChildDocuments(DocumentVO sourceBaseDocument, DocumentVO sourceDocument, List<XmlDocument> targetXmlDocs) {
        sourceDocument.getChildDocuments().forEach(
                childDocument -> sourceBaseDocument.getChildDocuments().stream().filter(doc -> doc.getRef().equals(childDocument.getRef())).findAny()
                        .ifPresent(baseChildDocument -> alignDocument(baseChildDocument, childDocument, targetXmlDocs)));
    }

    private byte[] renumberDocument(XmlDocument document, byte[] xmlContent) {
        if (Arrays.asList(LeosCategory.BILL, LeosCategory.ANNEX).contains(document.getCategory())) {
            List<TocItem> tocItems = this.structureContext.get().getTocItems();
            String documentLanguage = document.getMetadata().get().getLanguage();
            this.languageGroupService.getLanguageMap();
            this.documentLanguageContext.setDocumentLanguage(documentLanguage);
            xmlContent = this.numberService.renumberArticles(xmlContent, false);
            xmlContent = this.numberService.renumberRecitals(xmlContent);
            xmlContent = this.numberService.renumberLevel(xmlContent);
            xmlContent = this.numberService.renumberParagraph(xmlContent);
            xmlContent = this.numberService.renumberDivisions(xmlContent);
            for (String higherElement : HIGHER_ELEMENTS) {
                xmlContent = this.numberService.renumberHigherSubDivisions(xmlContent, documentLanguage, higherElement, tocItems);
            }
        }
        return xmlContent;
    }
}