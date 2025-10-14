package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotAvailableException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotSupportedException;
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
import eu.europa.ec.digit.leos.pilot.export.util.StringUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class MetadataServiceImpl implements MetadataService {
    public static final Logger LOG = LoggerFactory.getLogger(MetadataServiceImpl.class);

    public static final String RESPONSE_STATUS_FIELD_SUCCESS = "0";
    public static final String RESPONSE_STATUS_FIELD_ERROR = "1";
    public static final String RESPONSE_STATUS_FIELD_NOT_SUPPORTED = "0";
    public static final String RESPONSE_STATUS_FIELD_NOT_AVAILABLE = "30";

    public MetadataServiceImpl(){}

    public static MetadataService newInstance() {
        return new MetadataServiceImpl();
    }

    @Override
    public ApplyMetadataResponse.FieldNode getFieldInvalidValueResult(final String fieldName, final String reason) {
        return new ApplyMetadataResponse.FieldNode(fieldName, RESPONSE_STATUS_FIELD_ERROR, reason);
    }

    @Override
    public ApplyMetadataResponse.FieldNode getFieldNotAvailableResult(final String fieldName) {
        return new ApplyMetadataResponse.FieldNode(fieldName, RESPONSE_STATUS_FIELD_NOT_AVAILABLE, "The command is not available");
    }

    @Override
    public ApplyMetadataResponse.FieldNode getFieldNotSupportedResult(final String fieldName) {
        return new ApplyMetadataResponse.FieldNode(fieldName, RESPONSE_STATUS_FIELD_NOT_SUPPORTED, "The command is not supported");
    }

    @Override
    public ApplyMetadataResponse.FieldNode getFieldSuccessResult(final String fieldName) {
        return new ApplyMetadataResponse.FieldNode(fieldName, RESPONSE_STATUS_FIELD_SUCCESS, "Inserted");
    }

    @Override
    public MetadataFieldInfo lookupFieldInfo(ApplyMetadataRequest.FieldNode field) throws MetadataFieldInvalidValueException, MetadataFieldNotAvailableException, MetadataFieldNotSupportedException {
        return lookupFieldInfo(field.getKey(), field.getValue());
    }

    @Override
    public MetadataFieldInfo lookupFieldInfo(String field, String fieldValue) throws MetadataFieldInvalidValueException, MetadataFieldNotAvailableException, MetadataFieldNotSupportedException {
        try {
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
                case COTE:
                    return MetadataUtil.parseCote(fieldValue, MetadataFieldType.COTE);
                case LINKED_DOCUMENTS:
                    return MetadataUtil.parseLinkedDocuments(fieldValue);
                case FINAL_COTE:
                    return MetadataUtil.parseCote(fieldValue, MetadataFieldType.FINAL_COTE);
                case STAMP:
                    return MetadataUtil.parseStamp(fieldValue);
                case COMMISSIONER:
                    return MetadataUtil.parseCommissionerValue(fieldValue);
                default:
                    throw MetadataFieldNotAvailableException.newException(field);
            }
        } catch (IllegalArgumentException e) {
            throw MetadataFieldNotSupportedException.newException(field);
        }
    }

    @Override
    public void processAdoptionLocation(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        addAdoptionLocationToMetaReference(fieldInfo, xmlFile);
        final ReferenceFieldInfo locationToLanguage = adaptLocationToLanguage(fieldInfo, xmlFile);
        addAdoptionLocationToCoverPage(locationToLanguage, xmlFile);
        addAdoptionLocationToConclusion(locationToLanguage, xmlFile);
    }

    @Override
    public void processAdoptionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillXmlDocument(xmlFile)) {
            this.addAdoptionDateToLongTitle(fieldInfo, xmlFile);
        }
        if (MetadataUtil.isBillXmlDocument(xmlFile)) {
            this.addAdoptionDateToConclusions(fieldInfo, xmlFile);
        }
    }

    private void addAdoptionDateToLongTitle(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addAdoptionDate(fieldInfo, MetadataUtil.ELEMENT_LONG_TITLE, xmlFile);
    }

    private void addAdoptionDateToConclusions (ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addAdoptionDate(fieldInfo, MetadataUtil.ELEMENT_CONCLUSIONS, xmlFile);
    }

    private void addAdoptionDate (ReferenceFieldInfo fieldInfo, String parentNodeName, XmlUtil.XmlFile xmlFile) {
        final Node parent = xmlFile.getElementByName(parentNodeName);
        if (parent == null) return;

        final Node pNode = XmlUtil.getChildNodeWithName(parent, MetadataUtil.ELEMENT_P);
        if (pNode == null) return;

        final Node dateNode = XmlUtil.getChildNodeWithName(pNode, MetadataUtil.ELEMENT_DATE);
        if (dateNode == null) return;

        XmlUtil.setNodeAttributeValue(dateNode, MetadataUtil.ATTRIBUTE_DATE, fieldInfo.getId());
        final String displayValue = this.readAdoptionDateDisplayValue(fieldInfo, xmlFile);
        dateNode.setTextContent(displayValue);
    }

    private String readAdoptionDateDisplayValue(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        return this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
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
        XmlUtil.setNodeAttributeValue(xmlNodeMeta, MetadataUtil.ATTRIBUTE_XMLID, fieldInfo.getId());
        XmlUtil.setNodeAttributeValue(xmlNodeMeta, MetadataUtil.ATTRIBUTE_HREF, fieldInfo.getHref());
        XmlUtil.setNodeAttributeValue(xmlNodeMeta, MetadataUtil.ATTRIBUTE_SHOWAS, fieldInfo.getDisplayValue());
    }

    private void addAdoptionLocationToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.VALUE_MAIN_DOC);
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, MetadataUtil.VALUE_PLACE_AND_DATE);
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
        Node xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ATTRIBUTE_CONCLUSIONSNEW);
        if (xmlNodeConclusions == null) {
            xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ELEMENT_CONCLUSIONS);
        }
        if (xmlNodeConclusions == null) {
            return;
        }

        List<Node> xmlNodesP = XmlUtil.getChildNodesWithName(xmlNodeConclusions, MetadataUtil.ELEMENT_P);
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
        addEmissionDateToCoverPage(fieldInfo, xmlFile);
        addEmissionDateToConclusion(fieldInfo, xmlFile);
    }

    private void addEmissionDateToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.VALUE_MAIN_DOC);
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, MetadataUtil.VALUE_PLACE_AND_DATE);
        if (xmlNodeBlock == null) {
            return;
        }

        Node xmlNodeDate = XmlUtil.getChildNodeWithName(xmlNodeBlock, MetadataUtil.ELEMENT_DATE);
        if (xmlNodeDate == null) {
            return;
        }
        XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.ATTRIBUTE_DATE, fieldInfo.getId());

        String displayValue = readEmissionDataDisplayValue(fieldInfo, xmlFile);
        MetadataUtil.removeClassAttribute(xmlNodeDate);
        xmlNodeDate.setTextContent(displayValue);
    }

    private void addEmissionDateToConclusion(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {

        Node xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ATTRIBUTE_CONCLUSIONSNEW);
        if (xmlNodeConclusions == null) {
            xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ELEMENT_CONCLUSIONS);
        }
        if (xmlNodeConclusions == null) {
            return;
        }

        Node xmlNodeConclusionsP = XmlUtil.getXmlChildNodeWithXmlIdAttributeValue(xmlNodeConclusions, MetadataUtil.VALUE_CONCLUSION_NODE_IDNEW);
        if (xmlNodeConclusionsP == null) {
            xmlNodeConclusionsP = XmlUtil.getXmlChildNodeWithXmlIdAttributeValue(xmlNodeConclusions, MetadataUtil.VALUE_CONCLUSION_NODE_ID);
        }
        if (xmlNodeConclusionsP == null) {
            return;
        }

        Node xmlNodeDate = XmlUtil.getChildNodeWithName(xmlNodeConclusionsP, MetadataUtil.ELEMENT_DATE);
        if (xmlNodeDate == null) {
            return;
        }

        XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.ATTRIBUTE_DATE, fieldInfo.getId());
        MetadataUtil.removeClassAttribute(xmlNodeDate);
        String displayValue = this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
        xmlNodeDate.setTextContent(displayValue);
    }

    private String readEmissionDataDisplayValue(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final MetadataLanguageFormats metadataLanguageFormats = getMetadataLanguageDateFormat(xmlFile);
        return metadataLanguageFormats.formatDate(MetadataUtil.convertIsoDateToLanguageDateFormat(fieldInfo.getId(), metadataLanguageFormats));
    }

    private MetadataLanguageFormats getMetadataLanguageDateFormat(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeLanguageReference = MetadataUtil.getLanguageReferenceNode(xmlFile);
        if (xmlNodeLanguageReference == null) {
            return MetadataLanguageFormats.EN;
        }
        final String countryCode = MetadataUtil.parseAlpha3CountryCode(xmlNodeLanguageReference);
        return MetadataUtil.convertIso6392tCodeToMetadataLanguageDateFormat(countryCode);
    }

    @Override
    public void processFinalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        processCote(fieldInfo, xmlFile);
        addFinalToCoverPage(xmlFile);
        addFinalToIdentification(xmlFile);
        addFinalToFilename(xmlFile);
    }

    private void addFinalToFilename(XmlUtil.XmlFile xmlFile) {
        final String fileName = xmlFile.getName();
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            final String[] splitFileName = fileName.split("-");
            final String newFileName = Arrays.stream(splitFileName).reduce("", (a, b) -> b.endsWith(".xml") ? a + MetadataUtil.VALUE_FINAL + "-" + b : a + b + "-");
            xmlFile.setName(newFileName);
        }
    }

    private void addFinalToIdentification(XmlUtil.XmlFile xmlFile) {
        final Node frbrExpression = xmlFile.getElementByName("FRBRExpression");
        if (frbrExpression == null) {
            return;
        }
        final Element frbrVersionNumber = xmlFile.newElement("FRBRversionNumber");
        XmlUtil.setNodeAttributeValue(frbrVersionNumber, MetadataUtil.ATTRIBUTE_VALUE, MetadataUtil.VALUE_FINAL);
        frbrExpression.insertBefore(frbrVersionNumber, XmlUtil.getChildNodeWithName(frbrExpression,"FRBRlanguage"));
    }

    private void addFinalToCoverPage(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
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
        XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_NAME, "version");
        inline.setTextContent(MetadataUtil.VALUE_FINAL);
        xmlNodeDocNumber.appendChild(inline);
    }


    @Override
    public void processCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        addCoteToMetaIdentification(fieldInfo, xmlFile);
        addCoteToMetaReference(fieldInfo, xmlFile);
        addCoteToCoverPage(fieldInfo, xmlFile);
        addCoteToDocumentFilename(fieldInfo, xmlFile);

        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            removeMetaPreservation(xmlFile);
        } else {
            removeDocCuid(xmlFile);
            addCoteToCuid(fieldInfo, xmlFile);
        }
    }

    /**
     * Add the cote value to the akn4eu:xxxxCUID nodes.
     * */
    public void addCoteToCuid(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.ELEMENT_PRESERVATION);
        if (preservationNode == null) {
            return;
        }

        String cuidValue = fieldInfo.getDisplayValue().replace(" ", "_");
        replaceCuidValue(preservationNode, "docCUID", cuidValue);

        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            replaceCuidValue(preservationNode, "fileCUID", cuidValue);
        }
    }

    private void replaceCuidValue(Node preservationNode, String cuidName, String value) {
        final Node cuidNode = XmlUtil.getChildNodeWithName(preservationNode, String.format("akn4eu:%s", cuidName));
        if (cuidNode != null) {
            XmlUtil.setNodeAttributeValue(cuidNode, "value", value);
        }
    }

    private void addCoteToDocumentFilename(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final String fileName = xmlFile.getName();
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            final String[] splitFileName = fileName.split("-");
            splitFileName[1] = prepareCoteForFileName(fieldInfo);
            xmlFile.setName(String.join("-", splitFileName));
        }
    }

    private String prepareCoteForFileName(ReferenceFieldInfo fieldInfo) {
        final String insertCote = fieldInfo.getDisplayValue();
        return insertCote.replace(" ", "_");
    }

    public void addCoteToMetaIdentification(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node identificationNode = xmlFile.getElementByName("identification");
        if (identificationNode == null) return;

        final Node frbrWorkNode = XmlUtil.getChildNodeWithName(identificationNode, MetadataUtil.ELEMENT_FRBRWORK);
        if (frbrWorkNode == null) return;

        final Node prescriptiveNode = XmlUtil.getChildNodeWithName(frbrWorkNode, "FRBRprescriptive");
        if(prescriptiveNode == null) {
            return;
        }

        final Element frbrNumber = xmlFile.newElement("FRBRnumber");
        XmlUtil.setNodeAttributeValue(frbrNumber, MetadataUtil.ATTRIBUTE_VALUE, fieldInfo.getDisplayValue());
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            MetadataUtil.addRefersToAttribute(frbrNumber, fieldInfo.getId());
        }
        frbrWorkNode.insertBefore(frbrNumber, prescriptiveNode);
    }

    public void addCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile)) {
            addTLCReference(fieldInfo, xmlFile, "identifier");
        }
    }

    public void removeMetaPreservation(XmlUtil.XmlFile xmlFile) {
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.ELEMENT_PRESERVATION);
        if (preservationNode == null) {
            return;
        }
        frbrWorkNode.removeChild(preservationNode);
    }

    public void removeDocCuid(XmlUtil.XmlFile xmlFile) {
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.ELEMENT_PRESERVATION);
        if (preservationNode == null) {
            return;
        }

        final Node docCuidNode = XmlUtil.getChildNodeWithName(preservationNode, "akn4eu:docCUID");
        if (docCuidNode == null) {
            return;
        }
        preservationNode.removeChild(docCuidNode);
    }

    public void addCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.VALUE_MAIN_DOC);
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
    public void processInterinstitutionalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final String langValue = MetadataUtil.readLanguageValue(xmlFile);
        ReferenceFieldInfo langFieldInfo = fieldInfo.withHref(fieldInfo.getHref().replace(MetadataUtil.INTERINSTITUTIONAL_COTE_LANG_PLACEHOLDER, langValue));
        addInterinstitutionalCoteToMetaReference(langFieldInfo, xmlFile);
        addInterinstitutionalCoteToCoverPage(langFieldInfo, xmlFile);
        addInterinstitutionalCoteToPreface(langFieldInfo, xmlFile);
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

        Node tlcReference = XmlUtil.getChildNodeWithName(references, name);
        final boolean isTlcReferenceFound = (tlcReference != null);
        if (!isTlcReferenceFound) {
            tlcReference = xmlFile.newElement(MetadataUtil.ELEMENT_TLCREFERENCE);
        }

        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.ATTRIBUTE_NAME, name);
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.ATTRIBUTE_XMLID, fieldInfo.getId());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.ATTRIBUTE_HREF, fieldInfo.getHref());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.ATTRIBUTE_SHOWAS, fieldInfo.getDisplayValue());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.ATTRIBUTE_SHORTFORM, fieldInfo.getShortValue());

        if (!isTlcReferenceFound) {
            references.appendChild(tlcReference);
        }
    }

    private void addInterinstitutionalCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }
        addInterinstitutionalCoteToDocketNumber(fieldInfo, xmlNodeCoverpage);
    }

    private void addInterinstitutionalCoteToPreface(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodePreface = xmlFile.getElementByName("preface");
        if (xmlNodePreface == null) {
            return;
        }
        addInterinstitutionalCoteToDocketNumber(fieldInfo, xmlNodePreface);
    }

    public void addInterinstitutionalCoteToDocketNumber(ReferenceFieldInfo fieldInfo, Node xmlParentNode) {
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
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
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

    @Override
    public void processStamp(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (!MetadataUtil.VALUE_ONE.equals(fieldInfo.getDisplayValue())) return;
        if (MetadataUtil.isMainDocumentFile(xmlFile)) return;

        final Node conclusions = xmlFile.getElementByName(MetadataUtil.ELEMENT_CONCLUSIONS);
        if (conclusions == null) return;

        final Node blockNode = xmlFile.newElement("block");
        XmlUtil.setNodeAttributeValue(blockNode, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(blockNode, MetadataUtil.ATTRIBUTE_NAME, "stamp");

        final String language = readLanguageValue(xmlFile);
        final String b64Stamp = getLanguageStampAsBase64(language);

        final Node imgNode = xmlFile.newElement("img");
        XmlUtil.setNodeAttributeValue(imgNode, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(imgNode, "src", "data:image/gif;base64," + b64Stamp);
        blockNode.appendChild(imgNode);
        conclusions.appendChild(blockNode);
    }

    private String readLanguageValue(XmlUtil.XmlFile xmlFile) {
        final Node frbrLanguage = xmlFile.getElementByName(MetadataUtil.ELEMENT_FRBRLANGUAGE);
        if (frbrLanguage == null) {
            return MetadataUtil.VALUE_LANGUAGE_EN;
        }

        final String value = XmlUtil.getNodeAttributeValue(frbrLanguage, MetadataUtil.ATTRIBUTE_LANGUAGE);
        if (!StringUtils.hasLength(value)) {
            return MetadataUtil.VALUE_LANGUAGE_EN;
        }
        return value.toUpperCase();
    }

    private String getLanguageStampAsBase64(final String languageShortValue) {
        final String stampPath = String.format("stamp/%s.gif", languageShortValue);
        final byte[] stampBytes = ResourcesUtil.readResourceFile(stampPath);
        return Base64.getEncoder().encodeToString(stampBytes);
    }

    private Element createLinkedDocumentElement(final ReferenceFieldInfo reference, XmlUtil.XmlFile xmlFile) {
        final Element refElement = xmlFile.newElement("ref");

        XmlUtil.setNodeAttributeValue(refElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        refElement.setTextContent(reference.getDisplayValue());
        refElement.setAttribute(MetadataUtil.ATTRIBUTE_HREF, reference.getHref());

        final Element referenceElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
        XmlUtil.setNodeAttributeValue(referenceElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        referenceElement.appendChild(xmlFile.createTextNode("{"));
        referenceElement.appendChild(refElement);
        referenceElement.appendChild(xmlFile.createTextNode("}"));
        return referenceElement;
    }

    @Override
    public void processCommissioner(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile, int pos) {
        if (!MetadataUtil.isBillXmlDocument(xmlFile)) return;
        final Node signatureNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_SIGNATURE);
        final int roleIndex = XmlUtil.indexOfChildNode(signatureNode, MetadataUtil.ELEMENT_ROLE);
        final int personIndex = XmlUtil.indexOfChildNode(signatureNode, MetadataUtil.ELEMENT_PERSON);
        if (roleIndex < 0 || personIndex < 0) {
            return;
        }

        // Check wether role or person is first set in xml
        // Depending on the index, the commission values are set accordingly
        switch(pos) {
            case 0:
                if (roleIndex < personIndex) {
                    processCommissionerRole(fieldInfo, signatureNode, xmlFile);
                } else {
                    processCommissionerPerson(fieldInfo, signatureNode);
                }
                break;
            case 1:
                if (roleIndex < personIndex) {
                    processCommissionerPerson(fieldInfo, signatureNode);
                } else {
                    processCommissionerRole(fieldInfo, signatureNode, xmlFile);
                }
                break;
            default:
                break;
        }
    }

    private void processCommissionerRole(ReferenceFieldInfo fieldInfo, Node signatureNode, XmlUtil.XmlFile xmlFile) {
        this.addRoleToReferences(fieldInfo, xmlFile);
        final Node roleNode = XmlUtil.getChildNodeWithName(signatureNode, MetadataUtil.ELEMENT_ROLE);
        if (roleNode == null) return;

        roleNode.setTextContent(fieldInfo.getDisplayValue());

        final ReferenceFieldInfo roleFieldInfo = getRoleFieldInfo(fieldInfo.getDisplayValue());
        XmlUtil.setNodeAttributeValue(roleNode, MetadataUtil.ATTRIBUTE_REFERSTO, (roleFieldInfo == null) ? "" : "~" + roleFieldInfo.getId());
    }

    private void addRoleToReferences(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node referencesNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_REFERENCES);
        boolean appendNode = false;
        if (referencesNode == null) return;

        final ReferenceFieldInfo roleFieldInfo = getRoleFieldInfo(fieldInfo.getDisplayValue());
        if (roleFieldInfo == null) return;

        Node tlcRoleNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_TLCROLE);
        if (tlcRoleNode == null) {
            tlcRoleNode = xmlFile.newElement(MetadataUtil.ELEMENT_TLCROLE);
            appendNode = true;
        }

        XmlUtil.setNodeAttributeValue(tlcRoleNode, MetadataUtil.ATTRIBUTE_HREF, roleFieldInfo.getHref());
        XmlUtil.setNodeAttributeValue(tlcRoleNode, MetadataUtil.ATTRIBUTE_SHOWAS, roleFieldInfo.getDisplayValue());
        XmlUtil.setNodeAttributeValue(tlcRoleNode, MetadataUtil.ATTRIBUTE_XMLID, roleFieldInfo.getId());
        if (appendNode) {
            referencesNode.appendChild(tlcRoleNode);
        }
    }

    private ReferenceFieldInfo getRoleFieldInfo(String commissionerValue) {
        if (MetadataUtil.isRolePresident(commissionerValue)) {
            return MetadataUtil.getRolePresidentFieldInfo();
        }
        if (MetadataUtil.isRoleVicePresident(commissionerValue)) {
            return MetadataUtil.getRoleVicePresidentFieldInfo();
        }
        if (MetadataUtil.isRoleMemberOfTheCommission(commissionerValue)) {
            return MetadataUtil.getRoleMemberOfTheCommissionFieldInfo();
        }
        if (MetadataUtil.isRoleDirectorGeneral(commissionerValue)) {
            return MetadataUtil.getRoleDirectorGeneralFieldInfo();
        }
        return null;
    }

    private void processCommissionerPerson(ReferenceFieldInfo fieldInfo, Node signatureNode) {
        final Node personNode = XmlUtil.getChildNodeWithName(signatureNode, MetadataUtil.ELEMENT_PERSON);
        if (personNode == null) return;
        personNode.setTextContent(fieldInfo.getDisplayValue());
    }

    @Override
    public void removeTemplateClassAttributes(XmlUtil.XmlFile xmlFile) {
        final NodeList nodeList = xmlFile.getElementsWithAttributeValue(MetadataUtil.ATTRIBUTE_CLASS, MetadataUtil.VALUE_TEMPLATE);
        for(int i=0; i<nodeList.getLength(); i++) {
            XmlUtil.removeNodeAttributeValue(nodeList.item(i), MetadataUtil.ATTRIBUTE_CLASS);
        }
    }

    public void removeDateIfNeeded(XmlUtil.XmlFile xmlFile) {
        this.removeConclusionsDateIfNeeded(xmlFile);
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            this.removeCoverPageDateIfNeeded(xmlFile);
        }
        if (MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillXmlDocument(xmlFile)) {
            this.removeLongTitleDateIfNeeded(xmlFile);
        }
    }

    private void removeConclusionsDateIfNeeded(XmlUtil.XmlFile xmlFile) {
        final Node conclusions = xmlFile.getElementByName(MetadataUtil.ELEMENT_CONCLUSIONS);
        if (conclusions == null) return;

        final Node pNode = XmlUtil.getChildNodeWithName(conclusions, MetadataUtil.ELEMENT_P);
        if (pNode == null) return;

        final Node dateNode = XmlUtil.getChildNodeWithName(pNode, MetadataUtil.ELEMENT_DATE);
        if (dateNode == null) return;

        if (StringUtil.isEmpty(dateNode.getTextContent())) {
            pNode.removeChild(dateNode);
        }
    }

    private void removeCoverPageDateIfNeeded(XmlUtil.XmlFile xmlFile) {
        final Node coverPage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (coverPage == null) return;

        final Node containerMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(coverPage, MetadataUtil.VALUE_MAIN_DOC);
        if (containerMainDoc == null) return;

        final Node blockPlaceAndDate = XmlUtil.getXmlChildNodeWithNameAttributeValue(containerMainDoc, MetadataUtil.VALUE_PLACE_AND_DATE);
        if (blockPlaceAndDate == null) return;

        final Node dateNode = XmlUtil.getChildNodeWithName(blockPlaceAndDate, MetadataUtil.ELEMENT_DATE);
        if (dateNode == null) return;

        if (StringUtil.isEmpty(dateNode.getTextContent())) {
            blockPlaceAndDate.removeChild(dateNode);
        }
    }

    private void removeLongTitleDateIfNeeded(XmlUtil.XmlFile xmlFile) {
        final Node longTitle = xmlFile.getElementByName(MetadataUtil.ELEMENT_LONG_TITLE);
        if (longTitle == null) return;

        final Node pNode = XmlUtil.getChildNodeWithName(longTitle, MetadataUtil.ELEMENT_P);
        if (pNode == null) return;

        final Node dateNode = XmlUtil.getChildNodeWithName(pNode, MetadataUtil.ELEMENT_DATE);
        if (dateNode == null) return;

        if (StringUtil.isEmpty(dateNode.getTextContent())) {
            pNode.removeChild(dateNode);
        }
    }
}
