package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.common.CustomTemplateMilestoneStatus;
import eu.europa.ec.leos.repository.entities.*;
import eu.europa.ec.leos.repository.entities.Package;
import eu.europa.ec.leos.repository.exceptions.RepositoryException;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.repositories.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class CatalogServiceImplTest {

    @Mock private DocumentRepository documentRepository;
    @Mock private DocumentMilestoneRepository documentMilestoneRepository;
    @Mock private CustomTemplateEntitiesRepository customTemplateEntitiesRepository;
    @Mock private DocumentVRepository documentVRepository;
    @Mock private DocumentContentRepository documentContentRepository;
    @Mock private ConfigService configService;
    @Mock private ConfigurationVRepository configurationVRepository;
    @Mock private CustomTemplateConfigRepository customTemplateConfigRepository;
    @Mock private CustomTemplateConfigVersionRepository customTemplateConfigVersionRepository;
    @Mock private CustomTemplateConfigContentRepository customTemplateConfigContentRepository;
    @Mock private CustomTemplateConfigCategoryRepository customTemplateConfigCategoryRepository;
    @Mock private ConfigCategoryRepository configCategoryRepository;
    @Mock private DocumentService documentService;
    @Mock private MilestoneDocumentService milestoneDocumentService;

    @InjectMocks
    private CatalogServiceImpl catalogService;

    private LeosDocument mockLeosDocument;
    private Document mockDocument;
    private Package mockPackage;
    private CustomTemplateEntities mockCustomTemplateEntities;
    private DocumentMilestone mockDocumentMilestone;
    private CustomTemplateConfig mockCustomTemplateConfig;
    private CustomTemplateConfigVersion mockCustomTemplateConfigVersion;
    private CustomTemplateConfigCategory mockCustomTemplateConfigCategory;

    @Before
    public void setUp() {
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

        mockCustomTemplateConfig = new CustomTemplateConfig();
        mockCustomTemplateConfig.setId(BigDecimal.valueOf(200));
        mockCustomTemplateConfig.setName("catalog-DG1");

        mockCustomTemplateConfigVersion = new CustomTemplateConfigVersion();
        mockCustomTemplateConfigVersion.setConfigId(BigDecimal.valueOf(200));
        mockCustomTemplateConfigVersion.setVersionLabel("1.0.0.0");

        mockCustomTemplateConfigCategory = new CustomTemplateConfigCategory();
        mockCustomTemplateConfigCategory.setId(BigDecimal.valueOf(300));
        mockCustomTemplateConfigCategory.setCategoryCode("CONFIG");
    }

    @Test
    public void testPublishCustomTemplate_ExistingEntities_Success() throws RepositoryException {
        // Arrange - Test scenario where entities already exist (no catalog creation)
        String legFileId = "123";
        String templateName = "Test Template";
        List<String> dgs = Arrays.asList("DG1", "DG2");
        String userId = "testUser";

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
        catalogService.publishCustomTemplate(legFileId, templateName, dgs, userId);

        // Assert - Verify core operations
        verify(milestoneDocumentService).findMilestoneById(new BigDecimal(legFileId));
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
    public void testPublishCustomTemplate_NewEntities_CatalogCreation() throws RepositoryException {
        // Arrange - Test first-time publishing (catalog creation scenario)
        String legFileId = "123";
        List<String> dgs = Arrays.asList("DG1");
        String userId = "testUser";

        setupBasicMocks(legFileId, userId);
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty()); // No existing entities - triggers catalog creation
        setupCatalogCreationMocks();

        // Act
        catalogService.publishCustomTemplate(legFileId, "Template", dgs, userId);

        // Assert - Verify catalog creation
        verify(customTemplateConfigRepository).findConfigByName("catalog-DG1");
        verify(customTemplateConfigRepository).save(any(CustomTemplateConfig.class));
        verify(customTemplateConfigVersionRepository).save(any(CustomTemplateConfigVersion.class));
        verify(customTemplateConfigContentRepository).save(any(CustomTemplateConfigContent.class));
        
        // Verify entities creation
        ArgumentCaptor<CustomTemplateEntities> entitiesCaptor = ArgumentCaptor.forClass(CustomTemplateEntities.class);
        verify(customTemplateEntitiesRepository).save(entitiesCaptor.capture());
        assertEquals("DG1", entitiesCaptor.getValue().getEntities());
        assertEquals(userId, entitiesCaptor.getValue().getAuditCBy());
    }

    @Test
    public void testPublishCustomTemplate_EmptyDgsList() throws RepositoryException {
        // Arrange - Test edge case with empty DGs list
        String legFileId = "123";
        List<String> emptyDgs = Collections.emptyList();
        String userId = "testUser";

        setupBasicMocks(legFileId, userId);
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty());
        setupCatalogCreationMocks();

        // Act
        catalogService.publishCustomTemplate(legFileId, "Template", emptyDgs, userId);

        // Assert - Verify empty entities are saved
        ArgumentCaptor<CustomTemplateEntities> entitiesCaptor = ArgumentCaptor.forClass(CustomTemplateEntities.class);
        verify(customTemplateEntitiesRepository).save(entitiesCaptor.capture());
        assertEquals("", entitiesCaptor.getValue().getEntities());
        assertEquals(mockPackage, entitiesCaptor.getValue().getPackageId());
        assertEquals(userId, entitiesCaptor.getValue().getAuditCBy());
        assertNotNull(entitiesCaptor.getValue().getAuditCDate());
    }

    @Test(expected = RepositoryException.class)
    public void testPublishCustomTemplate_MilestoneAlreadyPublished() throws RepositoryException {
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

        // Act - Should throw RepositoryException
        catalogService.publishCustomTemplate("123", "Template", Arrays.asList("DG1"), "user");
    }

    @Test(expected = RepositoryException.class)
    public void testPublishCustomTemplate_MilestoneNotFound() throws RepositoryException {
        // Arrange - Test null milestone validation
        when(milestoneDocumentService.findMilestoneById(new BigDecimal("123")))
            .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
            .thenReturn(Optional.of(mockDocument));
        when(customTemplateEntitiesRepository.findByPackageId(mockPackage))
            .thenReturn(Optional.empty());
        when(documentMilestoneRepository.findByDocumentId(mockDocument.getId()))
            .thenReturn(null);

        // Act - Should throw RepositoryException
        catalogService.publishCustomTemplate("123", "Template", Arrays.asList("DG1"), "user");
    }

    @Test(expected = NumberFormatException.class)
    public void testPublishCustomTemplate_InvalidLegFileId() throws RepositoryException {
        // Act - Should throw NumberFormatException for invalid BigDecimal
        catalogService.publishCustomTemplate("invalid", "Template", Arrays.asList("DG1"), "user");
    }

    @Test(expected = RepositoryException.class)
    public void testPublishCustomTemplate_LegFileNotFound() throws RepositoryException {
        // Arrange - Test early return when milestone not found
        String legFileId = "999";
        when(milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId)))
            .thenReturn(Optional.empty());

        // Act
        catalogService.publishCustomTemplate(legFileId, "Template", Arrays.asList("DG1"), "user");
    }

    @Test(expected = RepositoryException.class)
    public void testPublishCustomTemplate_DocumentNotFound() throws RepositoryException {
        // Arrange - Test early return when document not found
        String legFileId = "123";
        when(milestoneDocumentService.findMilestoneById(new BigDecimal(legFileId)))
            .thenReturn(Optional.of(mockLeosDocument));
        when(documentRepository.findById(mockLeosDocument.getDocumentId()))
            .thenReturn(Optional.empty());

        // Act
        catalogService.publishCustomTemplate(legFileId, "Template", Arrays.asList("DG1"), "user");
    }

    @Test
    public void testPublishCustomTemplate_MilestoneHandling() throws RepositoryException {
        // Arrange - Test milestone unpublishing and publishing logic
        DocumentMilestone previousMilestone = new DocumentMilestone();
        previousMilestone.setStatus(CustomTemplateMilestoneStatus.PUBLISHED.getValue());
        previousMilestone.setMilestoneComments("Custom Template");
        previousMilestone.setAuditLastMBy("PreviousUser");
        previousMilestone.setAuditLastMDate(LocalDateTime.now());
        
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
        catalogService.publishCustomTemplate("123", "Template", Arrays.asList("DG1"), "testUser");

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

    private void setupCatalogCreationMocks() throws RepositoryException {
        // Mock catalog database retrieval
        when(configService.findConfigByName("catalog")).thenReturn(null);
        ConfigurationV mockCatalogConfig = new ConfigurationV();
        mockCatalogConfig.setContent("<catalog><item type='CATEGORY' key='test'></item></catalog>".getBytes());
        when(configurationVRepository.findConfigurationByName("catalog"))
            .thenReturn(Optional.of(mockCatalogConfig));
        
        // Mock category repository
        when(customTemplateConfigCategoryRepository.findConfigCategoriesByCategoryCode("CONFIG"))
            .thenReturn(Optional.of(mockCustomTemplateConfigCategory));
        
        // Mock config repository - return empty for findConfigByName, return saved entity for save
        when(customTemplateConfigRepository.findConfigByName(anyString()))
            .thenReturn(Optional.empty());
        when(customTemplateConfigRepository.save(any(CustomTemplateConfig.class)))
            .thenReturn(mockCustomTemplateConfig);
        
        // Mock version repository
        when(customTemplateConfigVersionRepository.save(any(CustomTemplateConfigVersion.class)))
            .thenReturn(mockCustomTemplateConfigVersion);
        
        // Mock content repository
        when(customTemplateConfigContentRepository.save(any(CustomTemplateConfigContent.class)))
            .thenReturn(new CustomTemplateConfigContent());
    }
}