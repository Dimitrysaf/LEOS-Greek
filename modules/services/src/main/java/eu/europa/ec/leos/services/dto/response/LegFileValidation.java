package eu.europa.ec.leos.services.dto.response;

import eu.europa.ec.leos.domain.vo.DocumentVO;
import eu.europa.ec.leos.domain.vo.ErrorVO;

import javax.swing.text.Document;
import java.util.List;

public class LegFileValidation {
    DocumentVO documentToBeCreated;
    List<ErrorVO> errors;

    public LegFileValidation(DocumentVO documentToBeCreated, List<ErrorVO> errors) {
        this.documentToBeCreated = documentToBeCreated;
        this.errors = errors;
    }

    public LegFileValidation() {

    }

    public DocumentVO getDocumentToBeCreated() {
        return documentToBeCreated;
    }

    public void setDocumentToBeCreated(DocumentVO documentToBeCreated) {
        this.documentToBeCreated = documentToBeCreated;
    }

    public List<ErrorVO> getErrors() {
        return errors;
    }

    public void setErrors(List<ErrorVO> errors) {
        this.errors = errors;
    }
}
