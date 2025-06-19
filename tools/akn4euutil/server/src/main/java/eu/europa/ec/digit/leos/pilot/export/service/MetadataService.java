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

import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ListFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.SimpleFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;

public interface MetadataService {
    MetadataFieldInfo lookupFieldInfo(ApplyMetadataRequest.FieldNode field) throws MetadataUtilsException;
    MetadataFieldInfo lookupFieldInfo(String field, String fieldValue) throws MetadataUtilsException;
    ApplyMetadataResponse.FieldNode getLookupFieldInfoErrorResult(ApplyMetadataRequest.FieldNode field, MetadataUtilsException ex);
    ApplyMetadataResponse.FieldNode getLookupFieldInfoSuccessResult(ApplyMetadataRequest.FieldNode field);
    void processCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processFinalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processInterinstitutionalCote(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processLinkedDocuments(MultipleReferencesFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processEmissionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processAdoptionLocation(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processStamp(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processAdoptionDate(ReferenceFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processPackageTitle(SimpleFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processInternalRef(SimpleFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
    void processAuthenticLanguages(ListFieldInfo fieldInfo, XmlUtil.XmlFile xmlFile);
}