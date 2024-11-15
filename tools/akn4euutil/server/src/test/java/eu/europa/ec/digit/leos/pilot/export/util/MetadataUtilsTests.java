package eu.europa.ec.digit.leos.pilot.export.util;

import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.Collections;

/**
 * tests on parsing the linked documents
 */
public class MetadataUtilsTests {

    @Test
    public void testLinkedDocumentsSwdWithDraft() throws MetadataUtilsException {
     
        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments("{SWD(2012) 1234 draft}");

        Assertions.assertNotNull(actual);

        final MultipleReferencesFieldInfo typedResult = (MultipleReferencesFieldInfo) actual;
        Assertions.assertEquals(1, typedResult.getReferences().size());

        final ReferenceFieldInfo refField = typedResult.getReferences().get(0);
        
        Assertions.assertEquals("SWD(2012) 1234 draft", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/swd/2012/1234", refField.getHref());
    }
    
    @Test
    public void testLinkedDocumentsComWithoutSuffixAndBrackets() throws MetadataUtilsException {
     
        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments("COM(2014) 4");

        Assertions.assertNotNull(actual);

        final MultipleReferencesFieldInfo typedResult = (MultipleReferencesFieldInfo) actual;
        Assertions.assertEquals(1, typedResult.getReferences().size());

        final ReferenceFieldInfo refField = typedResult.getReferences().get(0);
        
        Assertions.assertEquals("COM(2014) 4", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/com/2014/4", refField.getHref());
    }
    
    @Test
    public void testLinkedDocumentsSecIsConvertedToSwdInHref() throws MetadataUtilsException {

        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments("{SEC(2011) 12 final}");

        Assertions.assertNotNull(actual);
        Assertions.assertTrue(actual instanceof MultipleReferencesFieldInfo);

        final MultipleReferencesFieldInfo typedResult = (MultipleReferencesFieldInfo) actual;
        Assertions.assertEquals(MetadataFieldType.LINKED_DOCUMENTS, actual.getFieldType());

        Assertions.assertEquals(1, typedResult.getReferences().size());
        final ReferenceFieldInfo refField = typedResult.getReferences().get(0);
        
        Assertions.assertEquals("SEC(2011) 12 final", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/swd/2011/12", refField.getHref());
    }
    
    @Test
    public void testParseMultipleLinkedDocuments() throws MetadataUtilsException {
        
        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments(
                "{COM(2014) 4 final}-{SWD(2012) 1111}-{SEC(2016) 248 final}");

        Assertions.assertNotNull(actual);

        final MultipleReferencesFieldInfo typedResult = (MultipleReferencesFieldInfo) actual;
        Assertions.assertEquals(3, typedResult.getReferences().size());

        ReferenceFieldInfo refField = typedResult.getReferences().get(0);
        Assertions.assertEquals("COM(2014) 4 final", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/com/2014/4", refField.getHref());
        
        refField = typedResult.getReferences().get(1);
        Assertions.assertEquals("SWD(2012) 1111", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/swd/2012/1111", refField.getHref());
        
        refField = typedResult.getReferences().get(2);
        Assertions.assertEquals("SEC(2016) 248 final", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/swd/2016/248", refField.getHref());
    }
    
    //---------------------------
    // verify space tolerance for parsing the "cote"
    //---------------------------
    @Test
    public void testParseCote_spaceLeft() throws MetadataUtilsException {
        
        final MetadataFieldInfo actual = MetadataUtil.parseInsertCote("COM(2013) 2456");
        
        Assertions.assertNotNull(actual);
        
        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }
    
    @Test
    public void testParseCote_noSpaceLeft() throws MetadataUtilsException {
        
        final MetadataFieldInfo actual = MetadataUtil.parseInsertCote("COM(2013)2456");
        
        Assertions.assertNotNull(actual);
        
        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }
    
    @Test
    public void testParseCote_spaceLeftWithSuffix() throws MetadataUtilsException {
        
        final MetadataFieldInfo actual = MetadataUtil.parseInsertCote("COM(2013) 2456 final");
        
        Assertions.assertNotNull(actual);
        
        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }
    
    @Test
    public void testParseCote_noSpaceLeftWithSuffix() throws MetadataUtilsException {
        
        final MetadataFieldInfo actual = MetadataUtil.parseInsertCote("COM(2013)2456 final");
        
        Assertions.assertNotNull(actual);
        
        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }

    @Test
    public void testPreFinalizationLegNameWithoutInstitutionalReference() {
        ApplyMetadataRequest.ActionNode actionNode = getDummyActionNode();
        actionNode.setFields(Collections.singletonList(createIsFinalNode("true")));

        ApplyMetadataRequest.TaskNode taskNode = getDummyTaskNode();
        taskNode.setActions(Collections.singletonList(actionNode));
        ApplyMetadataRequest.DocumentNode documentNode = getDummyDocumentNode();

        ApplyMetadataRequest request = getDummyMetadataRequest();
        request.setDocument(documentNode);
        request.setTasks(Collections.singletonList(taskNode));

        String legName = MetadataUtil.buildPrefinalizationLegName(request);
        Assertions.assertEquals(documentNode.getFilename(), legName);
    }

    @Test
    public void testPreFinalizationLegNameWithInstitutionalReference() {
        ApplyMetadataRequest.ActionNode actionNode = getDummyActionNode();
        actionNode.setFields(Arrays.asList(createInsertCoteNode("COM(2022) 666"), createIsFinalNode("0")));

        ApplyMetadataRequest.TaskNode taskNode = getDummyTaskNode();
        taskNode.setActions(Collections.singletonList(actionNode));
        ApplyMetadataRequest.DocumentNode documentNode = getDummyDocumentNode();

        ApplyMetadataRequest request = getDummyMetadataRequest();
        request.setDocument(documentNode);
        request.setTasks(Collections.singletonList(taskNode));

        String legName = MetadataUtil.buildPrefinalizationLegName(request);
        Assertions.assertEquals("PROP_ACT-COM(2022)_666-en.leg", legName);
    }

    @Test
    public void testPreFinalizationLegNameWithInstitutionalReferenceAndIsFinal() {
        ApplyMetadataRequest.ActionNode actionNode = getDummyActionNode();
        actionNode.setFields(Arrays.asList(createInsertCoteNode("COM(2022) 666"), createIsFinalNode("1")));

        ApplyMetadataRequest.TaskNode taskNode = getDummyTaskNode();
        taskNode.setActions(Collections.singletonList(actionNode));
        ApplyMetadataRequest.DocumentNode documentNode = getDummyDocumentNode();

        ApplyMetadataRequest request = getDummyMetadataRequest();
        request.setDocument(documentNode);
        request.setTasks(Collections.singletonList(taskNode));

        String legName = MetadataUtil.buildPrefinalizationLegName(request);
        Assertions.assertEquals("PROP_ACT-COM(2022)_666-final-en.leg", legName);
    }


    private ApplyMetadataRequest getDummyMetadataRequest() {
        return new ApplyMetadataRequest("http://example.com/test",
                "1.0.0", "1900-01-01T00:00:01.000+02:00", "12345");
    }

    private ApplyMetadataRequest.DocumentNode getDummyDocumentNode() {
        return new ApplyMetadataRequest.DocumentNode("zip://PROP_ACT-clujy4npp0000mg34snvwwcd0-en.leg",
                "PROP_ACT-clujy4npp0000mg34snvwwcd0-en.leg",
                "application/zip",
                "_body_cmp_1__dref_2");
    }

    private ApplyMetadataRequest.TaskNode getDummyTaskNode() {
        return new ApplyMetadataRequest.TaskNode("1");
    }

    private ApplyMetadataRequest.ActionNode getDummyActionNode() {
        return new ApplyMetadataRequest.ActionNode("InsertData", "true");
    }

    private ApplyMetadataRequest.FieldNode createInsertCoteNode(final String value) {
        return new ApplyMetadataRequest.FieldNode("insertCote", value);
    }

    private ApplyMetadataRequest.FieldNode createIsFinalNode(final String value) {
        return new ApplyMetadataRequest.FieldNode("isFinal", value);
    }
}
