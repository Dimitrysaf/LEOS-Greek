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
package eu.europa.ec.leos.domain.vo;

import eu.europa.ec.leos.domain.repository.metadata.LeosAuthenticLanguage;
import eu.europa.ec.leos.domain.repository.metadata.LeosCoverPageType;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class MetadataVO {
    private String docStage;
    private String docType;
    private String docPurpose;
    private String docVersion;
    private String packageTitle;
    private String internalRef;
    private SecurityLevel securityLevel = SecurityLevel.STANDARD;
    private String language; // always should be set to language Code
    private boolean eeaRelevance;
    private boolean isCustomTemplateAct;
    private String templateName;
    private String template;
    private String docTemplateCategory;
    private String docTemplate;
    private String title;
    private String index;
    private String number;
    private String callbackAddress;
    private boolean imported;
    private String docCollectionName;

    private List<String> authenticLang;
    private String documentCollectionName;
    private LeosAuthenticLanguage isAuthenticLang;
    private LeosCoverPageType coverPageType;
    private Float verticalShift;
    private List<String> crossReferences;

    private String adoptionPlace;
    private Date adoptionDate;
    private String institutionalReference;
    private Boolean institutionalReferenceFinalVersion;
    private String interInstitutionalReference;
    private String specialMention;
    private String signingCommissioner;
    private String commissionerTitle;
    private Boolean stamp;

    public MetadataVO() {
    }// added for early binding

    public MetadataVO(String docStage, String docType, String docPurpose, String template, String language, boolean eeaRelevance, boolean isCustomTemplateAct) {
        this.docStage = docStage;
        this.docType = docType;
        this.docPurpose = docPurpose;
        this.template = template;
        this.language = language;
        this.eeaRelevance = eeaRelevance;
        this.isCustomTemplateAct = isCustomTemplateAct;
    }

    public enum SecurityLevel {
        STANDARD, SENSITIVE;
    }

    public void clean() {
        this.setDocStage(null);
        this.setDocType(null);
        this.setDocPurpose(null);
        this.setPackageTitle(null);
        this.setInternalRef(null);
        this.setSecurityLevel(null);
        this.setLanguage(null); // always should be set to language Code
        this.setTemplateName(null);
        this.setTemplate(null);
        this.setDocTemplate(null);
        this.setDocTemplateCategory(null);
        this.setTitle(null);
        this.setIndex(null);
        this.setNumber(null);
        this.setEeaRelevance(false);
        this.setCustomTemplateAct(false);
        this.setCallbackAddress(null);
        this.setImported(false);
        this.setAuthenticLang(null);
        this.setIsAuthenticLang(null);
        this.setCoverPageType(null);
        this.setVerticalShift(null);
        this.setCrossReferences(null);
        this.setAdoptionDate(null);
        this.setAdoptionPlace(null);
        this.setInstitutionalReference(null);
        this.setInstitutionalReferenceFinalVersion(null);
        this.setInterInstitutionalReference(null);
        this.setSpecialMention(null);
        this.setSigningCommissioner(null);
        this.setCommissionerTitle(null);
        this.setStamp(null);
    }
}
