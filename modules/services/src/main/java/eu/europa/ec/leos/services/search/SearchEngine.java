package eu.europa.ec.leos.services.search;

import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.user.User;

import java.util.List;

public interface SearchEngine {
    
    byte[] replace(final byte[] docContent, final List<SearchMatchVO> searchMatchVOs, String searchText, String replaceText, boolean removeEmptyTags, User user, boolean isTrackChangesEnabled);
    List<SearchMatchVO> searchText(String searchText, boolean isMatchCase, boolean isWholeWords);
}
