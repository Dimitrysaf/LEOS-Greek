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

import eu.europa.ec.leos.repository.entities.DocumentPropertiesV;
import eu.europa.ec.leos.repository.entities.DocumentPropertyValues;
import eu.europa.ec.leos.repository.entities.DocumentV;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class XmlDocumentMetadata {
    private String category;
    private String docStage;
    private String docType;
    private String docPurpose;
    private String procedureType;
    private String packageTitle;
    private String internalRef;
    private String language;
    private String ref;
    private Boolean eeaRelevance;
    private String templateName;
    private String template;
    private String docTemplate;
    private String title;
    private String index;
    private String number;
    private List<Collaborator> collaborators = new ArrayList<>();

    private String clonedFrom;
    private String revisionStatus;
    private String contributionStatus;
    private Boolean isLiveDiffingRequired;
    private String originRef;
    private String baseRevisionId;

    public XmlDocumentMetadata(DocumentV doc, List<Collaborator> collaborators) {
        this.docStage = doc.getDocStage();
        this.docType = doc.getDocType();
        this.docPurpose = doc.getDocPurpose();
        this.procedureType = doc.getProcedureType();
        this.template = doc.getTemplate();
        this.language = doc.getLanguage();
        this.eeaRelevance = doc.getEeaRelevance();
        this.title = doc.getTitle();
        this.category = doc.getCategoryCode();
        this.docTemplate = doc.getDocTemplate();
        this.ref = doc.getRef();
        this.clonedFrom = doc.getClonedFrom() != null ? doc.getClonedFrom() : null;
        this.revisionStatus = doc.getRevisionStatus();
        this.contributionStatus = doc.getContributionStatus();
        this.isLiveDiffingRequired = doc.isLiveDiffingRequired();
        this.originRef = doc.getOriginRef() != null ? doc.getOriginRef() : null;
        this.baseRevisionId = doc.getBaseRevisionId() != null ? doc.getBaseRevisionId().toString() : null;
        this.setCollaborators(collaborators);
    }

    public Map<String, Object> generateMetadataMap(List<DocumentPropertyValues> otherMetadata) {
        Map<String, Object> metadataMap = new HashMap<String, Object>();
        if (this.getDocStage() != null) {
            metadataMap.put("docStage", this.getDocStage());
        }
        if (this.getDocType() != null) {
            metadataMap.put("docType", this.getDocType());
        }
        if (this.getDocPurpose() != null) {
            metadataMap.put("docPurpose", this.getDocPurpose());
        }
        if (this.getTemplate() != null) {
            metadataMap.put("template", this.getTemplate());
        }
        if (this.getLanguage() != null) {
            metadataMap.put("language", this.getLanguage());
        }
        if (this.getEeaRelevance() != null) {
            metadataMap.put("eeaRelevance", this.getEeaRelevance());
        }
        if (this.getTitle() != null) {
            metadataMap.put("title", this.getTitle());
        }
        if (this.getCategory() != null) {
            metadataMap.put("category", this.getCategory());
        }
        if (this.getDocTemplate() != null) {
            metadataMap.put("docTemplate", this.getDocTemplate());
        }
        if (this.getProcedureType() != null) {
            metadataMap.put("procedureType", this.getProcedureType());
        }
        if (this.getRef() != null) {
            metadataMap.put("ref", this.getRef());
        }
        if (this.getClonedFrom() != null) {
            metadataMap.put("clonedFrom", this.getClonedFrom());
        }
        if (this.getRevisionStatus() != null) {
            metadataMap.put("revisionStatus", this.getRevisionStatus());
        }
        if (this.getContributionStatus() != null) {
            metadataMap.put("contributionStatus", this.getContributionStatus());
        }
        if (this.isLiveDiffingRequired() != null) {
            metadataMap.put("liveDiffingRequired", this.isLiveDiffingRequired());
        }
        if (this.getOriginRef() != null) {
            metadataMap.put("originRef", this.getOriginRef());
        }
        if (this.getBaseRevisionId() != null) {
            metadataMap.put("baseRevisionId", this.getBaseRevisionId());
        }
        if (this.getCollaborators() != null) {
            metadataMap.put("collaborators", this.getCollaborators());
        }

        for (DocumentPropertyValues propValue : otherMetadata) {
            metadataMap.put(propValue.getPropertyId().getPropertyName(), propValue.getPropertyValue());
        }
        return metadataMap;
    }

    public List<Collaborator> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(List<Collaborator> collaborators) {
        this.collaborators = collaborators;
    }

    public String getDocStage() {
        return docStage;
    }

    public void setDocStage(String docStage) {
        this.docStage = docStage;
    }

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public String getDocPurpose() {
        return docPurpose;
    }

    public void setDocPurpose(String docPurpose) {
        this.docPurpose = docPurpose;
    }

    public String getPackageTitle() {
        return packageTitle;
    }

    public void setPackageTitle(String packageTitle) {
        this.packageTitle = packageTitle;
    }

    public String getInternalRef() {
        return internalRef;
    }

    public void setInternalRef(String internalRef) {
        this.internalRef = internalRef;
    }

    public Boolean getEeaRelevance() {
        return eeaRelevance;
    }

    public void setEeaRelevance(Boolean eeaRelevance) {
        this.eeaRelevance = eeaRelevance;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String languageCode) {
        this.language = languageCode;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getDocTemplate() {
        return docTemplate;
    }

    public void setDocTemplate(String docTemplate) {
        this.docTemplate = docTemplate;
    }

    public String getClonedFrom() {
        return clonedFrom;
    }

    public void setClonedFrom(String clonedFrom) {
        this.clonedFrom = clonedFrom;
    }

    public String getRevisionStatus() {
        return revisionStatus;
    }

    public void setRevisionStatus(String revisionStatus) {
        this.revisionStatus = revisionStatus;
    }

    public String getContributionStatus() {
        return contributionStatus;
    }

    public void setContributionStatus(String contributionStatus) {
        this.contributionStatus = contributionStatus;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public Boolean isLiveDiffingRequired() {
        return isLiveDiffingRequired;
    }

    public void setLiveDiffingRequired(Boolean liveDiffingRequired) {
        isLiveDiffingRequired = liveDiffingRequired;
    }

    public String getOriginRef() {
        return originRef;
    }

    public void setOriginRef(String originRef) {
        this.originRef = originRef;
    }

    public String getBaseRevisionId() {
        return baseRevisionId;
    }

    public void setBaseRevisionId(String baseRevisionId) {
        this.baseRevisionId = baseRevisionId;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }
}
