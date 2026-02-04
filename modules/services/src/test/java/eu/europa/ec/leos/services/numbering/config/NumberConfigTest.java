package eu.europa.ec.leos.services.numbering.config;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class NumberConfigTest {

    @Disabled
    @Test
    public void test_printArabicConfig() {
        NumberConfig numberConfig = new NumberConfigArabic();
        numberConfig.getNextNumberToShow();
        for (int i = 0; i < 200; i++) {
            numberConfig.incrementComplexValue();
            System.out.println(numberConfig.getComplexValue() + ", nr:" + numberConfig.getComplexValueToShow());
        }
    }

    @Test
    public void test_parseRoman() {
        NumberConfig numberConfig = new NumberConfigRoman();
        numberConfig.parseValue("i");
        assertEquals(1, numberConfig.getValue());
        assertEquals("i", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("xxxix");
        assertEquals(39, numberConfig.getValue());
        assertEquals("xxxix", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("MMMCMXCIX");
        assertEquals(3999, numberConfig.getValue());
        assertEquals("mmmcmxcix", numberConfig.getActualNumberToShow());
    }

    @Test
    public void test_parseCyrillic() {
        NumberConfig numberConfig = new NumberConfigCyrillicAlpha();
        numberConfig.parseValue("а");
        assertEquals(1, numberConfig.getValue());
        numberConfig.parseValue("я");
        assertEquals(32, numberConfig.getValue());
        numberConfig.parseValue("аа");
        assertEquals(33, numberConfig.getValue());
        numberConfig.parseValue("яя");
        assertEquals(64, numberConfig.getValue());
        numberConfig.parseValue("ааа");
        assertEquals(65, numberConfig.getValue());
        numberConfig.parseValue("яяя");
        assertEquals(96, numberConfig.getValue());
    }

    @Test
    public void test_parseGreek() {
        NumberConfig numberConfig = new NumberConfigGreekAlpha();
        numberConfig.parseValue("α");
        assertEquals(1, numberConfig.getValue());
        numberConfig.parseValue("ω");
        assertEquals(25, numberConfig.getValue());
        numberConfig.parseValue("αα");
        assertEquals(26, numberConfig.getValue());
        numberConfig.parseValue("ωω");
        assertEquals(50, numberConfig.getValue());
        numberConfig.parseValue("ααα");
        assertEquals(51, numberConfig.getValue());
        numberConfig.parseValue("ωωω");
        assertEquals(75, numberConfig.getValue());
    }

    @Test
    public void test_parseAlpha() {
        NumberConfig numberConfig = new NumberConfigAlpha();
        numberConfig.parseValue("a");
        assertEquals(1, numberConfig.getValue());
        assertEquals("a", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("z");
        assertEquals(26, numberConfig.getValue());
        assertEquals("z", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("aa");
        assertEquals(27, numberConfig.getValue());
        assertEquals("aa", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("zz");
        assertEquals(52, numberConfig.getValue());
        assertEquals("zz", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("aaa");
        assertEquals(53, numberConfig.getValue());
        assertEquals("aaa", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("zzz");
        assertEquals(78, numberConfig.getValue());
        assertEquals("zzz", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("aaaa");
        assertEquals(79, numberConfig.getValue());
        assertEquals("aaaa", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("zzzz");
        assertEquals(104, numberConfig.getValue());
        assertEquals("zzzz", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("aaaaa");
        assertEquals(105, numberConfig.getValue());
        assertEquals("aaaaa", numberConfig.getActualNumberToShow());
        numberConfig.parseValue("zzzzz");
        assertEquals(130, numberConfig.getValue());
        assertEquals("zzzzz", numberConfig.getActualNumberToShow());
    }

    @Test
    public void test_arabicConfig() {
        NumberConfig numberConfig = new NumberConfigArabic();
        numberConfig.getNextNumberToShow();
        assertEquals("1", numberConfig.getActualNumberToShow());
        assertEquals("", numberConfig.getComplexValueToShow());

        // 1. Test first cycle "a" to "z"
        numberConfig.incrementComplexValue();
        assertEquals("a", numberConfig.getComplexValueToShow());
        for (int i = 0; i < 25; i++) {
            numberConfig.incrementComplexValue();
        }
        assertEquals("z", numberConfig.getComplexValueToShow());

        // 2. Test second cycle "aa" to "zz"
        numberConfig.incrementComplexValue();
        assertEquals("aa", numberConfig.getComplexValueToShow());
        numberConfig.incrementComplexValue();
        assertEquals("bb", numberConfig.getComplexValueToShow());
        for (int i = 0; i < 22; i++) {
            numberConfig.incrementComplexValue();
        }
        numberConfig.incrementComplexValue();
        assertEquals("yy", numberConfig.getComplexValueToShow()); // 51
        numberConfig.incrementComplexValue();
        assertEquals("zz", numberConfig.getComplexValueToShow()); // 52

        // 3. Test third cycle "ba" to "bz"
        numberConfig.incrementComplexValue();
        assertEquals("aaa", numberConfig.getComplexValueToShow()); // 53
        numberConfig.incrementComplexValue();
        assertEquals("bbb", numberConfig.getComplexValueToShow()); // 54
        for (int i = 0; i < 22; i++) {
            numberConfig.incrementComplexValue();
        }
        numberConfig.incrementComplexValue();
        assertEquals("yyy", numberConfig.getComplexValueToShow()); // 77
        numberConfig.incrementComplexValue();
        assertEquals("zzz", numberConfig.getComplexValueToShow()); // 78

        // 4. Test third cycle "ca" to the "cz"
        numberConfig.incrementComplexValue();
        assertEquals("aaaa", numberConfig.getComplexValueToShow()); // 79
        for (int i = 0; i < 23; i++) {
            numberConfig.incrementComplexValue();
        }
        numberConfig.incrementComplexValue();
        assertEquals("yyyy", numberConfig.getComplexValueToShow()); // 103
        numberConfig.incrementComplexValue();
        assertEquals("zzzz", numberConfig.getComplexValueToShow()); // 104

        // 5. make sure adding more 1000 articles we have the right "complex" number
        for (int i = 1; i < 1000; i++) {
            numberConfig.incrementComplexValue();
        }
        assertEquals("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", numberConfig.getComplexValueToShow(), "For config: " + numberConfig.toString());
        assertEquals("1kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", numberConfig.getActualNumberToShow());

    }

}
