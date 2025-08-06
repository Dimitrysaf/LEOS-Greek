package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

public class FinancialStatementMetadata extends LeosMetadata{
    private final String title;

    public String getTitle() {
        return title;
    }

    public FinancialStatementMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String title, String objectId, String docVersion, boolean eeaRelevance, boolean isCustomTemplateAct) {
        this(stage, type, purpose, template, language, docTemplate, ref, null, title, objectId, docVersion, eeaRelevance, isCustomTemplateAct);
    }

    public FinancialStatementMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String packageRef, String title, String objectId, String docVersion, boolean eeaRelevance, boolean isCustomTemplateAct) {
        super(LeosCategory.STAT_DIGIT_FINANC_LEGIS, stage, type, purpose, template, language, docTemplate, ref, packageRef, objectId, docVersion, eeaRelevance, isCustomTemplateAct);
        this.title = title;
    }

    public FinancialStatementMetadataBuilder builder() {
        return new FinancialStatementMetadataBuilder(this);
    }
    public static final class FinancialStatementMetadataBuilder {
        private String stage;
        private String type;
        private String purpose;
        private String template;
        private String language;
        private String docTemplate;
        private String ref;
        private String objectId;
        private String docVersion;
        private boolean eeaRelevance;
        private boolean isCustomTemplateAct;
        private String title;
        private String packageRef;

        private FinancialStatementMetadataBuilder(FinancialStatementMetadata metadata) {
            this.title = metadata.title;
            this.stage = metadata.stage;
            this.type = metadata.type;
            this.purpose = metadata.purpose;
            this.template = metadata.template;
            this.language = metadata.language;
            this.docTemplate = metadata.docTemplate;
            this.ref = metadata.ref;
            this.objectId = metadata.objectId;
            this.docVersion = metadata.docVersion;
            this.eeaRelevance = metadata.eeaRelevance;
            this.isCustomTemplateAct = metadata.isCustomTemplateAct;
            this.packageRef = metadata.packageRef;
        }

        public FinancialStatementMetadataBuilder withStage(String stage) {
            this.stage = stage;
            return this;
        }

        public FinancialStatementMetadataBuilder withType(String type) {
            this.type = type;
            return this;
        }

        public FinancialStatementMetadataBuilder withPurpose(String purpose) {
            this.purpose = purpose;
            return this;
        }

        public FinancialStatementMetadataBuilder withTemplate(String template) {
            this.template = template;
            return this;
        }

        public FinancialStatementMetadataBuilder withLanguage(String language) {
            this.language = language;
            return this;
        }

        public FinancialStatementMetadataBuilder withDocTemplate(String docTemplate) {
            this.docTemplate = docTemplate;
            return this;
        }

        public FinancialStatementMetadataBuilder withRef(String ref) {
            this.ref = ref;
            return this;
        }

        public FinancialStatementMetadataBuilder withObjectId(String objectId) {
            this.objectId = objectId;
            return this;
        }

        public FinancialStatementMetadataBuilder withDocVersion(String docVersion) {
            this.docVersion = docVersion;
            return this;
        }

        public FinancialStatementMetadataBuilder withEeaRelevance(boolean eeaRelevance) {
            this.eeaRelevance = eeaRelevance;
            return this;
        }

        public FinancialStatementMetadataBuilder withIsCustomTemplateAct(boolean isCustomTemplateAct) {
            this.isCustomTemplateAct = isCustomTemplateAct;
            return this;
        }

        public FinancialStatementMetadataBuilder withTitle(String title) {
            this.title = title;
            return this;
        }

        public FinancialStatementMetadataBuilder withPackageRef(String packageRef) {
            this.packageRef = packageRef;
            return this;
        }

        public FinancialStatementMetadata build() {
            return new FinancialStatementMetadata(this.stage, this.type, this.purpose, this.template, this.language, this.docTemplate, this.ref, this.packageRef, this.title, this.objectId, this.docVersion, this.eeaRelevance, this.isCustomTemplateAct);
        }
    }
}