package eu.europa.ec.leos.services.numbering.config;

public class NumberConfigGreekAlpha extends NumberConfigAbstract implements NumberConfig {

    /**
     * Unicode start points for Greek uppercase and lowercase letters
     */
    private static final int GREEK_UPPERCASE_START = 913;
    private static final int GREEK_LOWERCASE_START = 945;
    private static final int ALPHABET_LENGTH = 25;

    public NumberConfigGreekAlpha(boolean isUpperCase, String prefix, String suffix) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.isUpperCase = isUpperCase;
    }

    public NumberConfigGreekAlpha() {
        this(false, "", "");
    }

    @Override
    public String getActualNumberToShow() {
        int count = complexValue;
        if (value < 0) {
            // When numbering start from -1, we do not start complexValue from "a"
            // instead of -1a, -1b, -1c we show -1, -1a, -1b. Shift 1 alpha char to the left.
            count = complexValue - 1;
        }

        String val = "";
        if (value < 0) {
            val = "-";
        }
        val = val + getGreekAlphaNumber(value) + getGreekAlphaNumber(count);
        return isUpperCase ? val.toUpperCase() : val;
    }

    @Override
    public void parseInitialValue(String numAsString) {
        int num = charToInteger(numAsString);
        setInitialValue(num);
    }

    @Override
    public void parseValue(String numAsString) {
        int num = charToInteger(numAsString);
        setValue(num);
    }

    public int getNumberIndex(String numAsString) {
        return charToInteger(numAsString.replace(this.prefix, "").replace(this.suffix, ""));
    }

    public String getNumberFromIndex(int index) {
        return this.prefix + getGreekAlphaNumber(index) + this.suffix;
    }

    public int charToInteger(String numAsString) {
        int numAsInt = 0;
        for (int index = 0; index < numAsString.length(); index++) {
            int pow = numAsString.length() - 1 - index;
            int decimalCodePoint = (int) numAsString.charAt(index);
            if(decimalCodePoint >= 962) {
                decimalCodePoint = decimalCodePoint - 1;
            }
            numAsInt = numAsInt + ((decimalCodePoint - 944) * (int) (Math.pow(24, pow)));
        }
        return numAsInt;
    }

    @Override
    protected String getImplName() {
        return this.getClass().getSimpleName();
    }

}
