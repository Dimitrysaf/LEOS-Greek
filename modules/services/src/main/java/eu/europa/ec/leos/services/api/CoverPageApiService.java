package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;

public interface CoverPageApiService {

    String getCoverPageDocument(String documentRef);

    List<TableOfContentItemVO> getTocItems(String documentRef);
}
