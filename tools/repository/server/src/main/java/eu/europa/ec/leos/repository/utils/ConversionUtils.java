/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.repository.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.entities.Config;
import eu.europa.ec.leos.repository.entities.ConfigContent;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.entities.DocumentContent;
import eu.europa.ec.leos.repository.entities.DocumentCategories;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentPropertiesV;
import eu.europa.ec.leos.repository.entities.DocumentPropertyValues;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.LeosDocument;
import eu.europa.ec.leos.repository.model.Package;
import eu.europa.ec.leos.repository.repositories.DocumentCategoriesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentContentRepository;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.repositories.DocumentPropertyValuesRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.services.CollaboratorsService;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

public class ConversionUtils {
    private static final Logger LOG = LoggerFactory.getLogger(ConversionUtils.class);
    public final static DateTimeFormatter LEOS_REPO_DATE_FORMAT = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH);

    public static String getLeosDateAsString(Date date, DateTimeFormatter formatter) {
        String dateAsStr = null;
        if (date != null) {
            dateAsStr = formatter.format(ZonedDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault()));
        }
        return dateAsStr;
    }

    public static Date getDateFromString(String dateStr, DateTimeFormatter formatter) {
        Date date = null;
        if (dateStr != null) {
            ZonedDateTime zdt = ZonedDateTime.parse(dateStr, formatter);
            date = new Date(zdt.toInstant().toEpochMilli());
        }
        return date;
    }

    public static ArrayList<LinkedHashMap<String, Object>> getLeosCollaboratorsAsLinkedHashMap(List<Collaborator> collaborators) {
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<LinkedHashMap<String, Object>> collaboratorsAsLinkedHashMap = null;
        if (collaborators != null) {
            try {
                collaboratorsAsLinkedHashMap = mapper.convertValue(collaborators,
                        new TypeReference<ArrayList<LinkedHashMap<String, Object>>>() { });
            } catch (Exception e) {
                LOG.debug("Exception occured while converting collaborators to string : " + e.getMessage());
            }
        }
        return collaboratorsAsLinkedHashMap;
    }

    public static List<Collaborator> getLeosCollaboratorsFromLinkedHashMap(ArrayList<LinkedHashMap<String, Object>> collaboratorsLinkedHashMap) {
        ObjectMapper mapper = new ObjectMapper();
        List<Collaborator> collaborators = null;
        if (collaboratorsLinkedHashMap != null) {
            try {
                collaborators = mapper.convertValue(collaboratorsLinkedHashMap,
                        new TypeReference<List<Collaborator>>() { });
            } catch (Exception e) {
                LOG.debug("Exception occured while converting string to collaborators: " + e.getMessage());
            }
        }
        return collaborators;
    }

    public static Boolean convertBoolean(Object value) {
        Boolean valueBoolean = null;
        if (value != null) {
            try {
                valueBoolean = (Boolean) value;
            } catch (ClassCastException e) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    valueBoolean = mapper.readValue((String) value, new TypeReference<Boolean>(){});
                } catch (Exception ex) {
                    LOG.debug("Exception occured while converting string to boolean: " + ex.getMessage());
                }
            }
        }
        return valueBoolean;
    }

    public static LocalDateTime convertToLocalDateTime(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    private static List<DocumentPropertyValues> getDocumentProperties(DocumentPropertyValuesRepository documentPropertyValuesRepository, BigDecimal versionId,
                                                                      BigDecimal documentId) {
        List<DocumentPropertyValues> docProps = documentPropertyValuesRepository.findDocumentPropertiesByVersionId(versionId);
        if (docProps.isEmpty()) {
            docProps = documentPropertyValuesRepository.findDocumentPropertiesByDocumentId(documentId);
            if (docProps.isEmpty() || docProps.get(0).getVersion() != null) {
                docProps.clear();
            }
        }
        return docProps;
    }

    public static LeosDocument buildXmlDocument(Document doc, DocumentVersion docVersion, DocumentContent docContent,
                                                CollaboratorsService collaboratorsService, DocumentPropertyValuesRepository documentPropertyValuesRepository) {
        List<DocumentPropertyValues> docProps = getDocumentProperties(documentPropertyValuesRepository, docVersion.getId(), doc.getId());
        List<Collaborator> collaborators = collaboratorsService.getCollaborators(doc.getPackageId());
        return new LeosDocument(doc, docVersion, docContent, collaborators, docProps);
    }

    public static LeosDocument buildXmlDocument(DocumentVRepository documentVRepository, DocumentContentRepository documentContentRepository,
                                               CollaboratorsService collaboratorsService, DocumentPropertyValuesRepository documentPropertyValuesRepository,
                                               BigDecimal docId) {
        Optional<DocumentV> docV = documentVRepository.findLastVersionByDocumentId(docId);
        return docV.isPresent() ? buildXmlDocument(documentPropertyValuesRepository, collaboratorsService, documentContentRepository,
                docV.get(), true) : null;
    }

    public static List<LeosDocument> buildXmlDocument(DocumentPropertyValuesRepository documentPropertyValuesRepository,
                                                CollaboratorsService collaboratorsService, DocumentContentRepository documentContentRepository,
                                                List<DocumentV> docs, boolean fetchContent) {
        List<LeosDocument> convertedDocs = new ArrayList<>();
        for (DocumentV doc : docs) {
            List<DocumentPropertyValues> docProps = getDocumentProperties(documentPropertyValuesRepository, doc.getVersionId(), doc.getDocumentId());
            List<Collaborator> collaborators = collaboratorsService.getCollaborators(doc.getPackageId());
            Optional<DocumentContent> content = Optional.empty();
            if (fetchContent) {
                content = documentContentRepository.findDocumentContentByVersionId(doc.getVersionId());
            }
            convertedDocs.add(content.isPresent() ? new LeosDocument(doc, content.get(), collaborators, docProps) : new LeosDocument(doc, collaborators, docProps));
        }
        return convertedDocs;
    }

    public static LeosDocument buildXmlDocument(DocumentPropertyValuesRepository documentPropertyValuesRepository,
                                                CollaboratorsService collaboratorsService, DocumentContentRepository documentContentRepository,
                                                DocumentV doc, boolean fetchContent) {
        if (doc != null) {
            List<DocumentPropertyValues> docProps = getDocumentProperties(documentPropertyValuesRepository, doc.getVersionId(), doc.getDocumentId());
            List<Collaborator> collaborators = collaboratorsService.getCollaborators(doc.getPackageId());
            Optional<DocumentContent> content = Optional.empty();
            if (fetchContent) {
                content = documentContentRepository.findDocumentContentByVersionId(doc.getVersionId());
            }
            return content.isPresent() ? new LeosDocument(doc, content.get(), collaborators, docProps) : new LeosDocument(doc, collaborators, docProps);
        } else {
            return null;
        }
    }

    public static LeosDocument buildLegDocument(DocumentMilestone docMilestone,
                                                DocumentMilestoneListRepository documentMilestoneListRepository) {
        return new LeosDocument(docMilestone, documentMilestoneListRepository);
    }

    public static LeosDocument buildLegDocument(MilestoneV milestoneV,
                                                DocumentMilestoneListRepository documentMilestoneListRepository,
                                                DocumentCategoriesRepository documentCategoriesRepository) {
        Optional<DocumentCategories> category = documentCategoriesRepository.findById(milestoneV.getCategoryId());
        return new LeosDocument(milestoneV, category.get().getCategoryCode(), documentMilestoneListRepository);
    }

    public static LeosDocument buildConfigDocument(Config config,
                                                   ConfigContent configContent) {
        return new LeosDocument(config, configContent);
    }

    public static Package buildPackage(eu.europa.ec.leos.repository.entities.Package pkg,
                                              CollaboratorsService collaboratorsService) {
        if (pkg != null) {
            List<Collaborator> collaborators = collaboratorsService.getCollaborators(pkg.getId());
            Package pkgFound = new Package(pkg);
            pkgFound.setCollaborators(collaborators);
            return pkgFound;
        } else {
            return null;
        }
    }

    public static LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
