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
package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.common.CustomTemplateMilestoneStatus;
import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.entities.*;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.CatalogException;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service implementation for managing custom template catalogs.
 * Handles publishing, versioning, and catalog operations for custom templates.
 * 
 * <p>This service is thread-safe and uses synchronized methods to prevent
 * concurrent catalog modifications that could lead to data inconsistency.</p>
 */
@Service
public class CatalogServiceImpl implements CatalogService {
    private static final Logger LOG = LoggerFactory.getLogger(CatalogServiceImpl.class);
    private static final String CUSTOM_TEMPLATE_COMMENT = "Custom Template";
    private static final String CUSTOM_TEMPLATE_SEPARATOR = "_";
    private static final String CUSTOM_TEMPLATE_CATEGORY_PATH_SEPARATOR = ";";

    private final DocumentRepository documentRepository;
    private final DocumentMilestoneRepository documentMilestoneRepository;
    private final CustomTemplateEntitiesRepository customTemplateEntitiesRepository;
    private final DocumentVRepository documentVRepository;
    private final DocumentContentRepository documentContentRepository;
    private final ConfigService configService;
    private final ConfigurationVRepository configurationVRepository;
    private final ConfigCategoryRepository configCategoryRepository;
    private final DocumentService documentService;
    private final MilestoneDocumentService milestoneDocumentService;
    private final ConfigRepository configRepository;
    private final ConfigVersionRepository configVersionRepository;
    private final ConfigContentRepository configContentRepository;

    @Autowired
    public CatalogServiceImpl(DocumentRepository documentRepository,
                              DocumentMilestoneRepository documentMilestoneRepository,
                              CustomTemplateEntitiesRepository customTemplateEntitiesRepository,
                              DocumentVRepository documentVRepository,
                              DocumentContentRepository documentContentRepository,
                              ConfigService configService,
                              ConfigurationVRepository configurationVRepository,
                              ConfigCategoryRepository configCategoryRepository,
                              DocumentService documentService,
                              MilestoneDocumentService milestoneDocumentService,
                              ConfigRepository configRepository,
                              ConfigVersionRepository configVersionRepository,
                              ConfigContentRepository configContentRepository) {
        this.documentRepository = documentRepository;
        this.documentMilestoneRepository = documentMilestoneRepository;
        this.customTemplateEntitiesRepository = customTemplateEntitiesRepository;
        this.documentVRepository = documentVRepository;
        this.documentContentRepository = documentContentRepository;
        this.configService = configService;
        this.configurationVRepository = configurationVRepository;
        this.configCategoryRepository = configCategoryRepository;
        this.documentService = documentService;
        this.milestoneDocumentService = milestoneDocumentService;
        this.configRepository = configRepository;
        this.configVersionRepository = configVersionRepository;
        this.configContentRepository = configContentRepository;
    }

