package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public final class ProposalMetadata extends LeosMetadata {
    private String internalRef;
    private LeosAuthenticLanguage isAuthenticLang;
    private LeosCoverPageType coverPageType;
    private Float verticalShift;
    private List<String> crossReferences;

    private String adoptionPlace;
    private Date adoptionDate;
    private String institutionalReference;
    private Boolean institutionalReferenceFinalVersion;
    private String interInstitutionalReference;
    private List<SignatureMetadata> signatures;
    private Boolean stamp;
    private String aiValues;

    public ProposalMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String objectId, String docVersion, boolean eeaRelevance, boolean customTemplateAct) {
        super(LeosCategory.PROPOSAL, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance, customTemplateAct);
    }
    public static ProposalMetadataBuilder builder(ProposalMetadata metadata) {
        return new ProposalMetadataBuilder(metadata);
    }
    public ProposalMetadataBuilder builder() {
        return new ProposalMetadataBuilder(this);
    }
    public static final class ProposalMetadataBuilder {
        private String stage;
        private String type;
        private String purpose;
        private String template;
        private String language;
        private String docTemplate;
        private String ref;
        private String objectId;
        private String docVersion;
        private String procedureType;
        private String actType;
        private boolean eeaRelevance;
        private boolean customTemplateAct;
        private String packageTitle;
        private List<String> authenticLang;
        private LeosAuthenticLanguage isAuthenticLang;
        private LeosCoverPageType coverPageType;
        private String internalRef;
        private Float verticalShift;
        private List<String> crossReferences;
        private String adoptionPlace;
        private Date adoptionDate;
        private String institutionalReference;
        private Boolean institutionalReferenceFinalVersion;
        private String interInstitutionalReference;
        private List<SignatureMetadata> signatures;
        private Boolean stamp;
        private String aiValues;
        private ProposalMetadataBuilder() {
        }
        private  ProposalMetadataBuilder(ProposalMetadata metadata) {
            this.stage= metadata.stage;
            this.type= metadata.type;
            this.purpose= metadata.purpose;
            this.template= metadata.template;
            this.language= metadata.language;
            this.docTemplate= metadata.docTemplate;
            this.ref= metadata.ref;
            this.objectId= metadata.objectId;
            this.docVersion= metadata.docVersion;
            this.eeaRelevance= metadata.eeaRelevance;
            this.customTemplateAct = metadata.customTemplateAct;
            this.procedureType = metadata.getProcedureType();
            this.packageTitle = metadata.packageTitle;
            this.internalRef = metadata.internalRef;
            this.isAuthenticLang = metadata.isAuthenticLang;
            this.coverPageType = metadata.coverPageType;
            this.verticalShift = metadata.getVerticalShift();
            this.actType = metadata.getActType();
            this.crossReferences = metadata.getCrossReferences();
            this.institutionalReference = metadata.getInstitutionalReference();
            this.institutionalReferenceFinalVersion = metadata.getInstitutionalReferenceFinalVersion();
            this.interInstitutionalReference = metadata.getInterInstitutionalReference();
            this.signatures = metadata.getSignatures();
            this.adoptionPlace = metadata.getAdoptionPlace();
            this.adoptionDate = metadata.getAdoptionDate();
            this.stamp = metadata.getStamp();
            this.aiValues = metadata.aiValues;
        }
        public ProposalMetadataBuilder withStage(String stage) {
            this.stage = stage;
            return this;
        }
        public ProposalMetadataBuilder withType(String type) {
            this.type = type;
            return this;
        }
        public ProposalMetadataBuilder withPurpose(String purpose) {
            this.purpose = purpose;
            return this;
        }
        public ProposalMetadataBuilder withTemplate(String template) {
            this.template = template;
            return this;
        }
        public ProposalMetadataBuilder withLanguage(String language) {
            this.language = language;
            return this;
        }
        public ProposalMetadataBuilder withDocTemplate(String docTemplate) {
            this.docTemplate = docTemplate;
            return this;
        }
        public ProposalMetadataBuilder withRef(String ref) {
            this.ref = ref;
            return this;
        }
        public ProposalMetadataBuilder withObjectId(String objectId) {
            this.objectId = objectId;
            return this;
        }
        public ProposalMetadataBuilder withDocVersion(String docVersion) {
            this.docVersion = docVersion;
            return this;
        }
        public ProposalMetadataBuilder withEeaRelevance(boolean eeaRelevance) {
            this.eeaRelevance = eeaRelevance;
            return this;
        }
        public ProposalMetadataBuilder withCustomTemplateAct(boolean customTemplateAct) {
            this.customTemplateAct = customTemplateAct;
            return this;
        }
        public ProposalMetadataBuilder withPackageTitle(String packageTitle) {
            this.packageTitle = packageTitle;
            return this;
        }
        public ProposalMetadataBuilder withAuthenticLang(List<String> authenticLang) {
            this.authenticLang = authenticLang;
            return this;
        }
        public ProposalMetadataBuilder withIsAuthenticLang(LeosAuthenticLanguage isAuthenticLang) {
            this.isAuthenticLang = isAuthenticLang;
            return this;
        }
        public ProposalMetadataBuilder withCoverPageType(LeosCoverPageType coverPageType) {
            this.coverPageType = coverPageType;
            return this;
        }
        public ProposalMetadataBuilder withProcedureType(String procedureType) {
            this.procedureType = procedureType;
            return this;
        }
        public ProposalMetadataBuilder withActType(String actType) {
            this.actType = actType;
            return this;
        }
        public ProposalMetadataBuilder withInternalRef(String internalRef) {
            this.internalRef = internalRef;
            return this;
        }
        public ProposalMetadataBuilder withVerticalShift(Float verticalShift) {
            this.verticalShift = verticalShift;
            return this;
        }
        public ProposalMetadataBuilder withAiValues(String aiValues) {
            this.aiValues = aiValues;
            return this;
        }

        public ProposalMetadata build() {
            ProposalMetadata metadata = new ProposalMetadata(this.stage, this.type, this.purpose, this.template, this.language, this.docTemplate, this.ref,
                    this.objectId,
                this.docVersion, this.eeaRelevance, this.customTemplateAct);
            metadata.setProcedureType(procedureType);
            metadata.setActType(actType);
            metadata.setPackageTitle(packageTitle);
            metadata.setInternalRef(internalRef);
            metadata.setAuthenticLang(authenticLang);
            metadata.setIsAuthenticLang(isAuthenticLang);
            metadata.setCoverPageType(coverPageType != null ? coverPageType : null);
            metadata.setVerticalShift(verticalShift);
            metadata.setCrossReferences(crossReferences);
            metadata.setAdoptionPlace(adoptionPlace);
            metadata.setAdoptionDate(adoptionDate);
            metadata.setInstitutionalReference(institutionalReference);
            metadata.setInstitutionalReferenceFinalVersion(institutionalReferenceFinalVersion);
            metadata.setInterInstitutionalReference(interInstitutionalReference);
            metadata.setSignatures(signatures);
            metadata.setStamp(stamp);
            metadata.setAiValues(aiValues);
            return metadata;
        }
    }
}
