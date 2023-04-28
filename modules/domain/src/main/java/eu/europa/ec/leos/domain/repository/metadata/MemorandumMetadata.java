package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

public final class MemorandumMetadata extends LeosMetadata {
    public MemorandumMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String objectId, String docVersion, boolean eeaRelevance) {
        super(LeosCategory.MEMORANDUM, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
    }
    public MemorandumMetadataBuilder builder() {
        return new MemorandumMetadataBuilder(this);
    }
    public static final class MemorandumMetadataBuilder {
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
        private MemorandumMetadataBuilder() {
        }
        private  MemorandumMetadataBuilder(MemorandumMetadata metadata) {
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
        }
        public MemorandumMetadataBuilder withStage(String stage) {
            this.stage = stage;
            return this;
        }
        public MemorandumMetadataBuilder withType(String type) {
            this.type = type;
            return this;
        }
        public MemorandumMetadataBuilder withPurpose(String purpose) {
            this.purpose = purpose;
            return this;
        }
        public MemorandumMetadataBuilder withTemplate(String template) {
            this.template = template;
            return this;
        }
        public MemorandumMetadataBuilder withLanguage(String language) {
            this.language = language;
            return this;
        }
        public MemorandumMetadataBuilder withDocTemplate(String docTemplate) {
            this.docTemplate = docTemplate;
            return this;
        }
        public MemorandumMetadataBuilder withRef(String ref) {
            this.ref = ref;
            return this;
        }
        public MemorandumMetadataBuilder withObjectId(String objectId) {
            this.objectId = objectId;
            return this;
        }
        public MemorandumMetadataBuilder withDocVersion(String docVersion) {
            this.docVersion = docVersion;
            return this;
        }
        public MemorandumMetadataBuilder withEeaRelevance(boolean eeaRelevance) {
            this.eeaRelevance = eeaRelevance;
            return this;
        }

        public MemorandumMetadata build() {
            return new MemorandumMetadata(this.stage, this.type, this.purpose, this.template, this.language, this.docTemplate, this.ref, this.objectId, this.docVersion, this.eeaRelevance);
        }
    }
}
