package eu.europa.ec.leos.services.api;

import com.sun.istack.NotNull;
import eu.europa.ec.leos.domain.common.TocMode;
import eu.europa.ec.leos.services.dto.response.LeosRenditionOutputResponse;
import eu.europa.ec.leos.services.exception.NotFoundException;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;

public interface GenericDocumentTocApiService {

    List<TableOfContentItemVO> getTableOfContent(@NotNull String docRef,
                                                 @NotNull TocMode mode) throws NotFoundException;

    String getTocAsJson(String fileName, byte[] content, TocMode mode);

    LeosRenditionOutputResponse addHtmlRendition(String xmlDocumentName, byte[] xmlContent, String tocJson);
}
