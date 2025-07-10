/*
 * Copyright 2021-2025 European Commission
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
package eu.europa.ec.digit.leos.pilot.export.util;

import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XmlFile;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Node;

import java.util.Collections;

/**
 * tests on parsing the linked documents
 */
public class MetadataUtilsTests {
    @Test
    public void testLinkedDocumentsSwdWithDraft() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments("{SWD(2012) 1234 draft}");

        Assertions.assertNotNull(actual);

        final MultipleReferencesFieldInfo typedResult = (MultipleReferencesFieldInfo) actual;
        Assertions.assertEquals(1, typedResult.getReferences().size());

        final ReferenceFieldInfo refField = typedResult.getReferences().get(0);

        Assertions.assertEquals("SWD(2012) 1234 draft", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/swd/2012/1234", refField.getHref());
    }

    @Test
    public void testLinkedDocumentsComWithoutSuffixAndBrackets() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments("COM(2014) 4");

        Assertions.assertNotNull(actual);

        final MultipleReferencesFieldInfo typedResult = (MultipleReferencesFieldInfo) actual;
        Assertions.assertEquals(1, typedResult.getReferences().size());

        final ReferenceFieldInfo refField = typedResult.getReferences().get(0);

        Assertions.assertEquals("COM(2014) 4", refField.getDisplayValue());
        Assertions.assertEquals("http://data.europa.eu/eli/com/2014/4", refField.getHref());
    }

    @Test
    public void testLinkedDocumentsSecIsConvertedToSwdInHref() throws MetadataFieldInvalidValueException {

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
    public void testParseMultipleLinkedDocuments() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseLinkedDocuments("{COM(2014) 4 final}-{SWD(2012) 1111}-{SEC(2016) 248 final}");

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
    public void testParseCote_spaceLeft() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseCote("COM(2013) 2456", MetadataFieldType.COTE);

        Assertions.assertNotNull(actual);

        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }

    @Test
    public void testParseCote_noSpaceLeft() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseCote("COM(2013)2456", MetadataFieldType.COTE);

        Assertions.assertNotNull(actual);

        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }

    @Test
    public void testParseCote_spaceLeftWithSuffix() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseCote("COM(2013) 2456 final", MetadataFieldType.FINAL_COTE);

        Assertions.assertNotNull(actual);

        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }

    @Test
    public void testParseCote_noSpaceLeftWithSuffix() throws MetadataFieldInvalidValueException {

        final MetadataFieldInfo actual = MetadataUtil.parseCote("COM(2013)2456 final", MetadataFieldType.FINAL_COTE);

        Assertions.assertNotNull(actual);

        final ReferenceFieldInfo typedResult = (ReferenceFieldInfo) actual;
        Assertions.assertEquals("COM/2013/2456", typedResult.getShortValue());
    }

    @Test
    public void testPreFinalizationLegNameWithoutInstitutionalReference() {
        ApplyMetadataRequest.ActionNode actionNode = getDummyActionNode();
        actionNode.setFields(Collections.singletonList(createFinalCoteNode("COM(2022) 666")));

        ApplyMetadataRequest.TaskNode taskNode = getDummyTaskNode();
        taskNode.setActions(Collections.singletonList(actionNode));
        ApplyMetadataRequest.DocumentNode documentNode = getDummyDocumentNode();
        taskNode.setDocument(documentNode);

        ApplyMetadataRequest request = getDummyMetadataRequest();
        request.setTasks(Collections.singletonList(taskNode));

        String legName = MetadataUtil.buildPrefinalizationLegName(request);
        Assertions.assertEquals("PROP_ACT-COM(2022)_666-final-en.leg", legName);
    }

    @Test
    public void testPreFinalizationLegNameWithInstitutionalReference() {
        ApplyMetadataRequest.ActionNode actionNode = getDummyActionNode();
        actionNode.setFields(Collections.singletonList(createCoteNode("COM(2022) 666")));

        ApplyMetadataRequest.TaskNode taskNode = getDummyTaskNode();
        taskNode.setActions(Collections.singletonList(actionNode));
        ApplyMetadataRequest.DocumentNode documentNode = getDummyDocumentNode();
        taskNode.setDocument(documentNode);

        ApplyMetadataRequest request = getDummyMetadataRequest();
        request.setTasks(Collections.singletonList(taskNode));

        String legName = MetadataUtil.buildPrefinalizationLegName(request);
        Assertions.assertEquals("PROP_ACT-COM(2022)_666-en.leg", legName);
    }

    @Test
    public void testPreFinalizationLegNameWithInstitutionalReferenceAndFinalCote() {
        ApplyMetadataRequest.ActionNode actionNode = getDummyActionNode();
        actionNode.setFields(Collections.singletonList(createFinalCoteNode("COM(2022) 666")));

        ApplyMetadataRequest.TaskNode taskNode = getDummyTaskNode();
        taskNode.setActions(Collections.singletonList(actionNode));
        ApplyMetadataRequest.DocumentNode documentNode = getDummyDocumentNode();
        taskNode.setDocument(documentNode);

        ApplyMetadataRequest request = getDummyMetadataRequest();
        request.setTasks(Collections.singletonList(taskNode));

        String legName = MetadataUtil.buildPrefinalizationLegName(request);
        Assertions.assertEquals("PROP_ACT-COM(2022)_666-final-en.leg", legName);
    }

    @Test
    public void testIsDocumentXmlFilename() {
        String fileNameSuffix = "-cm3rbjrge0004si76xfw7zuq7-en.xml";

        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("ANNEX" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("BILL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("EXPL_MEMORANDUM" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("EXPL_COUNCIL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("main" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("MEMORANDUM" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("REG" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("REG_DEL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("REG_IMPL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DIR" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DIR_DEL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DIR_IMPL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DEC" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DEC_DEL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("DEC_IMPL" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("FINANCIAL_STATEMENT" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("STAT_FINANCE" + fileNameSuffix));
        Assertions.assertTrue(MetadataUtil.isDocumentXmlFilename("STAT_DIGIT_FINANCE" + fileNameSuffix));
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFilename("main-cm3rbjrge0004si76xfw7zuq7-en.css"));
        Assertions.assertFalse(MetadataUtil.isDocumentXmlFilename("MY_DOC" + fileNameSuffix));
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

    @Test
    public void testIsPresidentRole() {
        for (String spelling : MetadataUtil.ROLE_PRESIDENT){
            Assertions.assertTrue(MetadataUtil.isRolePresident(spelling));
        }
    }

    @Test
    public void testIsVicePresidentRole() {
        for (String spelling : MetadataUtil.ROLE_VICE_PRESIDENT){
            Assertions.assertTrue(MetadataUtil.isRoleVicePresident(spelling));
        }
    }

    @Test
    public void testIsDirectorRole() {
        for (String spelling : MetadataUtil.ROLE_DIRECTOR){
            Assertions.assertTrue(MetadataUtil.isRoleDirector(spelling));
        }
    }

    @Test
    public void testIsDirectorGeneralRole() {
        for (String spelling : MetadataUtil.ROLE_DIRECTOR_GENERAL){
            Assertions.assertTrue(MetadataUtil.isRoleDirectorGeneral(spelling));
        }
    }

    @Test
    public void testIsHeadOfServiceRole() {
        for (String spelling : MetadataUtil.ROLE_HEAD_OF_SERVICE){
            Assertions.assertTrue(MetadataUtil.isRoleHeadOfService(spelling));
        }
    }

    @Test
    public void testIsHeadOfUnitRole() {
        for (String spelling : MetadataUtil.ROLE_HEAD_OF_UNIT){
            Assertions.assertTrue(MetadataUtil.isRoleHeadOfUnit(spelling));
        }
    }

    @Test
    public void testIsMemberOfCommissionRole() {
        for (String spelling : MetadataUtil.ROLE_MEMBER_OF_THE_COMMISSION){
            Assertions.assertTrue(MetadataUtil.isRoleMemberOfTheCommission(spelling));
        }
    }

    @Test
    public void testIsSecretariesRole() {
        for (String spelling : MetadataUtil.ROLE_SECRETARIES){
            Assertions.assertTrue(MetadataUtil.isRoleSecretaries(spelling));
        }
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

    private ApplyMetadataRequest.FieldNode createCoteNode(final String value) {
        return new ApplyMetadataRequest.FieldNode("cote", value);
    }

    private ApplyMetadataRequest.FieldNode createFinalCoteNode(final String value) {
        return new ApplyMetadataRequest.FieldNode("finalCote", value);
    }
}
