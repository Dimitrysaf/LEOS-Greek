package eu.europa.ec.leos.services.utils;

import eu.europa.ec.leos.domain.repository.document.LegDocument;
import eu.europa.ec.leos.domain.vo.DocumentVO;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@UtilityClass
public class LegUtils {

    public static String fetchMilestoneVersion(final LegDocument legDocument) {
        return Objects.nonNull(legDocument) && Objects.nonNull(legDocument.getContainedDocuments())?
                fetchMilestoneVersion(legDocument.getContainedDocuments())
                :getMilestoneVersion(1);
    }

    private static List<String> buildListDocumentsFromVO(final DocumentVO documentVO) {
        List<String> containedDocuments = new ArrayList<>();
        if (Objects.nonNull(documentVO)) {
            containedDocuments.add(documentVO.getRef() + "_" + documentVO.getMetadata().getDocVersion());
            for (DocumentVO docVO : documentVO.getChildDocuments()) {
                containedDocuments.addAll(buildListDocumentsFromVO(docVO));
            }
        }
        return containedDocuments;
    }

    public static String fetchMilestoneVersion(final DocumentVO documentVO) {
        return Objects.nonNull(documentVO) ?
                fetchMilestoneVersion(buildListDocumentsFromVO(documentVO))
                :getMilestoneVersion(1);
    }

    public static String fetchMilestoneVersion(List<String> containedDocuments) {
        int milestoneVersionInt = getMilestoneVersionInt(containedDocuments);
        return getMilestoneVersion(milestoneVersionInt);
    }

    private String getMilestoneVersion(int majorVersion) {
        return majorVersion > 0 ? String.format("%d.0.0.0", majorVersion) : "1.0.0.O";
    }

    public static int getMilestoneVersionInt(final List<String> containedDocuments) {
        Integer cumulativeIncrements = containedDocuments.stream()
                .map(LegUtils::getPartMajorVersionInt)
                .map(LegUtils::nbOfIncrements)
                .reduce(Integer::sum)
                .orElse(0);
        return cumulativeIncrements + 1;
    }

    public static int getPartMajorVersionInt(final String containedDocument) {
        if (Objects.isNull(containedDocument)) {
            return 0;
        }
        int lastUnderscorePosition = containedDocument.lastIndexOf("_");
        if ( lastUnderscorePosition != -1 ) {
            int firstDotPosition = containedDocument.indexOf(".", lastUnderscorePosition);
            return firstDotPosition != -1 ? Integer.parseInt(containedDocument.substring(lastUnderscorePosition + 1, firstDotPosition)) : 0;
        }
        return 0;
    }

    private static int nbOfIncrements(int version) {
        int increment = (version-1);
        return increment > 0 ? increment : 0;
    }
}
