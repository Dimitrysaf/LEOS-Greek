/*
 * Copyright 2024 European Union
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
package eu.europa.ec.leos.cmis.extensions;

import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.cmis.mapping.CmisProperties;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.*;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import io.atlassian.fugue.Option;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigInteger;
import java.time.Instant;
import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.UnknownFormatConversionException;

import static eu.europa.ec.leos.cmis.extensions.CmisMetadataExtensions.*;

public class CmisDocumentExtensions {

    private static final Logger logger = LoggerFactory.getLogger(CmisDocumentExtensions.class);

    private static RepositoryPropertiesMapper repositoryPropertiesMapper = new CmisProperties();
    
    @SuppressWarnings("unchecked")
    public static <T extends LeosDocument> T toLeosDocument(Document document, Class<? extends T> type, boolean fetchContent, Map<String, String> oldVersions) {

        T leosDocument;
        LeosCategory category = getCategory(document);
        switch (category) {
            case PROPOSAL:
                if (type.isAssignableFrom(Proposal.class)) {
                    leosDocument = (T) toLeosProposal(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Proposal.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case COUNCIL_EXPLANATORY:
                if (type.isAssignableFrom(Explanatory.class)) {
                    leosDocument = (T) toCouncilExplanatory(document, fetchContent, oldVersions);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Explanatory.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case MEMORANDUM:
                if (type.isAssignableFrom(Memorandum.class)) {
                    leosDocument = (T) toLeosMemorandum(document, fetchContent, oldVersions);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Memorandum.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case BILL:
                if (type.isAssignableFrom(Bill.class)) {
                    leosDocument = (T) toLeosBill(document, fetchContent, oldVersions);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Bill.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case ANNEX:
                if (type.isAssignableFrom(Annex.class)) {
                    leosDocument = (T) toLeosAnnex(document, fetchContent, oldVersions);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Annex.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case STAT_FINANC_LEGIS:
                if (type.isAssignableFrom(FinancialStatement.class)) {
                    leosDocument = (T) toFinancialStatement(document, fetchContent, oldVersions);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + FinancialStatement.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case MEDIA:
                if (type.isAssignableFrom(MediaDocument.class)) {
                    leosDocument = (T) toLeosMediaDocument(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + MediaDocument.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case CONFIG:
                if (type.isAssignableFrom(ConfigDocument.class)) {
                    leosDocument = (T) toLeosConfigDocument(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + ConfigDocument.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case LEG:
                if (type.isAssignableFrom(LegDocument.class)) {
                    leosDocument = (T) toLeosLegDocument(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + LegDocument.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case STRUCTURE:
                if (type.isAssignableFrom(Structure.class)) {
                    leosDocument = (T) toLeosStructureDocument(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Structure.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case EXPORT:
                if (type.isAssignableFrom(ExportDocument.class)) {
                    leosDocument = (T) toLeosExportDocument(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + ExportDocument.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            default:
                throw new IllegalStateException("Unknown category:" + category);
        }

        return leosDocument;
    }

    private static Proposal toLeosProposal(Document d, boolean fetchContent) {
        return new Proposal(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                getInitialCreatedBy(d),
                getInitialCreationInstant(d),
                contentOption(d, fetchContent),
                getProposalMetadataOption(d),
                isClonedProposal(d),
                getOriginRef(d),
                getClonedFrom(d),
                getRevisionStatus(d),
                getClonedMilestoneId(d),
                getContributionStatus(d),
                isTrackChangesEnabled(d));
    }

    private static Explanatory toCouncilExplanatory(Document d, boolean fetchContent, Map<String, String> oldVersions) {
        return new Explanatory(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d, oldVersions), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                getBaseRevisionId(d),
                isLiveDiffingRequired(d),
                getExplanatorydataOption(d),
                isTrackChangesEnabled(d));
    }

    private static Memorandum toLeosMemorandum(Document d, boolean fetchContent, Map<String, String> oldVersions) {
        return new Memorandum(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d, oldVersions), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                getContributionStatus(d),
                getClonedFrom(d),
                getMemorandumMetadataOption(d),
                isTrackChangesEnabled(d));
    }

    private static Bill toLeosBill(Document d, boolean fetchContent, Map<String, String> oldVersions) {
        return new Bill(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d, oldVersions), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                getBaseRevisionId(d),
                getContributionStatus(d),
                getClonedFrom(d),
                contentOption(d, fetchContent),
                getBillMetadataOption(d),
                isTrackChangesEnabled(d));
    }

    private static Annex toLeosAnnex(Document d, boolean fetchContent, Map<String, String> oldVersions) {
        return new Annex(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d, oldVersions), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                getBaseRevisionId(d),
                isLiveDiffingRequired(d),
                getContributionStatus(d),
                getClonedFrom(d),
                contentOption(d, fetchContent),
                getAnnexMetadataOption(d),
                isTrackChangesEnabled(d));
    }

    private static FinancialStatement toFinancialStatement(Document d, boolean fetchContent, Map<String, String> oldVersions) {
        return new FinancialStatement(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d, oldVersions), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                getFinancialstatementdataOption(d),
                getBaseRevisionId(d),
                isTrackChangesEnabled(d),
                getContributionStatus(d),
                getClonedFrom(d));
    }

    private static MediaDocument toLeosMediaDocument(Document d, boolean fetchContent) {
        return new MediaDocument(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent));
    }

    private static ConfigDocument toLeosConfigDocument(Document d, boolean fetchContent) {
        return new ConfigDocument(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent));
    }

    private static Structure toLeosStructureDocument(Document d, boolean fetchContent) {
        return new Structure(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent),
                getStructureMetadataOption(d));
    }

    private static LegDocument toLeosLegDocument(Document d, boolean fetchContent) {
        return new LegDocument(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                getInitialCreatedBy(d),
                getInitialCreationInstant(d),
                getJobId(d),
                getJobDate(d),
                getStatus(d),
                getContainedDocuments(d),
                null);
    }

    private static ExportDocument toLeosExportDocument(Document d, boolean fetchContent) {
        return new ExportDocument(d.getId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getLastModifiedBy(),
                getLastModificationInstant(d),
                d.getVersionSeriesId(), d.getVersionLabel(), getLeosVersionLabel(d), d.getCheckinComment(), getVersionType(d), d.isLatestVersion(),
                getInitialCreatedBy(d),
                getInitialCreationInstant(d),
                contentOption(d, fetchContent),
                getExportStatus(d),
                getComments(d),
                null);
    }

    private static LeosCategory getCategory(Document document) {
        // FIXME add check for leos:document primary type???
        String cmisCategory = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_CATEGORY));
        return LeosCategory.valueOf(cmisCategory);
    }

    static Instant getCreationInstant(Document document) {
        GregorianCalendar creationDate = document.getCreationDate();
        return creationDate != null ? creationDate.toInstant() : Instant.MIN;
    }

    static Instant getLastModificationInstant(Document document) {
        GregorianCalendar lastModificationDate = document.getLastModificationDate();
        return lastModificationDate != null ? lastModificationDate.toInstant() : Instant.MIN;
    }

    private static Option<Content> contentOption(Document document, boolean fetchContent) {
        Content content = null;
        if (fetchContent) {
            ContentStream contentStream = document.getContentStream();
            if (contentStream != null) {
                content = new ContentImpl(contentStream.getFileName(), contentStream.getMimeType(),
                        contentStream.getLength(), new SourceImpl(contentStream.getStream()));
            }
        }

        return Option.option(content);
    }

    static List<Collaborator> getCollaborators(Document document) {

        Property<String> collaboratorsProperty = document.getProperty(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS));
        List<String> collaboratorsPropertyValues = collaboratorsProperty.getValues();

        List<Collaborator> collaborators = new ArrayList<>();
        collaboratorsPropertyValues.forEach(value -> {
            try {
                String[] values = value.split("::");
                if (values.length == 2) {
                    //legacy proposal. No entity for user stored, pass null and assume default entity
                    collaborators.add(new Collaborator(values[0], values[1], null));
                } else if (values.length == 3) {
                    collaborators.add(new Collaborator(values[0], values[1], values[2]));
                } else {
                    throw new UnknownFormatConversionException("User record is in incorrect format, required format[login::entity::Authority ], present value=" + value);
                }
            } catch (Exception e) {
                logger.error("Failure in processing user record [value=" + value + "], continuing...", e);
            }
        });

        return collaborators;
    }

    // FIXME maybe move title property to metadata or remove it entirely
    private static String getTitle(Document document) { // FIXME add check for leos:xml primary type
        return document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE));
    }

    private static List<String> getMilestoneComments(Document document) {
        Property<String> milestoneComments = document.getProperty(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS));
        return milestoneComments.getValues();
    }

    private static String getJobId(Document document) {
        return document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_ID));
    }

    private static Instant getJobDate(Document document) {
        GregorianCalendar jobDate = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_DATE));
        return jobDate != null ? jobDate.toInstant() : Instant.MIN;
    }

    private static LeosLegStatus getStatus(Document document) {
        return LeosLegStatus.valueOf(document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS)));
    }

    private static LeosExportStatus getExportStatus(Document document) {
        return LeosExportStatus.valueOf(document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS)));
    }

    static String getInitialCreatedBy(Document document) {
        String initialCreatedBy = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATED_BY));
        return initialCreatedBy != null ? initialCreatedBy : document.getCreatedBy();
    }

    static Instant getInitialCreationInstant(Document document) {
        GregorianCalendar initialCreationDate = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.INITIAL_CREATION_DATE));
        return initialCreationDate != null ? initialCreationDate.toInstant() : getCreationInstant(document);
    }

    public static String getLeosVersionLabel(Document document, Map<String, String>  oldVersions) {
        String versionLabel = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_LABEL));
        if (StringUtils.isEmpty(versionLabel)) {
            versionLabel = oldVersions.get(document.getId());
        }
        return versionLabel;
    }

    private static String getLeosVersionLabel(Document document) {
        return document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_LABEL));
    }

    private static VersionType getVersionType(Document document) {
        BigInteger versionType = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.VERSION_TYPE));
        if (versionType != null) {
            return VersionType.fromValue(versionType.intValueExact());
        } else if (!document.isMajorVersion()) { // For compatibility with documents with no populated leos:versionType property
            return VersionType.MINOR;
        } else if ((document.getProperty(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS)) != null) &&
                (!document.getProperty(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS)).getValues().isEmpty())) {
            return VersionType.MAJOR;
        } else {
            return VersionType.INTERMEDIATE;
        }
    }

    private static List<String> getContainedDocuments(Document document) {
        Property<String> containedDocuments = document.getProperty(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS));
        return containedDocuments.getValues();
    }

    private static boolean isClonedProposal(Document document) {
        Boolean clonedProposal = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL));
        return clonedProposal != null ? clonedProposal : false;
    }

    private static String getOriginRef(Document document) {
        String originRef = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF));
        return originRef != null ? originRef : "";
    }

    private static String getClonedFrom(Document document) {
        String clonedFrom = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM));
        return clonedFrom != null ? clonedFrom : "";
    }

    private static String getRevisionStatus(Document document) {
        String revisionStatus = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.REVISION_STATUS));
        return revisionStatus != null ? revisionStatus : "";
    }

    private static String getContributionStatus(Document document) {
        String contributionStatus = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS));
        return contributionStatus != null ? contributionStatus : "";
    }

    private static List<String> getComments(Document document) {
        Property<String> comments = document.getProperty(repositoryPropertiesMapper.getId(RepositoryProperties.COMMENTS));
        return comments.getValues();
    }

    private static List<String> getClonedMilestoneId(Document document) {
        List<String> clonedMilestoneId = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_MILESTONE_ID));
        return clonedMilestoneId != null ? clonedMilestoneId : new ArrayList<>();
    }

    private static String getBaseRevisionId(Document document) {
        return document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.BASE_REVISION_ID));
    }
    
    private static boolean isLiveDiffingRequired(Document document) {
    	Boolean liveDiffingRequired = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.LIVE_DIFFING_REQUIRED));
    	return liveDiffingRequired != null ? liveDiffingRequired : false;
    }

    private static boolean isTrackChangesEnabled(Document document) {
        Boolean trackChangesEnabled = document.getPropertyValue(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED));
        return trackChangesEnabled != null ? trackChangesEnabled : false;
    }
}
