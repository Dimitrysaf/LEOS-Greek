package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

import java.util.List;

public final class ProposalMetadata extends LeosMetadata {
    private String internalRef;
    private LeosAuthenticLanguage isAuthenticLang;

    public ProposalMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String objectId, String docVersion, boolean eeaRelevance) {
        super(LeosCategory.PROPOSAL, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
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
        private String packageTitle;
        private List<String> authenticLang;
        private LeosAuthenticLanguage isAuthenticLang;
        private String internalRef;

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
            this.packageTitle = metadata.packageTitle;
            this.authenticLang = metadata.authenticLang;
            this.procedureType = metadata.getProcedureType();
            this.packageTitle = metadata.packageTitle;
            this.internalRef = metadata.internalRef;
            this.isAuthenticLang = metadata.isAuthenticLang;
            this.actType = metadata.getActType();
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

        public ProposalMetadata build() {
            ProposalMetadata metadata = new ProposalMetadata(this.stage, this.type, this.purpose, this.template, this.language, this.docTemplate, this.ref,
                    this.objectId,
                this.docVersion, this.eeaRelevance);
            metadata.setProcedureType(procedureType);
            metadata.setActType(actType);
            metadata.setPackageTitle(packageTitle);
            metadata.setInternalRef(internalRef);
            metadata.setAuthenticLang(authenticLang);
            metadata.setIsAuthenticLang(isAuthenticLang);
            return metadata;
        }
    }

    public List<String> getAuthenticLang() {
        return authenticLang;
    }

    public void setAuthenticLang(List<String> authenticLanguages) {
        this.authenticLang = authenticLanguages;
    }

    public LeosAuthenticLanguage getIsAuthenticLang() {
        return isAuthenticLang;
    }

    public void setIsAuthenticLang(LeosAuthenticLanguage isAuthenticLang) {
        this.isAuthenticLang = isAuthenticLang;
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
}
