package eu.europa.ec.leos.services.dto.request;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItemPosition;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class TocValidationRequest implements Serializable {

    private LeosCategory documentType;
    private String documentRef;
    private List<TableOfContentItemVO> tableOfContentItemVOs;
}
