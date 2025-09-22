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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
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
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.Collection;

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
    public static final String ELEMENT_CONCLUSIONS = "conclusions";
    public static final String ATTRIBUTE_CONCLUSIONSNEW = "_" + ELEMENT_CONCLUSIONS;
    public static final String VALUE_CONCLUSION_NODE_ID = "conclusions__p_1";
    public static final String VALUE_CONCLUSION_NODE_IDNEW = "_" + VALUE_CONCLUSION_NODE_ID;
    public static final String ATTRIBUTE_STATUS_CODE ="statusCode";
    public static final String ATTRIBUTE_KEY ="key";
    public static final String ELEMENT_DOCUMENT ="document";
    public static final String ELEMENT_TASK ="task";
    public static final String ATTRIBUTE_TASKID ="taskId";
    public static final String ATTRIBUTE_NAME="name";
    public static final String ATTRIBUTE_CLEANUP ="cleanup";
    public static final String ELEMENT_FIELD ="field";
    public static final String ATTRIBUTE_VERSION ="version";
    public static final String ATTRIBUTE_MIMETYPE ="mimeType";
    public static final String ATTRIBUTE_FILENAME ="fileName";
    public static final String ATTRIBUTE_SOURCE_URL ="sourceURL";
    public static final String ATTRIBUTE_DOCUMENTID ="documentId";
    public static final String ELEMENT_ACTION ="action";
    public static final String ATTRIBUTE_DATE="date";
    public static final String ELEMENT_DATE="date";
    public static final String VALUE_ONE ="1";
    public static final String VALUE_ZERO ="0";
    public static final String MESSAGE_LOCATION_NOT_SUPPORTED ="Location not supported";
    public static final String MESSAGE_INVALID_ISO_DATE ="Invalid iso date";
    public static final String MESSAGE_INVALID_FIELD_VALUE ="Invalid field value";
    public static final String ATTRIBUTE_XMLID ="xml:id";
    public static final String ATTRIBUTE_HREF ="href";
    public static final String ATTRIBUTE_SHOWAS ="showAs";
    public static final String ATTRIBUTE_SHORTFORM ="shortForm";
    public static final String ATTRIBUTE_REFERSTO ="refersTo";
    public static final String ATTRIBUTE_VALUE ="value";
    public static final String ATTRIBUTE_CLASS ="class";
    public static final String ELEMENT_COVERPAGE ="coverPage";
    public static final String ELEMENT_PREFACE ="preface";
    public static final String ELEMENT_LONGTITLE ="longTitle";
    public static final String ELEMENT_FRBRWORK ="FRBRWork";
    public static final String ELEMENT_FRBRLANGUAGE ="FRBRlanguage";
    public static final String ELEMENT_TLCREFERENCE = "TLCReference";
    public static final String ELEMENT_PRESERVATION ="preservation";
    public static final String ELEMENT_REFERENCES ="references";
    public static final String ELEMENT_CONTAINER="container";
    public static final String ELEMENT_META="meta";
    public static final String ATTRIBUTE_LANGUAGE ="language";
    public static final String VALUE_LANGUAGE ="language";
    public static final String VALUE_LANGUAGE_EN ="EN";
    public static final String FIELD_NOT_SUPPORTED_MESSAGE="Field not supported";
    public static final String STYLE="style";
    public static final String TLCREFERENCE = "TLCReference";
    public static final String ELEMENT_DISCLAIMER ="disclaimer";
    public static final String ELEMENT_LOGO ="logo";
    public static final String ELEMENT_P ="p";
    public static final String ELEMENT_IMG ="img";
    public static final String ELEMENT_ORGANIZATION ="organization";
    public static final String ATTRIBUTE_PACKAGE_TITLE="packageTitle";
    public static final String VALUE_AUTHENTIC_LANGUAGES_NAME = "authenticLang";
    public static final String VALUE_CROSS_CONFERENCE_NAME = "associatedReferences";
    public static final String ACTING_ENTITY_NAME = "actingEntity";
    public static final String INTERINSTITUTIONAL_COTE_LANG_PLACEHOLDER = "__LANG__";
    public static final String AUTONOMOUS_ACT_VALUE="ACT_AUTO_COM";
    public static final String VALUE_FINAL = "final";
    public static final String ELEMENT_TLCROLE = "TLCRole";
    public static final String ELEMENT_ROLE = "role";
    public static final String ELEMENT_PERSON = "person";
    public static final String ELEMENT_SIGNATURE = "signature";
    public static final String AUTHENTIC_LANGUAGES_PATH = "//akn:meta/akn:references/akn:TLCReference[@name='language']";
    public static final String COVERPAGE_TYPE_PATH = "//akn:coverPage/akn:container[@name='disclaimer']";
    public static final String ACTING_ENTITY_PATH = "//akn:coverPage/akn:container[@name='actingEntity']";

    public static final List<String> validXmlDocumentPrefixes = Arrays.asList("annex",
            "bill", "dec", "dir", "expl_council", "expl_memorandum", "financial_statement",
            "main", "memorandum", "reg", "stat_digit_financ", "stat_financ");

    public static final Set<String> LIST_LANGUAGES = new LinkedHashSet<>(Arrays.asList("BG",
                    "CS", "DA", "DE", "EL", "EN", "ES", "ET", "FI",
                    "FR", "GA", "HR", "HU",
                    "IT", "LT", "LV", "MT",
                    "NL", "PL", "PT", "RO",
                    "SK", "SL",
                    "SV")
            .stream()
            .map(String::toLowerCase)
            .collect(Collectors.toList()));

    public static final List<String> orderInCoverPage =
            Arrays.asList("akn:container[@name='logo']"
            , "akn:container[@name='actingEntity']", "akn:container[@name='mainDoc']", "akn:container[@name='procedureIdentifier']"
            , "akn:container[@name='corrigendum']", "akn:longTitle", "akn:container[@name='authenticLang']"
            , "akn:container[@name='associatedReferences']", "akn:container[@name='eeaRelevance']", "akn:container[@name='mainDocLanguage']");

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

    public static ReferenceFieldInfo getRolePresidentFieldInfo(final String lang) {
        return new ReferenceFieldInfo("PRESID",
                "http://publications.europa.eu/resource/authority/role/PRESID",
                ResourcesUtil.getMessage(lang, "role.president"),
                "", MetadataFieldType.COMMISSIONER);
    }

    public static ReferenceFieldInfo getRoleVicePresidentFieldInfo(final String lang) {
        return new ReferenceFieldInfo("PRESID_VICE",
                "http://publications.europa.eu/resource/authority/role/PRESID_VICE",
                ResourcesUtil.getMessage(lang, "role.vice.president"),
                "", MetadataFieldType.COMMISSIONER);
    }

    public static ReferenceFieldInfo getRoleMemberOfTheCommissionFieldInfo(final String lang) {
        return new ReferenceFieldInfo("MEMBER_COM",
                "http://publications.europa.eu/resource/authority/role/MEMBER_COM",
                ResourcesUtil.getMessage(lang, "role.member.commission"),
                "", MetadataFieldType.COMMISSIONER);
    }

    public static ReferenceFieldInfo getRoleDirectorGeneralFieldInfo(final String lang) {
        return new ReferenceFieldInfo("DIR_GEN",
                "http://publications.europa.eu/resource/authority/role/DIR_GEN",
                ResourcesUtil.getMessage(lang, "role.director.general"),
                "", MetadataFieldType.COMMISSIONER);
    }

    public static ReferenceFieldInfo getMentionCommissionFieldInfo(final String lang) {
        return new ReferenceFieldInfo("COM",
                "",
                ResourcesUtil.getMessage(lang, "mention.com"),
                "", MetadataFieldType.COMMISSIONER);
    }

    public static ReferenceFieldInfo getMentionCouncilFieldInfo(final String lang) {
        return new ReferenceFieldInfo("CONSIL",
                "",
                ResourcesUtil.getMessage(lang, "mention.consil"),
                "", MetadataFieldType.COMMISSIONER);
    }

    public static ReferenceFieldInfo getMentionEPFieldInfo(final String lang) {
        return new ReferenceFieldInfo("EP",
                "",
                ResourcesUtil.getMessage(lang, "mention.ep"),
                "", MetadataFieldType.COMMISSIONER);
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

    public static boolean isDocumentXmlFilename(final String fileName) {
        final String lowerCaseFileName = fileName.toLowerCase();
        if (!lowerCaseFileName.endsWith(".xml")) {
            return false;
        }
        return MetadataUtil.validXmlDocumentPrefixes.stream()
                .anyMatch((prefix) -> lowerCaseFileName.startsWith(prefix));
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
        if(e.getMessage().equals(MESSAGE_INVALID_FIELD_VALUE)) {
            return new ApplyMetadataResponse.FieldNode(field.getKey(), VALUE_ONE,
                    String.format(MESSAGE_INVALID_FIELD_VALUE + " \"%s\"", field.getValue(), ELEMENT_FIELD));
        }

        return new ApplyMetadataResponse.FieldNode(field.getKey(), VALUE_ONE,
                String.format("tag not found (field=\"%s\", tag=\"%s\")", field.getKey(), ELEMENT_FIELD));
    }

    public static ApplyMetadataResponse.FieldNode getLookupFieldInfoSuccessResult(ApplyMetadataRequest.FieldNode field) {
        return new ApplyMetadataResponse.FieldNode(field.getKey(), VALUE_ZERO, "Inserted");
    }

    public static MetadataFieldInfo parseAdoptionLocation(String fieldValue) throws MetadataFieldInvalidValueException {
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
                    throw MetadataFieldInvalidValueException.newException(MetadataFieldType.ADOPTION_LOCATION.toString(), MESSAGE_LOCATION_NOT_SUPPORTED);
            }
        } catch (IllegalArgumentException e){
            throw MetadataFieldInvalidValueException.newException(MetadataFieldType.ADOPTION_LOCATION.toString(), MESSAGE_LOCATION_NOT_SUPPORTED);
        }
    }

    public static MetadataFieldInfo parseAdoptionDate(String fieldValue) throws MetadataFieldInvalidValueException {
        return ((ReferenceFieldInfo)parseEmissionDate(MetadataFieldType.ADOPTION_DATE.toString(), fieldValue)).withFieldType(MetadataFieldType.ADOPTION_DATE);
    }

    public static MetadataFieldInfo parseEmissionDate(String fieldValue) throws MetadataFieldInvalidValueException {
        return ((ReferenceFieldInfo) parseEmissionDate(MetadataFieldType.EMISSION_DATE.toString(), fieldValue));
    }

    public static MetadataFieldInfo parseEmissionDate(String fieldName, String fieldValue) throws MetadataFieldInvalidValueException {
        if (fieldValue.isEmpty()) {
            return new ReferenceFieldInfo("", "", "", "", MetadataFieldType.EMISSION_DATE);
        }
        Date parsedDate = stringToDate(fieldValue, EMISSION_DATE_PARSE_PATTERN);
        if (parsedDate == null) {
            throw MetadataFieldInvalidValueException.newException(fieldName, MESSAGE_INVALID_ISO_DATE);
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

    public static MetadataFieldInfo parseInterinstitutionalCote(String fieldValue) throws MetadataFieldInvalidValueException {
        if (StringUtil.isEmpty(fieldValue)) {
            return new ReferenceFieldInfo("", "", fieldValue, "", MetadataFieldType.INTERINSTITUTIONAL_COTE);
        }

        if (!fieldValue.matches(INTERINSTITUTIONAL_COTE_PARSE_PATTERN)) {
            throw MetadataFieldInvalidValueException.newException(MetadataFieldType.INTERINSTITUTIONAL_COTE.toString(), MESSAGE_INVALID_FIELD_VALUE);
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
        while (value.startsWith(VALUE_ZERO)){
            value = value.substring(1);
        }
        return value;
    }

    public static MetadataFieldInfo parseCote(String fieldValue, MetadataFieldType coteType) throws MetadataFieldInvalidValueException {
        if (StringUtil.isEmpty(fieldValue)) {
            return new ReferenceFieldInfo("", "", fieldValue, "", MetadataFieldType.COTE);
        }

        if (!fieldValue.matches(INSERT_COTE_PARSE_PATTERN)){
            throw MetadataFieldInvalidValueException.newException(MetadataFieldType.COTE.toString(), MESSAGE_INVALID_FIELD_VALUE);
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

    public static MetadataFieldInfo parseLinkedDocuments(final String fieldValue) throws MetadataFieldInvalidValueException {
        String[] references = StringUtils.hasLength(fieldValue) ? fieldValue.split("-") : new String[0];
        List<ReferenceFieldInfo> referenceFieldInfoList = new ArrayList<>();

        for (final String reference : references) {
            final ReferenceFieldInfo fieldInfo = parseLinkedDocumentInfo(reference);
            referenceFieldInfoList.add(fieldInfo);
        }
        return new MultipleReferencesFieldInfo(referenceFieldInfoList, MetadataFieldType.LINKED_DOCUMENTS);
    }

    public static ReferenceFieldInfo parseLinkedDocumentInfo(final String referenceValue) throws MetadataFieldInvalidValueException
    {
        final String displayValue = referenceValue.replace("{", "").replace("}", "").trim();

        if (!displayValue.matches(LINKED_DOCUMENT_PARSE_PATTERN)){
            throw MetadataFieldInvalidValueException.newException(MetadataFieldType.LINKED_DOCUMENTS.toString(), MESSAGE_INVALID_FIELD_VALUE);
        }

        String regex = "(([A-Z]+)\\(([0-9]+)\\) ([0-9]*)( .*)?)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(displayValue);
        while (matcher.find()) {
            String crossRef = matcher.group(1);
            String abbreviation = matcher.group(2);
            String year = matcher.group(3);
            String number = matcher.group(4);
            final String href = String.format(LINKED_DOCUMENT_HREF_PATTERN,
                    abbreviation.toLowerCase().replace("sec",  "swd"), // SEC documents are published under SWD
                    year, number);

            return new ReferenceFieldInfo("", href, displayValue, "", MetadataFieldType.LINKED_DOCUMENTS);
        }
        throw MetadataFieldInvalidValueException.newException(MetadataFieldType.LINKED_DOCUMENTS.toString(), MESSAGE_INVALID_FIELD_VALUE);
    }

    public static MetadataFieldInfo  parseCommissionerValue(String fieldValue) {
        return new ReferenceFieldInfo("", "", fieldValue, "", MetadataFieldType.COMMISSIONER);
    }

    public static MetadataFieldInfo parseStamp(String fieldValue) {
        return new ReferenceFieldInfo("", "", fieldValue, "", MetadataFieldType.STAMP);
    }

    public static MetadataFieldInfo parseCorrigendumAddendum(String fieldValue) {
        return new SimpleFieldInfo(fieldValue, MetadataFieldType.CORRIGENDUM_ADDENDUM);
    }

    public static MetadataFieldInfo parsePackageTitle(String fieldValue) {
        return new SimpleFieldInfo(fieldValue, MetadataFieldType.PACKAGE_TITLE);
    }

    public static MetadataFieldInfo parseAuthenticLanguages(String fieldValue) {
        String[] values = {};
        try {
            ObjectMapper mapper = new ObjectMapper();
            values = mapper.readValue(fieldValue, String[].class);
        } catch (JsonProcessingException e) {
            LOG.debug("Issue parsing json list of authentic languages");
        }
        return new ListFieldInfo(Arrays.asList(values), MetadataFieldType.AUTHENTIC_LANG);
    }

    public static MetadataFieldInfo parseCoverPageType(String fieldValue) {
        return new SimpleFieldInfo(fieldValue, MetadataFieldType.COVERPAGE_TYPE);
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
        String hrefAttributeValue = XmlUtil.getNodeAttributeValue(nodeLanguageReference, ATTRIBUTE_HREF);
        return (hrefAttributeValue != null && hrefAttributeValue.length() >= 3)
                ? hrefAttributeValue.substring(hrefAttributeValue.length() - 3) : null;
    }

    public static Node getLanguageReferenceNode(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeReferences = xmlFile.getElementByName(ELEMENT_REFERENCES);
        if (xmlNodeReferences == null) {
            return null;
        }
        return XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeReferences, MetadataUtil.ATTRIBUTE_LANGUAGE);
    }

    public static Node getPackageTitleReferenceNode(XmlUtil.XmlFile xmlFile) {
        Node xmlNodeReferences = xmlFile.getElementByName(ELEMENT_REFERENCES);
        if (xmlNodeReferences == null) {
            return null;
        }
        return XmlUtil.getXmlChildNodeWithNameAttributeValue(xmlNodeReferences, MetadataUtil.ATTRIBUTE_PACKAGE_TITLE);
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
                    && (XmlUtil.nodeAttributeValueEquals(xmlNodeReference, ATTRIBUTE_NAME, nameAttributeValue))) {
                xmlNodeReferenceProcedureReference = xmlNodeReference;
            }
            index++;
        }

        return xmlNodeReferenceProcedureReference;
    }

    public static boolean isMetaReferenceXmlNode(Node xmlNode) {
        return xmlNode != null
                && XmlUtil.parentNodeNameEquals(xmlNode, ELEMENT_REFERENCES)
                && XmlUtil.parentNodeNameEquals(xmlNode.getParentNode(), "meta");
    }

    public static String readLanguageValue(XmlUtil.XmlFile xmlFile) {
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

    public static String buildPrefinalizationLegName(ApplyMetadataRequest request) {
        Optional<ApplyMetadataRequest.TaskNode> firstTask = request.getTasks().stream().findFirst();
        if (!firstTask.isPresent()) {
            return "prefinalized";
        }
        return buildPrefinalizationLegName(firstTask.get());
    }

    public static String buildPrefinalizationLegName(ApplyMetadataRequest.TaskNode task) {
        final String documentFilename = task.getDocument().getFileName();
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
            prefinalisationName = prefinalisationName + "-" + VALUE_FINAL;
        }

        pos = documentFilename.indexOf("-", pos+1);
        if (pos == -1) {
            return documentFilename;
        }
        return prefinalisationName + documentFilename.substring(pos);
    }

    public static void addRefersToAttribute(Node xmlNode, final String id) {
        XmlUtil.setNodeAttributeValue(xmlNode, ATTRIBUTE_REFERSTO, "~" + id);
    }

    public static Node getAkomaNtosoNode(XmlFile xmlFile) {
        return xmlFile.getElementByName("akomaNtoso");
    }

    public static void removeClassAttribute(Node xmlNode) {
        XmlUtil.removeNodeAttributeValue(xmlNode, ATTRIBUTE_CLASS);
    }

    public static Element insertElementInCoverPage(XmlFile xmlFile, String elementName) {
        String coverPagePath = "//akn:coverPage/";
        Element containerElement = null;
        Node xmlCoverPage = xmlFile.getElementByName(ELEMENT_COVERPAGE);
        String eltXPath = "akn:container[@name='" + elementName + "']";
        if (xmlCoverPage != null) {
            containerElement = xmlFile.newElement(MetadataUtil.ELEMENT_CONTAINER);
            XmlUtil.setNodeAttributeValue(containerElement, MetadataUtil.ATTRIBUTE_XMLID, IdGenerator.generateId());
            XmlUtil.setNodeAttributeValue(containerElement, MetadataUtil.ATTRIBUTE_NAME, elementName);
            boolean found = false;
            for (String elementPath : orderInCoverPage) {
                if (found) {
                    NodeList node = XmlUtil.getElementsByXPath(xmlCoverPage, coverPagePath + elementPath, true);
                    if (node.getLength() > 0) {
                        xmlCoverPage.insertBefore(containerElement, node.item(0));
                        return containerElement;
                    }
                }
                found = found || (elementPath.equals(eltXPath));
            }
            xmlCoverPage.appendChild(containerElement);
        }
        return containerElement;
    }

    public static boolean isRolePresident(final String value) {
        if (value.equalsIgnoreCase("PRESID")) return true;
        final Set<String> rolesPresident = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesPresident.add(ResourcesUtil.getMessage(lang, "role.president").toLowerCase());
        }
        return valueContainsSpelling(value, rolesPresident);
    }

    public static boolean isRoleVicePresident(final String value) {
        if (value.equalsIgnoreCase("PRESID_VICE")) return true;
        final Set<String> rolesVicePresident = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesVicePresident.add(ResourcesUtil.getMessage(lang, "role.vice.president").toLowerCase());
        }
        return valueContainsSpelling(value, rolesVicePresident);
    }

    public static boolean isRoleMemberOfTheCommission(final String value) {
        if (value.equalsIgnoreCase("MEMBER_COM")) return true;
        final Set<String> rolesMemberOfTheCommission = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesMemberOfTheCommission.add(ResourcesUtil.getMessage(lang, "role.member.commission").toLowerCase());
        }
        return valueContainsSpelling(value, rolesMemberOfTheCommission);
    }

    public static boolean isRoleDirectorGeneral(final String value) {
        if (value.equalsIgnoreCase("DIR_GEN")) return true;
        final Set<String> rolesDirectorGeneral = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesDirectorGeneral.add(ResourcesUtil.getMessage(lang, "role.director.general").toLowerCase());
        }
        return valueContainsSpelling(value, rolesDirectorGeneral);
    }

    public static boolean isRoleDirector(final String value) {
        final Set<String> rolesDirector = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesDirector.add(ResourcesUtil.getMessage(lang, "role.director").toLowerCase());
        }
        return valueContainsSpelling(value, rolesDirector);
    }

    public static boolean isRoleHeadOfService(final String value) {
        final Set<String> rolesHeadOfService = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesHeadOfService.add(ResourcesUtil.getMessage(lang, "role.head.service").toLowerCase());
        }
        return valueContainsSpelling(value, rolesHeadOfService);
    }

    public static boolean isRoleHeadOfUnit(final String value) {
        final Set<String> rolesHeadOfUnit = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesHeadOfUnit.add(ResourcesUtil.getMessage(lang, "role.head.unit").toLowerCase());
        }
        return valueContainsSpelling(value, rolesHeadOfUnit);
    }

    public static boolean isRoleSecretaries(final String value) {
        final Set<String> rolesSecretaries = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            rolesSecretaries.add(ResourcesUtil.getMessage(lang, "role.secretaries").toLowerCase());
        }
        return valueContainsSpelling(value, rolesSecretaries);
    }

    public static boolean isMentionCommission(final String value) {
        if (value.equalsIgnoreCase("COM")) return true;
        final Set<String> mentionsCom = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            mentionsCom.add(ResourcesUtil.getMessage(lang, "mention.com").toLowerCase());
        }
        return valueContainsSpelling(value, mentionsCom);
    }

    public static boolean isMentionCouncil(final String value) {
        if (value.equalsIgnoreCase("CONSIL")) return true;
        final Set<String> mentions = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            mentions.add(ResourcesUtil.getMessage(lang, "mention.consil").toLowerCase());
        }
        return valueContainsSpelling(value, mentions);
    }

    public static boolean isMentionEuropeanParliament(final String value) {
        if (value.equalsIgnoreCase("EP")) return true;
        final Set<String> mentions = new HashSet<>();
        for (final String lang : LIST_LANGUAGES) {
            mentions.add(ResourcesUtil.getMessage(lang, "mention.ep").toLowerCase());
        }
        return valueContainsSpelling(value, mentions);
    }

    public static boolean valueContainsSpelling(final String value, final Collection<String> spellings) {
        return !StringUtil.isEmpty(value) && spellings.stream()
                .filter((spelling) -> value.toLowerCase().contains(spelling))
                .findFirst().isPresent();
    }
}