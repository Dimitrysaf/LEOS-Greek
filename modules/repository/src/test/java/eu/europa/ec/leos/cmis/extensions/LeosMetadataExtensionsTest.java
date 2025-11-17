package eu.europa.ec.leos.cmis.extensions;

import eu.europa.ec.leos.cmis.mapping.CmisProperties;
import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.MemorandumMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.*;

public class LeosMetadataExtensionsTest {

    private final static String METADATA_STAGE_VALUE = "stage";
    private final static String METADATA_TYPE_VALUE = "type";
    private final static String METADATA_PURPOSE_VALUE = "purpose";
    private final static boolean METADATA_EEA_RELEVANCE_VALUE = true;
    private final static String DOCUMENT_TEMPLATE_VALUE = "template";
    private final static String DOCUMENT_LANGUAGE_VALUE = "language";
    private final static String METADATA_DOCTEMPLATE_VALUE = "docTemplate";
    private final static String METADATA_REF_VALUE = "ref";
    private final static String DOCUMENT_OBJECT_ID_VALUE = "title";
    private final static RepositoryPropertiesMapper repositoryPropertiesMapper = new CmisProperties();

    @Test
    public void toCmisProperties_IfProposalMetadata() {
        //setup
        ProposalMetadata proposalMetadata = new ProposalMetadata(METADATA_STAGE_VALUE, METADATA_TYPE_VALUE, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, METADATA_REF_VALUE, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(proposalMetadata);

        //verify
        verifyCommonCmisProperties(metadata, METADATA_TYPE_VALUE, METADATA_REF_VALUE, "stage type purpose", true);
    }

    @Test
    public void toCmisProperties_IfProposalMetadata_whenSomeFieldsNull() {
        //setup
        ProposalMetadata proposalMetadata = new ProposalMetadata(METADATA_STAGE_VALUE, null, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, null, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", false);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(proposalMetadata);

        //verify
        verifyCommonCmisProperties(metadata, null, null, "stage purpose", false);

    }

    @Test
    public void toCmisProperties_IfMemorandumMetadata() {
        //setup
        MemorandumMetadata memorandumMetadata = new MemorandumMetadata(METADATA_STAGE_VALUE, METADATA_TYPE_VALUE, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, METADATA_REF_VALUE, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(memorandumMetadata);

        //verify
        verifyCommonCmisProperties(metadata, METADATA_TYPE_VALUE, METADATA_REF_VALUE, METADATA_TYPE_VALUE, METADATA_EEA_RELEVANCE_VALUE);
    }

    @Test
    public void toCmisProperties_IfMemorandumMetadata_whenSomeFieldsNull() {
        //setup
        MemorandumMetadata memorandumMetadata = new MemorandumMetadata(METADATA_STAGE_VALUE, null, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, null, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(memorandumMetadata);

        //verify
        verifyCommonCmisProperties(metadata, null, null, null, METADATA_EEA_RELEVANCE_VALUE);

    }

    @Test
    public void toCmisProperties_IfBillMetadata() {
        //setup
        BillMetadata billMetadata = new BillMetadata(METADATA_STAGE_VALUE, METADATA_TYPE_VALUE, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, METADATA_REF_VALUE, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(billMetadata);

        //verify
        verifyCommonCmisProperties(metadata, METADATA_TYPE_VALUE, METADATA_REF_VALUE, "stage type purpose", METADATA_EEA_RELEVANCE_VALUE);
    }

    @Test
    public void toCmisProperties_IfBillMetadata_whenSomeFieldsNull() {
        //setup
        BillMetadata billMetadata = new BillMetadata(METADATA_STAGE_VALUE, null, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, null, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(billMetadata);

        //verify
        verifyCommonCmisProperties(metadata, null, null, "stage purpose", METADATA_EEA_RELEVANCE_VALUE);

    }

    @Test
    public void toCmisProperties_IfAnnexMetadata() {
        //setup
        int annexIndex = 12;
        String annexNumber = "annexNumber";
        String annexTitle = "annexTitle";
        AnnexMetadata annexMetadata = new AnnexMetadata(METADATA_STAGE_VALUE, METADATA_TYPE_VALUE, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, METADATA_REF_VALUE, annexIndex,
                annexNumber, annexTitle, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE, null);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(annexMetadata);

        //verify
        verifyCommonCmisProperties(metadata, METADATA_TYPE_VALUE, METADATA_REF_VALUE, METADATA_TYPE_VALUE, METADATA_EEA_RELEVANCE_VALUE);
        assertEquals(annexIndex,
                metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_INDEX)));

        assertEquals(annexNumber,
                metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_NUMBER)));

        assertEquals(annexTitle,
                metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_TITLE)));

    }

    @Test
    public void toCmisProperties_IfAnnexMetadata_whenSomeFieldsNull() {
        //setup
        int annexIndex = 12;
        String annexNumber = "annexNumber";
        String annexTitle = "annexTitle";
        AnnexMetadata annexMetadata = new AnnexMetadata(METADATA_STAGE_VALUE, null, METADATA_PURPOSE_VALUE,
                DOCUMENT_TEMPLATE_VALUE, DOCUMENT_LANGUAGE_VALUE, METADATA_DOCTEMPLATE_VALUE, null, annexIndex,
                annexNumber, annexTitle, DOCUMENT_OBJECT_ID_VALUE, "0.1.0", METADATA_EEA_RELEVANCE_VALUE, null);

        //make call
        Map<String, ? extends Object> metadata = LeosMetadataExtensions.toCmisProperties(annexMetadata);

        //verify
        verifyCommonCmisProperties(metadata, null, null, null, METADATA_EEA_RELEVANCE_VALUE);
        assertEquals(annexIndex, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_INDEX)));
        assertEquals(annexNumber, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_NUMBER)));
        assertEquals(annexTitle, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_TITLE)));

    }

    
    private void verifyCommonCmisProperties(Map<String, ?> metadata, String expectedType, String expectedRefValue, String expectedTitleValue, boolean eeaRelevance) {
        assertNotNull(metadata);

        assertEquals(METADATA_STAGE_VALUE, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_STAGE)));
        assertEquals(expectedType, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_TYPE)));
        assertEquals(METADATA_PURPOSE_VALUE, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE)));
        assertEquals(DOCUMENT_TEMPLATE_VALUE, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TEMPLATE)));
        assertEquals(DOCUMENT_LANGUAGE_VALUE, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_LANGUAGE)));
        assertEquals(METADATA_DOCTEMPLATE_VALUE, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_DOCTEMPLATE)));
        assertEquals(eeaRelevance, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_EEA_RELEVANCE)));

        assertEquals(expectedRefValue, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_REF)));
        assertEquals(expectedTitleValue, metadata.get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE)));

    }
}
