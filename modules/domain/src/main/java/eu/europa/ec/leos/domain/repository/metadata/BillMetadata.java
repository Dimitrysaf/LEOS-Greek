package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

public final class BillMetadata extends LeosMetadata {

    public BillMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String objectId, String docVersion, boolean eeaRelevance) {
        this(stage, type, purpose, template, language, docTemplate, ref, null, objectId, docVersion, eeaRelevance);
    }

    public BillMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String packageRef, String objectId, String docVersion, boolean eeaRelevance) {
        super(LeosCategory.BILL, stage, type, purpose, template, language, docTemplate, ref, packageRef, objectId, docVersion, eeaRelevance);
    }

    public  BillMetadataBuilder builder() {
        return new BillMetadataBuilder(this);
    }
    public static final class BillMetadataBuilder {
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
        private String packageRef;
        private BillMetadataBuilder() {
        }
        private  BillMetadataBuilder(BillMetadata metadata) {
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
            this.packageRef = metadata.packageRef;
        }
        public BillMetadataBuilder withStage(String stage) {
            this.stage = stage;
            return this;
        }
        public BillMetadataBuilder withType(String type) {
            this.type = type;
            return this;
        }
        public BillMetadataBuilder withPurpose(String purpose) {
            this.purpose = purpose;
            return this;
        }
        public BillMetadataBuilder withTemplate(String template) {
            this.template = template;
            return this;
        }
        public BillMetadataBuilder withLanguage(String language) {
            this.language = language;
            return this;
        }
        public BillMetadataBuilder withDocTemplate(String docTemplate) {
            this.docTemplate = docTemplate;
            return this;
        }
        public BillMetadataBuilder withRef(String ref) {
            this.ref = ref;
            return this;
        }
        public BillMetadataBuilder withObjectId(String objectId) {
            this.objectId = objectId;
            return this;
        }
        public BillMetadataBuilder withDocVersion(String docVersion) {
            this.docVersion = docVersion;
            return this;
        }
        public BillMetadataBuilder withEeaRelevance(boolean eeaRelevance) {
            this.eeaRelevance = eeaRelevance;
            return this;
        }
        public BillMetadataBuilder withPackageRef(String packageRef) {
            this.packageRef = packageRef;
            return this;
        }

        public BillMetadata build() {
            return new BillMetadata(this.stage, this.type, this.purpose, this.template, this.language, this.docTemplate, this.ref, this.packageRef, this.objectId, this.docVersion, this.eeaRelevance);
        }
    }
}
