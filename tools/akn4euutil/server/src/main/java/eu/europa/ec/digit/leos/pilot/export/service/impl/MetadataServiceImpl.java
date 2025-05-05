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
package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataLanguageFormats;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.service.MetadataService;
import eu.europa.ec.digit.leos.pilot.export.util.IdGenerator;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ResourcesUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.InputStream;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
public class MetadataServiceImpl implements MetadataService {
    public static final Logger LOG = LoggerFactory.getLogger(MetadataServiceImpl.class);

    public MetadataServiceImpl(){}

    public static MetadataService newInstance() {
        return new MetadataServiceImpl();
    }

    @Override
    public ApplyMetadataResponse.FieldNode getLookupFieldInfoErrorResult(
            ApplyMetadataRequest.FieldNode field,
            MetadataUtilsException e) {

        if(e.getMessage().equals(MetadataUtil.INVALID_FIELD_VALUE_MESSAGE)) {
            return new ApplyMetadataResponse.FieldNode(field.getKey(), MetadataUtil.ONE,
                    String.format(MetadataUtil.INVALID_FIELD_VALUE_MESSAGE + " \"%s\"", field.getValue(), MetadataUtil.FIELD));
        }

        return new ApplyMetadataResponse.FieldNode(field.getKey(), MetadataUtil.ONE,
                String.format("tag not found (field=\"%s\", tag=\"%s\")", field.getKey(), MetadataUtil.FIELD));
    }

    @Override
    public ApplyMetadataResponse.FieldNode getLookupFieldInfoSuccessResult(ApplyMetadataRequest.FieldNode field) {
        return new ApplyMetadataResponse.FieldNode(field.getKey(), MetadataUtil.ZERO, "Inserted");
    }

    @Override
    public MetadataFieldInfo lookupFieldInfo(ApplyMetadataRequest.FieldNode field) throws MetadataUtilsException {
        return lookupFieldInfo(field.getKey(), field.getValue());
    }

    @Override
    public MetadataFieldInfo lookupFieldInfo(String field, String fieldValue) throws MetadataUtilsException {
        try {
            LOG.debug("Lookup field ", field);
            MetadataFieldType fieldType = MetadataFieldType.valueOfTypeName(field);
            switch(fieldType){
                case ADOPTION_DATE:
                    return MetadataUtil.parseAdoptionDate(fieldValue);
                case ADOPTION_LOCATION:
                    return MetadataUtil.parseAdoptionLocation(fieldValue);
                case EMISSION_DATE:
                    return MetadataUtil.parseEmissionDate(fieldValue);
                case INTERINSTITUTIONAL_COTE:
                    return MetadataUtil.parseInterinstitutionalCote(fieldValue);
                case INSERT_COTE:
                    return MetadataUtil.parseInsertCote(fieldValue);
                case LINKED_DOCUMENTS:
                    return MetadataUtil.parseLinkedDocuments(fieldValue);
                case DOCUMENT_FINAL:
                    return MetadataUtil.parseDocumentFinal(fieldValue);
                case STAMP:
                    return MetadataUtil.parseStamp(fieldValue);
                default:
                    throw new MetadataUtilsException(MetadataUtil.FIELD_NOT_SUPPORTED_MESSAGE);
            }
        } catch (IllegalArgumentException e){
            throw new MetadataUtilsException(MetadataUtil.FIELD_NOT_SUPPORTED_MESSAGE);
        } catch (MetadataUtilsException mue){
            throw mue;
        }
    }

    @Override
    public void processAdoptionLocation(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final ReferenceFieldInfo locationToLanguage = adaptLocationToLanguage(fieldInfo, xmlFile);
        this.addAdoptionLocationToMetaReference(locationToLanguage, xmlFile);
        this.addAdoptionLocationToCoverPage(locationToLanguage, xmlFile);
        this.addAdoptionLocationToConclusion(locationToLanguage, xmlFile);
    }

