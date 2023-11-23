package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.cmis.mapping.CmisProperties;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.document.AnnexRepository;
import eu.europa.ec.leos.repository.document.CmisAnnexRepositoryImpl;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.services.document.util.DocumentVOProvider;
import eu.europa.ec.leos.services.numbering.NumberService;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.XmlDocumentService;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.validation.ValidationService;
import eu.europa.ec.leos.test.support.LeosTest;
import io.atlassian.fugue.Option;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.cmis.support.RepositoryUtil.updateDocumentProperties;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AnnexServiceImplTest extends LeosTest {

    private AnnexService annexService;
    private AnnexRepository annexRepository;

    private final static RepositoryPropertiesMapper repositoryPropertiesMapper = new CmisProperties();

    @Mock
    private PackageRepository packageRepository;
    @Mock
    private XmlNodeProcessor xmlNodeProcessor;
    @Mock
    private XmlContentProcessor xmlContentProcessor;
    @Mock
    private XmlDocumentService xmlDocumentService;
    @Mock
    private NumberService numberService;
    @Mock
    private XmlNodeConfigProcessor xmlNodeConfigProcessor;
    @Mock
    private ValidationService validationService;
    @Mock
    private DocumentVOProvider documentVOProvider;
    @Mock
    private TableOfContentProcessor tableOfContentProcessor;
    @Mock
    private MessageHelper messageHelper;
    @Mock
    private XPathCatalog xPathCatalog;
    @Mock
    private LeosRepository leosRepository;
    private UpdateInternalReferencesMessage message;

    private String objectId = "555";
    private String baseVersionId = "210::0.1.0::Element Created";

    @Before
    public void onSetUp() {
        super.setup();
        annexRepository = new CmisAnnexRepositoryImpl(leosRepository);
        message = new UpdateInternalReferencesMessage(objectId, "annex");
        annexService = new AnnexServiceMandateImpl(annexRepository, xmlNodeProcessor,
                xmlContentProcessor, xmlDocumentService, numberService, xmlNodeConfigProcessor, validationService,
                documentVOProvider, tableOfContentProcessor, messageHelper, xPathCatalog);

    }

    @Test
    public void test_updateBaseVersionId() throws Exception {
        Annex mockedAnnex = getMockedAnnexWithBaseVersionId();
        when(leosRepository.updateDocument(anyString(), anyString(), anyMap(), any(), anyBoolean())).thenReturn(mockedAnnex);
        when(annexService.findAnnex(mockedAnnex.getId(), true)).thenReturn(mockedAnnex);
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.BASE_REVISION_ID), baseVersionId);
        Annex annex = annexService.updateAnnex(objectId, objectId, properties, true);
        assertEquals(baseVersionId, annex.getBaseRevisionId());
    }

    @Test
    public void test_enableLiveDiffing() throws Exception {
        Annex mockedAnnex = getMockedAnnexWithLiveDiffing();
        when(leosRepository.updateDocument(anyString(), anyString(), anyMap(), any(), anyBoolean())).thenReturn(mockedAnnex);
        when(annexService.findAnnex(mockedAnnex.getId(), true)).thenReturn(mockedAnnex);
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.LIVE_DIFFING_REQUIRED), true);
        Annex annex = annexService.updateAnnex(objectId, objectId, properties, true);
        assertTrue(annex.isLiveDiffingRequired());
    }

    @Test
    public void test_disableLiveDiffing() throws Exception {
        Annex mockedAnnex = getMockedAnnexWithoutLiveDiffing();
        when(leosRepository.updateDocument(anyString(), anyString(), anyMap(), any(), anyBoolean())).thenReturn(mockedAnnex);
        when(annexService.findAnnex(mockedAnnex.getId(), true)).thenReturn(mockedAnnex);
        Map<String, Object> properties = new HashMap<>();
        properties.put(repositoryPropertiesMapper.getId(RepositoryProperties.LIVE_DIFFING_REQUIRED), false);
        Annex annex = annexService.updateAnnex(objectId, objectId, properties, true);
        assertFalse(annex.isLiveDiffingRequired());
    }

    private Annex getMockedAnnexWithBaseVersionId() {
        AnnexMetadata annexMetadata = getMockedMetadata();
        List<Collaborator> collaborators = Arrays.asList(new Collaborator("test", "OWNER", "SG"));
        Content content = mock(Content.class);
        return new Annex(objectId, "ANNEX_COUNCIL", "test", Instant.now(), "test", Instant.now(),
                "", "", "", "", VersionType.MINOR, false, "",
                collaborators, Arrays.asList(""), baseVersionId, true, "", "", Option.some(content),
                Option.some(annexMetadata), false);
    }

    private Annex getMockedAnnexWithLiveDiffing() {
        AnnexMetadata annexMetadata = getMockedMetadata();
        List<Collaborator> collaborators = Arrays.asList(new Collaborator("test", "OWNER", "SG"));
        Content content = mock(Content.class);
        return new Annex(objectId, "ANNEX_COUNCIL", "test", Instant.now(), "test", Instant.now(),
                "", "", "", "", VersionType.MINOR, false, "",
                collaborators, Arrays.asList(""), null, true, "", "", Option.some(content),
                Option.some(annexMetadata), false);
    }

    private Annex getMockedAnnexWithoutLiveDiffing() {
        AnnexMetadata annexMetadata = getMockedMetadata();
        List<Collaborator> collaborators = Arrays.asList(new Collaborator("test", "OWNER", "SG"));
        Content content = mock(Content.class);
        return new Annex(objectId, "ANNEX_COUNCIL", "test", Instant.now(), "test", Instant.now(),
                "", "", "", "", VersionType.MINOR, false, "",
                collaborators, Arrays.asList(""), null, false, "", "", Option.some(content),
                Option.some(annexMetadata), false);
    }

    private AnnexMetadata getMockedMetadata() {
        return new AnnexMetadata("... at this stage", "REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL", "on ...",
                "CE-001", "EN", "CE-001", "annex", 1, "I", "Working Party cover page", "555",
                "0.1.0", false, "");
    }

}
