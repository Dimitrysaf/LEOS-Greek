package eu.europa.ec.leos.services.search;

import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface SearchService {
    @PreAuthorize("hasPermission(#xmlContent, 'CAN_UPDATE')")
    byte[] replaceText(byte[] xmlContent, String searchText, String replaceText, List<SearchMatchVO> searchMatchVOs, boolean isTrackChangesEnabled);

    byte[] searchAndReplaceText(byte[] xmlContent, String searchText, String replaceText);

    List<SearchMatchVO> searchText(byte[] xmlContent, String searchText, boolean caseSensitive, boolean completeWords);
    List<SearchMatchVO> searchTextForHighlight(byte[] xmlContent, String searchText, boolean caseSensitive, boolean completeWords);
}
