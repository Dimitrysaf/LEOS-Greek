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
package eu.europa.ec.leos.repository.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import eu.europa.ec.leos.repository.utils.DateDesSerializer;
import eu.europa.ec.leos.repository.utils.DateSerializer;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class Package {
    private static final Logger LOG = LoggerFactory.getLogger(Package.class);

    private String id;
    private String name;
    private String createdBy;
    private Date createdOn;
    private String updatedBy;
    private Date updatedOn;
    private Boolean isCloned;
    private String clonedPackageName;
    private List<Collaborator> collaboratorList;
    private String language;
    private Boolean isTranslated;
    private String creatorOrganization;

    public Package(eu.europa.ec.leos.repository.entities.Package pkg) {
        this.id = pkg.getId().toString();
        this.name = pkg.getName();
        this.createdBy = pkg.getAuditCBy();
        this.createdOn = pkg.getAuditCDate() != null ? Date.from(pkg.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant()) : null;
        this.updatedBy = pkg.getAuditLastMBy();
        this.updatedOn = pkg.getAuditLastMDate() != null ? Date.from(pkg.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null;
        this.language = pkg.getLanguage();
        this.isTranslated = pkg.getIsTranslated();
    }

    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDesSerializer.class)
    public Date getCreatedOn() {
        return this.createdOn;
    }

    @JsonSerialize(using = DateSerializer.class)
    @JsonDeserialize(using = DateDesSerializer.class)
    public Date getUpdatedOn() {
        return this.updatedOn;
    }

    public Boolean isCloned() {
        return this.isCloned;
    }

    public void setIsCloned(boolean isCloned) {
        this.isCloned = isCloned;
    }

    public List<Collaborator> getCollaborators() {
        return this.collaboratorList;
    }

    public void setCollaborators(List<Collaborator> collaboratorList) {
        this.collaboratorList = collaboratorList;
    }

    public Boolean getTranslated() {
        return isTranslated;
    }

    public void setTranslated(Boolean translated) {
        isTranslated = translated;
    }
}