    @Override
    public void processAdoptionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillXmlDocument(xmlFile)) {
            addAdoptionDate(fieldInfo, xmlFile);
        }
    }

    private void addAdoptionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node longTitle = xmlFile.getElementByName("longTitle");
        if (longTitle == null) return;

        final Node pNode = XmlUtil.getChildNodeWithName(longTitle, "p");
        if (pNode == null) return;

        final Node dateNode = XmlUtil.getChildNodeWithName(pNode, MetadataUtil.DATE);
        if (dateNode == null) return;

        String displayValue = this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
        XmlUtil.setNodeAttributeValue(dateNode, MetadataUtil.DATE, displayValue);
    }

    private ReferenceFieldInfo adaptLocationToLanguage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final MetadataLanguageFormats metadataLanguageDateFormat = getMetadataLanguageDateFormat(xmlFile);
        final String displayValue = metadataLanguageDateFormat.getLocationDisplayValue(fieldInfo.getId());
        return new ReferenceFieldInfo(fieldInfo.getId(), fieldInfo.getHref(), displayValue, fieldInfo.getShortValue(), fieldInfo.getFieldType());

    }

    private void addAdoptionLocationToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeMeta = MetadataUtil.getXmlNodeMetaReference(xmlFile, "TLCLocation");
        if (xmlNodeMeta == null) {
            return;
        }
        XmlUtil.setNodeAttributeValue(xmlNodeMeta, MetadataUtil.XMLID, fieldInfo.getId());
        XmlUtil.setNodeAttributeValue(xmlNodeMeta, MetadataUtil.HREF, fieldInfo.getHref());
        XmlUtil.setNodeAttributeValue(xmlNodeMeta, MetadataUtil.SHOWAS, fieldInfo.getDisplayValue());
    }


    private void addAdoptionLocationToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, "mainDoc");
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, "placeAndDate");
        if (xmlNodeBlock == null) {
            return;
        }

        Node xmlNodeLocation = XmlUtil.getChildNodeWithName(xmlNodeBlock, "location");
        if (xmlNodeLocation == null) {
            return;
        }
        MetadataUtil.addRefersToAttribute(xmlNodeLocation, fieldInfo.getId());
        xmlNodeLocation.setTextContent(fieldInfo.getDisplayValue());
    }

    private void addAdoptionLocationToConclusion(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {

        Node xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.CONCLUSIONSNEW);
        if (xmlNodeConclusions == null) {
            xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.CONCLUSIONS);
        }
        if (xmlNodeConclusions == null) {
            return;
        }

        List<Node> xmlNodesP = XmlUtil.getChildNodesWithName(xmlNodeConclusions, "p");
        if (xmlNodesP.isEmpty()) {
            return;
        }

        for(Node xmlNodeP : xmlNodesP) {
            Node xmlNodeLocation = XmlUtil.getChildNodeWithName(xmlNodeP, "location");
            if (xmlNodeLocation == null) {
                continue;
            }
            MetadataUtil.addRefersToAttribute(xmlNodeLocation, fieldInfo.getId());
            xmlNodeLocation.setTextContent(fieldInfo.getDisplayValue());
        }
    }

    @Override
    public void processEmissionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addEmissionDateToCoverPage(fieldInfo, xmlFile);
        this.addEmissionDateToConclusion(fieldInfo, xmlFile);
    }

    private void addEmissionDateToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, "mainDoc");
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, "placeAndDate");
        if (xmlNodeBlock == null) {
            return;
        }

        Node xmlNodeDate = XmlUtil.getChildNodeWithName(xmlNodeBlock, MetadataUtil.DATE);
        if (xmlNodeDate == null) {
            return;
        }
        XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.DATE, fieldInfo.getId());

        String displayValue = this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
        MetadataUtil.removeClassAttribute(xmlNodeDate);
        xmlNodeDate.setTextContent(displayValue);
    }


    private void addEmissionDateToConclusion(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {

        Node xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.CONCLUSIONSNEW);
        if (xmlNodeConclusions == null) {
            xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.CONCLUSIONS);
        }
        if (xmlNodeConclusions == null) {
            return;
        }

        Node xmlNodeConclusionsP = XmlUtil.getXmlChildNodeWithXmlIdAttributeValue(xmlNodeConclusions, MetadataUtil.CONCLUSION_NODE_IDNEW);
        if (xmlNodeConclusionsP == null) {
            xmlNodeConclusionsP = XmlUtil.getXmlChildNodeWithXmlIdAttributeValue(xmlNodeConclusions, MetadataUtil.CONCLUSION_NODE_ID);
        }
        if (xmlNodeConclusionsP == null) {
            return;
        }

        Node xmlNodeDate = XmlUtil.getChildNodeWithName(xmlNodeConclusionsP, MetadataUtil.DATE);
        if (xmlNodeDate == null) {
            return;
        }

        XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.DATE, fieldInfo.getId());
        MetadataUtil.removeClassAttribute(xmlNodeDate);
        String displayValue = this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
        xmlNodeDate.setTextContent(displayValue);
    }

    private String readEmissionDataDisplayValue(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final MetadataLanguageFormats metadataLanguageFormats = getMetadataLanguageDateFormat(xmlFile);
        return metadataLanguageFormats.formatDate(MetadataUtil.convertIsoDateToLanguageDateFormat(fieldInfo.getId(), metadataLanguageFormats));
    }

    private MetadataLanguageFormats getMetadataLanguageDateFormat(XmlUtil.XmlFile xmlFile){
        Node xmlNodeLanguageReference = MetadataUtil.getLanguageReferenceNode(xmlFile);
        if (xmlNodeLanguageReference == null) {
            return MetadataLanguageFormats.EN;
        }
        final String countryCode = MetadataUtil.parseAlpha3CountryCode(xmlNodeLanguageReference);
        return MetadataUtil.convertIso6392tCodeToMetadataLanguageDateFormat(countryCode);
    }

    @Override
    public void processInsertCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addInsertCoteToMetaIdentification(fieldInfo, xmlFile);
        this.addInsertCoteToMetaReference(fieldInfo, xmlFile);
        this.addInsertCoteToCoverPage(fieldInfo, xmlFile);
        this.addInsertCoteToDocumentFilename(fieldInfo, xmlFile);

        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            this.removeMetaPreservation(xmlFile);
        } else {
            this.removeDocCuid(xmlFile);
            this.addInsertCoteToCuid(fieldInfo, xmlFile);
        }
    }

    /**
     * Add the cote value to the akn4eu:xxxxCUID nodes.
     * */
    private void addInsertCoteToCuid(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.PRESERVATION);
        if (preservationNode == null) {
            return;
        }

        String cuidValue = fieldInfo.getDisplayValue().replace(" ", "_");
        this.replaceCuidValue(preservationNode, "docCUID", cuidValue);

        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            this.replaceCuidValue(preservationNode, "fileCUID", cuidValue);
        }
    }

    private void replaceCuidValue(Node preservationNode, String cuidName, String value) {
        final Node cuidNode = XmlUtil.getChildNodeWithName(preservationNode, String.format("akn4eu:%s", cuidName));
        if (cuidNode != null) {
            XmlUtil.setNodeAttributeValue(cuidNode, "value", value);
        }
    }

    private void addInsertCoteToDocumentFilename(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile)
    {
        final String fileName = xmlFile.getName();
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            final String[] splitFileName = fileName.split("-");
            splitFileName[1] = prepareInsertCoteForFileName(fieldInfo);
            xmlFile.setName(String.join("-", splitFileName));
        }
    }

    private String prepareInsertCoteForFileName(ReferenceFieldInfo fieldInfo) {
        final String insertCote = fieldInfo.getDisplayValue();
        return insertCote.replace(" ", "_");
    }

    private void addInsertCoteToMetaIdentification(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node identificationNode = xmlFile.getElementByName("identification");
        if (identificationNode == null) return;

        final Node frbrWorkNode = XmlUtil.getChildNodeWithName(identificationNode, MetadataUtil.FRBRWORK);
        if (frbrWorkNode == null) return;

        final Node prescriptiveNode = XmlUtil.getChildNodeWithName(frbrWorkNode, "FRBRprescriptive");
        if(prescriptiveNode == null) {
            return;
        }

        final Element frbrNumber = xmlFile.newElement("FRBRnumber");
        XmlUtil.setNodeAttributeValue(frbrNumber, MetadataUtil.VALUE, fieldInfo.getDisplayValue());
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            MetadataUtil.addRefersToAttribute(frbrNumber, fieldInfo.getId());
        }
        frbrWorkNode.insertBefore(frbrNumber, prescriptiveNode);
    }

    private void addInsertCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile)) {
            addTLCReference(fieldInfo, xmlFile, "identifier");
        }
    }

    private void removeMetaPreservation(XmlUtil.XmlFile xmlFile) {
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.PRESERVATION);
        if (preservationNode == null) {
            return;
        }
        frbrWorkNode.removeChild(preservationNode);
    }

    private void removeDocCuid(XmlUtil.XmlFile xmlFile) {
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.PRESERVATION);
        if (preservationNode == null) {
            return;
        }

        final Node docCuidNode = XmlUtil.getChildNodeWithName(preservationNode, "akn4eu:docCUID");
        if (docCuidNode == null) {
            return;
        }
        preservationNode.removeChild(docCuidNode);
    }

    public void addInsertCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, "mainDoc");
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, "reference");
        if (xmlNodeBlock == null) {
            return;
        }

        Node xmlNodeDocNumber = XmlUtil.getChildNodeWithName(xmlNodeBlock, "docNumber");
        if (xmlNodeDocNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeBlock);
        MetadataUtil.removeClassAttribute(xmlNodeDocNumber);
        MetadataUtil.addRefersToAttribute(xmlNodeDocNumber, fieldInfo.getId());
        xmlNodeDocNumber.setTextContent(fieldInfo.getDisplayValue());
    }

    @Override
    public void processDocumentFinal(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile)
    {
        if (fieldInfo.getDisplayValue().equals("final")) {
            this.addFinalToCoverPage(fieldInfo, xmlFile);
            this.addFinalToIdentification(fieldInfo, xmlFile);
            this.addFinalToFilename(fieldInfo, xmlFile);
        }
    }

    private void addFinalToFilename(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile)
    {
        final String fileName = xmlFile.getName();
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            final String[] splitFileName = fileName.split("-");
            final String newFileName = Arrays.stream(splitFileName).reduce("", (a, b) -> b.endsWith(".xml") ? a + "final-" + b : a + b + "-");
            xmlFile.setName(newFileName);
        }
    }

    private void addFinalToIdentification(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node frbrExpression = xmlFile.getElementByName("FRBRExpression");
        if (frbrExpression == null) {
            return;
        }
        final Element frbrVersionNumber = xmlFile.newElement("FRBRversionNumber");
        XmlUtil.setNodeAttributeValue(frbrVersionNumber, MetadataUtil.VALUE, fieldInfo.getDisplayValue());

        frbrExpression.insertBefore(frbrVersionNumber, XmlUtil.getChildNodeWithName(frbrExpression,MetadataUtil.FRBRLANGUAGE));
    }

    private void addFinalToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile)
    {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeDocNumber = MetadataUtil.getXmlNodeDocNumber(xmlFile);
        if (xmlNodeDocNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeDocNumber);
        xmlNodeDocNumber.setTextContent(xmlNodeDocNumber.getTextContent() + " ");
        final Element inline = xmlFile.newElement("inline");
        XmlUtil.setNodeAttributeValue(inline, MetadataUtil.XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(inline, MetadataUtil.NAME, "version");
        inline.setTextContent(fieldInfo.getDisplayValue());
        xmlNodeDocNumber.appendChild(inline);
    }

    @Override
    public void processInterinstitutionalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addInterinstitutionalCoteToMetaReference(fieldInfo, xmlFile);
        this.addInterinstitutionalCoteToCoverPage(fieldInfo, xmlFile);
        this.addInterinstitutionalCoteToPreface(fieldInfo, xmlFile);
    }

    @Override
    public void processStamp(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (!MetadataUtil.ONE.equals(fieldInfo.getDisplayValue())) return;
        if (MetadataUtil.isMainDocumentFile(xmlFile)) return;

        final Node conclusions = xmlFile.getElementByName(MetadataUtil.CONCLUSIONS);
        if (conclusions == null) return;

        final Node blockNode = xmlFile.newElement("block");
        XmlUtil.setNodeAttributeValue(blockNode, MetadataUtil.NAME, "stamp");

        final String language = this.readLanguageValue(xmlFile);
        final String b64Stamp = this.getLanguageStampAsBase64(language);

        final Node imgNode = xmlFile.newElement("img");
        XmlUtil.setNodeAttributeValue(blockNode, "src", "data:image/gif;base64," + b64Stamp);
        blockNode.appendChild(imgNode);
        conclusions.appendChild(blockNode);
    }

    private String readLanguageValue(XmlUtil.XmlFile xmlFile) {
        final Node frbrLanguage = xmlFile.getElementByName(MetadataUtil.FRBRLANGUAGE);
        if (frbrLanguage == null) {
            return MetadataUtil.LANGUAGE_EN;
        }

        final String value = XmlUtil.getNodeAttributeValue(frbrLanguage, MetadataUtil.LANGUAGE);
        if (!StringUtils.hasLength(value)) {
            return MetadataUtil.LANGUAGE_EN;
        }
        return value.toUpperCase();
    }

    private String getLanguageStampAsBase64(final String languageShortValue) {
        final String stampPath = String.format("stamp/%s.gif", languageShortValue);
        final byte[] stampBytes = ResourcesUtil.readResourceFile(stampPath);
        return Base64.getEncoder().encodeToString(stampBytes);
    }

    private void addInterinstitutionalCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillDocumentFile(xmlFile)) {
            addTLCReference(fieldInfo, xmlFile, "procedureReference");
        }
    }

    private void addTLCReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile, String name) {
        final Node references = xmlFile.getElementByName("references");
        if (references == null)
            return;

        final Element tlcReference = xmlFile.newElement("TLCReference");
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.NAME, name);
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.XMLID, fieldInfo.getId());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.HREF, fieldInfo.getHref());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.SHOWAS, fieldInfo.getDisplayValue());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.SHORTFORM, fieldInfo.getShortValue());
        references.appendChild(tlcReference);
    }

    private void addInterinstitutionalCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }
        this.addInterinstitutionalCoteToDocketNumber(fieldInfo, xmlNodeCoverpage);
    }

    private void addInterinstitutionalCoteToPreface(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodePreface = xmlFile.getElementByName("preface");
        if (xmlNodePreface == null) {
            return;
        }
        this.addInterinstitutionalCoteToDocketNumber(fieldInfo, xmlNodePreface);
    }

    private void addInterinstitutionalCoteToDocketNumber(ReferenceFieldInfo fieldInfo, Node xmlParentNode) {
        Node xmlNodeContainer = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlParentNode, "procedureIdentifier");
        if (xmlNodeContainer == null) {
            return;
        }

        Node xmlNodeDocketNumber = MetadataUtil.getXmlNodeDocketNumber(xmlNodeContainer);
        if (xmlNodeDocketNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeContainer);
        MetadataUtil.removeClassAttribute(xmlNodeDocketNumber);
        MetadataUtil.addRefersToAttribute(xmlNodeDocketNumber, fieldInfo.getId());
        xmlNodeDocketNumber.setTextContent(fieldInfo.getDisplayValue());
    }

    @Override
    public void processLinkedDocuments(MultipleReferencesFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeAssociatedReferences = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, "associatedReferences");
        if (xmlNodeAssociatedReferences == null) {
            return;
        }

        if (fieldInfo.getReferences().isEmpty()) {
            xmlNodeCoverpage.removeChild(xmlNodeAssociatedReferences);
            return;
        }

        MetadataUtil.removeClassAttribute(xmlNodeAssociatedReferences);
        // remove any existing content
        if(xmlNodeAssociatedReferences.hasChildNodes()) {
            final NodeList children = xmlNodeAssociatedReferences.getChildNodes();
            for(int i = children.getLength() - 1; i >= 0; i--)
                xmlNodeAssociatedReferences.removeChild(children.item(i));
        }

        for (final ReferenceFieldInfo reference : fieldInfo.getReferences()) {
            final Element referenceElement = createLinkedDocumentElement(reference, xmlFile);
            xmlNodeAssociatedReferences.appendChild(referenceElement);
        }
    }

    private Element createLinkedDocumentElement(final ReferenceFieldInfo reference, XmlUtil.XmlFile xmlFile) {
        final Element refElement = xmlFile.newElement("ref");

        XmlUtil.setNodeAttributeValue(refElement, MetadataUtil.XMLID, IdGenerator.generateId());
        refElement.setTextContent(reference.getDisplayValue());
        refElement.setAttribute(MetadataUtil.HREF, reference.getHref());

        final Element referenceElement = xmlFile.newElement("p");
        XmlUtil.setNodeAttributeValue(referenceElement, MetadataUtil.XMLID, IdGenerator.generateId());
        referenceElement.appendChild(xmlFile.createTextNode("{"));
        referenceElement.appendChild(refElement);
        referenceElement.appendChild(xmlFile.createTextNode("}"));
        return referenceElement;
    }
}
