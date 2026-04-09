package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.H2TestBase;
import eu.europa.ec.leos.repository.common.CustomTemplateMilestoneStatus;
import eu.europa.ec.leos.repository.entities.*;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.CatalogException;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CatalogServiceImplTest extends H2TestBase {

    @Mock private DocumentRepository documentRepository;
    @Mock private DocumentMilestoneRepository documentMilestoneRepository;
    @Mock private CustomTemplateEntitiesRepository customTemplateEntitiesRepository;
    @Mock private DocumentVRepository documentVRepository;
    @Mock private DocumentContentRepository documentContentRepository;
    @Mock private ConfigService configService;
    @Mock private ConfigurationVRepository configurationVRepository;
    @Mock private ConfigRepository customTemplateConfigRepository;
    @Mock private ConfigVersionRepository customTemplateConfigVersionRepository;
    @Mock private ConfigContentRepository customTemplateConfigContentRepository;
    @Mock private ConfigCategoryRepository customTemplateConfigCategoryRepository;
    @Mock private DocumentService documentService;
    @Mock private MilestoneDocumentService milestoneDocumentService;
    @Mock private PackageRepository packageRepository;
    @Mock private LinkedPackagedRepository linkedPackagedRepository;
    @Mock
    private Config config;

    @Mock
    private ConfigVersion configVersion;

    @Mock
    private ConfigContent configContent;


    @InjectMocks
    private CatalogServiceImpl catalogService;

    private LeosDocument mockLeosDocument;
    private Document mockDocument;
    private Package mockPackage;
    private CustomTemplateEntities mockCustomTemplateEntities;
    private DocumentMilestone mockDocumentMilestone;
    private Config mockCustomTemplateConfig;
    private ConfigVersion mockCustomTemplateConfigVersion;
    private ConfigCategory mockCustomTemplateConfigCategory;

    @BeforeEach
    void setUp() {
        mockLeosDocument = new LeosDocument();
        mockLeosDocument.setDocumentId(BigDecimal.valueOf(100));

        mockDocument = new Document();
        mockDocument.setId(BigDecimal.valueOf(100));

        mockPackage = new Package();
        mockPackage.setId(BigDecimal.valueOf(1));
        mockDocument.setPackageId(mockPackage);

        mockCustomTemplateEntities = new CustomTemplateEntities();
        mockCustomTemplateEntities.setPackageId(mockPackage);
        mockCustomTemplateEntities.setEntities("DG1,DG2");

        mockDocumentMilestone = new DocumentMilestone();
        mockDocumentMilestone.setStatus(CustomTemplateMilestoneStatus.UNPUBLISHED.getValue());
        mockDocumentMilestone.setMilestoneComments("Custom Template");

        mockCustomTemplateConfig = new Config();
        mockCustomTemplateConfig.setId(BigDecimal.valueOf(200));
        mockCustomTemplateConfig.setName("catalog-DG1");

        mockCustomTemplateConfigVersion = new ConfigVersion();
        mockCustomTemplateConfigVersion.setConfigId(BigDecimal.valueOf(200));
        mockCustomTemplateConfigVersion.setVersionLabel("1.0.0.0");

        mockCustomTemplateConfigCategory = new ConfigCategory();
        mockCustomTemplateConfigCategory.setId(BigDecimal.valueOf(300));
        mockCustomTemplateConfigCategory.setCategoryCode("CONFIG");
    }

    @Test
    void testPublishCustomTemplate_ExistingEntities_Success() throws CatalogException {
        // Arrange - Test scenario where entities already exist (no catalog creation)
        String legFileId = "123";
        String templateName = "Test Template";
        List<String> dgs = Arrays.asList("DG1", "DG2");
        String userId = "testUser";
        String originalDg = "DG1";

        when(milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId)))
            .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
            .thenReturn(Optional.of(mockDocument));
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.of(mockCustomTemplateEntities));
        when(documentRepository.findAllDocumentsByPackageId(mockPackage))
            .thenReturn(Arrays.asList(mockDocument));
        when(documentMilestoneRepository.findDocumentMilestonesByDocumentIn(any()))
            .thenReturn(Arrays.asList(mockDocumentMilestone));
        when(documentMilestoneRepository.findByDocumentId(mockDocument.getId()))
            .thenReturn(mockDocumentMilestone);

        // Act
        catalogService.publishCustomTemplate(legFileId, templateName, dgs, userId, originalDg);

        // Assert - Verify core operations
        verify(milestoneDocumentService, times(2)).findMilestoneById(new BigDecimal(legFileId));
        verify(documentRepository).findById(mockLeosDocument.getDocumentId());
        verify(customTemplateEntitiesRepository, times(2)).findByPackageId(mockPackage);
        
        // Verify entities are updated
        ArgumentCaptor<CustomTemplateEntities> entitiesCaptor = ArgumentCaptor.forClass(CustomTemplateEntities.class);
        verify(customTemplateEntitiesRepository).save(entitiesCaptor.capture());
        assertEquals("DG1,DG2", entitiesCaptor.getValue().getEntities());
        assertEquals(userId, entitiesCaptor.getValue().getAuditLastMBy());
        
        // Verify milestone operations (unpublish previous + publish current)
        verify(documentMilestoneRepository, times(1)).save(any(DocumentMilestone.class));
    }

    @Test
    void testPublishCustomTemplate_NewEntities_CatalogCreation() throws CatalogException {
        // Arrange - Test first-time publishing (catalog creation scenario)
        String legFileId = "123";
        List<String> dgs = Arrays.asList("DG1");
        String userId = "testUser";
        String originalDg = "DG1";


        setupBasicMocks(legFileId, userId);
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty()); // No existing entities - triggers catalog creation
        setupCatalogCreationMocks();



        // Act
        catalogService.publishCustomTemplate(legFileId, "Template", dgs, userId, originalDg);

        // Assert - Verify catalog creation
        verify(customTemplateConfigRepository).findConfigByName("catalog-DG1");
        verify(customTemplateConfigRepository).save(any(Config.class));
        verify(customTemplateConfigVersionRepository).save(any(ConfigVersion.class));
        verify(customTemplateConfigContentRepository).save(any(ConfigContent.class));
        
        // Verify entities creation
        ArgumentCaptor<CustomTemplateEntities> entitiesCaptor = ArgumentCaptor.forClass(CustomTemplateEntities.class);
        verify(customTemplateEntitiesRepository).save(entitiesCaptor.capture());
        assertEquals("DG1", entitiesCaptor.getValue().getEntities());
        assertEquals(userId, entitiesCaptor.getValue().getAuditCBy());
    }

    @Test
    void testPublishCustomTemplate_EmptyDgsList() throws CatalogException {
        // Arrange - Test edge case with empty DGs list
        String legFileId = "123";
        List<String> emptyDgs = Collections.emptyList();
        String userId = "testUser";
        String originalDg = "DG1";

        setupBasicMocks(legFileId, userId);
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty());

        // Act
        catalogService.publishCustomTemplate(legFileId, "Template", emptyDgs, userId, originalDg);

        // Assert - Verify empty entities are saved
        ArgumentCaptor<CustomTemplateEntities> entitiesCaptor = ArgumentCaptor.forClass(CustomTemplateEntities.class);
        verify(customTemplateEntitiesRepository).save(entitiesCaptor.capture());
        assertEquals("", entitiesCaptor.getValue().getEntities());
        assertEquals(mockPackage, entitiesCaptor.getValue().getPackageId());
        assertEquals(userId, entitiesCaptor.getValue().getAuditCBy());
        assertNotNull(entitiesCaptor.getValue().getAuditCDate());
    }

    @Test
    void testPublishCustomTemplate_MilestoneAlreadyPublished() {
        // Arrange - Test milestone validation
        DocumentMilestone publishedMilestone = new DocumentMilestone();
        publishedMilestone.setStatus(CustomTemplateMilestoneStatus.PUBLISHED.getValue());
        
        when(milestoneDocumentService.findMilestoneById(new BigDecimal("123")))
            .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
            .thenReturn(Optional.of(mockDocument));
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty());
        when(documentMilestoneRepository.findByDocumentId(mockDocument.getId()))
            .thenReturn(publishedMilestone);

        String originalDg = "DG1";
        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.publishCustomTemplate("123", "Template", List.of("DG1"), "user", originalDg));
    }

    @Test
    void testPublishCustomTemplate_MilestoneNotFound() {
        // Arrange - Test null milestone validation
        when(milestoneDocumentService.findMilestoneById(new BigDecimal("123")))
            .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
            .thenReturn(Optional.of(mockDocument));
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty());
        when(documentMilestoneRepository.findByDocumentId(mockDocument.getId()))
            .thenReturn(null);

        String originalDg = "DG1";
        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.publishCustomTemplate("123", "Template", List.of("DG1"), "user", originalDg));
    }

    @Test
    void testPublishCustomTemplate_InvalidLegFileId() {
        String originalDg = "DG1";
        // Act & Assert
        assertThrows(NumberFormatException.class, () -> 
            catalogService.publishCustomTemplate("invalid", "Template", List.of("DG1"), "user", originalDg));
    }

    @Test
    void testPublishCustomTemplate_LegFileNotFound() {
        // Arrange - Test early return when milestone not found
        String legFileId = "999";
        when(milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId)))
            .thenReturn(Optional.empty());

        String originalDg = "DG1";
        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.publishCustomTemplate(legFileId, "Template", List.of("DG1"), "user", originalDg));
    }

    @Test
    void testPublishCustomTemplate_DocumentNotFound() {
        // Arrange - Test early return when document not found
        String legFileId = "123";
        when(milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId)))
                .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
                .thenReturn(Optional.empty());

        String originalDg = "DG1";
        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.publishCustomTemplate(legFileId, "Template", List.of("DG1"), "user", originalDg));
    }

    @Test
    void testPublishCustomTemplate_MilestoneHandling() throws CatalogException {
        // Arrange - Test milestone unpublishing and publishing logic
        DocumentMilestone previousMilestone = new DocumentMilestone();
        previousMilestone.setStatus(CustomTemplateMilestoneStatus.PUBLISHED.getValue());
        previousMilestone.setMilestoneComments("Custom Template");
        previousMilestone.setAuditLastMBy("PreviousUser");
        previousMilestone.setAuditLastMDate(LocalDateTime.now());
        String originalDg = "DG1";

        DocumentMilestone currentMilestone = new DocumentMilestone();
        currentMilestone.setStatus(CustomTemplateMilestoneStatus.UNPUBLISHED.getValue());

        setupBasicMocks("123", "testUser");
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
                .thenReturn(Optional.of(mockCustomTemplateEntities));
        when(documentMilestoneRepository.findDocumentMilestonesByDocumentIn(any()))
                .thenReturn(Arrays.asList(previousMilestone));
        when(documentMilestoneRepository.findByDocumentId(mockDocument.getId()))
                .thenReturn(currentMilestone);

        // Act
        catalogService.publishCustomTemplate("123", "Template", Arrays.asList("DG1"), "testUser", originalDg);

        // Assert - Verify milestone operations
        ArgumentCaptor<DocumentMilestone> captor = ArgumentCaptor.forClass(DocumentMilestone.class);
        verify(documentMilestoneRepository, times(2)).save(captor.capture());

        List<DocumentMilestone> savedMilestones = captor.getAllValues();

        // First save - unpublish previous
        assertEquals(CustomTemplateMilestoneStatus.UNPUBLISHED.getValue(), savedMilestones.get(0).getStatus());
        assertEquals("testUser", savedMilestones.get(0).getAuditLastMBy());
        assertNotNull(savedMilestones.get(0).getAuditLastMDate());
        
        // Second save - publish current
        assertEquals(CustomTemplateMilestoneStatus.PUBLISHED.getValue(), savedMilestones.get(1).getStatus());
        assertEquals("Custom Template", savedMilestones.get(1).getMilestoneComments());
        assertEquals("testUser", savedMilestones.get(1).getAuditLastMBy());
        assertNotNull(savedMilestones.get(1).getAuditLastMDate());
    }

    // Helper methods for test setup
    private void setupBasicMocks(String legFileId, String userId) {
        when(milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId)))
            .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
            .thenReturn(Optional.of(mockDocument));
        when(documentRepository.findAllDocumentsByPackageId(mockPackage))
            .thenReturn(Arrays.asList(mockDocument));
        when(documentMilestoneRepository.findDocumentMilestonesByDocumentIn(any()))
            .thenReturn(Collections.emptyList());
        when(documentMilestoneRepository.findByDocumentId(mockDocument.getId()))
            .thenReturn(mockDocumentMilestone);
    }

    private void setupCatalogCreationMocks() throws CatalogException {
        // Mock catalog database retrieval
        try {
            when(configService.findConfigByName("catalog")).thenReturn(null);
        } catch (RepositoryException e) {
            throw new CatalogException(CatalogException.CatalogExceptionCode.DB_NOT_FOUND, e.getMessage());
        }

        ConfigurationV mockCatalogConfig = new ConfigurationV();
        mockCatalogConfig.setContent("<catalog><item type='CATEGORY' key='test'></item></catalog>");
        when(configurationVRepository.findConfigurationByName("catalog"))
            .thenReturn(Optional.of(mockCatalogConfig));
        
        // Mock category repository
        when(customTemplateConfigCategoryRepository.findConfigCategoriesByCategoryCode("CONFIG"))
            .thenReturn(Optional.of(mockCustomTemplateConfigCategory));
        
        // Mock config repository - return empty for findConfigByName, return saved entity for save
        when(customTemplateConfigRepository.findConfigByName(anyString()))
            .thenReturn(Optional.empty());
        when(customTemplateConfigRepository.save(any(Config.class)))
            .thenReturn(mockCustomTemplateConfig);
        
        // Mock version repository
        when(customTemplateConfigVersionRepository.save(any(ConfigVersion.class)))
            .thenReturn(mockCustomTemplateConfigVersion);
        
        // Mock content repository
        when(customTemplateConfigContentRepository.save(any(ConfigContent.class)))
            .thenReturn(new ConfigContent());
    }
    @Test
    void testUnpublishCustomTemplate_Success() throws CatalogException {
        // Arrange
        String packageId = "123";
        String userId = "testUser";
        String VALID_XML =
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                        "<catalog>" +
                        "  <item type=\"TEMPLATE\" key=\"Custom Template_123\" custom-name=\"Test Template\"/>" +
                        "</catalog>";

        mockDocumentMilestone = new DocumentMilestone();
        mockDocumentMilestone.setStatus(CustomTemplateMilestoneStatus.PUBLISHED.getValue());
        mockDocumentMilestone.setMilestoneComments("Custom Template");
        when(customTemplateConfigVersionRepository.save(any(ConfigVersion.class)))
                .thenReturn(new ConfigVersion());
        // Mock content repository
        when(customTemplateConfigContentRepository.save(any(ConfigContent.class)))
                .thenReturn(new ConfigContent());
        when(customTemplateConfigRepository.findConfigByName(any()))
                .thenReturn(Optional.of(config));
        when(customTemplateConfigVersionRepository.findLastConfigVersionByConfigId(any()))
                .thenReturn(configVersion);
        when(customTemplateConfigContentRepository.findConfigContentByVersionId(any()))
                .thenReturn(configContent);
        when(configContent.getContentString())
                .thenReturn(VALID_XML);
        when(config.getId()).thenReturn(BigDecimal.valueOf(1));
        when(packageRepository.findById(new BigDecimal(packageId)))
                .thenReturn(Optional.of(mockPackage));
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
                .thenReturn(Optional.of(mockCustomTemplateEntities));
        when(documentRepository.findAllDocumentsByPackageId(mockPackage))
                .thenReturn(Arrays.asList(mockDocument));
        when(documentMilestoneRepository.findDocumentMilestonesByDocumentIn(any()))
                .thenReturn(Arrays.asList(mockDocumentMilestone));
        DocumentV documentV = new DocumentV();
        documentV.setTemplate("Custom Template");
        // Arrange
        when(documentVRepository.findAllVersionsByPackageIdAndCategoryCode(eq(new BigDecimal(1)), eq("PROPOSAL")))
                .thenReturn(Arrays.asList(documentV));

        // Act
        Boolean result = catalogService.unpublishCustomTemplate(packageId, userId);

        // Assert
        assertEquals(true, result);
        verify(documentMilestoneRepository, times(1)).save(mockDocumentMilestone);
        verify(customTemplateEntitiesRepository, times(1)).save(any(CustomTemplateEntities.class));
    }

    @Test
    void testUnpublishCustomTemplate_PackageNotFound() {
        // Arrange
        String packageId = "999";
        when(packageRepository.findById(new BigDecimal(packageId)))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.unpublishCustomTemplate(packageId, "testUser"));
    }

    @Test
    void testUnpublishCustomTemplate_NoEntitiesToUnpublish() throws CatalogException {
        // Arrange
        String packageId = "123";
        String userId = "testUser";
        when(packageRepository.findById(new BigDecimal(packageId)))
                .thenReturn(Optional.of(mockPackage));

        // Act
        Boolean result = catalogService.unpublishCustomTemplate(packageId, userId);

        // Assert
        assertEquals(false, result);
        verify(documentMilestoneRepository, never()).save(any(DocumentMilestone.class));
        verify(customTemplateEntitiesRepository, never()).save(any(CustomTemplateEntities.class));
    }

    @Test
    void testUpdateCustomTemplate_EntitiesUpdatedSuccessfully() throws CatalogException {
        // Arrange
        String packageId = "123";
        List<String> newEntities = Arrays.asList("DG3", "DG4");
        String userId = "testUser";
        String templateName = "Updated Template";
        String originalDg = "DG3";

        when(packageRepository.findById(new BigDecimal(packageId)))
                .thenReturn(Optional.of(mockPackage));
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
                .thenReturn(Optional.of(mockCustomTemplateEntities));

        // Act
        catalogService.updateCustomTemplate(packageId, templateName, newEntities, userId, originalDg);

        // Assert
        ArgumentCaptor<CustomTemplateEntities> capture = ArgumentCaptor.forClass(CustomTemplateEntities.class);
        verify(customTemplateEntitiesRepository).save(capture.capture());
        assertEquals("DG3,DG4", capture.getValue().getEntities());
        assertEquals(userId, capture.getValue().getAuditLastMBy());
    }


    @Test
    void testUpdateCustomTemplate_PackageNotFound() {
        // Arrange
        when(packageRepository.findById(new BigDecimal("999")))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.updateCustomTemplate("999", "Template", List.of("DG1"), "user", "DG1"));
    }

    @Test
    void testUpdateCustomTemplate_ExceptionPropagation() {
        // Arrange
        String packageId = "123";
        String templateName = "Fail Template";
        List<String> dgs = Arrays.asList("DG1");
        String userId = "testUser";
        String originalDg = "DG1";

        // Act & Assert
        assertThrows(CatalogException.class, () -> 
            catalogService.updateCustomTemplate(packageId, templateName, dgs, userId, originalDg));
    }
}