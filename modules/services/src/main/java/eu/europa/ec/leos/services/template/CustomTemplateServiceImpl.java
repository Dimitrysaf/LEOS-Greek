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
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.dto.response.CustomTemplateInfoResponse;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.support.VersionsUtil;
import eu.europa.ec.leos.services.user.UserHelper;
import eu.europa.ec.leos.services.user.UserService;
import eu.europa.ec.leos.vo.catalog.CatalogItem;
import eu.europa.ec.leos.vo.structure.TocItem;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.io.IOException;
import java.util.*;

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


    @Override
    public List<CatalogItem> getCustomTemplatesCatalog(String entityName) throws IOException {
        String customTemplatesCatalog = userHelper.getUserDgCustomTemplatesCatalog(entityName);
        return templateService.getTemplatesCatalog(customTemplatesCatalog);
    }

    @Override
    public void publishTemplate(String legFileId,String templateName, List<String> dgCodes) {
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
        
        // Publish template with validated DG codes
        leosRepository.publishCustomTemplate(legFileId, templateName, finalDgCodes, user.getLogin(), originalDg);
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

    public void alignDocumentsFromBaseVersion(List<? extends XmlDocument> sourceXmlDocs, List<? extends XmlDocument> targetXmlDocs, DocumentVO documentToAlignWith, String ref) {
        sourceXmlDocs.stream().filter(doc -> VersionsUtil.BASE_VERSION.equals(doc.getVersionLabel())).forEach(sourceXmlDoc -> {
            try {
                this.structureContext.get().useDocumentTemplate(sourceXmlDoc.getMetadata().get().getDocTemplate());
                LeosCategory category = sourceXmlDoc.getCategory();
                XmlDocument targetXmlDoc = targetXmlDocs.stream().filter(doc -> doc.getCategory().equals(category)).findAny()
                        .orElseThrow(() -> new IllegalArgumentException(category.toString() + " document not found"));
                XmlDocument sourceXmlDocWithContent = leosRepository.findDocumentByVersion(XmlDocument.class, sourceXmlDoc.getMetadata().get().getRef(),
                        VersionsUtil.BASE_VERSION);
                XmlDocument alignedTargetBaseDocument = alignWithBaseVersion(targetXmlDoc, sourceXmlDocWithContent);
                alignWithLatestMilestoneIfDifferentFromBase(sourceXmlDocs, sourceXmlDocWithContent, alignedTargetBaseDocument, documentToAlignWith, category);
            } catch (IllegalArgumentException e) {
                    LOG.error("{} in {} version", e.getMessage(), ref.substring(ref.lastIndexOf("-") + 1).toUpperCase());
            }
        });
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
            DocumentVO documentToAlignWith, LeosCategory category) {
        if (versionExistsBetweenBaseAndLatestMilestone(sourceXmlDocs, category)) {
            DocumentVO sourceDocument = documentToAlignWith;
            switch (category) {
                case MEMORANDUM:
                    sourceDocument = documentToAlignWith.getChildDocument(LeosCategory.MEMORANDUM);
                    break;
                case BILL:
                    sourceDocument = documentToAlignWith.getChildDocument(LeosCategory.BILL);
                    break;
                case ANNEX:
                    sourceDocument = documentToAlignWith.getChildDocument(LeosCategory.BILL).getChildDocument(LeosCategory.ANNEX);
                    break;
            }
            byte[] sourceBaseXml = sourceBaseXmlDoc.getContent().get().getSource().getBytes();
            alignDocumentIdAndStructure(targetXmlDoc, sourceDocument.getSource(), sourceBaseXml);
        }
    }

    private static boolean versionExistsBetweenBaseAndLatestMilestone(List<? extends XmlDocument> sourceXmlDocs, LeosCategory category) {
        return sourceXmlDocs.stream().filter(doc -> doc.getCategory().equals(category) && !doc.getVersionLabel().startsWith("0.0")).count() > 2;
    }

    @Override
    public void alignDocument(DocumentVO sourceBaseDocument, DocumentVO sourceDocument, List<XmlDocument> targetXmlDocs) {
        if (!sourceBaseDocument.equals(sourceDocument)) {
            this.structureContext.get().useDocumentTemplate(sourceDocument.getMetadata().getDocTemplate());
            byte[] sourceXml = sourceDocument.getSource();
            byte[] sourceBaseXml = sourceBaseDocument.getSource();
            LeosCategory category = sourceDocument.getCategory();
            XmlDocument targetXmlDoc = targetXmlDocs.stream().filter(doc -> doc.getCategory().equals(category)).findAny()
                    .orElseThrow(() -> new IllegalArgumentException(category.toString() + " document not found"));
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