    /**
     * Publishes a custom template to specified entity catalogs.
     * 
     * <p>This method is synchronized to prevent concurrent modifications that could
     * override catalog information. It performs the following operations:</p>
     * <ul>
     *   <li>Validates the leg file and document existence</li>
     *   <li>Updates custom template entities</li>
     *   <li>Updates milestone status</li>
     *   <li>Handles catalog creation and updates</li>
     * </ul>
     * 
     * @param legFileId the ID of the leg file milestone
     * @param templateName the name of the custom template
     * @param dgs list of entity names (DGs) to publish the template to
     * @param userId the ID of the user performing the operation
     * @throws CatalogException if validation fails or database operations fail
     */
    @Override
    @Transactional
    public synchronized void publishCustomTemplate(String legFileId, String templateName, List<String> dgs, String userId) throws CatalogException {
        LOG.info("Publishing custom template: name={}, description={}, categories={}", templateName, legFileId, dgs);

        Optional<LeosDocument> legFile = milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId));

        if (!legFile.isPresent()){
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, "LegFile not found");
        }


        Optional<Document> leosDocument = documentRepository.findById(legFile.get().getDocumentId());

        if (!leosDocument.isPresent()){
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, "Document not found");
        }

        // Get the package from the document
        Package pkg = leosDocument.get().getPackageId();
        
        // 1. Get custom template entities for this package
        List<String> existingEntities = getCustomTemplateEntitiesByPackage(pkg);
        
        // 2. Update custom template entities with new ones from dgs parameter
        updateCustomTemplateEntities(pkg, dgs, userId);

        // 3. Update milestone status for custom template
        updateCustomTemplateMilestones(pkg, leosDocument.get().getId(), userId);

        // 4. Handle catalog creation based on existing entities
        handleCatalog(existingEntities, dgs, templateName, userId, pkg);
    }

    /**
     * Retrieves existing custom template entities for a package.
     * 
     * @param pkg the package to query
     * @return list of entity names, empty if none exist
     */
    private List<String> getCustomTemplateEntitiesByPackage(Package pkg) {
        Optional<CustomTemplateEntities> entities = customTemplateEntitiesRepository.findByPackageId(pkg);
        if (entities.isPresent() && entities.get().getEntities() != null) {
            return Arrays.asList(entities.get().getEntities().split(","));
        }
        return Collections.emptyList();
    }

    /**
     * Updates or creates custom template entities for a package.
     * 
     * @param pkg the package to update
     * @param newEntities list of new entity names
     * @param userId the user performing the update
     */
    private void updateCustomTemplateEntities(Package pkg, List<String> newEntities, String userId) {
        Optional<CustomTemplateEntities> existing = customTemplateEntitiesRepository.findByPackageId(pkg);
        CustomTemplateEntities entities;

        if (existing.isPresent()) {
            entities = existing.get();
            entities.setAuditLastMBy(userId);
            entities.setAuditLastMDate(LocalDateTime.now());
        } else {
            entities = new CustomTemplateEntities();
            entities.setPackageId(pkg);
            entities.setAuditCBy(userId);
            entities.setAuditCDate(LocalDateTime.now());
        }

        entities.setEntities(String.join(",", newEntities));
        customTemplateEntitiesRepository.save(entities);
    }

    /**
     * Updates milestone status for custom template publication.
     * Unpublishes previous custom template milestones and publishes the current one.
     * 
     * @param pkg the package containing the documents
     * @param currentDocumentId the ID of the current document
     * @param userId the user performing the update
     * @throws CatalogException if milestone is already published or update fails
     */
    private void updateCustomTemplateMilestones(Package pkg, BigDecimal currentDocumentId, String userId) throws CatalogException {
        DocumentMilestone currentMilestone = documentMilestoneRepository.findByDocumentId(currentDocumentId);

        if (currentMilestone == null || currentMilestone.getStatus().equals(CustomTemplateMilestoneStatus.PUBLISHED.getValue())) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, "Milestone already published!");
        }

        // Get all documents in the package
        List<Document> allDocuments = documentRepository.findAllDocumentsByPackageId(pkg);

        // Find all milestones for documents in the package
        List<DocumentMilestone> allMilestones = documentMilestoneRepository.findDocumentMilestonesByDocumentIn(allDocuments);

        // Unpublish previous custom template milestones
        for (DocumentMilestone milestone : allMilestones) {
            if (CustomTemplateMilestoneStatus.PUBLISHED.getValue().equals(milestone.getStatus()) &&
                    CUSTOM_TEMPLATE_COMMENT.equals(milestone.getMilestoneComments())) {
                milestone.setStatus(CustomTemplateMilestoneStatus.UNPUBLISHED.getValue());
                milestone.setAuditLastMBy(userId);
                // Comment to prevent all the Milestones to have the same modified date.
                // milestone.setAuditLastMDate(LocalDateTime.now());
                documentMilestoneRepository.save(milestone);
            }
        }

        // Update current milestone
        currentMilestone.setStatus(CustomTemplateMilestoneStatus.PUBLISHED.getValue());
        currentMilestone.setMilestoneComments(CUSTOM_TEMPLATE_COMMENT);
        currentMilestone.setAuditLastMBy(userId);
        currentMilestone.setAuditLastMDate(LocalDateTime.now());
        documentMilestoneRepository.save(currentMilestone);
    }

    //CATALOG MANIPULATION

    private void handleCatalog(List<String> existingEntities, List<String> newEntities, String customTemplateName, String userId, Package pkg) throws CatalogException {
        List<DocumentV> latestDocuments = getLatestDocumentsByPackageId(pkg.getId());

        // 1. If this is the first time any Template in this Package will be Published
        if (existingEntities.isEmpty()) {
            // Create catalogs for each new entity if needed
            for (String entity : newEntities) {
                ensureCatalogExists(entity, userId, pkg);
            }

            // Get template name from PROPOSAL document and add to each catalog
            String baseTemplateName = getBaseTemplateNameFromProposal(pkg);
            if (baseTemplateName != null) {
                Set<String> insertedTemplateKeys = new HashSet<>();

                // Insert xml into Catalogs
                for (String entity : newEntities) {
                    String catalogName = "catalog-" + entity;
                    Optional<Config> config = configRepository.findConfigByName(catalogName);
                    if (config.isPresent()) {
                        ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
                        ConfigContent content = configContentRepository.findConfigContentByVersionId(version);
                        String updatedCatalog = insertTemplateIntoCatalogAndExtractKeys(content.getContentString(), baseTemplateName, customTemplateName, pkg.getId().toString(), insertedTemplateKeys);
                        updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
                    }
                    else{
                        throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, "Cannot find Catalog");
                    }
                }

                // Save all documents related with Templates previously inserted
                // Get category codes for the inserted template keys
                List<ConfigurationV> configurationVList = getCategoryCodesFromTemplateKeys(insertedTemplateKeys);
                // Get config categories by their codes
                List<ConfigCategory> configCategories = getConfigCategoriesByCodes(configurationVList);
                // Save document files matching the extracted template keys
                saveDocumentsAsCustomTemplates(latestDocuments, configurationVList, configCategories, pkg.getId().toString(), userId);
                // Save config files for each template
                saveConfigFiles(insertedTemplateKeys, pkg.getId().toString(), userId);
            }
        } else {
            // Existing entities - handle scenarios

            // Scenario 1: Identify removed entities and delete templates from their catalogs
            List<String> removedEntities = existingEntities.stream()
                    .filter(entity -> !newEntities.contains(entity))
                    .collect(Collectors.toList());

            for (String removedEntity : removedEntities) {
                removeTemplateFromEntityCatalog(removedEntity, pkg.getId().toString(), userId);
            }

            // Scenario 2: Identify new entities and add templates to their catalogs
            List<String> newlyAddedEntities = newEntities.stream()
                    .filter(entity -> !existingEntities.contains(entity))
                    .collect(Collectors.toList());

            String templateName = getBaseTemplateNameFromProposal(pkg);
            if (templateName != null) {
                for (String newEntity : newlyAddedEntities) {
                    ensureCatalogExists(newEntity, userId, pkg);
                    addTemplateToEntityCatalog(newEntity, templateName, customTemplateName, pkg.getId().toString(), userId);
                }
            }

            // Scenario 3: Identify common entities and replace templates in their catalogs
            List<String> commonEntities = existingEntities.stream()
                    .filter(newEntities::contains)
                    .collect(Collectors.toList());

            if (templateName != null) {
                for (String commonEntity : commonEntities) {
                    replaceTemplateInEntityCatalog(commonEntity, templateName, customTemplateName, pkg.getId().toString(), userId);
                }
            }

            // Final step: Save documents as custom templates after all catalog operations
            if (templateName != null) {
                Set<String> allTemplateKeys = new HashSet<>();

                // Extract template keys from all updated catalogs
                for (String entity : newEntities) {
                    String catalogName = "catalog-" + entity;
                    Optional<Config> config = configRepository.findConfigByName(catalogName);
                    if (config.isPresent()) {
                        ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
                        ConfigContent content = configContentRepository.findConfigContentByVersionId(version);
                        extractTemplateKeysFromCatalog(content.getContentString(), pkg.getId().toString(), allTemplateKeys);
                    }
                }

                if (!allTemplateKeys.isEmpty()) {
                    // Mark previous custom template versions as not latest
                    markPreviousCustomTemplateVersionsAsNotLatest(pkg.getId().toString());

                    // Save new custom templates
                    List<ConfigurationV> configurationVList = getCategoryCodesFromTemplateKeys(allTemplateKeys);
                    List<ConfigCategory> configCategories = getConfigCategoriesByCodes(configurationVList);
                    saveDocumentsAsCustomTemplates(latestDocuments, configurationVList, configCategories, pkg.getId().toString(), userId);

                    // Save config files for each template key
                    saveConfigFiles(allTemplateKeys, pkg.getId().toString(), userId);


                }
            }
        }
    }


    private String createCatalogWithCategoriesOnly() throws CatalogException {
        try {
            byte[] catalogContent = getCatalogFromDatabase();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document sourceDoc = builder.parse(new ByteArrayInputStream(catalogContent));

            org.w3c.dom.Document targetDoc = builder.newDocument();

            // Copy the root element with its attributes
            Element sourceRoot = sourceDoc.getDocumentElement();
            Element targetRoot = targetDoc.createElement(sourceRoot.getTagName());

            // Copy root attributes
            NamedNodeMap rootAttributes = sourceRoot.getAttributes();
            for (int i = 0; i < rootAttributes.getLength(); i++) {
                Node attr = rootAttributes.item(i);
                targetRoot.setAttribute(attr.getNodeName(), attr.getNodeValue());
            }

            targetDoc.appendChild(targetRoot);

            copyCategoriesOnly(sourceRoot, targetRoot, targetDoc);

            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(targetDoc), new StreamResult(writer));
            return writer.toString();

        } catch (Exception e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    protected byte[] getCatalogFromDatabase() throws CatalogException {

        try {
            configService.findConfigByName("catalog");
        } catch (RepositoryException e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }

        Optional<ConfigurationV> configurationV = configurationVRepository.findConfigurationByName("catalog");
        return configurationV.get().getContent();
    }

    private void copyCategoriesOnly(Element source, Element target, org.w3c.dom.Document targetDoc) {
        NodeList children = source.getChildNodes();

        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);

            if (child.getNodeType() == Node.ELEMENT_NODE) {
                Element childElement = (Element) child;

                if ("item".equals(childElement.getTagName())) {
                    String type = childElement.getAttribute("type");

                    // Only process CATEGORY items, skip TEMPLATE and DOCUMENT items
                    if ("CATEGORY".equals(type)) {
                        // Create the category item element
                        Element categoryItem = targetDoc.createElement("item");

                        // Copy all attributes
                        NamedNodeMap attributes = childElement.getAttributes();
                        for (int k = 0; k < attributes.getLength(); k++) {
                            Node attr = attributes.item(k);
                            categoryItem.setAttribute(attr.getNodeName(), attr.getNodeValue());
                        }

                        // Add to target
                        target.appendChild(categoryItem);

                        // Copy child elements that are not items (names, descriptions, languages, etc.)
                        NodeList categoryChildren = childElement.getChildNodes();
                        for (int j = 0; j < categoryChildren.getLength(); j++) {
                            Node categoryChild = categoryChildren.item(j);

                            if (categoryChild.getNodeType() == Node.ELEMENT_NODE) {
                                Element categoryChildElement = (Element) categoryChild;
                                if (!"item".equals(categoryChildElement.getTagName())) {
                                    // Import the entire subtree for non-item elements
                                    Node importedChild = targetDoc.importNode(categoryChild, true);
                                    categoryItem.appendChild(importedChild);
                                }
                            } else if (categoryChild.getNodeType() == Node.TEXT_NODE) {
                                // Only copy non-empty text nodes
                                String textContent = categoryChild.getNodeValue();
                                if (textContent != null && !textContent.trim().isEmpty()) {
                                    Node importedText = targetDoc.importNode(categoryChild, false);
                                    categoryItem.appendChild(importedText);
                                }
                            }
                        }

                        // Recursively process nested categories within this category
                        copyCategoriesOnly(childElement, categoryItem, targetDoc);
                    }
                    // Skip TEMPLATE and DOCUMENT items completely
                }
            } else if (child.getNodeType() == Node.TEXT_NODE) {
                // Only copy non-empty text nodes
                String textContent = child.getNodeValue();
                if (textContent != null && !textContent.trim().isEmpty()) {
                    Node importedText = targetDoc.importNode(child, false);
                    target.appendChild(importedText);
                }
            }
        }
    }


    private String insertTemplateIntoCatalog(String existingCatalogXml, String templateKey, String templateName, String packageId) throws CatalogException {
        try {
            // Get the full catalog from DB to find the template
            byte[] fullCatalogContent = getCatalogFromDatabase();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            // Parse both documents
            org.w3c.dom.Document existingCatalogDoc = builder.parse(new ByteArrayInputStream(existingCatalogXml.getBytes("UTF-8")));
            org.w3c.dom.Document fullCatalogDoc = builder.parse(new ByteArrayInputStream(fullCatalogContent));

            // Find the template in the full catalog
            Element templateElement = findTemplateByKey(fullCatalogDoc, templateKey);
            if (templateElement == null) {
                throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING,
                        "Template with key " + templateKey + " not found");
            }

            // Find the parent category path for this template in the full catalog
            String categoryPath = findTemplateCategoryPath(fullCatalogDoc, templateKey);
            if (categoryPath == null) {
                throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING,
                        "Parent category for template " + templateKey + " not found");
            }

            // Find or create the corresponding category in the existing catalog
            Element targetCategory = ensureCategoryPath(existingCatalogDoc, fullCatalogDoc, categoryPath);

            // Import and insert the template
            Node importedTemplate = existingCatalogDoc.importNode(templateElement, true);

            // Add custom attributes to the imported template and its children
            if (importedTemplate instanceof Element) {
                Element templateEl = (Element) importedTemplate;
                templateEl.setAttribute("custom-name", templateName);
                templateEl.setAttribute("key", templateEl.getAttribute("key") + CUSTOM_TEMPLATE_SEPARATOR + packageId);

                // Add custom-id to all child items
                NodeList childItems = templateEl.getElementsByTagName("item");
                for (int i = 0; i < childItems.getLength(); i++) {
                    Element childItem = (Element) childItems.item(i);
                    String id = childItem.getAttribute("id");
                    if (StringUtils.isNotBlank(id)) {
                        childItem.setAttribute("id", id + CUSTOM_TEMPLATE_SEPARATOR + packageId);
                    }
                }
            }

            targetCategory.appendChild(importedTemplate);

            // Convert back to string
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(existingCatalogDoc), new StreamResult(writer));
            return writer.toString();

        } catch (Exception e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private Element findTemplateByKey(org.w3c.dom.Document doc, String templateKey) {
        NodeList items = doc.getElementsByTagName("item");
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("TEMPLATE".equals(item.getAttribute("type")) &&
                    templateKey.equals(item.getAttribute("key"))) {
                return item;
            }
        }
        return null;
    }

    private String findTemplateCategoryPath(org.w3c.dom.Document doc, String templateKey) {
        Element templateElement = findTemplateByKey(doc, templateKey);
        if (templateElement == null) {
            return null;
        }

        // Build the path from root to the parent category
        List<String> pathSegments = new ArrayList<>();
        Element current = (Element) templateElement.getParentNode();

        // Traverse up to build the path
        while (current != null && "item".equals(current.getTagName()) && "CATEGORY".equals(current.getAttribute("type"))) {
            String key = current.getAttribute("key");
            if (key != null && !key.isEmpty()) {
                pathSegments.add(key);
            }
            Node parent = current.getParentNode();
            if (parent instanceof Element && "item".equals(((Element) parent).getTagName())) {
                current = (Element) parent;
            } else {
                break;
            }
        }

        // Reverse the path (we built it from bottom up)
        Collections.reverse(pathSegments);

        return String.join(CUSTOM_TEMPLATE_CATEGORY_PATH_SEPARATOR, pathSegments);
    }

    private Element findCategoryByKey(org.w3c.dom.Document doc, String categoryKey) {
        return findCategoryByKey(doc.getDocumentElement(), categoryKey);
    }

    private Element findCategoryByKey(Element root, String categoryKey) {
        NodeList items = root.getElementsByTagName("item");
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("CATEGORY".equals(item.getAttribute("type")) &&
                    categoryKey.equals(item.getAttribute("key"))) {
                return item;
            }
        }
        return null;
    }

    private Element ensureCategoryPath(org.w3c.dom.Document targetDoc, org.w3c.dom.Document sourceDoc, String categoryPath) throws CatalogException {
        String[] pathSegments = categoryPath.split(CUSTOM_TEMPLATE_CATEGORY_PATH_SEPARATOR);
        Element current = targetDoc.getDocumentElement();

        for (String segment : pathSegments) {
            if (segment.isEmpty()) continue;

            Element found = findChildCategoryByKey(current, segment);
            if (found == null) {
                // Category doesn't exist, copy it from source
                Element sourceCategory = findCategoryByKey(sourceDoc, segment);
                if (sourceCategory == null) {
                    throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING,
                            "Category with key " + segment + " not found in source catalog");
                }

                // Create the category without its children (templates/subcategories)
                Element categoryItem = targetDoc.createElement("item");

                // Copy all attributes
                NamedNodeMap attributes = sourceCategory.getAttributes();
                for (int k = 0; k < attributes.getLength(); k++) {
                    Node attr = attributes.item(k);
                    categoryItem.setAttribute(attr.getNodeName(), attr.getNodeValue());
                }

                // Copy non-item child elements (names, descriptions, etc.)
                NodeList categoryChildren = sourceCategory.getChildNodes();
                for (int j = 0; j < categoryChildren.getLength(); j++) {
                    Node categoryChild = categoryChildren.item(j);

                    if (categoryChild.getNodeType() == Node.ELEMENT_NODE) {
                        Element categoryChildElement = (Element) categoryChild;
                        if (!"item".equals(categoryChildElement.getTagName())) {
                            Node importedChild = targetDoc.importNode(categoryChild, true);
                            categoryItem.appendChild(importedChild);
                        }
                    } else if (categoryChild.getNodeType() == Node.TEXT_NODE) {
                        Node importedText = targetDoc.importNode(categoryChild, false);
                        categoryItem.appendChild(importedText);
                    }
                }

                current.appendChild(categoryItem);
                found = categoryItem;
            }

            current = found;
        }

        return current;
    }

    private Element findChildCategoryByKey(Element parent, String categoryKey) {
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                Element childElement = (Element) child;
                if ("item".equals(childElement.getTagName()) &&
                        "CATEGORY".equals(childElement.getAttribute("type")) &&
                        categoryKey.equals(childElement.getAttribute("key"))) {
                    return childElement;
                }
            }
        }
        return null;
    }

    private void ensureCatalogExists(String entityName, String userId, Package pkg) throws CatalogException {
        String catalogName = "catalog-" + entityName;

        if (!configRepository.findConfigByName(catalogName).isPresent()) {
            createCatalog(catalogName, entityName, userId);
        }
    }

    private void createCatalog(String catalogName, String entityName, String userId) throws CatalogException {
        try {
            String baseCatalog = createCatalogWithCategoriesOnly();

            // Find the Config Category category
            ConfigCategory templateCatalogCategory = configCategoryRepository
                    .findConfigCategoriesByCategoryCode("CONFIG")
                    .orElseThrow(() -> new CatalogException(CatalogException.CatalogExceptionCode.DB_NOT_FOUND,
                            "Config Category category not found"));

            // Step 1: Create config entry
            Config config = new Config();
            config.setName(catalogName);
            config.setAuditCBy(userId);
            config.setAuditCDate(LocalDateTime.now());
            config.setAuditLastMBy(userId);
            config.setAuditLastMDate(LocalDateTime.now());
            config.setLanguage("EN");
            config.setConfigCategory(templateCatalogCategory);
            config = configRepository.save(config);

            // Step 2: Create version entry
            ConfigVersion version = new ConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel("1.0.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType(String.valueOf(VersionType.MAJOR.value()));
            version.setIsLatestMajorVersion(true);
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(true);
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setAuditLastMBy(userId);
            version.setAuditLastMDate(LocalDateTime.now());
            version = configVersionRepository.save(version);

            // Step 3: Create content entry
            ConfigContent content = new ConfigContent();
            content.setContentString(baseCatalog);
            content.setContentStreamMimeType("application/xml");
            content.setContentStreamFilename(catalogName + ".xml");
            content.setContentStreamId(config.getId().toString());
            content.setContentStreamLength(String.valueOf(baseCatalog.length()));
            content.setAuditCBy(userId);
            content.setAuditCDate(LocalDateTime.now());
            content.setVersionId(version);
            configContentRepository.save(content);

            // Save catalog config file for this entity
            Optional<ConfigurationV> catalogConfigFile = configurationVRepository.findConfigurationByName("catalog-CONF");
            if (catalogConfigFile.isPresent()) {
                ConfigCategory configCategory = configCategoryRepository
                        .findConfigCategoriesByCategoryCode("CONFIG")
                        .orElseThrow(() -> new CatalogException(CatalogException.CatalogExceptionCode.DB_NOT_FOUND, "CONFIG category not found"));

                String customKey = "catalog-" + entityName + "-CONF";
                saveConfigFile(catalogConfigFile.get(), customKey, configCategory, userId);
            }

            LOG.info("Successfully created entity catalog: {}", catalogName);

        } catch (Exception e) {
            LOG.error("Error creating entity catalog: {}", catalogName, e);
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private String getBaseTemplateNameFromProposal(Package pkg) {
        List<DocumentV> proposalDocs = documentVRepository.findAllVersionsByPackageIdAndCategoryCode(pkg.getId(), "PROPOSAL");
        if (!proposalDocs.isEmpty()) {
            return proposalDocs.get(0).getTemplate();
        }
        return null;
    }

    private String removeTemplateFromCatalog(String catalogXml, String customKey) throws CatalogException {
        if (StringUtils.isBlank(catalogXml)) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.PARA_NOT_FOUND, "catalogXml cannot be null or empty");
        }
        if (StringUtils.isBlank(customKey)) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.PARA_NOT_FOUND, "customKey cannot be null or empty");
        }

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document catalogDoc = builder.parse(new ByteArrayInputStream(catalogXml.getBytes(StandardCharsets.UTF_8)));

            if (customKey.startsWith("*_")) {
                // Remove all templates with matching packageId
                String packageId = customKey.substring(2);
                removeTemplatesByPackageId(catalogDoc.getDocumentElement(), packageId);
            } else {
                // Remove specific template by key
                Element templateToRemove = findTemplateByCustomKey(catalogDoc.getDocumentElement(), customKey);
                if (templateToRemove != null) {
                    templateToRemove.getParentNode().removeChild(templateToRemove);
                }
            }

            return documentToString(catalogDoc);
        } catch (Exception e) {
            LOG.error("Error removing template from catalog", e);
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private Element findTemplateByCustomKey(Element root, String customKey) {
        NodeList items = root.getElementsByTagName("item");
        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("TEMPLATE".equals(item.getAttribute("type")) &&
                    customKey.equals(item.getAttribute("key"))) {
                return item;
            }
        }
        return null;
    }

    private void removeTemplatesByPackageId(Element root, String packageId) {
        NodeList items = root.getElementsByTagName("item");
        List<Element> toRemove = new ArrayList<>();

        for (int i = 0; i < items.getLength(); i++) {
            Element item = (Element) items.item(i);
            if ("TEMPLATE".equals(item.getAttribute("type"))) {
                String customKey = item.getAttribute("key");
                if (customKey != null && customKey.endsWith(CUSTOM_TEMPLATE_SEPARATOR + packageId)) {
                    toRemove.add(item);
                }
            }
        }

        for (Element item : toRemove) {
            item.getParentNode().removeChild(item);
        }
    }

    private String documentToString(org.w3c.dom.Document doc) throws Exception {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));
        return writer.toString();
    }

    private List<DocumentV> getLatestDocumentsByPackageId(BigDecimal packageId) {
        return documentVRepository.findDocumentsByPackageId(packageId);
    }

    private String insertTemplateIntoCatalogAndExtractKeys(String existingCatalogXml, String templateKey, String templateName, String packageId, Set<String> extractedKeys) throws CatalogException {
        try {
            byte[] fullCatalogContent = getCatalogFromDatabase();
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document fullCatalogDoc = builder.parse(new ByteArrayInputStream(fullCatalogContent));

            Element templateElement = findTemplateByKey(fullCatalogDoc, templateKey);
            if (templateElement != null) {
                // Add direct child items
                NodeList childItems = templateElement.getElementsByTagName("item");
                for (int i = 0; i < childItems.getLength(); i++) {
                    Node node = childItems.item(i);
                    if (node != null && node.getNodeType() == Node.ELEMENT_NODE) {
                        Element item = (Element) node;
                        String type = item.getAttribute("type");
                        String id = item.getAttribute("id");
                        if (("TEMPLATE".equals(type) || "DOCUMENT".equals(type)) && StringUtils.isNotBlank(id)) {
                            extractedKeys.add(id);
                        }
                    }
                }
            }

            return insertTemplateIntoCatalog(existingCatalogXml, templateKey, templateName, packageId);
        } catch (Exception e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private List<ConfigurationV> getCategoryCodesFromTemplateKeys(Set<String> templateKeys) {
        List<ConfigurationV> configs = new ArrayList<>();
        for (String key : templateKeys) {
            Optional<ConfigurationV> config = configurationVRepository.findConfigurationByName(key);
            if (config.isPresent()) {
                configs.add(config.get());
            }
        }
        return configs;
    }

    private List<ConfigCategory> getConfigCategoriesByCodes(List<ConfigurationV> configV) {
        List<String> categoryCodes = configV.stream()
                .map(ConfigurationV::getCategoryCode)
                .collect(Collectors.toList());

        return configCategoryRepository.findConfigCategoriesByCategoryCodeIn(categoryCodes);
    }

    private void updateCustomTemplateConfigWithNewVersion(Config config, String newContent, String userId) throws CatalogException {
        try {
            // Get current version
            ConfigVersion currentVersion = configVersionRepository.findLastConfigVersionByConfigId(config.getId());

            // Mark current version as not latest
            currentVersion.setIsLatestVersion(false);
            configVersionRepository.save(currentVersion);

            // Create new version
            ConfigVersion newVersion = new ConfigVersion();
            newVersion.setConfigId(config.getId());
            newVersion.setVersionLabel(documentService.getNextVersionLabel(VersionType.MINOR, currentVersion.getVersionLabel()));
            newVersion.setVersionSeriesId(config.getId().toString());
            newVersion.setVersionType(String.valueOf(VersionType.MINOR.value()));
            newVersion.setIsLatestMajorVersion(false);
            newVersion.setIsLatestVersion(true);
            newVersion.setIsMajorVersion(false);
            newVersion.setIsVersionSeriesCheckedOut(false);
            newVersion.setAuditCBy(userId);
            newVersion.setAuditCDate(LocalDateTime.now());
            newVersion.setAuditLastMBy(userId);
            newVersion.setAuditLastMDate(LocalDateTime.now());
            newVersion = configVersionRepository.save(newVersion);

            // Create new content
            ConfigContent newContentEntity = new ConfigContent();
            newContentEntity.setContentString(newContent);
            newContentEntity.setContentStreamMimeType("application/xml");
            newContentEntity.setContentStreamFilename(config.getName() + ".xml");
            newContentEntity.setContentStreamId(config.getId().toString());
            newContentEntity.setContentStreamLength(String.valueOf(newContent.length()));
            newContentEntity.setAuditCBy(userId);
            newContentEntity.setAuditCDate(LocalDateTime.now());
            newContentEntity.setVersionId(newVersion);
            configContentRepository.save(newContentEntity);

        } catch (Exception e) {
            LOG.error("Error updating custom template config with new version", e);
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void saveDocumentsAsCustomTemplates(List<DocumentV> documents, List<ConfigurationV> configVList, List<ConfigCategory> configCategories, String packageId, String userId) throws CatalogException {
        for (ConfigurationV configV : configVList) {
            Optional<ConfigCategory> matchingCategory = findMatchingConfigCategory(configV, configCategories);
            if (matchingCategory.isPresent()) {
                Optional<DocumentV> matchingDoc = documents.stream()
                        .filter(doc -> doc.getConfigCategoryId() != null && doc.getConfigCategoryId().equals(matchingCategory.get().getId()))
                        .findFirst();

                String customKey = configV.getName() + CUSTOM_TEMPLATE_SEPARATOR + packageId;
                if (matchingDoc.isPresent()) {
                    Optional<DocumentContent> docContent = documentContentRepository.findDocumentContentByVersionId(matchingDoc.get().getVersionId());

                    if (!docContent.isPresent()) {
                        throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, "Document content not found for document: " + customKey);
                    }

                    saveDocumentAsCustomTemplate(docContent.get().getContent(), customKey, matchingCategory.get(), userId);
                }
                else{
                    saveDocumentAsCustomTemplate(new String(configV.getContent()), customKey, matchingCategory.get(), userId);
                }
            }
        }
    }

    private Optional<ConfigCategory> findMatchingConfigCategory(ConfigurationV configV, List<ConfigCategory> configCategories) {
        return configCategories.stream()
                .filter(category -> configV.getCategoryCode().equals(category.getCategoryCode()))
                .findFirst();
    }

    private void saveDocumentAsCustomTemplate(String docContent, String customKey, ConfigCategory configCategory, String userId) throws CatalogException {
        try {
            ConfigCategory templateCategory = configCategoryRepository
                    .findConfigCategoriesByCategoryCode(configCategory.getCategoryCode())
                    .orElseThrow(() -> new CatalogException(CatalogException.CatalogExceptionCode.DB_NOT_FOUND, "Config category not found: " + configCategory.getCategoryCode()));

            // Check if config already exists
            Optional<Config> existingConfig = configRepository.findConfigByName(customKey);
            Config config;

            if (existingConfig.isPresent()) {
                config = existingConfig.get();
                // Mark previous version as not latest
                ConfigVersion currentVersion = configVersionRepository.findLastConfigVersionByConfigId(config.getId());
                if (currentVersion != null) {
                    currentVersion.setIsLatestVersion(false);
                    configVersionRepository.save(currentVersion);
                }
            } else {
                config = new Config();
                config.setName(customKey);
                config.setAuditCBy(userId);
                config.setAuditCDate(LocalDateTime.now());
                config.setAuditLastMBy(userId);
                config.setAuditLastMDate(LocalDateTime.now());
                config.setLanguage("en");
                config.setConfigCategory(templateCategory);
                config = configRepository.save(config);
            }

            ConfigVersion version = new ConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel(existingConfig.isPresent() ? documentService.getNextVersionLabel(VersionType.MINOR, "1.0.0.0") : "1.0.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType(existingConfig.isPresent() ? String.valueOf(VersionType.MINOR.value()) : String.valueOf(VersionType.MAJOR.value()));
            version.setIsLatestMajorVersion(!existingConfig.isPresent());
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(!existingConfig.isPresent());
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setAuditLastMBy(userId);
            version.setAuditLastMDate(LocalDateTime.now());
            version = configVersionRepository.save(version);

            String cleanedContent = clearXmlIdAttributes(docContent);

            ConfigContent content = new ConfigContent();
            content.setContentString(cleanedContent);
            content.setContentStreamMimeType("application/xml");
            content.setContentStreamFilename(customKey + ".xml");
            content.setContentStreamId(config.getId().toString());
            content.setContentStreamLength(String.valueOf(cleanedContent.length()));
            content.setAuditCBy(userId);
            content.setAuditCDate(LocalDateTime.now());
            content.setVersionId(version);
            configContentRepository.save(content);

        } catch (Exception e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private String clearXmlIdAttributes(String xmlString) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        org.w3c.dom.Document doc = builder.parse(new ByteArrayInputStream(xmlString.getBytes(StandardCharsets.UTF_8)));

        clearXmlIdAttributes(doc.getDocumentElement());

        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));

        return writer.toString();
    }

    private void clearXmlIdAttributes(Node node) {
        if (node.getNodeType() == Node.ELEMENT_NODE) {
            Element element = (Element) node;
            element.removeAttribute("xml:id");
        }

        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            clearXmlIdAttributes(children.item(i));
        }
    }

    private void extractTemplateKeysFromCatalog(String catalogXml, String packageId, Set<String> templateKeys) throws CatalogException {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document catalogDoc = builder.parse(new ByteArrayInputStream(catalogXml.getBytes(StandardCharsets.UTF_8)));

            NodeList items = catalogDoc.getElementsByTagName("item");
            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);
                if ("TEMPLATE".equals(item.getAttribute("type"))) {
                    String customKey = item.getAttribute("key");
                    if (customKey != null && customKey.endsWith(CUSTOM_TEMPLATE_SEPARATOR + packageId)) {
                        NodeList childItems = item.getElementsByTagName("item");
                        for (int j = 0; j < childItems.getLength(); j++) {
                            Element childItem = (Element) childItems.item(j);
                            String id = childItem.getAttribute("id");
                            if (StringUtils.isNotBlank(id)) {
                                templateKeys.add(id);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void markPreviousCustomTemplateVersionsAsNotLatest(String packageId) {
        // Find all custom template configs with names ending with packageId
        List<Config> configs = configRepository.findAll().stream()
                .filter(config -> config.getName().endsWith(CUSTOM_TEMPLATE_SEPARATOR + packageId))
                .collect(Collectors.toList());

        for (Config config : configs) {
            ConfigVersion currentVersion = configVersionRepository.findLastConfigVersionByConfigId(config.getId());
            if (currentVersion != null && currentVersion.getIsLatestVersion()) {
                currentVersion.setIsLatestVersion(false);
                configVersionRepository.save(currentVersion);
            }
        }
    }

    // *-CONF.json files
    private void saveConfigFiles(Set<String> templateKeys, String packageId, String userId) throws CatalogException {
        try {
            ConfigCategory configCategory = configCategoryRepository
                    .findConfigCategoriesByCategoryCode("CONFIG")
                    .orElseThrow(() -> new CatalogException(CatalogException.CatalogExceptionCode.DB_NOT_FOUND, "CONFIG category not found"));

            for (String templateKey : templateKeys) {
                String configName = templateKey + "-CONF";
                Optional<ConfigurationV> configFile = configurationVRepository.findConfigurationByName(configName);

                if (configFile.isPresent()) {
                    String customKey = configName + CUSTOM_TEMPLATE_SEPARATOR + packageId;
                    saveConfigFile(configFile.get(), customKey, configCategory, userId);
                }
            }
        } catch (Exception e) {
            LOG.error("Error saving config files as custom templates", e);
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void saveConfigFile(ConfigurationV configFile, String customKey, ConfigCategory templateCategory, String userId) throws CatalogException {
        try {
            // Check if config already exists
            Optional<Config> existingConfig = configRepository.findConfigByName(customKey);
            Config config;

            if (existingConfig.isPresent()) {
                config = existingConfig.get();
                // Mark previous version as not latest
                ConfigVersion currentVersion = configVersionRepository.findLastConfigVersionByConfigId(config.getId());
                if (currentVersion != null) {
                    currentVersion.setIsLatestVersion(false);
                    configVersionRepository.save(currentVersion);
                }
            } else {
                config = new Config();
                config.setName(customKey);
                config.setAuditCBy(userId);
                config.setAuditCDate(LocalDateTime.now());
                config.setAuditLastMBy(userId);
                config.setAuditLastMDate(LocalDateTime.now());
                config.setLanguage("en");
                config.setConfigCategory(templateCategory);
                config = configRepository.save(config);
            }

            ConfigVersion version = new ConfigVersion();
            version.setConfigId(config.getId());
            version.setVersionLabel(existingConfig.isPresent() ? documentService.getNextVersionLabel(VersionType.MINOR, "1.0.0.0") : "1.0.0.0");
            version.setVersionSeriesId(config.getId().toString());
            version.setVersionType(existingConfig.isPresent() ? String.valueOf(VersionType.MINOR.value()) : String.valueOf(VersionType.MAJOR.value()));
            version.setIsLatestMajorVersion(!existingConfig.isPresent());
            version.setIsLatestVersion(true);
            version.setIsMajorVersion(!existingConfig.isPresent());
            version.setIsVersionSeriesCheckedOut(false);
            version.setAuditCBy(userId);
            version.setAuditCDate(LocalDateTime.now());
            version.setAuditLastMBy(userId);
            version.setAuditLastMDate(LocalDateTime.now());
            version = configVersionRepository.save(version);

            ConfigContent content = new ConfigContent();
            content.setContent(configFile.getContent());
            content.setContentStreamMimeType("application/json");
            content.setContentStreamFilename(customKey + ".json");
            content.setContentStreamId(config.getId().toString());
            content.setContentStreamLength(String.valueOf(configFile.getContent().length));
            content.setAuditCBy(userId);
            content.setAuditCDate(LocalDateTime.now());
            content.setVersionId(version);
            configContentRepository.save(content);

        } catch (Exception e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.ERROR_WHILE_CREATING, e.getMessage());
        }
    }

    private void removeTemplateFromEntityCatalog(String entityName, String packageId, String userId) throws CatalogException {
        String catalogName = "catalog-" + entityName;
        Optional<Config> config = configRepository.findConfigByName(catalogName);

        if (config.isPresent()) {
            ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
            ConfigContent content = configContentRepository.findConfigContentByVersionId(version);

            String customKey = "*#" + packageId; // Match any template with this packageId
            String updatedCatalog = removeTemplateFromCatalog(content.getContentString(), customKey);
            updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
        }
    }

    private void addTemplateToEntityCatalog(String entityName, String templateName, String customTemplateName, String packageId, String userId) throws CatalogException {
        String catalogName = "catalog-" + entityName;
        Optional<Config> config = configRepository.findConfigByName(catalogName);

        if (config.isPresent()) {
            ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
            ConfigContent content = configContentRepository.findConfigContentByVersionId(version);

            String updatedCatalog = insertTemplateIntoCatalog(content.getContentString(), templateName, customTemplateName, packageId);
            updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
        }
    }

    private void replaceTemplateInEntityCatalog(String entityName, String templateName, String customTemplateName, String packageId, String userId) throws CatalogException {
        String catalogName = "catalog-" + entityName;
        Optional<Config> config = configRepository.findConfigByName(catalogName);

        if (config.isPresent()) {
            ConfigVersion version = configVersionRepository.findLastConfigVersionByConfigId(config.get().getId());
            ConfigContent content = configContentRepository.findConfigContentByVersionId(version);

            // Remove existing templates for this package
            String customKey = "*#" + packageId;
            String catalogWithoutOldTemplate = removeTemplateFromCatalog(content.getContentString(), customKey);

            // Add the new template
            String updatedCatalog = insertTemplateIntoCatalog(catalogWithoutOldTemplate, templateName, customTemplateName, packageId);
            updateCustomTemplateConfigWithNewVersion(config.get(), updatedCatalog, userId);
        }
    }




}