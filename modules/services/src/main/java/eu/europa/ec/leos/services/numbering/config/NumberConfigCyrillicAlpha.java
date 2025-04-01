package eu.europa.ec.leos.services.numbering.config;

public class NumberConfigCyrillicAlpha extends NumberConfigAbstract implements NumberConfig {

    /**
     * Unicode start points for Cyrillic uppercase and lowercase letters
     */
    private static final int CYRILLIC_UPPERCASE_START = 1040;
    private static final int CYRILLIC_LOWERCASE_START = 1072;
    private static final int ALPHABET_LENGTH = 32;

    public NumberConfigCyrillicAlpha(boolean isUpperCase, String prefix, String suffix) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.isUpperCase = isUpperCase;
    }

    public NumberConfigCyrillicAlpha() {
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
        val = val + getCyrillicAlphaNumber(value) + getCyrillicAlphaNumber(count);
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
        return this.prefix + getCyrillicAlphaNumber(index) + this.suffix;
    }

    public int charToInteger(String label) {
        return super.charToInteger(label, CYRILLIC_BASE_UNICODE, CYRILLIC_LETTERS_COUNT);
    }

    @Override
    protected String getImplName() {
        return this.getClass().getSimpleName();
    }

}
