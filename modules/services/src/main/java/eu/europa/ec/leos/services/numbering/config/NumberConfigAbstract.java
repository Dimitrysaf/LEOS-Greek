package eu.europa.ec.leos.services.numbering.config;

public abstract class NumberConfigAbstract implements NumberConfig {

    protected static final int LATIN_BASE_UNICODE = 97;
    protected static final int LATIN_LETTERS_COUNT = 26;
    protected static final int GREEK_BASE_UNICODE = 945;
    protected static final int GREEK_LETTERS_COUNT = 25;
    protected static final int CYRILLIC_BASE_UNICODE = 1072;
    protected static final int CYRILLIC_LETTERS_COUNT = 32;

    protected int initialValue;
    protected int value;
    protected int complexValue;
    protected String numberToShow;
    protected String prefix;
    protected String suffix;
    protected boolean suffixInEnd;
    protected boolean isUpperCase;
    protected boolean isComplex;

    public NumberConfigAbstract() {
        setInitialValue(1);
    }

    @Override
    public String getNextNumberToShow() {
        if(initialValue == - value) {
            value = initialValue;
        } else {
            value++;
        }

        if (value == 0) {
            value++;// 0 is not in the scale. We skip from -1 to 1.
        }

        numberToShow = getActualNumberToShow();
        return numberToShow;
    }

    protected String getAlphaNumber(int index) {
        return integerToChar(index, LATIN_BASE_UNICODE, LATIN_LETTERS_COUNT);
    }

    protected String getCyrillicAlphaNumber(int index) {
        return integerToChar(index, CYRILLIC_BASE_UNICODE, CYRILLIC_LETTERS_COUNT);
    }

    protected String getGreekAlphaNumber(int index) {
        return integerToChar(index, GREEK_BASE_UNICODE, GREEK_LETTERS_COUNT);
    }

    @Override
    public int getValue() {
        return value;
    }

    @Override
    public void setValue(int value){
        this.value = value;
    }

    protected void setInitialValue(int value) {
       this.initialValue = value;
       this.value = -value;
    }

    @Override
    public int getComplexValue() {
        return complexValue;
    }

    @Override
    public String getComplexValueToShow() {
        return getAlphaNumber(complexValue);
    }

    @Override
    public void incrementComplexValue() {
        complexValue++;
    }

    @Override
    public void resetComplexValue() {
        complexValue = 0;
    }

    @Override
    public void setComplex(boolean isComplex) {
        this.isComplex = isComplex;
    }

    @Override
    public boolean isComplex() {
        return isComplex;
    }

    @Override
    public boolean isSoleNumbering() { return false; }

    @Override
    public String getSoleNumberLabel() { return null; }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    @Override
    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder(getImplName() + "[")
                .append("value = ").append(value)
                .append(", complexValue = ").append(complexValue)
                .append(", numberToShow = ").append(numberToShow)
                .append(", prefix = ").append(prefix)
                .append(", suffix = ").append(suffix)
                .append(", isUpperCase = ").append(isUpperCase)
                .append(", isComplex = ").append(isComplex)
                .append("]");

        return sb.toString();
    }

    protected abstract String getImplName();

    private String integerToChar(int index, int baseUniCode, int lettersCount) {
        if (index == 0) {
            return "";
        }
        index = Math.abs(index) - 1;

        int length = 1;
        int startIndex = 0;

        while (index >= startIndex + lettersCount) {
            startIndex += lettersCount;
            length++;
        }

        char ch = (char) (baseUniCode + (index - startIndex));

        return repeatCharacters(ch, length);
    }

    protected int charToInteger(String label, int baseUniCode, int lettersCount) {
        int length = label.length();
        int startIndex = 0;

        for (int i = 1; i < length; i++) {
            startIndex += lettersCount;
        }

        char firstChar = label.charAt(0);

        return startIndex + (firstChar - baseUniCode) + 1;
    }

    private String repeatCharacters(char ch, int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(ch);
        }
        return sb.toString();
    }
}
