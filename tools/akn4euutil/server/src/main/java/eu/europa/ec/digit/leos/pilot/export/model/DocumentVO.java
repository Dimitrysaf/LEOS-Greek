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
package eu.europa.ec.digit.leos.pilot.export.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DocumentVO {
    private String id;
    private String title;
    private String createdBy;
    private Date createdOn;
    private String updatedBy;
    private Date updatedOn;
    private String language;
    private String template;
    private int docNumber;// optional
    private byte[] source;
    private boolean uploaded;
    private String versionSeriesId;
    private String ref;
    private boolean trackChangesEnabled;
    private String proposalRef;

    private LeosCategory documentType;
    private String procedureType;
    private String actType;
    private List<DocumentVO> childDocuments = new ArrayList<>();
    private List<Collaborator> collaborators = new ArrayList<>();
    private MetadataVO metadata = new MetadataVO();
    private String name;
    private List<DocumentVO> translatedProposals;

    private Boolean favourite;
    private String creationOptions;

    public DocumentVO(LeosCategory documentType) {
        this.documentType = documentType;
    }

    public DocumentVO(String documentId, String language, LeosCategory docType, String updatedBy, Date updatedOn, boolean trackChangesEnabled) {
        this.id = documentId;
        this.language = language;
        this.documentType = docType;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
        this.trackChangesEnabled = trackChangesEnabled;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

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

    public Date getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = updatedOn;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public LeosCategory getDocumentType() {
        return documentType;
    }

    public void setDocumentType(LeosCategory documentType) {
        this.documentType = documentType;
    }

    public LeosCategory getCategory() {
        return getDocumentType();
    }

    public void setCategory(LeosCategory documentType) { setDocumentType(documentType); }

    public int getDocNumber() {
        return docNumber;
    }

    public void setDocNumber(int docNumber) {
        this.docNumber = docNumber;
    }

    public List<DocumentVO> getChildDocuments() {
        return childDocuments;
    }

    public void addChildDocument(DocumentVO childDocument) {
        childDocuments.add(childDocument);
    }

    public void setChildDocuments(List<DocumentVO> childDocuments) {
        this.childDocuments = childDocuments;
    }

    public byte[] getSource() {
        return source;
    }

    public void setSource(byte[] source) {
        this.source = source;
    }

    public boolean isUploaded() {
        return uploaded;
    }

    public void setUploaded(boolean uploaded) {
        this.uploaded = uploaded;
    }

    public MetadataVO getMetadata() {
        return metadata;
    }

    public void setMetaData(MetadataVO metadataVO) {
        this.metadata = metadataVO;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    public String getActType() {
        return actType;
    }

    public void setActType(String actType) {
        this.actType = actType;
    }

    public void addCollaborators(List<Collaborator> collaborators) {
        this.collaborators.addAll(collaborators);
    }

    public void addCollaborator(String userLogin, String authority, String userEntity) {
        this.collaborators.add(new Collaborator(userLogin, authority, userEntity));
    }

    public boolean isTrackChangesEnabled() {
        return trackChangesEnabled;
    }

    public void setTrackChangesEnabled(boolean trackChangesEnabled) {
        this.trackChangesEnabled = trackChangesEnabled;
    }

    public List<Collaborator> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(List<Collaborator> collaborators) {
        this.collaborators = collaborators;
    }

    public DocumentVO getChildDocument(LeosCategory documentType) {
        DocumentVO document = null;
        for (DocumentVO childDocument : childDocuments) {
            if (childDocument.getCategory().equals(documentType)) {
                document = childDocument;
                break;
            }
        }
        return document;
    }

    public List<DocumentVO> getChildDocuments(LeosCategory documentType) {
        List<DocumentVO> documents = new ArrayList<>();
        for (DocumentVO childDoc : childDocuments) {
            if (childDoc.getCategory().equals(documentType)) {
                documents.add(childDoc);
            }
        }
        return documents;
    }

    public String getVersionSeriesId() {
        return versionSeriesId;
    }

    public void setVersionSeriesId(String versionSeriesId) {
        this.versionSeriesId = versionSeriesId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setProposalRef(String proposalRef) {
        this.proposalRef = proposalRef;
    }

    public String getProposalRef() {
        return proposalRef;
    }
}
