package eu.europa.ec.leos.services.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TocValidationRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String documentType;
    private String documentRef;
    private List<TableOfContentItemVO> tableOfContentItemVOs;
}
