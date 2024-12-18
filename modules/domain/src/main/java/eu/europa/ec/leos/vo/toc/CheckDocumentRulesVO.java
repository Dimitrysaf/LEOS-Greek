package eu.europa.ec.leos.vo.toc;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CheckDocumentRulesVO {
    private boolean firstElementFound;
    private boolean notAllowedElementFound;
    private boolean validStructure;
    private boolean warning;
    private List<String> messageKey;
    private TableOfContentItemVO actualSourceItemVO;

    public CheckDocumentRulesVO() {
        this.firstElementFound = false;
        this.notAllowedElementFound = false;
        this.validStructure = true;
        this.messageKey = new ArrayList();
        this.warning = false;
    }
}
