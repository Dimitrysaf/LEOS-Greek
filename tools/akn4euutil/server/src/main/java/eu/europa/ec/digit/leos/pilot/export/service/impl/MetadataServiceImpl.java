package eu.europa.ec.digit.leos.pilot.export.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotAvailableException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotSupportedException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataLanguageFormats;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ListFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.SimpleFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.service.MetadataService;
import eu.europa.ec.digit.leos.pilot.export.util.IdGenerator;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ResourcesUtil;
import eu.europa.ec.digit.leos.pilot.export.util.StringUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.CorrigendumAddendumMetadata;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.CoverPageTypeMetadata;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.SignatureMetadata;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil.ELEMENT_DATE;
import static eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil.VALUE_FINAL;
import static eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil.insertElementInCoverPage;
import static eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil.isBillDocumentFile;
import static eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil.isMainDocumentFile;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.deleteElementsByXPath;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.getChildNodeWithName;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.getXmlChildNodeWithNameAttributeValue;

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
                case CORRIGENDUM_ADDENDUM:
                    return MetadataUtil.parseCorrigendumAddendum(fieldValue);
                case PACKAGE_TITLE:
                    return MetadataUtil.parsePackageTitle(fieldValue);
                case INTERNAL_REF:
                    return MetadataUtil.parseInternalRef(fieldValue);
                case AUTHENTIC_LANG:
                    return MetadataUtil.parseAuthenticLanguages(fieldValue);
                case COVERPAGE_TYPE:
                    return MetadataUtil.parseCoverPageType(fieldValue);
                case DIFFUSION_VERSION:
                    return MetadataUtil.parseDiffusionVersion(fieldValue);
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
    public void processAdoptionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile, boolean isAutonomousAct) {
        if (isAutonomousAct
                && (MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillXmlDocument(xmlFile))) {
            this.addAdoptionDateToLongTitle(fieldInfo, xmlFile);
        }
        if (MetadataUtil.isBillXmlDocument(xmlFile) && isAutonomousAct) {
            this.addAdoptionDateToConclusions(fieldInfo, xmlFile);
        }
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            addAdoptionDateToBlock(fieldInfo, xmlFile);
        }
    }

    private void addAdoptionDateToLongTitle(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addAdoptionDate(fieldInfo, MetadataUtil.ELEMENT_LONG_TITLE, xmlFile);
    }

    private void addAdoptionDateToConclusions(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        this.addAdoptionDate(fieldInfo, MetadataUtil.ELEMENT_CONCLUSIONS, xmlFile);
    }

    private void addAdoptionDate(ReferenceFieldInfo fieldInfo, String parentNodeName, XmlUtil.XmlFile xmlFile) {
        final Node parent = xmlFile.getElementByName(parentNodeName);
        if (parent == null) return;

        final Node pNode = XmlUtil.getChildNodeWithName(parent, MetadataUtil.ELEMENT_P);
        if (pNode == null) return;

        Node dateNode = XmlUtil.getChildNodeWithName(pNode, MetadataUtil.ELEMENT_DATE);
        if (dateNode == null) {
            dateNode = xmlFile.newElement(MetadataUtil.ELEMENT_DATE);
            XmlUtil.setNodeAttributeValue(dateNode, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            Node docPuposeNode = XmlUtil.getChildNodeWithName(pNode, MetadataUtil.ELEMENT_DOC_PURPOSE);
            if (docPuposeNode != null) {
                pNode.insertBefore(dateNode, docPuposeNode);
            } else {
                pNode.appendChild(dateNode);
            }
        }

        setDate(dateNode, fieldInfo, xmlFile);
        removeTemplateClassAttributeFromNode(dateNode);
    }

    private void addAdoptionDateToBlock(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, "mainDoc");
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlPlaceAndDate = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, "placeAndDate");
        if (xmlPlaceAndDate == null) {
            return;
        }

        Node dateNode = XmlUtil.getChildNodeWithName(xmlPlaceAndDate, MetadataUtil.ELEMENT_DATE);
        if (dateNode == null) {
            dateNode = xmlFile.newElement(MetadataUtil.ELEMENT_DATE);
            XmlUtil.setNodeAttributeValue(dateNode, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            xmlPlaceAndDate.appendChild(dateNode);
        }
        setDate(dateNode, fieldInfo, xmlFile);
        removeTemplateClassAttributeFromNode(dateNode);
    }

    private void setDate(Node dateNode, ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        XmlUtil.setNodeAttributeValue(dateNode, MetadataUtil.ATTRIBUTE_DATE, fieldInfo.getId().isEmpty() ? "2999-01-01" : fieldInfo.getId());
        final String displayValue = fieldInfo.getId().isEmpty() ? "" : this.readAdoptionDateDisplayValue(fieldInfo, xmlFile);
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
        removeTemplateClassAttributeFromNode(xmlNodeMeta);
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
        removeTemplateClassAttributeFromNode(xmlNodeLocation);
    }

    private void addAdoptionLocationToConclusion(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ATTRIBUTE_CONCLUSIONS_NEW);
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
            removeTemplateClassAttributeFromNode(xmlNodeLocation);
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
            xmlNodeDate = xmlFile.newElement(MetadataUtil.ELEMENT_DATE);
            XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            xmlNodeBlock.appendChild(xmlNodeDate);
        }
        XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.ATTRIBUTE_DATE, fieldInfo.getId().isEmpty() ? "2999-01-01" : fieldInfo.getId());
        final String displayValue = fieldInfo.getId().isEmpty() ? "" : this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
        MetadataUtil.removeClassAttribute(xmlNodeDate);
        xmlNodeDate.setTextContent(displayValue);
        removeTemplateClassAttributeFromNode(xmlNodeDate);
    }

    private void addEmissionDateToConclusion(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {

        Node xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ATTRIBUTE_CONCLUSIONS_NEW);
        if (xmlNodeConclusions == null) {
            xmlNodeConclusions = xmlFile.getElementByName(MetadataUtil.ELEMENT_CONCLUSIONS);
        }
        if (xmlNodeConclusions == null) {
            return;
        }

        Node xmlNodeConclusionsP = XmlUtil.getXmlChildNodeWithXmlIdAttributeValue(xmlNodeConclusions, MetadataUtil.VALUE_CONCLUSION_NODE_IDNEW);
        if (xmlNodeConclusionsP == null) {
            xmlNodeConclusionsP = XmlUtil.getChildNodeWithName(xmlNodeConclusions, MetadataUtil.ELEMENT_P);
        }
        if (xmlNodeConclusionsP == null) {
            return;
        }

        Node xmlNodeDate = XmlUtil.getChildNodeWithName(xmlNodeConclusionsP, MetadataUtil.ELEMENT_DATE);
        if (xmlNodeDate == null) {
            return;
        }

        XmlUtil.setNodeAttributeValue(xmlNodeDate, MetadataUtil.ATTRIBUTE_DATE, fieldInfo.getId().isEmpty() ? "2999-01-01" : fieldInfo.getId());
        MetadataUtil.removeClassAttribute(xmlNodeDate);
        final String displayValue = fieldInfo.getId().isEmpty() ? "" : this.readEmissionDataDisplayValue(fieldInfo, xmlFile);
        xmlNodeDate.setTextContent(displayValue);
        removeTemplateClassAttributeFromNode(xmlNodeDate);
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
    public void processFinalCote(ReferenceFieldInfo fieldInfo, String diffusionVersion, XmlUtil.XmlFile xmlFile) {
        processCote(fieldInfo, diffusionVersion, true, xmlFile);

        addFinalVersionNumberToIdentification(diffusionVersion, xmlFile);
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            addFinalToCoverPage(diffusionVersion, xmlFile);
            addFinalVersionNumberToFilename(diffusionVersion, xmlFile);
        }
    }

    private void addFinalVersionNumberToFilename(String diffusionVersion, XmlUtil.XmlFile xmlFile) {
        final String versionNumber = "-" + VALUE_FINAL + (StringUtil.isEmpty(diffusionVersion) ? "" : "_" + diffusionVersion);
        addVersionNumberToFilename(versionNumber, xmlFile);
    }

    private void addFinalVersionNumberToIdentification(String diffusionVersion, XmlUtil.XmlFile xmlFile) {
        final String versionNumber = VALUE_FINAL + (StringUtil.isEmpty(diffusionVersion) ? "" : "/" + diffusionVersion);
        addVersionNumberToIdentification(versionNumber, xmlFile);
    }

    private void removeFinalToIdentification(XmlUtil.XmlFile xmlFile) {
        final Node frbrExpression = xmlFile.getElementByName(MetadataUtil.ELEMENT_FRBREXPRESSION);
        if (frbrExpression == null) {
            return;
        }

        final Node frbrVersionNumberNode = getChildNodeWithName(frbrExpression, MetadataUtil.ELEMENT_FRBRVERSIONNUMBER);
        if (frbrVersionNumberNode != null) {
            frbrVersionNumberNode.getParentNode().removeChild(frbrVersionNumberNode);
        }
    }

    private void addFinalToCoverPage(String diffusionVersion, XmlUtil.XmlFile xmlFile) {
        final String versionNumber = VALUE_FINAL + (StringUtil.isEmpty(diffusionVersion) ? "" : "/" + diffusionVersion);
        addVersionNumberToCoverPage(versionNumber, xmlFile);
    }

    private void removeFinalToCoverPage(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeDocNumber = MetadataUtil.getXmlNodeDocNumber(xmlFile);
        if (xmlNodeDocNumber == null) {
            return;
        }

        final Node inline = getChildNodeWithName(xmlNodeDocNumber, MetadataUtil.ELEMENT_INLINE);
        if (inline != null) {
            inline.getParentNode().removeChild(inline);
        }
    }

    @Override
    public void processCote(ReferenceFieldInfo fieldInfo, String diffusionVersion, XmlUtil.XmlFile xmlFile) {
        if (StringUtil.isEmpty(fieldInfo.getDisplayValue())) {
            this.removeCote(fieldInfo, xmlFile);
            return;
        }
        this.addCote(fieldInfo, diffusionVersion, false, xmlFile);
    }

    @Override
    public void processDiffusionVersion(String diffusionVersion, boolean isCoteOrFinalCotePresent, XmlUtil.XmlFile xmlFile) {
        this.addDiffusionVersion(diffusionVersion, isCoteOrFinalCotePresent, xmlFile);
    }

    private void processCote(ReferenceFieldInfo fieldInfo, String diffusionVersion, boolean isFinal, XmlUtil.XmlFile xmlFile) {
        if (StringUtil.isEmpty(fieldInfo.getDisplayValue())) {
            this.removeCote(fieldInfo, xmlFile);
            return;
        }
        this.addCote(fieldInfo, diffusionVersion, isFinal, xmlFile);
    }

    private void removeCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        removeFinalToCoverPage(xmlFile);
        removeFinalToIdentification(xmlFile);
        removeCoteToMetaIdentification(fieldInfo, xmlFile);
        removeCoteToMetaReference(fieldInfo, xmlFile);
        removeCoteToCoverPage(fieldInfo, xmlFile);

        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            removeMetaPreservation(xmlFile);
        } else {
            removeDocCuid(xmlFile);
        }
    }

    private void addCote(ReferenceFieldInfo fieldInfo, String diffusionVersion, boolean isFinal, XmlUtil.XmlFile xmlFile) {
        addCoteToMetaIdentification(fieldInfo, xmlFile);
        addCoteToMetaReference(fieldInfo, xmlFile);
        addCoteToCoverPage(fieldInfo, xmlFile, isFinal);
        addCoteToDocumentFilename(fieldInfo, xmlFile);

        if (!StringUtil.isEmpty(diffusionVersion)) {
            addVersionNumberToIdentification("/" + diffusionVersion, xmlFile);
        }
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            removeMetaPreservation(xmlFile);
            if (!isFinal && !StringUtil.isEmpty(diffusionVersion)) {
                addVersionNumberToCoverPage("/" + diffusionVersion, xmlFile);
                addVersionNumberToFilename("_" + diffusionVersion, xmlFile);
            }
        } else {
            removeDocCuid(xmlFile);
            addCoteToCuid(fieldInfo, xmlFile);
        }
    }

    private void addDiffusionVersion(String diffusionVersion, boolean isCoteOrFinalCotePresent, XmlUtil.XmlFile xmlFile) {
        if (!StringUtil.isEmpty(diffusionVersion) && !isCoteOrFinalCotePresent && MetadataUtil.isMainDocumentFile(xmlFile)) {
            addVersionNumberToCoverPage("/" + diffusionVersion, xmlFile);
            addVersionNumberToFilename("_" + diffusionVersion, xmlFile);
        }
    }

    private void addVersionNumberToFilename(String versionNumber, XmlUtil.XmlFile xmlFile) {
        final String fileName = xmlFile.getName().replaceAll("-(?:" + VALUE_FINAL + ")?(?:_\\d+)?(?=-)", "");
        final String[] splitFileName = fileName.split("-");
        final String newFileName = Arrays.stream(splitFileName).reduce("", (a, b) -> b.endsWith(".xml") ? a.substring(0, a.length() - 1)
                + versionNumber + "-" + b : a + b + "-");
        xmlFile.setName(newFileName);
    }

    private void addVersionNumberToIdentification(String versionNumber, XmlUtil.XmlFile xmlFile) {
        final Node frbrExpression = xmlFile.getElementByName(MetadataUtil.ELEMENT_FRBREXPRESSION);
        if (frbrExpression == null) {
            return;
        }
        final Node frbrVersionNumber = xmlFile.getNodeOrCreateIfNotExists(frbrExpression, MetadataUtil.ELEMENT_FRBRVERSIONNUMBER);
        XmlUtil.setNodeAttributeValue(frbrVersionNumber, MetadataUtil.ATTRIBUTE_VALUE, versionNumber);
        frbrExpression.insertBefore(frbrVersionNumber, XmlUtil.getChildNodeWithName(frbrExpression, MetadataUtil.ELEMENT_FRBRLANGUAGE));
    }

    private void addVersionNumberToCoverPage(String versionNumber, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeDocNumber = MetadataUtil.getXmlNodeDocNumber(xmlFile);
        if (xmlNodeDocNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeDocNumber);
        final Node inline = xmlFile.getNodeOrCreateIfNotExists(xmlNodeDocNumber, MetadataUtil.ELEMENT_INLINE);
        if (!StringUtil.isEmpty(xmlNodeDocNumber.getTextContent())) {
            XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_NAME, MetadataUtil.VALUE_VERSION);
            inline.setTextContent(versionNumber);
            xmlNodeDocNumber.appendChild(inline);
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
        final Node identificationNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_IDENTIFICATION);
        if (identificationNode == null) return;

        final Node frbrWorkNode = XmlUtil.getChildNodeWithName(identificationNode, MetadataUtil.ELEMENT_FRBRWORK);
        if (frbrWorkNode == null) return;

        final Node prescriptiveNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.ELEMENT_FRBRPRESCRIPTIVE);
        if (prescriptiveNode == null) {
            return;
        }
        final Node frbrNumber = xmlFile.getNodeOrCreateIfNotExists(frbrWorkNode, MetadataUtil.ELEMENT_FRBRNUMBER);
        XmlUtil.setNodeAttributeValue(frbrNumber, MetadataUtil.ATTRIBUTE_VALUE, fieldInfo.getDisplayValue());
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            MetadataUtil.addRefersToAttribute(frbrNumber, fieldInfo.getId());
        }
        frbrWorkNode.insertBefore(frbrNumber, prescriptiveNode);
    }

    public void removeCoteToMetaIdentification(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node identificationNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_IDENTIFICATION);
        if (identificationNode == null) return;

        final Node frbrWorkNode = XmlUtil.getChildNodeWithName(identificationNode, MetadataUtil.ELEMENT_FRBRWORK);
        if (frbrWorkNode == null) return;

        final Node prescriptiveNode = XmlUtil.getChildNodeWithName(frbrWorkNode, "FRBRprescriptive");
        if(prescriptiveNode == null) {
            return;
        }

        final Node frbrNumberNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.ELEMENT_FRBRNUMBER);
        if (frbrNumberNode != null) {
            frbrNumberNode.getParentNode().removeChild(frbrNumberNode);
        }
    }

    public void addCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile)) {
            addTLCReference(fieldInfo, xmlFile, MetadataUtil.ELEMENT_IDENTIFIER);
        }
    }

    public void removeCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile)) {
            removeTLCReference(xmlFile, MetadataUtil.ELEMENT_IDENTIFIER);
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

    public void addCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile, boolean isFinal) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.VALUE_MAIN_DOC);
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, MetadataUtil.VALUE_REFERENCE);
        if (xmlNodeBlock == null) {
            return;
        }

        Node xmlNodeDocNumber = XmlUtil.getChildNodeWithName(xmlNodeBlock, MetadataUtil.ELEMENT_DOC_NUMBER);
        if (xmlNodeDocNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeBlock);
        MetadataUtil.removeClassAttribute(xmlNodeDocNumber);
        MetadataUtil.addRefersToAttribute(xmlNodeDocNumber, fieldInfo.getId());

        if (isFinal) {
            xmlNodeDocNumber.setTextContent(fieldInfo.getDisplayValue() + " ");
        }
        else{
            xmlNodeDocNumber.setTextContent(fieldInfo.getDisplayValue());
        }
    }

    public void removeCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeMainDoc = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.VALUE_MAIN_DOC);
        if (xmlNodeMainDoc == null) {
            return;
        }

        Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeMainDoc, MetadataUtil.VALUE_REFERENCE);
        if (xmlNodeBlock == null) {
            return;
        }

        Node xmlNodeDocNumber = XmlUtil.getChildNodeWithName(xmlNodeBlock, MetadataUtil.ELEMENT_DOC_NUMBER);
        if (xmlNodeDocNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeBlock);
        MetadataUtil.removeClassAttribute(xmlNodeDocNumber);
        MetadataUtil.addRefersToAttribute(xmlNodeDocNumber, "");
        xmlNodeDocNumber.setTextContent("");
    }

    @Override
    public void processInterinstitutionalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (StringUtil.isEmpty(fieldInfo.getDisplayValue())) {
            removeInterinstitutionalCoteToMetaReference(xmlFile);
            removeInterinstitutionalCoteToCoverPage(xmlFile);
            removeInterinstitutionalCoteToPreface(xmlFile);
        } else {
            final String langValue = MetadataUtil.readLanguageValue(xmlFile);
            ReferenceFieldInfo langFieldInfo = fieldInfo.withHref(fieldInfo.getHref().replace(MetadataUtil.INTERINSTITUTIONAL_COTE_LANG_PLACEHOLDER, langValue));
            addInterinstitutionalCoteToMetaReference(langFieldInfo, xmlFile);
            addInterinstitutionalCoteToCoverPage(langFieldInfo, xmlFile);
            addInterinstitutionalCoteToPreface(langFieldInfo, xmlFile);
        }
    }

    private void addInterinstitutionalCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillDocumentFile(xmlFile)) {
            addTLCReference(fieldInfo, xmlFile, MetadataUtil.ELEMENT_PROCEDURE_REFERENCE);
        }
    }

    private void removeInterinstitutionalCoteToMetaReference(XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile) || MetadataUtil.isBillDocumentFile(xmlFile)) {
            removeTLCReference(xmlFile, MetadataUtil.ELEMENT_PROCEDURE_REFERENCE);
        }
    }

    private void addTLCReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile, String name) {
        final Node references = xmlFile.getElementByName(MetadataUtil.ELEMENT_REFERENCES);
        if (references == null)
            return;

        Node tlcReference = XmlUtil.getXmlChildNodeWithNameAttributeValue(references, name);
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

    private void removeTLCReference(XmlUtil.XmlFile xmlFile, String name) {
        final Node references = xmlFile.getElementByName(MetadataUtil.ELEMENT_REFERENCES);
        if (references == null)
            return;

        Node tlcReference = XmlUtil.getXmlChildNodeWithNameAttributeValue(references, name);
        final boolean isTlcReferenceFound = (tlcReference != null);
        if (isTlcReferenceFound) {
            tlcReference.getParentNode().removeChild(tlcReference);
        }
    }

    private void addInterinstitutionalCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }
        addInterinstitutionalCoteToDocketNumber(fieldInfo, xmlNodeCoverpage);
    }

    private void removeInterinstitutionalCoteToCoverPage(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }
        removeInterinstitutionalCoteToDocketNumber(xmlNodeCoverpage);
    }

    private void addInterinstitutionalCoteToPreface(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodePreface = xmlFile.getElementByName(MetadataUtil.ELEMENT_PREFACE);
        if (xmlNodePreface == null) {
            return;
        }
        addInterinstitutionalCoteToDocketNumber(fieldInfo, xmlNodePreface);
    }

    private void removeInterinstitutionalCoteToPreface(XmlUtil.XmlFile xmlFile) {
        Node xmlNodePreface = xmlFile.getElementByName(MetadataUtil.ELEMENT_PREFACE);
        if (xmlNodePreface == null) {
            return;
        }
        removeInterinstitutionalCoteToDocketNumber(xmlNodePreface);
    }

    public void addInterinstitutionalCoteToDocketNumber(ReferenceFieldInfo fieldInfo, Node xmlParentNode) {
        Node xmlNodeContainer = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlParentNode, MetadataUtil.VALUE_PROCEDURE_IDENTIFIER);
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

    public void removeInterinstitutionalCoteToDocketNumber(Node xmlParentNode) {
        Node xmlNodeContainer = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlParentNode, MetadataUtil.VALUE_PROCEDURE_IDENTIFIER);
        if (xmlNodeContainer == null) {
            return;
        }

        Node xmlNodeDocketNumber = MetadataUtil.getXmlNodeDocketNumber(xmlNodeContainer);
        if (xmlNodeDocketNumber == null) {
            return;
        }
        MetadataUtil.removeClassAttribute(xmlNodeContainer);
        MetadataUtil.removeClassAttribute(xmlNodeDocketNumber);
        MetadataUtil.addRefersToAttribute(xmlNodeDocketNumber, "");
        xmlNodeDocketNumber.setTextContent("");
    }

    @Override
    public void processLinkedDocuments(MultipleReferencesFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverpage == null) {
            return;
        }

        Node xmlNodeAssociatedReferences = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.VALUE_CROSS_CONFERENCE_NAME);
        if (xmlNodeAssociatedReferences != null) {
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
        } else if (!fieldInfo.getReferences().isEmpty()) {
            xmlNodeAssociatedReferences = insertElementInCoverPage(xmlFile, MetadataUtil.VALUE_CROSS_CONFERENCE_NAME);
        } else {
            return;
        }

        for (final ReferenceFieldInfo reference : fieldInfo.getReferences()) {
            final Element referenceElement = createLinkedDocumentElement(reference, xmlFile);
            xmlNodeAssociatedReferences.appendChild(referenceElement);
        }
    }

    @Override
    public void processStamp(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (MetadataUtil.isMainDocumentFile(xmlFile)) return;

        final Node conclusions = xmlFile.getElementByName(MetadataUtil.ELEMENT_CONCLUSIONS);
        if (conclusions == null) return;

        if (MetadataUtil.VALUE_ONE.equals(fieldInfo.getDisplayValue())) {
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
        } else if (MetadataUtil.VALUE_ZERO.equals(fieldInfo.getDisplayValue())) {
            deleteElementsByXPath(conclusions, "//*[@name='stamp']", true);
        }
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
        final NodeList signatureNodes = xmlFile.getElementsByName(MetadataUtil.ELEMENT_SIGNATURE);
        final List<SignatureMetadata> signatures = fetchSignaturesValue(fieldInfo.getDisplayValue());
        if (signatures.isEmpty()) {
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
        } else {
            for (int i = 0; i < signatureNodes.getLength(); i++) {
                Node signatureNode = signatureNodes.item(i);
                if (i < signatures.size()) {
                    processCommissionerRole(signatures.get(i), signatureNode, xmlFile);
                    processCommissionerPerson(signatures.get(i), signatureNode);
                    processCommissionerMention(signatures.get(i), signatureNode, xmlFile);
                }
            }
        }
    }

    public List<SignatureMetadata> fetchSignaturesValue(String value) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(value, new TypeReference<List<SignatureMetadata>>(){});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    public String getFieldValue(String jsonString, String field) {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = null;
        try {
            root = mapper.readTree(jsonString);
        } catch (JsonProcessingException e) {
            return jsonString;
        }
        String fieldValue = root.get(field).asText();
        return fieldValue;
    }

    private void processCommissionerRole(ReferenceFieldInfo fieldInfo, Node signatureNode, XmlUtil.XmlFile xmlFile) {
        String fieldValue = fieldInfo.getDisplayValue();
        final String language = readLanguageValue(xmlFile);
        final ReferenceFieldInfo roleFieldInfo = getRoleFieldInfo(fieldValue, language);
        fieldValue = roleFieldInfo != null ? roleFieldInfo.getDisplayValue() : fieldValue;
        this.addRoleToReferences(roleFieldInfo, xmlFile);
        final Node roleNode = XmlUtil.getChildNodeWithName(signatureNode, MetadataUtil.ELEMENT_ROLE);
        if (roleNode == null) return;

        roleNode.setTextContent(fieldValue);

        XmlUtil.setNodeAttributeValue(roleNode, MetadataUtil.ATTRIBUTE_REFERSTO, (roleFieldInfo == null) ? "" : "~" + roleFieldInfo.getId());
        removeTemplateClassAttributeFromNode(roleNode);
    }

    private void processCommissionerRole(SignatureMetadata signature, Node signatureNode, XmlUtil.XmlFile xmlFile) {
        String fieldValue = signature.getCommissionerTitle();
        final String language = readLanguageValue(xmlFile);
        final ReferenceFieldInfo roleFieldInfo = getRoleFieldInfo(fieldValue, language);
        fieldValue = roleFieldInfo != null ? roleFieldInfo.getDisplayValue() : fieldValue;
        this.addRoleToReferences(roleFieldInfo, xmlFile);
        final Node roleNode = XmlUtil.getChildNodeWithName(signatureNode, MetadataUtil.ELEMENT_ROLE);
        if (roleNode == null) return;

        roleNode.setTextContent(fieldValue);

        XmlUtil.setNodeAttributeValue(roleNode, MetadataUtil.ATTRIBUTE_REFERSTO, (roleFieldInfo == null) ? "" : "~" + roleFieldInfo.getId());
    }

    private void processCommissionerMention(SignatureMetadata signature, Node signatureNode, XmlUtil.XmlFile xmlFile) {
        String fieldValue = signature.getSpecialMention();
        final String language = readLanguageValue(xmlFile);
        final ReferenceFieldInfo mentionFieldInfo = getMentionFieldInfo(fieldValue, language);
        fieldValue = mentionFieldInfo != null ? mentionFieldInfo.getDisplayValue() : fieldValue;
        final Node organizationNode = XmlUtil.getChildNodeWithName(signatureNode, MetadataUtil.ELEMENT_ORGANIZATION);
        if (organizationNode == null) return;

        organizationNode.setTextContent(fieldValue);

        XmlUtil.setNodeAttributeValue(organizationNode, MetadataUtil.ATTRIBUTE_REFERSTO, (mentionFieldInfo == null) ? "" : "~" + mentionFieldInfo.getId());
    }

    private void addRoleToReferences(ReferenceFieldInfo roleFieldInfo, XmlUtil.XmlFile xmlFile) {
        final Node referencesNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_REFERENCES);
        boolean appendNode = false;
        if (referencesNode == null) return;
        if (roleFieldInfo == null) return;

        Node tlcRoleNode = xmlFile.getElementByName(MetadataUtil.ELEMENT_TLCROLE);

