package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;

public interface BillApiService {

    byte[] getBillDocument(String documentRef);

    List<TableOfContentItemVO> getTocItems(String documentRef);
}
