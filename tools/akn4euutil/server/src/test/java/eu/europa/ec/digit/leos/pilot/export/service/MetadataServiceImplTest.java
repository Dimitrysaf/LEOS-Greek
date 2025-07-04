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
package eu.europa.ec.digit.leos.pilot.export.service;

import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotAvailableException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotSupportedException;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.service.impl.MetadataServiceImpl;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class MetadataServiceImplTest {
    private MetadataService metadataService;

    @BeforeEach
    public void beforeEach() {
        if (this.metadataService == null) {
            this.metadataService = MetadataServiceImpl.newInstance();
        }
    }

    @Test
    public void testAddCoteToCuidInMainXml() throws XmlUtilException, MetadataFieldInvalidValueException {
        XmlUtil.XmlFile xmlFile = createCuidXmlFile("main-cm29gm7v600276e56hvqz1k4g-en.xml", "cm29gm7v600276e56hvqz1k4g");
        ReferenceFieldInfo coteFieldInfo = createCoteFieldInfo("COM(2024) 1811");
        metadataService.processCote(coteFieldInfo, xmlFile);

        Node fileCuidNode = xmlFile.getElementByName("akn4eu:fileCUID");
        Assertions.assertNull(fileCuidNode);

        Node docCuidNode = xmlFile.getElementByName("akn4eu:docCUID");
        Assertions.assertNull(docCuidNode);
    }

    @Test
    public void testAddCoteToCuidInNotMainXml() throws XmlUtilException, MetadataFieldInvalidValueException {
        XmlUtil.XmlFile xmlFile = createCuidXmlFile("notMain-cm29gm7v600276e56hvqz1k4g-en.xml", "cm29gm7v600276e56hvqz1k4g");
        ReferenceFieldInfo coteFieldInfo = createCoteFieldInfo("COM(2024) 1811");
        metadataService.processCote(coteFieldInfo, xmlFile);

        Node fileCuidNode = xmlFile.getElementByName("akn4eu:fileCUID");
        Assertions.assertNotNull(fileCuidNode);
        Assertions.assertEquals("cm29gm7v600276e56hvqz1k4g", XmlUtil.getNodeAttributeValue(fileCuidNode, "value"));

        Node docCuidNode = xmlFile.getElementByName("akn4eu:docCUID");
        Assertions.assertNull(docCuidNode);
    }

    @Test
    public void testAssociatedReferences() throws MetadataFieldInvalidValueException, XmlUtilException {
        final MultipleReferencesFieldInfo referencesFieldInfo = (MultipleReferencesFieldInfo) MetadataUtil.parseLinkedDocuments("{SEC(2021) 11 jcwtest5} - {SWD(2021) 42 final} - {SWD(2021) 43 final}");
        final XmlUtil.XmlFile xmlFile = createAssociatedReferencesXmlFile("main.xml");
        metadataService.processLinkedDocuments(referencesFieldInfo, xmlFile);

        Node referencesContainer = xmlFile.getElementByName("container");
        Assertions.assertFalse(XmlUtil.isNodeEmpty(referencesContainer));
        Assertions.assertFalse(XmlUtil.nodeHasAttribute(referencesContainer, "class"));
        Assertions.assertTrue(referencesContainer.hasChildNodes());

        NodeList childNodes = referencesContainer.getChildNodes();
        Assertions.assertEquals(3, childNodes.getLength());
        for (int i=0; i<childNodes.getLength(); i++) {
            final Node referenceNode = childNodes.item(i);
            String xmlId = XmlUtil.getNodeAttributeValue(referenceNode, "xml:id");
            Assertions.assertNotNull(xmlId);
            Assertions.assertFalse(xmlId.isEmpty());
            Assertions.assertFalse(xmlId.startsWith("_"));
        }
    }

    @Test
    public void testMissingAssociatedReferences() throws MetadataFieldInvalidValueException, XmlUtilException {
        final MultipleReferencesFieldInfo referencesFieldInfo = (MultipleReferencesFieldInfo) MetadataUtil.parseLinkedDocuments("");
        final XmlUtil.XmlFile xmlFile = createAssociatedReferencesXmlFile("main.xml");
        metadataService.processLinkedDocuments(referencesFieldInfo, xmlFile);

        Node referencesContainer = xmlFile.getElementByName("container");
        Assertions.assertTrue(XmlUtil.isNodeEmpty(referencesContainer));
    }

    private XmlUtil.XmlFile createCuidXmlFile(String fileName, String cuid) throws XmlUtilException {
        XmlUtil.XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName(fileName);
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

    private ReferenceFieldInfo createCoteFieldInfo(String fieldValue) throws MetadataFieldInvalidValueException {
        return (ReferenceFieldInfo)MetadataUtil.parseCote(fieldValue, MetadataFieldType.COTE);
    }

    private XmlUtil.XmlFile createAssociatedReferencesXmlFile(String fileName) throws XmlUtilException {
        XmlUtil.XmlFile xmlFile = XmlUtil.newXmlFile();
        xmlFile.setName(fileName);
        Node rootNode = xmlFile.createRoot("doc");

        Node coverpageNode = xmlFile.newElement("coverPage");
        XmlUtil.setNodeAttributeValue(coverpageNode, "xml:id", "coverpage__container");
        rootNode.appendChild(coverpageNode);

        Node referencesContainerNode = xmlFile.newElement("container");
        XmlUtil.setNodeAttributeValue(referencesContainerNode, "name", "associatedReferences");
        XmlUtil.setNodeAttributeValue(referencesContainerNode, "class", "template");
        XmlUtil.setNodeAttributeValue(referencesContainerNode, "xml:id", "coverpage__container_associatedReferences");
        coverpageNode.appendChild(referencesContainerNode);

        Node referenceNode = xmlFile.newElement("p");
        XmlUtil.setNodeAttributeValue(referenceNode, "xml:id", "coverpage__container_2__p");

        return xmlFile;
    }

    @Test()
    public void testLookupFieldInfoThrowNotAvailableException() {
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.STATUS.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.COMMISSIONER.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.DELETE_INTERNAL_REFERENCE.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.START_PAGE_NUMBER.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.CLEANUP_HEADER_AND_FOOTER.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.FREEZE_NUMBERING.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.DELETE_COMMENTS.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.DELETE_VERSIONS.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.DELETE_HIDDEN_TEXT.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.DELETE_USER_PROPERTIES.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.CLEAR_MARKER.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.ADJUST_SIGNATURE_LAYOUT.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.REMOVE_SENSITIVITY.toString(), "");
        });
        Assertions.assertThrows(MetadataFieldNotAvailableException.class, () -> {
            metadataService.lookupFieldInfo(MetadataFieldType.UPDATE_COVER_PAGE.toString(), "");
        });
    }

    @Test
    public void testLookupFieldInfoThrowNotSupportedException() {
        Assertions.assertThrows(MetadataFieldNotSupportedException.class, () -> {
            metadataService.lookupFieldInfo("Not supported", "XXXX");
        });
    }
}