//        if (roleFieldInfo == null) {
//            XmlUtil.removeNodeFromParent(tlcRoleNode);
//            return;
//        }

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

    private ReferenceFieldInfo getRoleFieldInfo(String commissionerValue, String lang) {
        if (MetadataUtil.isRolePresident(commissionerValue)) {
            return MetadataUtil.getRolePresidentFieldInfo(lang);
        }
        if (MetadataUtil.isRoleVicePresident(commissionerValue)) {
            return MetadataUtil.getRoleVicePresidentFieldInfo(lang);
        }
        if (MetadataUtil.isRoleMemberOfTheCommission(commissionerValue)) {
            return MetadataUtil.getRoleMemberOfTheCommissionFieldInfo(lang);
        }
        if (MetadataUtil.isRoleDirectorGeneral(commissionerValue)) {
            return MetadataUtil.getRoleDirectorGeneralFieldInfo(lang);
        }
        if (MetadataUtil.isRoleHeadOfService(commissionerValue)) {
            return MetadataUtil.getRoleHeadOfServiceFieldInfo(lang);
        }
        if (MetadataUtil.isRoleHeadOfUnit(commissionerValue)) {
            return MetadataUtil.getRoleHeadOfUnitFieldInfo(lang);
        }
        if (MetadataUtil.isRoleDirector(commissionerValue)) {
            return MetadataUtil.getRoleDirectoryFieldInfo(lang);
        }
        return null;
    }

    private ReferenceFieldInfo getMentionFieldInfo(String mentionValue, String lang) {
        if (MetadataUtil.isMentionCommission(mentionValue)) {
            return MetadataUtil.getMentionCommissionFieldInfo(lang);
        }
        if (MetadataUtil.isMentionCouncil(mentionValue)) {
            return MetadataUtil.getMentionCouncilFieldInfo(lang);
        }
        if (MetadataUtil.isMentionEuropeanParliament(mentionValue)) {
            return MetadataUtil.getMentionEPFieldInfo(lang);
        }
        return null;
    }

    private void processCommissionerPerson(ReferenceFieldInfo fieldInfo, Node signatureNode) {
        String signingCommissioner = fieldInfo.getDisplayValue();
        processCommissionerPerson(signingCommissioner, signatureNode);
    }

    private void processCommissionerPerson(SignatureMetadata signature, Node signatureNode) {
        String signingCommissioner = signature.getSigningCommissioner();
        processCommissionerPerson(signingCommissioner, signatureNode);
    }

    private void processCommissionerPerson(String signingCommissioner, Node signatureNode) {
        final Node personNode = XmlUtil.getChildNodeWithName(signatureNode, MetadataUtil.ELEMENT_PERSON);
        if (personNode == null) return;
        personNode.setTextContent(signingCommissioner);
        XmlUtil.setNodeAttributeValue(personNode, MetadataUtil.ATTRIBUTE_REFERSTO, "");
        removeTemplateClassAttributeFromNode(personNode);
    }
    
    @Override
    public void processPackageTitle(SimpleFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
            if (xmlNodeCoverpage == null) {
                return;
            }

            Node xmlNodeBlock = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverpage, MetadataUtil.ATTRIBUTE_PACKAGE_TITLE);
            if (xmlNodeBlock != null) {
                xmlNodeCoverpage.removeChild(xmlNodeBlock);
            }
            createPackageTitleElement(fieldInfo, xmlFile);
        }
    }

    private void createPackageTitleElement(final SimpleFieldInfo packageTitle, XmlUtil.XmlFile xmlFile) {
        final Element containerElement = insertElementInCoverPage(xmlFile, MetadataUtil.ATTRIBUTE_PACKAGE_TITLE);

        final Element packageTitleElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
        XmlUtil.setNodeAttributeValue(packageTitleElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        packageTitleElement.setTextContent(packageTitle.getValue());
        containerElement.appendChild(packageTitleElement);
    }

    @Override
    public void processInternalRef(SimpleFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {

    }

    @Override
    public void processCoverPageType(SimpleFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (MetadataUtil.isMainDocumentFile(xmlFile)) {
            final String language = readLanguageValue(xmlFile);
            ObjectMapper objectMapper = new ObjectMapper();
            CoverPageTypeMetadata coverPageTypeMetadata;
            try {
                coverPageTypeMetadata = objectMapper.readValue(fieldInfo.getValue(), CoverPageTypeMetadata.class);
            } catch (JsonProcessingException e) {
                return;
            }
            Node xmlNodeCoverPage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
            if (xmlNodeCoverPage == null) {
                return;
            }
            String coverPageType = coverPageTypeMetadata.getCoverPageType().name();
            boolean disclaimer = coverPageTypeMetadata.isDisclaimer();
            boolean logo = coverPageTypeMetadata.isLogo();
            boolean watermark = coverPageTypeMetadata.isWatermark();
            Float verticalShift = coverPageTypeMetadata.getVerticalShift();
            deleteElementsByXPath(xmlNodeCoverPage, MetadataUtil.COVERPAGE_TYPE_PATH, true);
            if (disclaimer) {
                Element coverPageTypeElement = insertElementInCoverPage(xmlFile, MetadataUtil.ELEMENT_DISCLAIMER);
                if (verticalShift != null) {
                    XmlUtil.setNodeAttributeValue(coverPageTypeElement, MetadataUtil.STYLE, String.format("bottom: %scm", 4.0f + verticalShift));
                }
                Element coverPageTypePElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
                XmlUtil.setNodeAttributeValue(coverPageTypePElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
                if (coverPageType.contains("EUROPA")) {
                    coverPageTypePElement.setTextContent(ResourcesUtil.getMessage(language, "coverpage.disclaimer.europa"));
                } else {
                    coverPageTypePElement.setTextContent(ResourcesUtil.getMessage(language, "coverpage.disclaimer.expert"));
                }
                coverPageTypeElement.appendChild(coverPageTypePElement);
            }
            Node xmlNodeContainerLogo = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverPage, MetadataUtil.ELEMENT_LOGO);
            if (xmlNodeContainerLogo == null && logo) {
                deleteElementsByXPath(xmlNodeCoverPage, MetadataUtil.ACTING_ENTITY_PATH, true);
                Element containerLogoElement = insertElementInCoverPage(xmlFile, MetadataUtil.ELEMENT_LOGO);
                Element containerLogoPElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
                XmlUtil.setNodeAttributeValue(containerLogoPElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
                containerLogoElement.appendChild(containerLogoPElement);
                Element containerLogoImgElement = xmlFile.newElement(MetadataUtil.ELEMENT_IMG);
                XmlUtil.setNodeAttributeValue(containerLogoImgElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
                XmlUtil.setNodeAttributeValue(containerLogoImgElement, "alt", ResourcesUtil.getMessage(language, "coverpage.logo.ec.title"));
                XmlUtil.setNodeAttributeValue(containerLogoImgElement, "src", "data:image/png;base64," + getEcLogoAsBase64());
                XmlUtil.setNodeAttributeValue(containerLogoImgElement, "title", ResourcesUtil.getMessage(language, "coverpage.logo.ec.title"));
                containerLogoPElement.appendChild(containerLogoImgElement);

                Element containerActingEntityElement = insertElementInCoverPage(xmlFile, MetadataUtil.ACTING_ENTITY_NAME);
                Element containerActingPElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
                XmlUtil.setNodeAttributeValue(containerActingPElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
                containerActingEntityElement.appendChild(containerActingPElement);
                Element containerActingEntityOrgElement = xmlFile.newElement(MetadataUtil.ELEMENT_ORGANIZATION);
                XmlUtil.setNodeAttributeValue(containerActingEntityOrgElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
                XmlUtil.setNodeAttributeValue(containerActingEntityOrgElement, MetadataUtil.ATTRIBUTE_REFERSTO, "~COM");
                containerActingEntityOrgElement.setTextContent(ResourcesUtil.getMessage(language, "coverpage.logo.acting.entity.ec"));
                containerActingPElement.appendChild(containerActingEntityOrgElement);
            } else if (xmlNodeContainerLogo != null && !logo) {
                deleteElementsByXPath(xmlNodeCoverPage, MetadataUtil.ACTING_ENTITY_PATH, true);
                xmlNodeContainerLogo.getParentNode().removeChild(xmlNodeContainerLogo);
            }
            if (watermark) {
                XmlUtil.setNodeAttributeValue(xmlNodeCoverPage, MetadataUtil.ATTRIBUTE_CLASS, "watermark");
            } else {
                XmlUtil.removeNodeAttributeValue(xmlNodeCoverPage, MetadataUtil.ATTRIBUTE_CLASS);
            }
        }
    }

    private String getEcLogoAsBase64() {
        final String logoPath = "logo/ec.png";
        final byte[] logoBytes = ResourcesUtil.readResourceFile(logoPath);
        return Base64.getEncoder().encodeToString(logoBytes);
    }

    @Override
    public void processAuthenticLanguages(ListFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        final String language = readLanguageValue(xmlFile);
        Node xmlNodeMeta = xmlFile.getElementByName(MetadataUtil.ELEMENT_META);
        if (xmlNodeMeta == null) {
            return;
        }
        Node xmlNodeRef = xmlFile.getElementByName(MetadataUtil.ELEMENT_REFERENCES);
        if (xmlNodeRef == null) {
            return;
        }
        deleteElementsByXPath(xmlNodeRef, MetadataUtil.AUTHENTIC_LANGUAGES_PATH, true);
        Element authLangeElement = xmlFile.newElement(MetadataUtil.TLCREFERENCE);
        XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_NAME, MetadataUtil.VALUE_LANGUAGE);
        XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_HREF, String.format(MetadataUtil.ATHENTIC_LANGUAGE_HREF_PATTERN,
                language.toUpperCase()));
        XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_SHOWAS, language.toLowerCase());
        xmlNodeRef.appendChild(authLangeElement);
        List<String> authenticLang = new ArrayList<>(fieldInfo.getValue());
        authenticLang.remove(language.toLowerCase());
        for (String lang: authenticLang) {
            authLangeElement = xmlFile.newElement(MetadataUtil.ELEMENT_TLCREFERENCE);
            XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_NAME, MetadataUtil.VALUE_LANGUAGE);
            XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_HREF, String.format(MetadataUtil.ATHENTIC_LANGUAGE_HREF_PATTERN, lang.toUpperCase()));
            XmlUtil.setNodeAttributeValue(authLangeElement, MetadataUtil.ATTRIBUTE_SHOWAS, lang.toLowerCase());
            xmlNodeRef.appendChild(authLangeElement);
        }
        processAuthenticLanguagesInCoverPage(fieldInfo.getValue(), xmlFile);
        processAuthenticLanguagesAfterLongTitle(fieldInfo.getValue(), xmlFile);
    }

    public void processAuthenticLanguagesInCoverPage(List<String> authenticLang, XmlUtil.XmlFile xmlFile) {
        final String language = readLanguageValue(xmlFile);
        Node xmlNodeCoverPage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverPage == null) {
            return;
        }
        Node xmlNodeContainer = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeCoverPage, MetadataUtil.VALUE_AUTHENTIC_LANGUAGES_NAME);
        if (xmlNodeContainer != null) {
            xmlNodeContainer.getParentNode().removeChild(xmlNodeContainer);
        }

        if (!authenticLang.isEmpty()) {
            final Element authContainerElement = insertElementInCoverPage(xmlFile, MetadataUtil.VALUE_AUTHENTIC_LANGUAGES_NAME);
            final Element authPElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
            List<String> langArray = new ArrayList<String>();

            for (String lang: authenticLang) {
                langArray.add(ResourcesUtil.getMessage(language, "authentic.language." + lang.toUpperCase()));
            }
            langArray = langArray.stream().sorted().collect(Collectors.toList());
            final String langStr = langArray.size() == 1 ? langArray.get(0) :
                    String.join(", ", langArray.subList(0, langArray.size() - 1)) + " " + ResourcesUtil.getMessage(language,
                    "coverpage" +
                    ".separator") + " " + langArray.get(langArray.size() - 1);
            XmlUtil.setNodeAttributeValue(authContainerElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            authPElement.setTextContent(String.format(ResourcesUtil.getMessage(language, "authentic.languages.text.template"), langStr));
            authContainerElement.appendChild(authPElement);
        }
    }

    public void processAuthenticLanguagesAfterLongTitle(List<String> authenticLang, XmlUtil.XmlFile xmlFile) {
        if (!isBillDocumentFile(xmlFile)) {
            return;
        }
        final String language = readLanguageValue(xmlFile);
        Node xmlNodePreface = xmlFile.getElementByName(MetadataUtil.ELEMENT_PREFACE);
        if (xmlNodePreface == null) {
            return;
        }

        Node xmlNodeLongTitle = XmlUtil.getChildNodeWithName(xmlNodePreface, MetadataUtil.ELEMENT_LONGTITLE);
        if (xmlNodeLongTitle == null) {
            return;
        }

        Node xmlNodeContainer = XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodePreface, MetadataUtil.VALUE_AUTHENTIC_LANGUAGES_NAME);
        if (xmlNodeContainer != null) {
            xmlNodeContainer.getParentNode().removeChild(xmlNodeContainer);
        }

        if (!authenticLang.isEmpty()) {
            final Element authContainerElement = xmlFile.newElement(MetadataUtil.ELEMENT_CONTAINER);
            XmlUtil.setNodeAttributeValue(authContainerElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            XmlUtil.setNodeAttributeValue(authContainerElement, MetadataUtil.ATTRIBUTE_NAME, MetadataUtil.VALUE_AUTHENTIC_LANGUAGES_NAME);
            if (xmlNodeLongTitle.getNextSibling() != null){
                xmlNodePreface.insertBefore(authContainerElement, xmlNodeLongTitle.getNextSibling());
            } else {
                xmlNodePreface.appendChild(authContainerElement);
            }
            final Element authPElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
            List<String> langArray = new ArrayList<String>();

            for (String lang: authenticLang) {
                langArray.add(ResourcesUtil.getMessage(language, "authentic.language." + lang.toUpperCase()));
            }
            langArray = langArray.stream().sorted().collect(Collectors.toList());
            final String langStr = langArray.size() == 1 ? langArray.get(0) :
                    String.join(", ", langArray.subList(0, langArray.size() - 1)) + " " + ResourcesUtil.getMessage(language,
                            "coverpage" +
                                    ".separator") + " " + langArray.get(langArray.size() - 1);
            XmlUtil.setNodeAttributeValue(authContainerElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            authPElement.setTextContent(String.format(ResourcesUtil.getMessage(language, "authentic.languages.text.template"), langStr));
            authContainerElement.appendChild(authPElement);
        }
    }

    @Override
    public void processCorrigendumAddendum(SimpleFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if (isMainDocumentFile(xmlFile)) {
            ObjectMapper objectMapper = new ObjectMapper();
            CorrigendumAddendumMetadata corrigendumAddendumMetadata;
            try {
                corrigendumAddendumMetadata = objectMapper.readValue(fieldInfo.getValue(), CorrigendumAddendumMetadata.class);
                updateCorrigendumAddendum(xmlFile, corrigendumAddendumMetadata);
            } catch (JsonProcessingException e) {
                return;
            }
        }
    }

    private void removeCorrigendumAddendum(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverPage = xmlFile.getElementByName(MetadataUtil.ELEMENT_COVERPAGE);
        if (xmlNodeCoverPage == null) {
            return;
        }

        Node corrigendumNode = getXmlChildNodeWithNameAttributeValue(xmlNodeCoverPage, "corrigendum");
        if (corrigendumNode != null) {
            corrigendumNode.getParentNode().removeChild(corrigendumNode);
        }
        Node addendumNode = getXmlChildNodeWithNameAttributeValue(xmlNodeCoverPage, "addendum");
        if (addendumNode != null) {
            addendumNode.getParentNode().removeChild(addendumNode);
        }
    }


    private void updateCorrigendumAddendum(XmlUtil.XmlFile xmlFile, CorrigendumAddendumMetadata corrigendumAddendumMetadata) {
        Node xmlNodeLongTitle = xmlFile.getElementByName("longTitle");
        if (xmlNodeLongTitle == null) {
            return;
        }

        removeCorrigendumAddendum(xmlFile);

        if (Boolean.TRUE.equals(corrigendumAddendumMetadata.getShowCorrigendumAddendum()) && corrigendumAddendumMetadata.getProposalType() != null) {
            final String language = readLanguageValue(xmlFile);
            populateCorrigendumAddendumContainer(xmlFile, xmlNodeLongTitle, corrigendumAddendumMetadata, language);
        }
    }

    private void populateCorrigendumAddendumContainer(XmlUtil.XmlFile xmlFile, Node xmlNodeLongTitle,
                                                      CorrigendumAddendumMetadata corrigendumAddendumMetadata,
                                                      String language) {
        Element containerElement = xmlFile.newElement(MetadataUtil.ELEMENT_CONTAINER);
        XmlUtil.setNodeAttributeValue(containerElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(containerElement, MetadataUtil.ATTRIBUTE_CLASS, "template");
        XmlUtil.setNodeAttributeValue(containerElement, MetadataUtil.ATTRIBUTE_NAME, corrigendumAddendumMetadata.getProposalType());
        xmlNodeLongTitle.getParentNode().insertBefore(containerElement, xmlNodeLongTitle);

        addPElement(xmlFile, containerElement, corrigendumAddendumMetadata.getProposalType().toUpperCase(Locale.ROOT));
        createCAContainerTargetDocumentDateAndReference(xmlFile, containerElement, corrigendumAddendumMetadata, language);
        createCAContainerTargetLanguages(xmlFile, containerElement, corrigendumAddendumMetadata.getProposalTargetLang(), language);
        createCAContainerCorrectionInfo(xmlFile, containerElement, corrigendumAddendumMetadata);
        createCAContainerWrapperText(xmlFile, containerElement, language);
    }

    private void addPElement(XmlUtil.XmlFile xmlFile, Node container, String content) {
        Element pElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
        XmlUtil.setNodeAttributeValue(pElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        container.appendChild(pElement);
        pElement.setTextContent(content);
    }

    private void createCAContainerTargetDocumentDateAndReference(XmlUtil.XmlFile xmlFile, Node container,
                                                                 CorrigendumAddendumMetadata corrigendumAddendumMetadata, String language) {
        Element pElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
        XmlUtil.setNodeAttributeValue(pElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        pElement.setTextContent(ResourcesUtil.getMessage(language, "coverpage.corrigendum.addendum.affected.document.intro") + " ");
        Element affectedDocNode = xmlFile.newElement("affectedDocument");
        XmlUtil.setNodeAttributeValue(affectedDocNode, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());

        String hrefValue = "http://data.europa.eu/eli/dl";
        boolean isFinal = checkIfFinalVersion(corrigendumAddendumMetadata.getFinalVersion());
        String finalVersionValue = ResourcesUtil.getMessage(language, "coverpage.corrigendum.addendum.affected.document.final");
        String targetProposalRef = corrigendumAddendumMetadata.getTargetProposalReference();
        String hrefTargetProposalRef = targetProposalRef.replaceAll("[()]", "_");
        if (corrigendumAddendumMetadata.getTargetProposalInterInstitutionalRefNumber() != null
                && corrigendumAddendumMetadata.getTargetProposalInterInstitutionalRefYear() != null
                && corrigendumAddendumMetadata.getTargetProposalInterInstitutionalRefType() != null) {
            hrefValue = hrefValue + "/proc/"
                    + corrigendumAddendumMetadata.getTargetProposalInterInstitutionalRefYear()
                    + "/" + corrigendumAddendumMetadata.getTargetProposalInterInstitutionalRefNumber()
                    + "/" + corrigendumAddendumMetadata.getTargetProposalInterInstitutionalRefType()
                    + "/doc/com/" + hrefTargetProposalRef;

        } else {
            hrefValue = hrefValue + "/doc/com/" + hrefTargetProposalRef;
        }

        Element docNumber = xmlFile.newElement(MetadataUtil.ELEMENT_DOC_NUMBER);
        XmlUtil.setNodeAttributeValue(docNumber, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        docNumber.setTextContent(" " + targetProposalRef + " ");
        if (isFinal) {
            XmlUtil.setNodeAttributeValue(affectedDocNode, MetadataUtil.ATTRIBUTE_HREF, hrefValue+"/FINAL");
            Element inline = xmlFile.newElement(MetadataUtil.ELEMENT_INLINE);
            XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_NAME, MetadataUtil.VALUE_VERSION);
            inline.setTextContent(" " + finalVersionValue);
            docNumber.appendChild(inline);
        } else {
            XmlUtil.setNodeAttributeValue(affectedDocNode, MetadataUtil.ATTRIBUTE_HREF, hrefValue);
        }
        Element dateElement = xmlFile.newElement(ELEMENT_DATE);
        XmlUtil.setNodeAttributeValue(dateElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(dateElement, MetadataUtil.ATTRIBUTE_DATE, corrigendumAddendumMetadata.getTargetProposalDate());
        final MetadataLanguageFormats metadataLanguageFormats = getMetadataLanguageDateFormat(xmlFile);
        final String dateDisplayValue = metadataLanguageFormats.formatDate(MetadataUtil.convertIsoDateToLanguageDateFormat(corrigendumAddendumMetadata.getTargetProposalDate(), metadataLanguageFormats));
        dateElement.setTextContent(dateDisplayValue);
        affectedDocNode.appendChild(docNumber);
        affectedDocNode.appendChild(xmlFile.createTextNode(" " + ResourcesUtil.getMessage(language,"coverpage.corrigendum.addendum.affected.document.reference.date.separator") + " "));
        affectedDocNode.appendChild(dateElement);
        pElement.appendChild(affectedDocNode);
        container.appendChild(pElement);
    }

    private boolean checkIfFinalVersion(Boolean isFinalVersion) {
        return isFinalVersion != null && isFinalVersion;
    }

    private void createCAContainerTargetLanguages(XmlUtil.XmlFile xmlFile, Node container, List<String> targetLanguages, String language) {
        if(!targetLanguages.isEmpty() && !targetLanguages.get(0).equalsIgnoreCase("NONE")) {
            Element pElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
            if(targetLanguages.get(0).equalsIgnoreCase("ALL")) {
                pElement.appendChild(xmlFile.createTextNode(ResourcesUtil.getMessage(language,"coverpage.corrigendum.addendum.target.document.all.language")));
            } else {
                pElement.appendChild(xmlFile.createTextNode(ResourcesUtil.getMessage(language,"coverpage.corrigendum.addendum.target.document.selected.language") + " "));
                for(int i =0 ; i < targetLanguages.size(); i++) {
                    String lang = targetLanguages.get(i);
                    Element inline = xmlFile.newElement("inline");
                    XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
                    XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_NAME, lang.toUpperCase());
                    XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_REFERSTO, "~"+lang.toUpperCase());
                    inline.setTextContent(ResourcesUtil.getMessage(language,"authentic.language." + lang.toUpperCase()));
                    pElement.appendChild(inline);
                    if (i < targetLanguages.size() - 2) {
                        pElement.appendChild(xmlFile.createTextNode(", "));
                    } else if (i == targetLanguages.size() - 2) {
                        pElement.appendChild(xmlFile.createTextNode(" " + ResourcesUtil.getMessage(language,"coverpage.separator") + " "));
                    } else {
                        pElement.appendChild(xmlFile.createTextNode("."));
                    }
                }
            }
            //XmlUtil.setNodeAttributeValue(pElement, MetadataUtil.ATTRIBUTE_NAME, "targetLanguages");
            container.appendChild(pElement);
        }
    }

    private void createCAContainerCorrectionInfo(XmlUtil.XmlFile xmlFile, Node container,
                                                 CorrigendumAddendumMetadata corrigendumAddendumMetadata) {
        Element pElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
        XmlUtil.setNodeAttributeValue(pElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        Element inline = xmlFile.newElement("inline");
        XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        XmlUtil.setNodeAttributeValue(inline, MetadataUtil.ATTRIBUTE_NAME, "correctionInfo");
        inline.setTextContent(corrigendumAddendumMetadata.getCorrectionInformation());
        pElement.appendChild(inline);
        container.appendChild(pElement);
    }

    private void createCAContainerWrapperText(XmlUtil.XmlFile xmlFile, Node container, String language) {
        Element pElement = xmlFile.newElement(MetadataUtil.ELEMENT_P);
        XmlUtil.setNodeAttributeValue(pElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
        pElement.setTextContent(ResourcesUtil.getMessage(language,"coverpage.corrigendum.addendum.text.conclusion"));
        container.appendChild(pElement);
    }

    @Override
    public void removeTemplateClassAttributes(XmlUtil.XmlFile xmlFile) {
        final NodeList nodeList = xmlFile.getElementsWithAttributeValue(MetadataUtil.ATTRIBUTE_CLASS, MetadataUtil.VALUE_TEMPLATE);
        for(int i=0; i<nodeList.getLength(); i++) {
            XmlUtil.removeNodeAttributeValue(nodeList.item(i), MetadataUtil.ATTRIBUTE_CLASS);
        }
    }

    private void removeTemplateClassAttributeFromNode(Node node) {
        if (!XmlUtil.nodeHasAttribute(node, MetadataUtil.ATTRIBUTE_CLASS)) {
            return;
        }

        String attributeValue = XmlUtil.getNodeAttributeValue(node, MetadataUtil.ATTRIBUTE_CLASS);
        if (!MetadataUtil.VALUE_TEMPLATE.equals(attributeValue)) {
            return;
        }
        XmlUtil.removeNodeAttributeValue(node, MetadataUtil.ATTRIBUTE_CLASS);
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
