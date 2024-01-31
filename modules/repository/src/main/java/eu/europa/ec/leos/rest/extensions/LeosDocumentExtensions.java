/*
 * Copyright 2018 European Commission
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
package eu.europa.ec.leos.rest.extensions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.domain.repository.Content;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosExportStatus;
import eu.europa.ec.leos.domain.repository.LeosLegStatus;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Bill;
import eu.europa.ec.leos.domain.repository.document.ConfigDocument;
import eu.europa.ec.leos.domain.repository.document.Explanatory;
import eu.europa.ec.leos.domain.repository.document.ExportDocument;
import eu.europa.ec.leos.domain.repository.document.FinancialStatement;
import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.repository.document.LeosDocument;
import eu.europa.ec.leos.domain.repository.document.MediaDocument;
import eu.europa.ec.leos.domain.repository.document.Memorandum;
import eu.europa.ec.leos.domain.repository.document.Profile;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.Structure;
import eu.europa.ec.leos.domain.repository.metadata.ProfileMetaData;
import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.repository.domain.ContentImpl;
import eu.europa.ec.leos.repository.domain.SourceImpl;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.mapping.RestProperties;
import io.atlassian.fugue.Option;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Objects;

public class LeosDocumentExtensions {

    private static final Logger logger = LoggerFactory.getLogger(LeosDocumentExtensions.class);

    private static RepositoryPropertiesMapper repositoryPropertiesMapper = new RestProperties();

    @SuppressWarnings("unchecked")
    public static <T extends LeosDocument> T toLeosDocument(eu.europa.ec.leos.rest.support.model.LeosDocument document, Class<? extends T> type, boolean fetchContent) {

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
                    leosDocument = (T) toCouncilExplanatory(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Explanatory.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case MEMORANDUM:
                if (type.isAssignableFrom(Memorandum.class)) {
                    leosDocument = (T) toLeosMemorandum(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Memorandum.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case BILL:
                if (type.isAssignableFrom(Bill.class)) {
                    leosDocument = (T) toLeosBill(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Bill.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case ANNEX:
                if (type.isAssignableFrom(Annex.class)) {
                    leosDocument = (T) toLeosAnnex(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + Annex.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            case STAT_FINANC_LEGIS:
                if (type.isAssignableFrom(FinancialStatement.class)) {
                    leosDocument = (T) toFinancialStatement(document, fetchContent);
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
            case LIGHT_PROFILE:
                if (type.isAssignableFrom(Profile.class)) {
                    leosDocument = (T) toLeosProfileDocument(document, fetchContent);
                } else {
                    throw new IllegalStateException("Incompatible types! [category=" + category + ", mappedType=" + ExportDocument.class.getSimpleName() + ", wantedType=" + type.getSimpleName() + ']');
                }
                break;
            default:
                throw new IllegalStateException("Unknown category:" + category);
        }

        return leosDocument;
    }

    private static Proposal toLeosProposal(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Proposal(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d),
                getVersionType(d),
                d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                getInitialCreatedBy(d),
                getInitialCreationInstant(d),
                contentOption(d, fetchContent),
                LeosRepositoryMetadataExtensions.getProposalMetadataOption(d),
                isClonedProposal(d),
                getOriginRef(d),
                getClonedFrom(d),
                getRevisionStatus(d),
                getClonedMilestoneId(d),
                getContributionStatus(d),
                isTrackChangesEnabled(d));
    }

    private static Explanatory toCouncilExplanatory(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Explanatory(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                getBaseRevisionId(d),
                isLiveDiffingRequired(d),
                LeosRepositoryMetadataExtensions.getExplanatorydataOption(d),
                isTrackChangesEnabled(d));
    }

    private static Memorandum toLeosMemorandum(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Memorandum(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                getContributionStatus(d),
                getClonedFrom(d),
                LeosRepositoryMetadataExtensions.getMemorandumMetadataOption(d),
                isTrackChangesEnabled(d));
    }

    private static Bill toLeosBill(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Bill(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                getBaseRevisionId(d),
                getContributionStatus(d),
                getClonedFrom(d),
                contentOption(d, fetchContent),
                LeosRepositoryMetadataExtensions.getBillMetadataOption(d),
                isTrackChangesEnabled(d));
    }

    private static Annex toLeosAnnex(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Annex(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                getBaseRevisionId(d),
                isLiveDiffingRequired(d),
                getContributionStatus(d),
                getClonedFrom(d),
                contentOption(d, fetchContent),
                LeosRepositoryMetadataExtensions.getAnnexMetadataOption(d),
                isTrackChangesEnabled(d));
    }

    private static FinancialStatement toFinancialStatement(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new FinancialStatement(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getTitle(d),
                getCollaborators(d),
                getMilestoneComments(d),
                contentOption(d, fetchContent),
                LeosRepositoryMetadataExtensions.getFinancialstatementdataOption(d),
                getBaseRevisionId(d),
                isTrackChangesEnabled(d),
                getContributionStatus(d),
                getClonedFrom(d));
    }

    private static MediaDocument toLeosMediaDocument(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new MediaDocument(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent));
    }

    private static ConfigDocument toLeosConfigDocument(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new ConfigDocument(d.getRef(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getRef(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent));
    }

    private static Structure toLeosStructureDocument(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Structure(d.getRef(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getRef(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent),
                LeosRepositoryMetadataExtensions.getStructureMetadataOption(d));
    }

    private static Profile toLeosProfileDocument(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new Profile(d.getRef(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getRef(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                contentOption(d, fetchContent),
                LeosRepositoryMetadataExtensions.getProfileMetaDataOption(d));
    }

    private static LegDocument toLeosLegDocument(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new LegDocument(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getMilestoneCommentsForLegDocument(d),
                contentOption(d, fetchContent),
                getInitialCreatedBy(d),
                getInitialCreationInstant(d),
                getJobId(d),
                getJobDate(d),
                getStatus(d),
                getContainedDocuments(d),
                d.getRef());
    }

    private static ExportDocument toLeosExportDocument(eu.europa.ec.leos.rest.support.model.LeosDocument d, boolean fetchContent) {
        return new ExportDocument(d.getVersionId(), d.getName(), d.getCreatedBy(),
                getCreationInstant(d),
                d.getUpdatedBy(),
                getLastModificationInstant(d),
                Integer.toString(Objects.hash(d.getVersionId(), d.getVersionLabel(), d.getUpdatedBy())), d.getVersionLabel(), getLeosVersionLabel(d), getComments(d), getVersionType(d), d.isLatestVersion(),
                getInitialCreatedBy(d),
                getInitialCreationInstant(d),
                contentOption(d, fetchContent),
                getExportStatus(d),
                getMilestoneCommentsForLegDocument(d),
                d.getRef());
    }

    private static LeosCategory getCategory(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String leosCategory = document.getCategory();
        leosCategory = (leosCategory.startsWith("TEMPLATE_")) ? leosCategory.substring("TEMPLATE_".length()) : leosCategory;
        return LeosCategory.valueOf(leosCategory);
    }

    static Instant getCreationInstant(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        GregorianCalendar creationDate = new GregorianCalendar();
        creationDate.setTime(document.getCreatedOn());
        return creationDate != null ? creationDate.toInstant() : Instant.MIN;
    }

    static Instant getLastModificationInstant(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        GregorianCalendar lastModificationDate = new GregorianCalendar();
        lastModificationDate.setTime(document.getUpdatedOn());
        return lastModificationDate != null ? lastModificationDate.toInstant() : Instant.MIN;
    }

    private static Option<Content> contentOption(eu.europa.ec.leos.rest.support.model.LeosDocument document, boolean fetchContent) {
        Content content = null;
        if (fetchContent) {
            content = new ContentImpl(document.getName(), null,
                    document.getSource().length, new SourceImpl(document.getSource()));
        }

        return Option.option(content);
    }

    static List<Collaborator> getCollaborators(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        if (document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS)) != null) {
            ObjectMapper mapper = new ObjectMapper();
            List<Collaborator> collaborators =
                    mapper.convertValue(document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.COLLABORATORS)), new TypeReference<List<Collaborator>>() { });
            return collaborators;
        } else {
            return Arrays.asList();
        }
    }

    // FIXME maybe move title property to metadata or remove it entirely
    private static String getTitle(eu.europa.ec.leos.rest.support.model.LeosDocument document) { // FIXME add check for leos:xml primary type
        return (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE));
    }

    private static List<String> getMilestoneComments(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        Object milestoneComments = document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.MILESTONE_COMMENTS));
        try {
            if (milestoneComments instanceof List) {
                return (List<String>) milestoneComments;
            } else {
                return new ArrayList<String>() {
                    {
                        add(milestoneComments.toString());
                    }
                };
            }
        } catch (Exception e) {
            return new ArrayList<String>();
        }
    }

    private static String getJobId(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        return (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_ID));
    }

    private static Instant getJobDate(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        try {
            GregorianCalendar jobDate = new GregorianCalendar();
            jobDate.setTime(new Date((Long) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.JOB_DATE))));
            return jobDate.toInstant();
        } catch (Exception e) {
            return null;
        }
    }

    private static LeosLegStatus getStatus(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        if (document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS)) != null) {
            return LeosLegStatus.valueOf((String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS)));
        } else {
            return null;
        }
    }

    private static LeosExportStatus getExportStatus(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        if (document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS)) != null) {
            return LeosExportStatus.valueOf((String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.STATUS)));
        } else {
            return null;
        }
    }

    static String getInitialCreatedBy(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String initialCreatedBy = document.getCreatedBy();
        return initialCreatedBy != null ? initialCreatedBy : document.getCreatedBy();
    }

    static Instant getInitialCreationInstant(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        GregorianCalendar initialCreationDate = new GregorianCalendar();
        initialCreationDate.setTime(document.getCreatedOn());
        return initialCreationDate != null ? initialCreationDate.toInstant() : getCreationInstant(document);
    }

    public static String getLeosVersionLabel(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        return document.getVersionLabel();
    }

    private static VersionType getVersionType(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        return document.getVersionType();
    }

    private static List<String> getContainedDocuments(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        if (document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS)) != null) {
            List<String> containedDocuments = (List<String>) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.CONTAINED_DOCUMENTS));
            return containedDocuments;
        } else {
            return Arrays.asList();
        }
    }

    private static boolean isClonedProposal(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        try {
            Boolean isClonedProposal =
                    Boolean.parseBoolean((String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_PROPOSAL)));
            return isClonedProposal;
        } catch (Exception e) {
            return false;
        }
    }

    private static String getOriginRef(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String originRef = (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ORIGIN_REF));
        return originRef != null ? originRef : "";
    }

    private static String getClonedFrom(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String clonedFrom = (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_FROM));
        return clonedFrom != null ? clonedFrom : "";
    }

    private static String getRevisionStatus(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String revisionStatus = (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.REVISION_STATUS));
        return revisionStatus != null ? revisionStatus : "";
    }

    private static String getContributionStatus(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        String contributionStatus = (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.CONTRIBUTION_STATUS));
        return contributionStatus != null ? contributionStatus : "";
    }

    private static String getComments(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        return document.getComments();
    }

    private static List<String> getMilestoneCommentsForLegDocument(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        return Arrays.asList(document.getComments());
    }

    private static List<String> getClonedMilestoneId(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        Object clonedMilestoneIds = document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.CLONED_MILESTONE_ID));
        try {
            if (clonedMilestoneIds instanceof List) {
                return (List<String>) clonedMilestoneIds;
            } else {
                return new ArrayList<String>() {
                    {
                        add(clonedMilestoneIds.toString());
                    }
                };
            }
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private static String getBaseRevisionId(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        return (String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.BASE_REVISION_ID));
    }
    
    private static boolean isLiveDiffingRequired(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
    	Boolean liveDiffingRequired = (Boolean) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.LIVE_DIFFING_REQUIRED));
    	return liveDiffingRequired != null ? liveDiffingRequired : false;
    }

    private static boolean isTrackChangesEnabled(eu.europa.ec.leos.rest.support.model.LeosDocument document) {
        try {
            Boolean trackChangesEnabled =
                    Boolean.parseBoolean((String) document.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.TRACK_CHANGES_ENABLED)));
            return trackChangesEnabled;
        } catch (Exception e) {
            return false;
        }
    }
}
