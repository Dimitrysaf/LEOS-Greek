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

import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldInvalidValueException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotAvailableException;
import eu.europa.ec.digit.leos.pilot.export.exception.metadata.MetadataFieldNotSupportedException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;

public interface MetadataService {
    /**
     * Pre-process the value of a task field value to use them in the xml.
     * @param field Request task field
     * @throws MetadataFieldInvalidValueException Thrown if the field value does not exist or is malformed
     * @throws MetadataFieldNotSupportedException Thrown if the field key is not a part of the allowed keys (see: {@link MetadataFieldType})
     * @throws MetadataFieldNotAvailableException Thrown if the field key is a part of the allowed keys but not in use (see: {@link MetadataFieldType})
     * @return Object providing the values that have to be set in the provided xml files
     * */
    MetadataFieldInfo lookupFieldInfo(ApplyMetadataRequest.FieldNode field) throws MetadataFieldInvalidValueException, MetadataFieldNotAvailableException, MetadataFieldNotSupportedException;

    /**
     * Pre-process the value of a task field value to use them in the xml.
     * @param field Key / Name of the task field
     * @param fieldValue Value of the task field
     * @throws MetadataFieldInvalidValueException Thrown if the field value does not exist or is malformed
     * @throws MetadataFieldNotSupportedException Thrown if the field key is not a part of the allowed keys (see: {@link MetadataFieldType})
     * @throws MetadataFieldNotAvailableException Thrown if the field key is a part of the allowed keys but not in use (see: {@link MetadataFieldType})
     * @return Object providing the values that have to be set in the provided xml files
     * */
    MetadataFieldInfo lookupFieldInfo(String field, String fieldValue) throws MetadataFieldInvalidValueException, MetadataFieldNotAvailableException, MetadataFieldNotSupportedException;;

    /**
     * Return a response field node providing a invalid value error.
     * @param fieldName Name / Key  of the field that is malformed
     * @param value Value of the field that is malformed
     * */
    ApplyMetadataResponse.FieldNode getFieldInvalidValueResult(String fieldName, final String value);

    /**
     * Return a response field node providing a field not available error.
     *
     * Fields are not available if they are a part of {@link MetadataFieldType} but not used at the moment.
     *
     * @param fieldName Name / Key  of the field that is not available
     * */
    ApplyMetadataResponse.FieldNode getFieldNotAvailableResult(String fieldName);

    /**
     * Return a response field node providing a field not supported error.
     *
     * Fields are not supported if they are not a part of {@link MetadataFieldType}.
     *
     * @param fieldName Name / Key of the field that is not supported
     * */
    ApplyMetadataResponse.FieldNode getFieldNotSupportedResult(String fieldName);

    /**
     * Return a response field for successfully processed field.
     * @param fieldName Name / Key of the field that passed processing
     * */
    ApplyMetadataResponse.FieldNode getFieldSuccessResult(String fieldName);

    /**
     * Process the cote field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the cote data
     * */
    void processCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the final cote field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the final cote value
     * */
    void processFinalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the interinstitutional cote field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the interinstitutional cote data
     * */
    void processInterinstitutionalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the linked documents field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the linked documents data
     * */
    void processLinkedDocuments(MultipleReferencesFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the emission date field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the emission date
     * */
    void processEmissionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the adoption location field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the adoption location
     * */
    void processAdoptionLocation(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the stamp field and add the data to the xml. Stamp can vary by set language.
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the stamp
     * */
    void processStamp(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);

    /**
     * Process the adoption date field and add the data to the xml
     * @param fieldInfo {@link ReferenceFieldInfo} providing the data to set
     * @param xmlFile XML file to add the adoption date
     * */
    void processAdoptionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
}