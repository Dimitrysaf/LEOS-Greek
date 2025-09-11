package eu.europa.ec.leos.services.numbering.config;

public class NumberConfigAlpha extends NumberConfigAbstract implements NumberConfig {

    public NumberConfigAlpha(boolean isUpperCase, String prefix, String suffix, boolean suffixInEnd) {
        this.prefix = prefix;
        this.suffix = suffix;
        this.isUpperCase = isUpperCase;
        this.suffixInEnd = suffixInEnd;
    }

    public NumberConfigAlpha() {
        this(false, "", "", true);
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
        val = val + getAlphaNumber(value) + getAlphaNumber(count);
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
        return this.prefix + getAlphaNumber(index) + this.suffix;
    }

    public int charToInteger(String label) {
        return super.charToInteger(label, LATIN_BASE_UNICODE, LATIN_LETTERS_COUNT);
    }

    @Override
    protected String getImplName() {
        return this.getClass().getSimpleName();
    }

    public boolean isSuffixInEnd() {
        return this.suffixInEnd;
    }

}
