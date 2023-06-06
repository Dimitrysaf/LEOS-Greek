package eu.europa.ec.leos.repository.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.repository.entities.DocumentPropertiesV;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.model.Collaborator;
import eu.europa.ec.leos.repository.model.XmlDocument;
import eu.europa.ec.leos.repository.repositories.DocumentPropertiesVRepository;
import eu.europa.ec.leos.repository.repositories.DocumentVRepository;
import eu.europa.ec.leos.repository.services.CollaboratorsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
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

    public static String getLeosCollaboratorsAsString(List<Collaborator> collaborators) {
        ObjectMapper mapper = new ObjectMapper();
        String collaboratorsAsStr = null;
        if (collaborators != null) {
            try {
                collaboratorsAsStr = mapper.writeValueAsString(collaborators);
            } catch (JsonProcessingException e) {
                LOG.debug("Exception occured while converting collaborators to string : " + e.getMessage());
            }
        }
        return collaboratorsAsStr;
    }

    public static List<Collaborator> getLeosCollaboratorsFromString(String collaboratorsStr) {
        ObjectMapper mapper = new ObjectMapper();
        List<Collaborator> collaborators = null;
        if (collaboratorsStr != null) {
            try {
                collaborators = mapper.readValue(collaboratorsStr, new TypeReference<List<Collaborator>>(){});
            } catch (JsonProcessingException e) {
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

    public static XmlDocument buildXmlDocument(DocumentVRepository documentVRepository,
                                               CollaboratorsService collaboratorsService, DocumentPropertiesVRepository documentPropertiesVRepository,
                                               BigDecimal docId) {
        Optional<DocumentV> docV = documentVRepository.findLastVersionByDocumentId(docId);
        return docV.isPresent() ? buildXmlDocument(documentPropertiesVRepository, collaboratorsService,
                docV.get()) : null;
    }

    public static XmlDocument buildXmlDocument(DocumentPropertiesVRepository documentPropertiesVRepository, CollaboratorsService collaboratorsService,
                                               DocumentV doc) {
        if (doc != null) {
            List<DocumentPropertiesV> docProps = documentPropertiesVRepository.findDocumentPropertiesVById(doc.getDocumentId());
            List<Collaborator> collaborators = collaboratorsService.getCollaborators(doc.getPackageId());
            return new XmlDocument(doc, collaborators, docProps);
        } else {
            return null;
        }
    }

}
