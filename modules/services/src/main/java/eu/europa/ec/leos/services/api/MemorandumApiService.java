package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.services.document.MemorandumService;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface MemorandumApiService {
    byte[] getMemorandumDocument(String documentRef);
    List<TableOfContentItemVO> getTocItems(String documentRef);
}
