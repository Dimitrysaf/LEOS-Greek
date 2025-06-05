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

import eu.europa.ec.digit.leos.pilot.export.exception.LeosPrefinalisationException;
import eu.europa.ec.digit.leos.pilot.export.exception.MetadataUtilsException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlUtilException;
import eu.europa.ec.digit.leos.pilot.export.exception.XmlValidationException;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataRequest;
import eu.europa.ec.digit.leos.pilot.export.model.ApplyMetadataResponse;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.MetadataFieldType;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MetadataFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.MultipleReferencesFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.model.metadata.fieldInfo.ReferenceFieldInfo;
import eu.europa.ec.digit.leos.pilot.export.service.LeosPrefinalisationService;
import eu.europa.ec.digit.leos.pilot.export.service.MetadataService;
import eu.europa.ec.digit.leos.pilot.export.util.HttpUtil;
import eu.europa.ec.digit.leos.pilot.export.util.MetadataUtil;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil;
import eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XmlFile;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.ApplyMetadataRequestConverter;
import eu.europa.ec.digit.leos.pilot.export.util.metadata.ApplyMetadataResponseConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Validator;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
class LeosPrefinalisationServiceImpl implements LeosPrefinalisationService {
    private static final Logger LOG = LoggerFactory.getLogger(LeosPrefinalisationServiceImpl.class);

    private final MetadataService metadataService;

    @Autowired
    public LeosPrefinalisationServiceImpl(final MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @Override
    public void processMetadataFieldInfo(MetadataFieldInfo fieldInfo, List<XmlFile> documentXmlFiles) throws MetadataUtilsException {
        LOG.debug("Process field info  '{}'", fieldInfo);

        final boolean isAutonomousAct = MetadataUtil.isAutonomousAct(documentXmlFiles);
        for (XmlFile xmlFile : documentXmlFiles){
            LOG.debug("Process xml file '{}'", xmlFile.getName());
            switch(fieldInfo.getFieldType()){
                case ADOPTION_DATE:
                    metadataService.processAdoptionDate((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case ADOPTION_LOCATION:
                    metadataService.processAdoptionLocation((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case EMISSION_DATE:
                    metadataService.processEmissionDate((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case INTERINSTITUTIONAL_COTE:
                    metadataService.processInterinstitutionalCote((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case COTE:
                    metadataService.processCote((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case LINKED_DOCUMENTS:
                    metadataService.processLinkedDocuments((MultipleReferencesFieldInfo)fieldInfo, xmlFile);
                    break;
                case FINAL_COTE:
                    metadataService.processFinalCote((ReferenceFieldInfo)fieldInfo, xmlFile);
                    break;
                case STAMP:
                    if(isAutonomousAct) {
                        metadataService.processStamp((ReferenceFieldInfo)fieldInfo, xmlFile);
                    }
                    break;
                default:
                    throw new MetadataUtilsException(MetadataUtil.FIELD_NOT_SUPPORTED_MESSAGE);
            }
        }
    }
}