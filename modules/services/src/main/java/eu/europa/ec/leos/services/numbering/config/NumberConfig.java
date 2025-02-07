package eu.europa.ec.leos.services.numbering.config;

public interface NumberConfig {

    String getActualNumberToShow();
    String getNextNumberToShow();
    void parseValue(String numAsString);
    int getValue();
    void setValue(int value);
    void parseInitialValue(String numAsString);

    int getNumberIndex(String numAsString);
    String getNumberFromIndex(int index);

    String getPrefix();
    String getSuffix();

    void setComplex(boolean isComplex);
    boolean isComplex();
    boolean isSoleNumbering();
    String getSoleNumberLabel();

    int getComplexValue();
    String getComplexValueToShow();
    void incrementComplexValue();
    void resetComplexValue();
}
