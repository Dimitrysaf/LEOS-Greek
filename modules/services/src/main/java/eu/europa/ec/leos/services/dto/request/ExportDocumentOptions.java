package eu.europa.ec.leos.services.dto.request;

public class ExportDocumentOptions {
    private OutputType outputType;
    private boolean withAnnotations;

    public enum OutputType {
        PDF,
        WORD,
        XML
    }

    public ExportDocumentOptions() {
    }

    public ExportDocumentOptions(OutputType outputType, boolean withAnnotations) {
        this.outputType = outputType;
        this.withAnnotations = withAnnotations;
    }

    public OutputType getOutputType() {
        return outputType;
    }

    public void setOutputType(OutputType outputType) {
        this.outputType = outputType;
    }

    public boolean isWithAnnotations() {
        return withAnnotations;
    }

    public void setWithAnnotations(boolean withAnnotations) {
        this.withAnnotations = withAnnotations;
    }
}
