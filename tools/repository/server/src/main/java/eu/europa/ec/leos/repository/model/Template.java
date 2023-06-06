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

import eu.europa.ec.leos.repository.entities.Config;
import eu.europa.ec.leos.repository.entities.ConfigContent;
import eu.europa.ec.leos.repository.entities.ConfigVersion;

import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

public class Template extends XmlDocument {
    private String actType;

    public Template(Config doc, ConfigVersion configVersion, ConfigContent configContent, Map<String, Object> otherMetadata) {
        if (doc != null) {
            this.setId(doc.getId().toString());
            this.setCreatedBy(doc.getAuditCBy());
            this.setCreatedOn(Date.from(doc.getAuditCDate().atZone(ZoneId.systemDefault()).toInstant()));
            this.setUpdatedBy(doc.getAuditLastMBy());
            this.setUpdatedOn(doc.getAuditLastMDate() != null ? Date.from(doc.getAuditLastMDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
            this.setSource(configContent.getContent());
            this.setCategory((String) otherMetadata.get("category"));
            this.setTitle((String) otherMetadata.get("title"));
            this.setDocumentType((String) otherMetadata.get("category"));

            this.setVersionLabel(configVersion.getVersionLabel());
        }
    }

    public String getActType() {
        return actType;
    }

    public void setActType(String actType) {
        this.actType = actType;
    }
}
