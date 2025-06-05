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

import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataLanguageFormats;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataLocationType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ListFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.SimpleFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XmlFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class MetadataUtil {
    public static final Logger LOG = LoggerFactory.getLogger(MetadataUtil.class);
    public static final String EMISSION_DATE_PARSE_PATTERN = "yyyy-MM-dd";
    public static final String INSERT_COTE_PARSE_PATTERN = "([A-Za-z0-9]+)\\(([0-9]{4})\\)(\\s{0,1})([0-9]+)(\\s{0,1})([A-Za-z]{0,5})";
    public static final String INSERT_COTE_HREF = "http://publications.europa.eu/resource/authority/document-identifier-format/COM_NUMBER";
    public static final String INSERT_COTE_SHORT_VALUE_PATTERN = "%s/%s/%s";
    public static final String INTERINSTITUTIONAL_COTE_PARSE_PATTERN = "([0-9]{4})/([0-9]+) \\(([A-Za-z0-9]+)\\)";
    public static final String INTERINSTITUTIONAL_COTE_ID_PATTERN = "procedure_%s_%s";
    public static final String INTERINSTITUTIONAL_COTE_HREF_PATTERN = "http://eur-lex.europa.eu/procedure/__LANG__/%s_%s";
    public static final String ATHENTIC_LANGUAGE_HREF_PATTERN = "http://publications.europa.eu/resource/authority/language/%s";
    public static final String INTERINSTITUTIONAL_COTE_SHORT_VALUE_PATTERN = "%s/%s/%s";
    public static final String LINKED_DOCUMENT_HREF_PATTERN = "http://data.europa.eu/eli/%s/%s/%s";
    public static final String LINKED_DOCUMENT_PARSE_PATTERN = "([A-Za-z0-9]+)\\((\\d{4})\\)(\\s?)(\\d+)(\\s?)([A-Za-z0-9]*)";
    public static final String CONCLUSIONS = "conclusions";
    public static final String CONCLUSIONSNEW = "_" + CONCLUSIONS;
    public static final String CONCLUSION_NODE_ID = "conclusions__p_1";
    public static final String CONCLUSION_NODE_IDNEW = "_" + CONCLUSION_NODE_ID;
    public static final String STATUS_CODE="statusCode";
    public static final String KEY="key";
    public static final String DOCUMENT="document";
    public static final String TASK="task";
    public static final String TASKID="taskId";
    public static final String NAME="name";
    public static final String CLEANUP="cleanup";
    public static final String FIELD="field";
    public static final String VERSION="version";
    public static final String MIMETYPE="mimeType";
    public static final String FILENAME="filename";
    public static final String SOURCEURL="sourceURL";
    public static final String DOCUMENTID="documentId";
    public static final String ACTION="action";
    public static final String DATE="date";
    public static final String ONE="1";
    public static final String ZERO="0";
    public static final String FIELD_NOT_SUPPORTED_MESSAGE="Field not supported";
    public static final String LOCATION_NOT_SUPPORTED_MESSAGE="Location not supported";
    public static final String INVALID_ISO_DATE_MESSAGE="Invalid iso date";
    public static final String INVALID_FIELD_VALUE_MESSAGE="Invalid field value";
    public static final String XMLID="xml:id";
    public static final String HREF="href";
    public static final String SHOWAS="showAs";
    public static final String SHORTFORM="shortForm";
    public static final String META="meta";
    public static final String COVERPAGE="coverPage";
    public static final String REFERSTO="refersTo";
    public static final String VALUE="value";
    public static final String CLASS="class";
    public static final String FRBRWORK="FRBRWork";
    public static final String FRBRLANGUAGE="FRBRlanguage";
    public static final String TLCREFERENCE = "TLCReference";
    public static final String PRESERVATION="preservation";
    public static final String REFERENCES="references";
    public static final String CONTAINER="container";
    public static final String P="p";
    public static final String AUTHENTIC_LANGUAGES_COVERPAGE_TEXT = "(Only the %s texts are authentic)";
    public static final Map<String, String> AUTHENTIC_LANGUAGES = new HashMap<String, String>() {{
        put("BG", "Bulgarian");
        put("CS", "Czech");
        put("DA", "Danish");
        put("DE", "German");
        put("EL", "Greek");
        put("EN", "English");
        put("ES", "Spanish");
        put("ET", "Estonian");
        put("FI", "Finnish");
        put("FR", "French");
        put("GA", "Irish");
        put("HR", "Croatian");
        put("HU", "Hungarian");
        put("IT", "Italian");
        put("LT", "Lithuanian");
        put("LV", "Latvian");
        put("MT", "Maltese");
        put("NL", "Dutch");
        put("PL", "Polish");
        put("PT", "Portuguese");
        put("RO", "Romanian");
        put("SK", "Slovak");
        put("SL", "Slovenian");
        put("SV", "Swedish");
    }};
    public static final String LANGUAGE="language";
    public static final String LANGUAGE_EN="EN";
    public static final String PACKAGE_TITLE="packageTitle";
    public static final String AUTHENTIC_LANGUAGES_NAME = "authenticLang";
    public static final String INTERINSTITUTIONAL_COTE_LANG_PLACEHOLDER = "__LANG__";
    public static final String AUTONOMOUS_ACT_VALUE="ACT_AUTO_COM";
    public static final String FINAL_VALUE = "final";
    public static final List<MetadataFieldType> PREFINALISATION_FIELDTYPES = Arrays.asList(MetadataFieldType.FINAL_COTE, MetadataFieldType.ADOPTION_DATE,
            MetadataFieldType.ADOPTION_LOCATION, MetadataFieldType.EMISSION_DATE, MetadataFieldType.INTERINSTITUTIONAL_COTE,
            MetadataFieldType.LINKED_DOCUMENTS, MetadataFieldType.STAMP, MetadataFieldType.COTE);
    public static final String AUTHENTIC_LANGUAGES_PATH = "//akn:meta/akn:references/akn:TLCReference[@name='language']";

    public static final List<String> validXmlDocumentPrefixes = Arrays.asList("annex",
            "bill", "dec", "dir", "expl_council", "expl_memorandum", "financial_statement",
            "main", "memorandum", "reg", "stat_digit_financ", "stat_financ");

    public static ReferenceFieldInfo getFieldInfoLocationBrussels(){
        return new ReferenceFieldInfo("BEL_BRU",
                "http://publications.europa.eu/resource/authority/place/BEL_BRU",
                "Brussels",
                "", MetadataFieldType.ADOPTION_LOCATION);
    }

    public static ReferenceFieldInfo getFieldInfoLocationLuxembourg(){
        return new ReferenceFieldInfo("LUX_LUX",
                "http://publications.europa.eu/resource/authority/place/LUX_LUX",
                "Luxembourg",
                "", MetadataFieldType.ADOPTION_LOCATION);
    }

    public static ReferenceFieldInfo getFieldInfoLocationStrasbourg(){
        return new ReferenceFieldInfo("FRA_SXB",
                "http://publications.europa.eu/resource/authority/place/FRA_SXB",
                "Strasbourg",
                "", MetadataFieldType.ADOPTION_LOCATION);
    }

    public static boolean isDocumentXmlFile(final XmlFile xmlFile) {
        Node rootNode = MetadataUtil.getAkomaNtosoNode(xmlFile);
        if (rootNode == null) {
            return false;
        }
        if (hasDocumentElement(rootNode, "doc")) {
            return true;
        }
        return hasDocumentElement(rootNode, "bill");
    }

    public static boolean isAutonomousAct(final List<XmlFile> xmlFiles) {
        if (xmlFiles.isEmpty()) {
            return false;
        }

        final Optional<XmlFile> optMainXml = xmlFiles.stream().filter(MetadataUtil::isMainDocumentFile).findFirst();
        if (!optMainXml.isPresent()) {
            return false;
        }

        final XmlFile mainXml = optMainXml.get();
        final Node documentCollection = mainXml.getElementByName("documentCollection");
        if (documentCollection == null) {
            return false;
        }

        final String documentCollectionName = XmlUtil.getNodeAttributeValue(documentCollection, "name");
        return AUTONOMOUS_ACT_VALUE.equals(documentCollectionName);
    }

    public static boolean hasDocumentElement(final Node rootNode, final String docElementName) {
        Node documentNode = XmlUtil.getChildNodeWithName(rootNode, docElementName);
        if (documentNode == null) {
            return false;
        }
        if (!XmlUtil.nodeHasAttribute(documentNode, "name")) {
            return false;
        }
        return XmlUtil.getNodeAttributeValue(documentNode, "name").length() > 0;
    }

    public static boolean isDocumentXmlFilename(final String filename) {
        final String lowerCaseFilename = filename.toLowerCase();
        if (!lowerCaseFilename.endsWith(".xml")) {
            return false;
        }
        return MetadataUtil.validXmlDocumentPrefixes.stream()
                .anyMatch((prefix) -> lowerCaseFilename.startsWith(prefix));
    }

    public static boolean isMainDocumentFile(XmlFile xmlFile) {
        final String fileName = xmlFile.getName();
        return fileName.startsWith("main");
    }

    public static boolean isBillDocumentFile(XmlFile xmlFile) {
        final String fileName = xmlFile.getName().toLowerCase();
        if (fileName.startsWith("bill")) {
            return true;
        }
        return isBillXmlDocument(xmlFile);
    }

    public static boolean isBillXmlDocument(XmlFile xmlFile) {
        final Node rootNode = MetadataUtil.getAkomaNtosoNode(xmlFile);
        if (rootNode == null) {
            return false;
        }
        final Node billNode = XmlUtil.getChildNodeWithName(rootNode, "bill");
        return (billNode != null);
    }

    public static ApplyMetadataResponse.FieldNode getLookupFieldInfoErrorResult(
            ApplyMetadataRequest.FieldNode field,
            MetadataUtilsException e) {

        if(e.getMessage().equals(INVALID_FIELD_VALUE_MESSAGE)) {
            return new ApplyMetadataResponse.FieldNode(field.getKey(), ONE,
                    String.format(INVALID_FIELD_VALUE_MESSAGE + " \"%s\"", field.getValue(), FIELD));
        }

        return new ApplyMetadataResponse.FieldNode(field.getKey(), ONE,
                String.format("tag not found (field=\"%s\", tag=\"%s\")", field.getKey(), FIELD));
    }

    public static ApplyMetadataResponse.FieldNode getLookupFieldInfoSuccessResult(ApplyMetadataRequest.FieldNode field) {
        return new ApplyMetadataResponse.FieldNode(field.getKey(), ZERO, "Inserted");
    }

    public static MetadataFieldInfo parseAdoptionLocation(String fieldValue) throws MetadataUtilsException {
        try {
            MetadataLocationType locationType = MetadataLocationType.valueOfLocation(fieldValue.toUpperCase());

            switch (locationType){
                case BRUSSELS:
                    return getFieldInfoLocationBrussels();
                case LUXEMBOURG:
                    return getFieldInfoLocationLuxembourg();
                case STRASBOURG:
                    return getFieldInfoLocationStrasbourg();
                default:
                    throw new MetadataUtilsException(LOCATION_NOT_SUPPORTED_MESSAGE);
            }
        } catch (IllegalArgumentException e){
            throw new MetadataUtilsException(LOCATION_NOT_SUPPORTED_MESSAGE);
        }
    }

    public static MetadataFieldInfo parseAdoptionDate(String fieldValue) throws MetadataUtilsException {
        return ((ReferenceFieldInfo)parseEmissionDate(fieldValue)).withFieldType(MetadataFieldType.ADOPTION_DATE);
    }

    public static MetadataFieldInfo parseEmissionDate(String fieldValue) throws MetadataUtilsException {
        Date parsedDate = stringToDate(fieldValue, EMISSION_DATE_PARSE_PATTERN);
        if (parsedDate == null) {
            throw new MetadataUtilsException(INVALID_ISO_DATE_MESSAGE);
        };

        return new ReferenceFieldInfo(fieldValue, "", "", "", MetadataFieldType.EMISSION_DATE);
    }

    public static Date stringToDate(String strDate, String format) {
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
            return simpleDateFormat.parse(strDate);
        } catch(Exception e) {
            return null;
        }
    }

    public static MetadataFieldInfo parseInterinstitutionalCote(String fieldValue) throws MetadataUtilsException {
        if (!fieldValue.matches(INTERINSTITUTIONAL_COTE_PARSE_PATTERN)) {
            throw new MetadataUtilsException(INVALID_FIELD_VALUE_MESSAGE);
        }

        int slashIndex = fieldValue.indexOf("/");
        int bracketIndex = fieldValue.indexOf("(");

        String year = fieldValue.substring(0, slashIndex);
        String number = fieldValue.substring(slashIndex+1, bracketIndex-1).trim();
        String strippedNumber = removeTrailingZeros(number);
        String type = fieldValue.substring(bracketIndex+1, fieldValue.indexOf(")"));

        String id = String.format(INTERINSTITUTIONAL_COTE_ID_PATTERN, year, strippedNumber);
        String href = String.format(INTERINSTITUTIONAL_COTE_HREF_PATTERN, year, strippedNumber);
        String shortValue = String.format(INTERINSTITUTIONAL_COTE_SHORT_VALUE_PATTERN, year, strippedNumber, type);

        return new ReferenceFieldInfo(id, href, fieldValue, shortValue, MetadataFieldType.INTERINSTITUTIONAL_COTE);
    }

    public static String removeTrailingZeros(String value) {
        while (value.startsWith(ZERO)){
            value = value.substring(1);
        }
        return value;
    }

    public static MetadataFieldInfo parseCote(String fieldValue, MetadataFieldType coteType) throws MetadataUtilsException {
        if (!fieldValue.matches(INSERT_COTE_PARSE_PATTERN)){
            throw new MetadataUtilsException(INVALID_FIELD_VALUE_MESSAGE);
        }

        int bracketIndex = fieldValue.indexOf("(");
        int closingBracketIndex = fieldValue.indexOf(")");

        String type = fieldValue.substring(0, bracketIndex);
        String year = fieldValue.substring(bracketIndex+1, closingBracketIndex);
        String number = readCoteNumber(fieldValue, closingBracketIndex+1);

        String id = IdGenerator.generateId();
        String shortValue = String.format(INSERT_COTE_SHORT_VALUE_PATTERN, type, year, number);
        return new ReferenceFieldInfo(id, INSERT_COTE_HREF, fieldValue, shortValue, coteType);
    }

    public static boolean isPrefinalisationField(MetadataFieldType fieldType) {
        return PREFINALISATION_FIELDTYPES.contains(fieldType);
    }

    public static String readCoteNumber(String value, int startIndex) {
        String nextCharacter = value.substring(startIndex, startIndex+1);
        while (startIndex < value.length() && !StringUtil.isInteger(nextCharacter)) {
            startIndex++;
            nextCharacter = value.substring(startIndex, startIndex+1);
        }
        if (startIndex == value.length()) return "";

        Integer spaceIndex = value.indexOf(" ", startIndex);
        String coteNumber = (spaceIndex == -1) ? value.substring(startIndex) : value.substring(startIndex, spaceIndex);
        return coteNumber.trim();
    }

    public static MetadataFieldInfo parseLinkedDocuments(String fieldValue) throws MetadataUtilsException {
        String[] references = StringUtils.hasLength(fieldValue) ? fieldValue.split("-") : new String[0];
        List<ReferenceFieldInfo> referenceFieldInfoList = new ArrayList<>();

        for (final String reference : references) {
            final ReferenceFieldInfo fieldInfo = parseLinkedDocumentInfo(reference);
            referenceFieldInfoList.add(fieldInfo);
        }
        return new MultipleReferencesFieldInfo(referenceFieldInfoList, MetadataFieldType.LINKED_DOCUMENTS);
    }

    public static ReferenceFieldInfo parseLinkedDocumentInfo(final String referenceValue) throws MetadataUtilsException
    {
        final String displayValue = referenceValue.replace("{", "").replace("}", "").trim();

        if (!displayValue.matches(LINKED_DOCUMENT_PARSE_PATTERN)){
            throw new MetadataUtilsException(INVALID_FIELD_VALUE_MESSAGE);
        }
        int bracketIndex = displayValue.indexOf("(");
        final String abbreviation = displayValue.substring(0, bracketIndex).trim();

        int closingBracketIndex = displayValue.indexOf(")");
        final String year = displayValue.substring(bracketIndex+1, closingBracketIndex).trim();

        int wordPos = displayValue.indexOf(FINAL_VALUE);
        if(wordPos < 0) wordPos = displayValue.lastIndexOf("draft");
        if(wordPos < 0) wordPos = displayValue.length();
        final String number = displayValue.substring(closingBracketIndex+1, wordPos).trim();
        final String href = String.format(LINKED_DOCUMENT_HREF_PATTERN,
                abbreviation.toLowerCase().replace("sec",  "swd"), // SEC documents are published under SWD
                year, number);

        return new ReferenceFieldInfo("", href, displayValue, "", MetadataFieldType.LINKED_DOCUMENTS);
    }

    public static MetadataFieldInfo parseStamp(String fieldValue) {
        return new ReferenceFieldInfo("", "", fieldValue, "", MetadataFieldType.STAMP);
    }

    public static MetadataFieldInfo parsePackageTitle(String fieldValue) {
        return new SimpleFieldInfo(fieldValue, MetadataFieldType.PACKAGE_TITLE);
    }

    public static MetadataFieldInfo parseAuthenticLanguages(String fieldValue) {
        String[] values = StringUtils.hasLength(fieldValue) ? fieldValue.split("-") : new String[0];
        return new ListFieldInfo(Arrays.asList(values), MetadataFieldType.AUTHENTIC_LANG);
    }

    public static MetadataFieldInfo parseInternalRef(String fieldValue) {
        return new SimpleFieldInfo(fieldValue, MetadataFieldType.INTERNAL_REF);
    }

    public static Node getXmlNodeMetaReference(XmlFile xmlFile, String referenceNodeName) {
        Node xmlNodeMetaReference = null;

        Node xmlNode = xmlFile.getElementByName(referenceNodeName);
        if (isMetaReferenceXmlNode(xmlNode)) {
            xmlNodeMetaReference = xmlNode;
        }

        return xmlNodeMetaReference;
    }

    public static String convertIsoDateToLanguageDateFormat(String isoDate, MetadataLanguageFormats languageDateFormat) {
        Date parsedDate = stringToDate(isoDate, EMISSION_DATE_PARSE_PATTERN);
        return dateToString(parsedDate, languageDateFormat.getFormat());
    }

    public static MetadataLanguageFormats convertIso6392tCodeToMetadataLanguageDateFormat(String iso6392tCode) {
        try {
            return MetadataLanguageFormats.ofIso639_2T(iso6392tCode);
        } catch(IllegalArgumentException ex) {
            return MetadataLanguageFormats.EN;
        }
    }

    public static String dateToString(Date date, String format) {
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
            return simpleDateFormat.format(date);
        } catch(Exception e) {
            return "";
        }
    }

    public static String parseAlpha3CountryCode(Node nodeLanguageReference) {
        if (nodeLanguageReference == null) { return null; }
        String hrefAttributeValue = XmlUtil.getNodeAttributeValue(nodeLanguageReference, HREF);
        return (hrefAttributeValue != null && hrefAttributeValue.length() >= 3)
                ? hrefAttributeValue.substring(hrefAttributeValue.length() - 3) : null;
    }

    public static Node getLanguageReferenceNode(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeReferences = xmlFile.getElementByName(REFERENCES);
        if (xmlNodeReferences == null) {
            return null;
        }
        return XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeReferences, MetadataUtil.LANGUAGE);
    }

    public static Node getPackageTitleReferenceNode(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeReferences = xmlFile.getElementByName(REFERENCES);
        if (xmlNodeReferences == null) {
            return null;
        }
        return XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeReferences, MetadataUtil.PACKAGE_TITLE);
    }

    public static Node getXmlNodeDocketNumber(Node xmlNode) {
        Node xmlNodeDocketNumber = null;
        if (xmlNode != null) {
            Node xmlNodeP = XmlUtil.getChildNodeWithName(xmlNode, "p");
            if (xmlNodeP != null) {
                xmlNodeDocketNumber = XmlUtil.getChildNodeWithName(xmlNodeP, "docketNumber");
            }
        }
        return xmlNodeDocketNumber;
    }

    public static Node getXmlNodeDocNumber(XmlFile xmlFile) {
        Node xmlDocNumber = null;
        final NodeList elementsByName = xmlFile.getElementsByName("docNumber");
        xmlDocNumber = elementsByName.item(0);
        return  xmlDocNumber;
    }

    public static Node getXmlNodeMetaReferenceWithNameAttributeValue(XmlFile xmlFile, String referenceNodeName, String nameAttributeValue) {
        Node xmlNodeReferenceProcedureReference = null;

        int index = 0;
        NodeList xmlNodesReferences = xmlFile.getElementsByName(referenceNodeName);
        while(index < xmlNodesReferences.getLength() && xmlNodeReferenceProcedureReference == null) {
            Node xmlNodeReference = xmlNodesReferences.item(index);
            if (isMetaReferenceXmlNode(xmlNodeReference)
                    && (XmlUtil.nodeAttributeValueEquals(xmlNodeReference, NAME, nameAttributeValue))) {
                xmlNodeReferenceProcedureReference = xmlNodeReference;
            }
            index++;
        }

        return xmlNodeReferenceProcedureReference;
    }

    public static boolean isMetaReferenceXmlNode(Node xmlNode) {
        return xmlNode != null
                && XmlUtil.parentNodeNameEquals(xmlNode, REFERENCES)
                && XmlUtil.parentNodeNameEquals(xmlNode.getParentNode(), "meta");
    }

    public static String readLanguageValue(XmlUtil.XmlFile xmlFile) {
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

    public static String buildPrefinalizationLegName(ApplyMetadataRequest request) {
        Optional<ApplyMetadataRequest.TaskNode> firstTask = request.getTasks().stream().findFirst();
        if (!firstTask.isPresent()) {
            return "prefinalized";
        }
        return buildPrefinalizationLegName(firstTask.get());
    }

    public static String buildPrefinalizationLegName(ApplyMetadataRequest.TaskNode task) {
        final String documentFilename = task.getDocument().getFilename();
        Optional<ApplyMetadataRequest.ActionNode> action = task.getActions().stream().findFirst();
        if (!action.isPresent()) {
            return documentFilename;
        }

        Optional<ApplyMetadataRequest.FieldNode> coteField = action.get().getFieldWithKey(MetadataFieldType.COTE.toString());
        Optional<ApplyMetadataRequest.FieldNode> finalCote = action.get().getFieldWithKey(MetadataFieldType.FINAL_COTE.toString());
        if (!coteField.isPresent() && !finalCote.isPresent()) {
            return documentFilename;
        }
        if (finalCote.isPresent()) {
            coteField = finalCote;
        }

        final String coteValue = coteField.get().getValue().replace(" ", "_");
        String prefinalisationName = "";
        int pos = documentFilename.indexOf("-");
        if (pos == -1) {
            return documentFilename;
        }

        prefinalisationName = documentFilename.substring(0, pos+1) + coteValue;
        if (finalCote.isPresent()) {
            prefinalisationName = prefinalisationName + "-" + FINAL_VALUE;
        }

        pos = documentFilename.indexOf("-", pos+1);
        if (pos == -1) {
            return documentFilename;
        }
        return prefinalisationName + documentFilename.substring(pos);
    }

    public static void addRefersToAttribute(Node xmlNode, final String id) {
        XmlUtil.setNodeAttributeValue(xmlNode, REFERSTO, "~" + id);
    }

    public static Node getAkomaNtosoNode(XmlFile xmlFile) {
        return xmlFile.getElementByName("akomaNtoso");
    }

    public static void removeClassAttribute(Node xmlNode) {
        XmlUtil.removeNodeAttributeValue(xmlNode, CLASS);
    }
}