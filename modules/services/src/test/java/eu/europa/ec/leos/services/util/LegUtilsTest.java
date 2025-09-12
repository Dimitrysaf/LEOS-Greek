package eu.europa.ec.leos.services.util;

import eu.europa.ec.leos.services.utils.LegUtils;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class LegUtilsTest {

    @ParameterizedTest
    @CsvSource(value = {
            "main-xxx-en_1.0.0.0,1",
            "main-clpsel089000far563i2744ps-en_2.0.0,2",
            "main-cln1vkvek000rsd56edtmtj7c-en_3.0.0,3",
            "main-cln1vkvek000rsd56edtmtj7c-en_3.4.5.6,3",
            "main-cln1vkvek000rsd56edtmtj7c-en_xx,0",
            "main-cln1vkvek000rsd56edtmtj7c-en,0",
    })
    public void test_getPartMajorVersionInt(String containedDocument, int expectedResult) {
        int milestoneVersionInt = LegUtils.getPartMajorVersionInt(containedDocument);
        assertThat(milestoneVersionInt).isEqualTo(expectedResult);
    }

    @ParameterizedTest
    @CsvSource(value = {
            "main-xxx-en_1.0.0.0,REG-yyy-en_1.0.0,EXPL_MEMORANDUM-zzz-en_1.0.0|1",
            "main-xxx-en_2.0.0.0,REG-yyy-en_1.0.0,EXPL_MEMORANDUM-zzz-en_1.0.0|2",
            "main-xxx-en_2.0.0.0,REG-yyy-en_2.0.0,EXPL_MEMORANDUM-zzz-en_1.0.0|3",
            "main-xxx-en_2.0.0.0,REG-yyy-en_2.0.0,EXPL_MEMORANDUM-zzz-en_2.0.0|4",
            "main-xxx-en_3.0.0.0,REG-yyy-en_2.0.0,EXPL_MEMORANDUM-zzz-en_2.0.0|5",
    }
            , delimiter = '|')
    public void test_MilestoneVersionInt(String containedDocuments, int expectedResult) {
        List<String> list = Arrays.asList(containedDocuments.split(","));
        int milestoneVersionInt = LegUtils.getMilestoneVersionInt(list);
        assertThat(milestoneVersionInt).isEqualTo(expectedResult);
    }

    @ParameterizedTest
    @CsvSource(value = {
            "main-xxx-en_1.0.0.0,REG-yyy-en_1.0.0,EXPL_MEMORANDUM-zzz-en_1.0.0|1.0.0.0",
            "main-xxx-en_2.0.0.0,REG-yyy-en_1.0.0,EXPL_MEMORANDUM-zzz-en_1.0.0|2.0.0.0",
            "main-xxx-en_2.0.0.0,REG-yyy-en_2.0.0,EXPL_MEMORANDUM-zzz-en_1.0.0|3.0.0.0",
            "main-xxx-en_2.0.0.0,REG-yyy-en_2.0.0,EXPL_MEMORANDUM-zzz-en_2.0.0|4.0.0.0",
            "main-xxx-en_3.0.0.0,REG-yyy-en_2.0.0,EXPL_MEMORANDUM-zzz-en_2.0.0|5.0.0.0",
    }
            , delimiter = '|')
    public void test_fetchMilestoneVersion(String containedDocuments, String expectedResult) {
        List<String> list = Arrays.asList(containedDocuments.split(","));
        assertThat(LegUtils.fetchMilestoneVersion(list)).isEqualTo(expectedResult);
    }
}