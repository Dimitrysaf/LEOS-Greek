package eu.europa.ec.digit.leos.pilot.export.util;

import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XmlFile;
import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Node;

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
    public void testAddInsertCoteToCuidInMainXml() throws XmlUtilException, MetadataUtilsException {
        XmlFile xmlFile = createCuidXmlFile("main-cm29gm7v600276e56hvqz1k4g-en.xml", "cm29gm7v600276e56hvqz1k4g");
        ReferenceFieldInfo insertCoteFieldInfo = createInsertCoteFieldInfo("COM(2024) 1811");
        MetadataUtil.addInsertCoteToCuid(insertCoteFieldInfo, xmlFile);

        Node fileCuidNode = xmlFile.getElementByName("akn4eu:fileCUID");
        Assertions.assertNotNull(fileCuidNode);
        Assertions.assertEquals("COM(2024)_1811", XmlUtil.getNodeAttributeValue(fileCuidNode, "value"));

        Node docCuidNode = xmlFile.getElementByName("akn4eu:docCUID");
        Assertions.assertNotNull(docCuidNode);
        Assertions.assertEquals("COM(2024)_1811", XmlUtil.getNodeAttributeValue(docCuidNode, "value"));
    }

    @Test
    public void testAddInsertCoteToCuidInNotMainXml() throws XmlUtilException, MetadataUtilsException {
        XmlFile xmlFile = createCuidXmlFile("notMain-cm29gm7v600276e56hvqz1k4g-en.xml", "cm29gm7v600276e56hvqz1k4g");
        ReferenceFieldInfo insertCoteFieldInfo = createInsertCoteFieldInfo("COM(2024) 1811");
        MetadataUtil.addInsertCoteToCuid(insertCoteFieldInfo, xmlFile);

        Node fileCuidNode = xmlFile.getElementByName("akn4eu:fileCUID");
        Assertions.assertNotNull(fileCuidNode);
        Assertions.assertEquals("cm29gm7v600276e56hvqz1k4g", XmlUtil.getNodeAttributeValue(fileCuidNode, "value"));

        Node docCuidNode = xmlFile.getElementByName("akn4eu:docCUID");
        Assertions.assertNotNull(docCuidNode);
        Assertions.assertEquals("COM(2024)_1811", XmlUtil.getNodeAttributeValue(docCuidNode, "value"));
    }

    private XmlFile createCuidXmlFile(String filename, String cuid) throws XmlUtilException {
        XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName(filename);
        Node rootNode = xmlFile.createRoot("doc");

        Node metaNode = xmlFile.newElement("meta");
        rootNode.appendChild(metaNode);

        Node identiciationNode = xmlFile.newElement("identification");
        metaNode.appendChild(identiciationNode);

        Node frbrWorkNode = xmlFile.newElement("FRBRWork");
        identiciationNode.appendChild(frbrWorkNode);

        Node preservationNode = xmlFile.newElement("preservation");
        frbrWorkNode.appendChild(preservationNode);

        Node fileCuidNode = xmlFile.newElement("akn4eu:fileCUID");
        XmlUtil.setNodeAttributeValue(fileCuidNode, "value", cuid);
        preservationNode.appendChild(fileCuidNode);

        Node docCuidNode = xmlFile.newElement("akn4eu:docCUID");
        XmlUtil.setNodeAttributeValue(docCuidNode, "value", cuid);
        preservationNode.appendChild(docCuidNode);

        return xmlFile;
    }

    private ReferenceFieldInfo createInsertCoteFieldInfo(String fieldValue) throws MetadataUtilsException {
        return (ReferenceFieldInfo)MetadataUtil.parseInsertCote(fieldValue);
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

    @Test
    public void testIsDocumentXmlFilename() {
        String filenameSuffix = "-cm3rbjrge0004si76xfw7zuq7-en.xml";

        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("ANNEX" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("BILL" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("EXPL_MEMORANDUM" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("EXPL_COUNCIL" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("main" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("MEMORANDUM" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("REG" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DIR" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DEC" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("FINANCIAL_STATEMENT" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("STAT_FINANCE" + filenameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("STAT_DIGIT_FINANCE" + filenameSuffix));
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFilename("main-cm3rbjrge0004si76xfw7zuq7-en.css"));
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFilename("MY_DOC" + filenameSuffix));
    }

    @Test
    public void testIsDocumentXmlFileForDocElement() throws XmlUtilException {
        final XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName("EXPL_MEMORANDUM-cm3rbjrge0004si76xfw7zuq7-en.xml");
        final Node rootNode = xmlFile.createRoot("akomaNtoso");

        final Node docNode = xmlFile.newElement("doc");
        rootNode.appendChild(docNode);
        XmlUtil.setNodeAttributeValue(docNode, "name", "EXPL_MEMORANDUM");
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFile(xmlFile));
    }

    @Test
    public void testIsDocumentXmlFileForBillElement() throws XmlUtilException {
        final XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName("REG-cm3rbjrge0004si76xfw7zuq7-en.xml");
        final Node rootNode = xmlFile.createRoot("akomaNtoso");

        final Node billNode = xmlFile.newElement("bill");
        rootNode.appendChild(billNode);
        XmlUtil.setNodeAttributeValue(billNode, "name", "REG");
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFile(xmlFile));
    }

    @Test
    public void testIsDocumentXmlFileMissingDocElement() throws XmlUtilException {
        final XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName("MYDOC-cm3rbjrge0004si76xfw7zuq7-en.xml");
        Node rootNode = xmlFile.createRoot("akomaNtoso");
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFile(xmlFile));
    }

    @Test
    public void testIsDocumentXmlFileMissingNameAttribute() throws XmlUtilException {
        final XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName("MYDOC-cm3rbjrge0004si76xfw7zuq7-en.xml");
        Node rootNode = xmlFile.createRoot("akomaNtoso");
        rootNode.appendChild(xmlFile.newElement("doc"));
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFile(xmlFile));
    }

    @Test
    public void testIsDocumentXmlFileEmptyNameAttribute() throws XmlUtilException {
        final XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName("MYDOC-cm3rbjrge0004si76xfw7zuq7-en.xml");
        Node rootNode = xmlFile.createRoot("akomaNtoso");
        XmlUtil.setNodeAttributeValue(rootNode, "name", "");
        rootNode.appendChild(xmlFile.newElement("doc"));
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFile(xmlFile));
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
