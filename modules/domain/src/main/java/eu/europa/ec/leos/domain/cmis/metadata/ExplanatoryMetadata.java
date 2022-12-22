package eu.europa.ec.leos.domain.cmis.metadata;

import eu.europa.ec.leos.domain.cmis.LeosCategory;

public class ExplanatoryMetadata extends LeosMetadata{
    private final String title;

    public String getTitle() {
        return title;
    }

    public ExplanatoryMetadata(String stage, String type, String purpose, String template, String language, String docTemplate, String ref, String title, String objectId, String docVersion, boolean eeaRelevance) {
        super(LeosCategory.COUNCIL_EXPLANATORY, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
        this.title = title;
    }

    public ExplanatoryMetadataBuilder builder() {
        return new ExplanatoryMetadataBuilder(this);
    }
    public static final class ExplanatoryMetadataBuilder {
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
        private String title;

        private ExplanatoryMetadataBuilder() {
        }

        private ExplanatoryMetadataBuilder(ExplanatoryMetadata metadata) {
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
        }

        public ExplanatoryMetadataBuilder withStage(String stage) {
            this.stage = stage;
            return this;
        }

        public ExplanatoryMetadataBuilder withType(String type) {
            this.type = type;
            return this;
        }

        public ExplanatoryMetadataBuilder withPurpose(String purpose) {
            this.purpose = purpose;
            return this;
        }

        public ExplanatoryMetadataBuilder withTemplate(String template) {
            this.template = template;
            return this;
        }

        public ExplanatoryMetadataBuilder withLanguage(String language) {
            this.language = language;
            return this;
        }

        public ExplanatoryMetadataBuilder withDocTemplate(String docTemplate) {
            this.docTemplate = docTemplate;
            return this;
        }

        public ExplanatoryMetadataBuilder withRef(String ref) {
            this.ref = ref;
            return this;
        }

        public ExplanatoryMetadataBuilder withObjectId(String objectId) {
            this.objectId = objectId;
            return this;
        }

        public ExplanatoryMetadataBuilder withDocVersion(String docVersion) {
            this.docVersion = docVersion;
            return this;
        }

        public ExplanatoryMetadataBuilder withEeaRelevance(boolean eeaRelevance) {
            this.eeaRelevance = eeaRelevance;
            return this;
        }

        public ExplanatoryMetadataBuilder withTitle(String title) {
            this.title = title;
            return this;
        }

        public ExplanatoryMetadata build() {
            return new ExplanatoryMetadata(this.stage, this.type, this.purpose, this.template, this.language, this.docTemplate, this.ref, this.title, this.objectId, this.docVersion, this.eeaRelevance);
        }
    }
}