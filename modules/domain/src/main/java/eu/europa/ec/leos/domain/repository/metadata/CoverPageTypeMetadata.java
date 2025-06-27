package eu.europa.ec.leos.domain.repository.metadata;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.xml.bind.JAXB;
import java.io.StringWriter;

@Getter
@Setter
public class CoverPageTypeMetadata {
    LeosCoverPageType coverPageType;

    boolean logo;
    boolean disclaimer;
    boolean watermark;
    Float verticalShift;

    public CoverPageTypeMetadata(LeosCoverPageType coverPageType, Float verticalShift) {
        setCoverPageType(coverPageType, verticalShift);
    }

    public void setCoverPageType(LeosCoverPageType coverPageType, Float verticalShift) {
        if (coverPageType == null) {
            return;
        }
        this.coverPageType = coverPageType;
        switch (coverPageType) {
            case STANDARD:
                this.logo = true;
                this.disclaimer = false;
                this.watermark = false;
                break;
            case EUROPA_EURLEX:
                this.logo = true;
                this.disclaimer = true;
                this.watermark = true;
                this.verticalShift = verticalShift;
                break;
            case COMMITEE_EXPERTS_GROUP:
                this.logo = false;
                this.disclaimer = true;
                this.watermark = true;
                this.verticalShift = verticalShift;
                break;
        }
    }

    @Override
    public String toString() {
        StringWriter sw = new StringWriter();
        JAXB.marshal(this, sw);
        return sw.toString();
    }
}
