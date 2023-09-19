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
package eu.europa.ec.leos.repository.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import eu.europa.ec.leos.repository.entities.DocumentContent;
import eu.europa.ec.leos.repository.entities.DocumentVersion;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneRepository;
import eu.europa.ec.leos.repository.utils.PropertiesMetadata;
import eu.europa.ec.leos.repository.common.VersionType;
import eu.europa.ec.leos.repository.entities.Config;
import eu.europa.ec.leos.repository.entities.ConfigContent;
import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.DocumentMilestone;
import eu.europa.ec.leos.repository.entities.DocumentMilestoneList;
import eu.europa.ec.leos.repository.entities.DocumentPropertyValues;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.entities.MilestoneV;
import eu.europa.ec.leos.repository.repositories.DocumentMilestoneListRepository;
import eu.europa.ec.leos.repository.utils.DateDesSerializer;
import eu.europa.ec.leos.repository.utils.DateSerializer;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LeosDocument {
    private static final Logger LOG = LoggerFactory.getLogger(LeosDocument.class);

    private String name;
    private String createdBy;
    private Date createdOn;
    private String updatedBy;
    private Date updatedOn;
    private byte[] source;

    private VersionType versionType;
    private Boolean isLatestVersion = false;
    private String versionLabel;
    private String comments;

    private String ref;
    private String versionId;

    private String packageId;

    private String category;

    private Map<String, Object> metadata = new HashMap<>();

    public LeosDocument() {}

    public LeosDocument(DocumentV doc, List<Collaborator> collaborators, List<DocumentPropertyValues> otherMetadata) {
        Validate.notNull(doc, "Document must not be null");
        this.name = doc.getName();
        this.createdBy = doc.getCreatedBy();
        this.createdOn = Date.from(doc.getCreatedOn().atZone(ZoneId.systemDefault()).toInstant());
        this.updatedBy = doc.getUpdatedBy();
        this.updatedOn = doc.getUpdatedOn() != null ? Date.from(doc.getUpdatedOn().atZone(ZoneId.systemDefault()).toInstant()) : null;
        this.setRef(doc.getRef());
        this.setVersionId(doc.getVersionId().toString());

        this.isLatestVersion = doc.isLatestVersion();
        this.versionLabel = doc.getVersionLabel();
        this.versionType = VersionType.fromValue(Integer.parseInt(doc.getVersionType()));
        this.comments = doc.getComments();

        this.packageId = doc.getPackageId().toString();

        this.setCategory(doc.getCategoryCode());

        this.metadata.put("documentType", doc.getCategoryCode());

        XmlDocumentMetadata xmlDocumentMetadata = new XmlDocumentMetadata(doc, collaborators);
        this.metadata.putAll(xmlDocumentMetadata.generateMetadataMap(otherMetadata));
    }

    public LeosDocument(DocumentV doc, DocumentContent content, List<Collaborator> collaborators, List<DocumentPropertyValues> otherMetadata) {
        Validate.notNull(doc, "Document must not be null");
        this.name = doc.getName();
        this.createdBy = doc.getCreatedBy();
        this.createdOn = Date.from(doc.getCreatedOn().atZone(ZoneId.systemDefault()).toInstant());
        this.updatedBy = doc.getUpdatedBy();
        this.updatedOn = doc.getUpdatedOn() != null ? Date.from(doc.getUpdatedOn().atZone(ZoneId.systemDefault()).toInstant()) : null;
        this.source = content.getContent().getBytes(StandardCharsets.UTF_8);
        this.setRef(doc.getRef());
        this.setVersionId(doc.getVersionId().toString());

        this.isLatestVersion = doc.isLatestVersion();
        this.versionLabel = doc.getVersionLabel();
        this.versionType = VersionType.fromValue(Integer.parseInt(doc.getVersionType()));
        this.comments = doc.getComments();

        this.packageId = doc.getPackageId().toString();

        this.setCategory(doc.getCategoryCode());

        this.metadata.put("documentType", doc.getDocType());

        XmlDocumentMetadata xmlDocumentMetadata = new XmlDocumentMetadata(doc, collaborators);
        this.metadata.putAll(xmlDocumentMetadata.generateMetadataMap(otherMetadata));
    }

    public LeosDocument(Document doc, DocumentVersion docVersion, DocumentContent docContent, List<Collaborator> collaborators,
                        List<DocumentPropertyValues> otherMetadata) {
        Validate.notNull(doc, "Document must not be null");
        Validate.notNull(docVersion, "Document Version must not be null");
        Validate.notNull(docContent, "Document Content must not be null");
        this.name = doc.getName();
        this.createdBy = doc.getAuditCBy();
        this.createdOn = Date.from(doc.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant());
        this.updatedBy = docVersion.getAuditLastMBy();
        this.updatedOn = docVersion.getAuditLastMDate() != null ? Date.from(docVersion.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) :
                null;
        this.source = docContent.getContent().getBytes(StandardCharsets.UTF_8);
        this.setRef(doc.getRef());
        this.setVersionId(docVersion.getId().toString());

        this.isLatestVersion = docVersion.isLatestVersion();
        this.versionLabel = docVersion.getVersionLabel();
        this.versionType = VersionType.fromValue(Integer.parseInt(docVersion.getVersionType()));
        this.comments = docVersion.getComments();

        this.packageId = doc.getPackageId().toString();

        this.setCategory(doc.getCategoryId().getCategoryCode());

        this.metadata.put("documentType", docContent.getDocType());

        XmlDocumentMetadata xmlDocumentMetadata = new XmlDocumentMetadata(doc, docContent, collaborators);
        this.metadata.putAll(xmlDocumentMetadata.generateMetadataMap(otherMetadata));
    }

    public LeosDocument(Config doc, ConfigContent configContent) {
        if (doc != null) {
            this.setVersionId(configContent.getVersionId().getId().toString());
            this.setCreatedBy(doc.getAuditCBy());
            this.setCreatedOn(Date.from(doc.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant()));
            this.setUpdatedBy(configContent.getVersionId().getAuditLastMBy());
            this.setUpdatedOn(configContent.getVersionId().getAuditLastMDate() != null ? Date.from(configContent.getVersionId().getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
            this.setSource(configContent.getContent());
            this.isLatestVersion = configContent.getVersionId().getIsLatestVersion();
            this.versionType = configContent.getVersionId().getVersionType() != null ? VersionType.fromValue(Integer.parseInt(configContent.getVersionId().getVersionType())) : null;
            this.name = doc.getName();
            this.ref = doc.getName();
            this.category = doc.getConfigCategory().getCategoryCode();

            this.metadata.put("language", doc.getLanguage());

            this.setVersionLabel(configContent.getVersionId().getVersionLabel());
        }
    }

    public LeosDocument(MilestoneV documentMilestoneV,
                        DocumentMilestoneListRepository documentMilestoneListRepository) {
        if (documentMilestoneV != null) {
            this.setName(documentMilestoneV.getName());
            this.setCreatedBy(documentMilestoneV.getAuditCBy());
            this.setCreatedOn(Date.from(documentMilestoneV.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant()));
            this.setUpdatedBy(documentMilestoneV.getAuditLastMBy());
            this.setUpdatedOn(documentMilestoneV.getAuditLastMDate() != null ?
                    Date.from(documentMilestoneV.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
            this.setRef(documentMilestoneV.getRef());
            this.setVersionId(documentMilestoneV.getMilestoneId().toString());
            this.setPackageId(documentMilestoneV.getPackageId().toString());
            this.setCategory(documentMilestoneV.getCategoryCode());

            this.setLatestVersion(true);

            this.metadata.put("status", documentMilestoneV.getStatus());
            this.metadata.put("jobId", documentMilestoneV.getJobId() != null ? documentMilestoneV.getJobId() : null);
            this.metadata.put("jobDate", documentMilestoneV.getJobDate() != null ?
                    Date.from(documentMilestoneV.getJobDate().atZone(ZoneId.systemDefault()).toInstant()) : null);

            List<String> milestoneComments = Arrays.asList(documentMilestoneV.getMilestoneComments());
            this.metadata.put("milestoneComments", milestoneComments);
            this.metadata.put("comments", milestoneComments);
            this.setComments(documentMilestoneV.getMilestoneComments());

            List<String> containedDocuments = new ArrayList<>();
            List<DocumentMilestoneList> milestonesDocuments =
                    documentMilestoneListRepository.findDocumentMilestoneListsByMilestoneId(documentMilestoneV.getMilestoneId());
            for (DocumentMilestoneList milestone : milestonesDocuments) {
                containedDocuments.add(milestone.getContainedDocuments());
            }
            this.metadata.put("containedDocuments", containedDocuments);
        }
    }

    public LeosDocument(MilestoneV documentMilestoneV, DocumentMilestone content,
                        DocumentMilestoneListRepository documentMilestoneListRepository) {
        if (documentMilestoneV != null) {
            this.setName(documentMilestoneV.getName());
            this.setCreatedBy(documentMilestoneV.getAuditCBy());
            this.setCreatedOn(Date.from(documentMilestoneV.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant()));
            this.setUpdatedBy(documentMilestoneV.getAuditLastMBy());
            this.setUpdatedOn(documentMilestoneV.getAuditLastMDate() != null ?
                    Date.from(documentMilestoneV.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
            this.setSource(content.getContent());
            this.setRef(documentMilestoneV.getRef());
            this.setVersionId(documentMilestoneV.getMilestoneId().toString());
            this.setPackageId(documentMilestoneV.getPackageId().toString());
            this.setCategory(documentMilestoneV.getCategoryCode());

            this.setLatestVersion(true);

            this.metadata.put("status", documentMilestoneV.getStatus());
            this.metadata.put("jobId", documentMilestoneV.getJobId() != null ? documentMilestoneV.getJobId() : null);
            this.metadata.put("jobDate", documentMilestoneV.getJobDate() != null ?
                    Date.from(documentMilestoneV.getJobDate().atZone(ZoneId.systemDefault()).toInstant()) : null);

            List<String> milestoneComments = Arrays.asList(documentMilestoneV.getMilestoneComments());
            this.metadata.put("milestoneComments", milestoneComments);
            this.metadata.put("comments", milestoneComments);
            this.setComments(documentMilestoneV.getMilestoneComments());

            List<String> containedDocuments = new ArrayList<>();
            List<DocumentMilestoneList> milestonesDocuments =
                    documentMilestoneListRepository.findDocumentMilestoneListsByMilestoneId(documentMilestoneV.getMilestoneId());
            for (DocumentMilestoneList milestone : milestonesDocuments) {
                containedDocuments.add(milestone.getContainedDocuments());
            }
            this.metadata.put("containedDocuments", containedDocuments);
        }
    }

    public LeosDocument(DocumentMilestone milestone,
                        DocumentMilestoneListRepository documentMilestoneListRepository) {
        if (milestone != null) {
            Document document = milestone.getDocument();
            this.setName(document.getName());
            this.setCreatedBy(document.getAuditCBy());
            this.setCreatedOn(Date.from(document.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant()));
            this.setUpdatedBy(milestone.getAuditLastMBy());
            this.setUpdatedOn(milestone.getAuditLastMDate() != null ?
                    Date.from(milestone.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
            this.setSource(milestone.getContent());
            this.setRef(document.getRef());
            this.setVersionId(milestone.getId().toString());
            this.setPackageId(document.getPackageId().getId().toString());
            this.setCategory(document.getCategoryId().getCategoryCode());

            this.setLatestVersion(true);

            this.metadata.put("status", milestone.getStatus());
            this.metadata.put("jobId", milestone.getJobId() != null ? milestone.getJobId() : null);
            this.metadata.put("jobDate", milestone.getJobDate() != null ?
                    Date.from(milestone.getJobDate().atZone(ZoneId.systemDefault()).toInstant()) : null);

            List<String> milestoneComments = Arrays.asList(milestone.getMilestoneComments());
            this.metadata.put("milestoneComments", milestoneComments);
            this.setComments(milestone.getMilestoneComments());

            List<String> containedDocuments = new ArrayList<>();
            List<DocumentMilestoneList> milestonesDocuments =
                    documentMilestoneListRepository.findDocumentMilestoneListsByMilestoneId(milestone.getId());
            for (DocumentMilestoneList milestoneList : milestonesDocuments) {
                containedDocuments.add(milestoneList.getContainedDocuments());
            }
            this.metadata.put("containedDocuments", containedDocuments);
        }
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDesSerializer.class)
    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDesSerializer.class)
    public Date getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = updatedOn;
    }

    public byte[] getSource() {
        return source;
    }

    public void setSource(byte[] source) {
        this.source = source;
    }

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    public VersionType getVersionType() {
        return versionType;
    }

    public void setVersionType(VersionType versionType) {
        this.versionType = versionType;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Boolean isLatestVersion() {
        return isLatestVersion;
    }

    public void setLatestVersion(Boolean latestVersion) {
        isLatestVersion = latestVersion;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getVersionId() {
        return versionId;
    }

    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LeosDocument that = (LeosDocument) o;

        if (!getName().equals(that.getName())) return false;
        if (getCreatedBy() != null ? !getCreatedBy().equals(that.getCreatedBy()) : that.getCreatedBy() != null) return false;
        if (getCreatedOn() != null ? !getCreatedOn().equals(that.getCreatedOn()) : that.getCreatedOn() != null) return false;
        if (getUpdatedBy() != null ? !getUpdatedBy().equals(that.getUpdatedBy()) : that.getUpdatedBy() != null) return false;
        if (getUpdatedOn() != null ? !getUpdatedOn().equals(that.getUpdatedOn()) : that.getUpdatedOn() != null) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = getName().hashCode();
        result = 31 * result + (getCreatedBy() != null ? getCreatedBy().hashCode() : 0);
        result = 31 * result + (getCreatedOn() != null ? getCreatedOn().hashCode() : 0);
        result = 31 * result + (getUpdatedBy() != null ? getUpdatedBy().hashCode() : 0);
        result = 31 * result + (getUpdatedOn() != null ? getUpdatedOn().hashCode() : 0);
        return result;
    }

    protected void clean() {
        this.setName(null);
        this.setSource(null);
        this.setCreatedBy(null);
        this.setCreatedOn(null);
        this.setUpdatedBy(null);
        this.setUpdatedOn(null);
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
