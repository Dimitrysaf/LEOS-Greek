package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface MemorandumApiService {
    DocumentViewResponse getMemorandumDocument(String documentRef);
    List<TableOfContentItemVO> getToc(String documentRef);
    List<TocItem> getTocItems(String documentRef);
}
