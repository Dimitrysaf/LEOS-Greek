package eu.europa.ec.digit.leos.pilot.export.util;


public class ExportLW extends ExportOptions {
    
    public static final String PREFIX_LEGISWRITE = "LW_";

    public ExportLW(Output exportOutput) {
        this.exportOutput = exportOutput;
        this.withAnnotations = true;
    }

    public ExportLW(String output) {
        switch (output.toLowerCase()) {
            case "pdf":
                exportOutput = Output.PDF;
                break;
            case "lw":
                exportOutput = Output.WORD;
                break;
            default:
                throw new IllegalArgumentException("Wrong value on parameter output type '" + output + "'");
        }
    }
    
    @Override
    public String getWordPrefix() {
        return PREFIX_LEGISWRITE;
    }
    
    @Override
    public String getExportOutputDescription() {
        switch (exportOutput){
            case PDF: return "Pdf";
            case WORD: return "Legiswrite";
            default: return "-";
        }
    }
}
