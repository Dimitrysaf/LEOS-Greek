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
import eu.europa.ec.leos.repository.entities.DocumentPropertiesV;
import eu.europa.ec.leos.repository.entities.DocumentV;
import eu.europa.ec.leos.repository.utils.CollaboratorDesSerializer;
import eu.europa.ec.leos.repository.utils.CollaboratorSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class XmlDocument extends LeosDocument {
    private static final Logger LOG = LoggerFactory.getLogger(XmlDocument.class);

    private String title;
    private String language;
    private String template;
    private String packageId;
    private String ref;

    private String documentType;
    private String documentId;
    private String procedureType;

    private Map<String, Object> metadata = new HashMap<>();

    public XmlDocument() {}

    public XmlDocument(DocumentV doc, List<Collaborator> collaborators, List<DocumentPropertiesV> otherMetadata) {
        super(doc);
        if (doc != null) {
            this.title = doc.getTitle();
            this.documentType = doc.getCategoryCode();
            this.packageId = doc.getPackageId().toString();
            this.language = doc.getLanguage();
            this.template = doc.getTemplate();
            this.procedureType = doc.getProcedureType();
            this.setCategory(doc.getCategoryCode());
            this.setRef(doc.getRef());
            this.setDocumentId(doc.getDocumentId().toString());
            populateMetadataValues(doc, collaborators, otherMetadata);
        }
    }

    protected void populateMetadataValues(DocumentV doc, List<Collaborator> collaborators, List<DocumentPropertiesV> otherMetadata) {
        XmlDocumentMetadata xmlDocumentMetadata = new XmlDocumentMetadata(doc, collaborators);
        this.setMetaData(xmlDocumentMetadata.generateMetadataMap(otherMetadata));
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
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

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getCategory() {
        return documentType;
    }

    public void setCategory(String documentType) {
        this.documentType = documentType;
    }

    public Map<String, Object> getMetadata() {
        return this.metadata;
    }

    public void setMetaData(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        XmlDocument that = (XmlDocument) o;

        if (!getId().equals(that.getId())) return false;
        if (getTitle() != null ? !getTitle().equals(that.getTitle()) : that.getTitle() != null) return false;
        if (getCreatedBy() != null ? !getCreatedBy().equals(that.getCreatedBy()) : that.getCreatedBy() != null) return false;
        if (getCreatedOn() != null ? !getCreatedOn().equals(that.getCreatedOn()) : that.getCreatedOn() != null) return false;
        if (getUpdatedBy() != null ? !getUpdatedBy().equals(that.getUpdatedBy()) : that.getUpdatedBy() != null) return false;
        if (getUpdatedOn() != null ? !getUpdatedOn().equals(that.getUpdatedOn()) : that.getUpdatedOn() != null) return false;
        if (getLanguage() != null ? !getLanguage().equals(that.getLanguage()) : that.getLanguage() != null) return false;
        if (getTemplate() != null ? !getTemplate().equals(that.getTemplate()) : that.getTemplate() != null) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = getId().hashCode();
        result = 31 * result + (getTitle() != null ? getTitle().hashCode() : 0);
        result = 31 * result + (getCreatedBy() != null ? getCreatedBy().hashCode() : 0);
        result = 31 * result + (getCreatedOn() != null ? getCreatedOn().hashCode() : 0);
        result = 31 * result + (getUpdatedBy() != null ? getUpdatedBy().hashCode() : 0);
        result = 31 * result + (getUpdatedOn() != null ? getUpdatedOn().hashCode() : 0);
        result = 31 * result + (getLanguage() != null ? getLanguage().hashCode() : 0);
        result = 31 * result + (getTemplate() != null ? getTemplate().hashCode() : 0);
        return result;
    }

    protected void clean() {
        this.setId(null);
        this.setRef(null);
        this.setDocumentType(null);
        this.getMetadata().clear();
        this.setSource(null);
        this.setTitle(null);
        this.setCreatedBy(null);
        this.setCreatedOn(null);
        this.setUpdatedBy(null);
        this.setUpdatedOn(null);
        this.setLanguage(null);
        this.setTemplate(null);
        this.setDocumentType(null);
        this.setProcedureType(null);
    }
}
