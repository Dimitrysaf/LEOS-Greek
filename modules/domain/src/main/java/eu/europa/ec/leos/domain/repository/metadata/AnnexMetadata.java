package eu.europa.ec.leos.domain.repository.metadata;

import eu.europa.ec.leos.domain.repository.LeosCategory;

import java.util.Objects;

public final class AnnexMetadata extends LeosMetadata {
    private final int index;
    private final String number;
    private final String title;
    private final String clonedRef; //Optional only required when adding new annex in clone proposal to original

    public AnnexMetadata(String stage, String type, String purpose, String template, String language, String docTemplate,
                         String ref, int index, String number, String title, String objectId, String docVersion,
                         boolean eeaRelevance, String clonedRef) {
        super(LeosCategory.ANNEX, stage, type, purpose, template, language, docTemplate, ref, objectId, docVersion, eeaRelevance);
        this.index = index;
        this.number = number;
        this.title = title;
        this.clonedRef = clonedRef;
    }

    public int getIndex() {
        return index;
    }

    public String getNumber() {
        return number;
    }

    public String getTitle() {
        return title;
    }

    public String getClonedRef() {
        return clonedRef;
    }

    @Override
    public String toString() {
        return "AnnexMetadata{" +
                "index=" + index +
                ", number='" + number + '\'' +
                ", title='" + title + '\'' +
                ", clonedRef='" + clonedRef + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnnexMetadata that = (AnnexMetadata) o;
        return index == that.index &&
                Objects.equals(stage, that.stage) &&
                Objects.equals(type, that.type) &&
                Objects.equals(purpose, that.purpose) &&
                Objects.equals(template, that.template) &&
                Objects.equals(language, that.language) &&
                Objects.equals(docTemplate, that.docTemplate) &&
                Objects.equals(ref, that.ref) &&
                Objects.equals(number, that.number) &&
                Objects.equals(title, that.title) &&
                Objects.equals(objectId, that.objectId) &&
                Objects.equals(eeaRelevance, that.eeaRelevance) &&
                Objects.equals(docVersion, that.docVersion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), index, number, title);
    }
    public AnnexMetadataBuilder builder() {
        return new AnnexMetadataBuilder(this);
    }
    public static final class AnnexMetadataBuilder {
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
        private int index;
        private String number;
        private String title;
        private String clonedRef;
        private AnnexMetadataBuilder() {
        }
        private AnnexMetadataBuilder(AnnexMetadata metadata) {
            this.index = metadata.index;
            this.number= metadata.number;
            this.title= metadata.title;
            this.clonedRef= metadata.clonedRef;
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
        public AnnexMetadataBuilder withStage(String stage) {
            this.stage = stage;
            return this;
        }
        public AnnexMetadataBuilder withType(String type) {
            this.type = type;
            return this;
        }
        public AnnexMetadataBuilder withPurpose(String purpose) {
            this.purpose = purpose;
            return this;
        }
        public AnnexMetadataBuilder withTemplate(String template) {
            this.template = template;
            return this;
        }
        public AnnexMetadataBuilder withLanguage(String language) {
            this.language = language;
            return this;
        }
        public AnnexMetadataBuilder withDocTemplate(String docTemplate) {
            this.docTemplate = docTemplate;
            return this;
        }
        public AnnexMetadataBuilder withRef(String ref) {
            this.ref = ref;
            return this;
        }
        public AnnexMetadataBuilder withObjectId(String objectId) {
            this.objectId = objectId;
            return this;
        }
        public AnnexMetadataBuilder withDocVersion(String docVersion) {
            this.docVersion = docVersion;
            return this;
        }
        public AnnexMetadataBuilder withEeaRelevance(boolean eeaRelevance) {
            this.eeaRelevance = eeaRelevance;
            return this;
        }
        public AnnexMetadataBuilder withIndex(int index) {
            this.index = index;
            return this;
        }
        public AnnexMetadataBuilder withNumber(String number) {
            this.number = number;
            return this;
        }
        public AnnexMetadataBuilder withTitle(String title) {
            this.title = title;
            return this;
        }
        public AnnexMetadataBuilder withClonedRef(String clonedRef) {
            this.clonedRef = clonedRef;
            return this;
        }
        public AnnexMetadata build() {
            return new AnnexMetadata(this.stage, this.type, this.purpose, this.template, this.language,
                    this.docTemplate, this.ref, this.index, this.number, this.title, this.objectId, this.docVersion,
                    this.eeaRelevance, this.clonedRef);
        }
    }

}
