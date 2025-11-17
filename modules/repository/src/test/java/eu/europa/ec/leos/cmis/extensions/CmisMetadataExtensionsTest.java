package eu.europa.ec.leos.cmis.extensions;

import eu.europa.ec.leos.cmis.mapping.CmisProperties;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.metadata.*;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import io.atlassian.fugue.Option;
import org.apache.chemistry.opencmis.client.api.Document;
import org.junit.jupiter.api.Test;

import java.math.BigInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CmisMetadataExtensionsTest {

    private final static String METADATA_STAGE = "DOCUMENT METADATA_STAGE";
    private final static String METADATA_TYPE = "DOCUMENT METADATA_TYPE";
    private final static String METADATA_PURPOSE = "DOCUMENT METADATA_PURPOSE";
    private final static String METADATA_DOCTEMPLATE = "DOCUMENT METADATA_DOCTEMPLATE";
    private final static String METADATA_REF = "DOCUMENT METADATA_REF";
    private final static String DOCUMENT_TEMPLATE = "DOCUMENT_TEMPLATE";
    private final static String DOCUMENT_LANGUAGE = "DOCUMENT_LANGUAGE";
    private final static RepositoryPropertiesMapper repositoryPropertiesMapper = new CmisProperties();

    @Test
    public void test_getProposalMetadataOption() {
        //setup
        Document cmisDocument = setupCommonDocument();

        //make call
        Option<ProposalMetadata> proposalMetadataOption = CmisMetadataExtensions.getProposalMetadataOption(cmisDocument);

        //verify
        assertFalse(proposalMetadataOption.isEmpty());
        ProposalMetadata proposalMetadata = proposalMetadataOption.get();
        assertNotNull(proposalMetadata);
        assertEquals(LeosCategory.PROPOSAL, proposalMetadata.getCategory());
        verifyCommonMetadata(proposalMetadata);
    }

    @Test
    public void test_getProposalMetadataOption_IfNullValues() {
        //setup
        Document cmisDocument = mock(Document.class);

        //make call
        Option<ProposalMetadata> proposalMetadataOption = CmisMetadataExtensions.getProposalMetadataOption(cmisDocument);

        //verify
        assertTrue(proposalMetadataOption.isEmpty());
    }

    @Test
    public void test_getMemorandumMetadataOption() {
        //setup
        Document cmisDocument = setupCommonDocument();

        //make call
        Option<MemorandumMetadata> memorandumMetadataOption = CmisMetadataExtensions.getMemorandumMetadataOption(cmisDocument);

        //verify
        assertFalse(memorandumMetadataOption.isEmpty());
        MemorandumMetadata memorandumMetadata = memorandumMetadataOption.get();
        assertNotNull(memorandumMetadata);
        assertEquals(LeosCategory.MEMORANDUM, memorandumMetadata.getCategory());
        verifyCommonMetadata(memorandumMetadata);
    }

    @Test
    public void test_getMemorandumMetadataOption_IfNullValues() {
        //setup
        Document cmisDocument = mock(Document.class);

        //make call
        Option<MemorandumMetadata> memorandumMetadataOption = CmisMetadataExtensions.getMemorandumMetadataOption(cmisDocument);

        //verify
        assertTrue(memorandumMetadataOption.isEmpty());
    }

    @Test
    public void test_getBillMetadataOption() {
        //setup
        Document cmisDocument = setupCommonDocument();

        //make call
        Option<BillMetadata> billMetadataOption = CmisMetadataExtensions.getBillMetadataOption(cmisDocument);

        //verify
        assertFalse(billMetadataOption.isEmpty());
        BillMetadata billMetadata = billMetadataOption.get();
        assertNotNull(billMetadata);
        assertEquals(LeosCategory.BILL, billMetadata.getCategory());
        verifyCommonMetadata(billMetadata);
    }

    @Test
    public void test_getBillMetadataOption_IfNullValues() {
        //setup
        Document cmisDocument = mock(Document.class);

        //make call
        Option<BillMetadata> billMetadataOption = CmisMetadataExtensions.getBillMetadataOption(cmisDocument);

        //verify
        assertTrue(billMetadataOption.isEmpty());
    }

    @Test
    public void test_getAnnexMetadataOption() {
        //setup
        Document cmisDocument = setupCommonDocument();
        BigInteger ANNEX_INDEX = new BigInteger("20");
        String ANNEX_NUMBER = "DOCUMENT ANNEX_NUMBER";
        String ANNEX_TITLE = "DOCUMENT ANNEX_TITLE";
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_INDEX))).thenReturn(ANNEX_INDEX);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_NUMBER))).thenReturn(ANNEX_NUMBER);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_TITLE))).thenReturn(ANNEX_TITLE);

        //make call
        Option<AnnexMetadata> annexMetadataOption = CmisMetadataExtensions.getAnnexMetadataOption(cmisDocument);

        //verify
        assertFalse(annexMetadataOption.isEmpty());
        AnnexMetadata annexMetadata = annexMetadataOption.get();
        assertNotNull(annexMetadata);
        assertEquals(LeosCategory.ANNEX, annexMetadata.getCategory());
        verifyCommonMetadata(annexMetadata);

        assertEquals(ANNEX_INDEX.intValue(), annexMetadata.getIndex());
        assertEquals(ANNEX_NUMBER, annexMetadata.getNumber());
        assertEquals(ANNEX_TITLE, annexMetadata.getTitle());
    }

    @Test
    public void test_getAnnexMetadataOption_IfNullValues() {
        //setup
        Document cmisDocument = mock(Document.class);

        //make call
        Option<AnnexMetadata> annexMetadataOption = CmisMetadataExtensions.getAnnexMetadataOption(cmisDocument);

        //verify
        assertTrue(annexMetadataOption.isEmpty());
    }

    private void verifyCommonMetadata(LeosMetadata leosMetadata) {
        assertEquals(METADATA_STAGE, leosMetadata.getStage());
        assertEquals(METADATA_TYPE, leosMetadata.getType());
        assertEquals(METADATA_PURPOSE, leosMetadata.getPurpose());
        assertEquals(METADATA_DOCTEMPLATE, leosMetadata.getDocTemplate());
        assertEquals(METADATA_REF, leosMetadata.getRef());
        assertEquals(DOCUMENT_TEMPLATE, leosMetadata.getTemplate());
        assertEquals(DOCUMENT_LANGUAGE, leosMetadata.getLanguage());
    }

    private Document setupCommonDocument() {
        Document cmisDocument = mock(Document.class);

        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_STAGE))).thenReturn(METADATA_STAGE);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_TYPE))).thenReturn(METADATA_TYPE);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE))).thenReturn(METADATA_PURPOSE);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_DOCTEMPLATE))).thenReturn(METADATA_DOCTEMPLATE);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_REF))).thenReturn(METADATA_REF);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TEMPLATE))).thenReturn(DOCUMENT_TEMPLATE);
        when(cmisDocument.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_LANGUAGE))).thenReturn(DOCUMENT_LANGUAGE);

        return cmisDocument;
    }
}
