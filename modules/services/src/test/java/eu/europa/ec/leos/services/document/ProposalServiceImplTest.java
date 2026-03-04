package eu.europa.ec.leos.services.document;


import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.integration.ExternalSystemACLService;
import eu.europa.ec.leos.model.action.ContributionVO;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.document.ProposalRepository;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.repository.store.PackageRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.collection.WorkflowCollaboratorService;
import eu.europa.ec.leos.services.dto.request.UpdateProposalRequest;
import eu.europa.ec.leos.services.metadata.MetadataOptions;
import eu.europa.ec.leos.services.metadata.MetadataService;
import eu.europa.ec.leos.services.processor.content.TableOfContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessorProposal;
import eu.europa.ec.leos.services.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.leos.services.processor.node.XmlNodeProcessor;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.lang.DocumentLanguageContext;
import eu.europa.ec.leos.services.support.XPathCatalog;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import eu.europa.ec.leos.services.util.TestUtils;
import io.atlassian.fugue.Option;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.spy;

import java.io.ByteArrayInputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class ProposalServiceImplTest {

    private final static String CLONED_PROPOSAL_DOCUMENT = "/document/clonedProposals/";
    private final static String ORIGINAL_PROPOSAL_DOCUMENT = "/document/originalProposals/";

    @Mock
    ProposalRepository proposalRepository;
    @Mock
    XmlNodeProcessor xmlNodeProcessor;
    @Mock
    XmlNodeConfigProcessor xmlNodeConfigProcessor;
    @Mock
    PackageRepository packageRepository;
    @Mock TableOfContentProcessor tableOfContentProcessor;
    @Mock MessageHelper messageHelper;
    @Mock
    TrackChangesContext trackChangesContext;
    @Mock
    DocumentLanguageContext documentLanguageContext;
    @Mock
    SecurityContext securityContext;
    @Mock
    WorkflowCollaboratorService workflowCollaboratorService;
    @Mock
    ExternalSystemACLService externalSystemACLService;
    @Mock
    PackageService packageService;
    @Mock
    MetadataService metadataService;

    @InjectMocks
    private XPathCatalog xPathCatalog = spy(new XPathCatalog());

    private XmlContentProcessor xmlContentProcessor = new XmlContentProcessorProposal();
    private ProposalService proposalService;
    
    @Test
    public void test_getExplanatoryDocumentRef() {
    	byte[] xmlContent = TestUtils.getFileContent(ORIGINAL_PROPOSAL_DOCUMENT, "proposal_original.xml");

    	// Expected
        String expectedDocRefHref = "explanatory_cl43ykqyd0006k485zxvf53na.xml";
        String expectedDocRefId = "body_cmp_3__dref_1";
        
        proposalService = new ProposalServiceProposalImpl(proposalRepository, xmlNodeProcessor, xmlContentProcessor,
                xmlNodeConfigProcessor, packageRepository, xPathCatalog, tableOfContentProcessor, messageHelper, trackChangesContext, documentLanguageContext,
                securityContext,
                workflowCollaboratorService,
                externalSystemACLService,
                packageService, metadataService);
        
        // Call
        Map<String, String> hrefIdMap = proposalService.getExplanatoryDocumentRef(xmlContent);
        
        // Assertions
        assertTrue(hrefIdMap.containsKey(expectedDocRefHref));
        assertTrue(hrefIdMap.containsValue(expectedDocRefId));
        
    }

    @Test
    public void test_metadataOptions() {
        byte[] xmlContent = TestUtils.getFileContent(ORIGINAL_PROPOSAL_DOCUMENT, "proposal_original.xml");

        proposalService = new ProposalServiceProposalImpl(proposalRepository, xmlNodeProcessor, xmlContentProcessor,
                xmlNodeConfigProcessor, packageRepository, xPathCatalog, tableOfContentProcessor, messageHelper, trackChangesContext, documentLanguageContext,
                securityContext,
                workflowCollaboratorService,
                externalSystemACLService,
                packageService, metadataService);

        String proposalId = "555";
        List<Collaborator> collaborators = new ArrayList<>();
        collaborators.add(new Collaborator("login", "OWNER", "SG"));
        Content.Source proposalSource = new SourceImpl(new ByteArrayInputStream(xmlContent));
        Content proposalContent = new ContentImpl("PR-00.xml", "mime type", xmlContent.length, proposalSource);
        ProposalMetadata proposalMetadata = new ProposalMetadata("", "REGULATION for EC", "", "PR-00.xml", "EN", "", "proposal-id", "", "0.1.0", false, false);
        Proposal leosProposal = new Proposal(proposalId, "Proposal", "login", Instant.now(), "login", Instant.now(), "", "", "", "", VersionType.MAJOR, true,
                "REGULATION for EC", collaborators,
                Arrays.asList(""), "login", Instant.now(), Option.some(proposalContent), Option.some(proposalMetadata), true, "", "", "", null,
                ContributionVO.ContributionStatus.CONTRIBUTION_DONE.name(), false, null, null, null, null);

        UpdateProposalRequest updateProposalRequest = new UpdateProposalRequest();
        updateProposalRequest.setAuthenticLang(Arrays.asList("en", "fr"));
        updateProposalRequest.setInternalRef("demo");
        updateProposalRequest.setPackageTitle("title");
        // Call
        MetadataOptions metadataOptions = proposalService.convertUpdateProposalRequestToMetadataOptions("legFileName", leosProposal, updateProposalRequest);

        // Assertions
        assertTrue(metadataOptions != null);

    }

}
