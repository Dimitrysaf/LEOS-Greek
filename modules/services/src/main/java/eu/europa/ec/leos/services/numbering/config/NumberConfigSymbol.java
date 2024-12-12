package eu.europa.ec.leos.services.numbering.config;

public class NumberConfigSymbol extends NumberConfigAbstract implements NumberConfig {

    public NumberConfigSymbol(String symbol, String prefix, String suffix) {
        this.numberToShow = symbol;
        this.prefix = prefix;
        this.suffix = suffix;
    }

    @Override
    public String getActualNumberToShow() {
        return numberToShow;
    }

    @Override
    public void parseInitialValue(String numAsString) { }

    @Override
    public void parseValue(String numAsString) { }

    public int getNumberIndex(String numAsString) {
        return -1;
    }

    public String getNumberFromIndex(int index) {
        return this.prefix + this.numberToShow + this.suffix;
    }

    @Override
    protected String getImplName() {
        return this.getClass().getSimpleName();
    }
}
