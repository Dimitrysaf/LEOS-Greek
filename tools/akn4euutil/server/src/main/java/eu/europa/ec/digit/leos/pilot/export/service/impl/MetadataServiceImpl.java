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
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
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
                    String.format(MetadataUtil.INVALID_FIELD_VALUE_MESSAGE + " \"%s\"", field.getValue()));
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
            MetadataFieldType fieldType = MetadataFieldType.valueOfTypeName(field);
            switch(fieldType){
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
        addAdoptionLocationToMetaReference(locationToLanguage, xmlFile);
        addAdoptionLocationToCoverPage(locationToLanguage, xmlFile);
        addAdoptionLocationToConclusion(locationToLanguage, xmlFile);
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
        addEmissionDateToCoverPage(fieldInfo, xmlFile);
        addEmissionDateToConclusion(fieldInfo, xmlFile);
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

        String displayValue = readEmissionDataDisplayValue(fieldInfo, xmlFile);
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
    public void processFinalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        processCote(fieldInfo, xmlFile);
        final ReferenceFieldInfo finalFieldInfo = new ReferenceFieldInfo("", "", "final", "final", MetadataFieldType.FINAL_COTE);
        addFinalToCoverPage(finalFieldInfo, xmlFile);
        addFinalToIdentification(finalFieldInfo, xmlFile);
        addFinalToFilename(finalFieldInfo, xmlFile);
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

        frbrExpression.insertBefore(frbrVersionNumber, XmlUtil.getChildNodeWithName(frbrExpression,"FRBRlanguage"));
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
        final Node frbrWorkNode = xmlFile.getElementByName(MetadataUtil.FRBRWORK);
        if (frbrWorkNode == null) {
            return;
        }

        final Node preservationNode = XmlUtil.getChildNodeWithName(frbrWorkNode, MetadataUtil.PRESERVATION);
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

    public void addCoteToMetaReference(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        if(MetadataUtil.isMainDocumentFile(xmlFile)) {
            addTLCReference(fieldInfo, xmlFile, "identifier");
        }
    }

    public void removeMetaPreservation(XmlUtil.XmlFile xmlFile) {
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

    public void removeDocCuid(XmlUtil.XmlFile xmlFile) {
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

    public void addCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
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
            tlcReference = xmlFile.newElement(MetadataUtil.TLCREFERENCE);
        }

        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.NAME, name);
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.XMLID, fieldInfo.getId());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.HREF, fieldInfo.getHref());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.SHOWAS, fieldInfo.getDisplayValue());
        XmlUtil.setNodeAttributeValue(tlcReference, MetadataUtil.SHORTFORM, fieldInfo.getShortValue());

        if (!isTlcReferenceFound) {
            references.appendChild(tlcReference);
        }
    }

    private void addInterinstitutionalCoteToCoverPage(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile) {
        Node xmlNodeCoverpage = xmlFile.getElementByName(MetadataUtil.COVERPAGE);
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
