package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import eu.europa.ec.leos.vo.toc.TocItem;

import java.util.List;

public interface CoverPageApiService {

    DocumentViewResponse getCoverPageDocument(String documentRef);
    List<TableOfContentItemVO> getToc(String documentRef);
    List<TocItem> getTocItems(String documentRef);
}
