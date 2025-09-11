package eu.europa.ec.leos.services.numbering.config;

public class SoleNumberConfig extends NumberConfigAbstract implements NumberConfig{

    String soleNumberingLabel;
    boolean isSoleNumbering;

    SoleNumberConfig(String soleNumberingLabel, boolean isSoleNumbering, boolean suffixInEnd) {
        this.soleNumberingLabel = soleNumberingLabel;
        this.isSoleNumbering = isSoleNumbering;
        this.suffixInEnd = suffixInEnd;
    }

    @Override
    public String getActualNumberToShow() { return null; }

    @Override
    public void parseValue(String numAsString) { return; }

    @Override
    public void parseInitialValue(String numAsString) { return; }

    @Override
    public int getNumberIndex(String numAsString) { return 0; }

    @Override
    public String getNumberFromIndex(int index) { return null; }

    @Override
    protected String getImplName() { return null; }

    @Override
    public boolean isSoleNumbering() {
        return this.isSoleNumbering;
    }

    @Override
    public String getSoleNumberLabel() {
        return this.soleNumberingLabel;
    }

    public boolean isSuffixInEnd() {
        return suffixInEnd;
    }

}
