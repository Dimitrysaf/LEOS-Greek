package eu.europa.ec.leos.services.search;

import eu.europa.ec.leos.domain.vo.SearchMatchVO;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Properties;

@Service
public class SearchServiceImpl implements SearchService {

    private static final String XML_CONTENT_IS_REQUIRED = "xml content is required";

    SearchServiceImpl(XmlContentProcessor xmlContentProcessor,
                      ObjectProvider<SearchEngine> searchEngineProvider,
                      SecurityContext securityContext, @Qualifier("applicationProperties") Properties applicationProperties){
        this.xmlContentProcessor = xmlContentProcessor;
        this.searchEngineProvider =searchEngineProvider;
        this.securityContext = securityContext;
        this.applicationProperties = applicationProperties;
    }
    protected final ObjectProvider<SearchEngine> searchEngineProvider;
    protected final XmlContentProcessor xmlContentProcessor;
    private final SecurityContext securityContext;
    private static final Logger LOG = LoggerFactory.getLogger(SearchServiceImpl.class);
    private final Properties applicationProperties;

    @Override
    public byte[] replaceText(byte[] xmlContent, String searchText, String replaceText, List<SearchMatchVO> searchMatchVOs, boolean isTrackChangesEnabled) {
        Validate.notNull(xmlContent, XML_CONTENT_IS_REQUIRED);
        try {
            SearchEngine se = searchEngineProvider.getObject(xmlContent);
            User user = securityContext != null && securityContext.hasAuthenticationInContext() ? securityContext.getUser() : null;
            return se.replace(xmlContent, searchMatchVOs, searchText, replaceText, true, user, isTrackChangesEnabled);
        } catch (Exception e) {
            LOG.error("Unable to replace", e);
            throw e;
        }
    }

    @Override
    public byte[] searchAndReplaceText(byte[] xmlContent, String searchText, String replaceText) {
        return xmlContentProcessor.searchAndReplaceText(xmlContent, searchText, replaceText);
    }

    @Override
    public List<SearchMatchVO> searchText(byte[] xmlContent, String searchText, boolean caseSensitive, boolean completeWords){
        Validate.notNull(xmlContent, XML_CONTENT_IS_REQUIRED);
        SearchEngine se = searchEngineProvider.getObject(xmlContent);
        return se.searchTextToReplace(searchText, caseSensitive, completeWords);
    }

    @Override
    public List<SearchMatchVO> searchTextForHighlight(byte[] xmlContent, String searchText, boolean caseSensitive, boolean completeWords){
        Validate.notNull(xmlContent, XML_CONTENT_IS_REQUIRED);
        SearchEngine se = searchEngineProvider.getObject(xmlContent, Boolean.TRUE);
        Integer maxSearchLimit = Integer.parseInt(applicationProperties.getProperty("leos.maximum.search.limit"));
        return se.searchTextAndHighlight(searchText, caseSensitive, completeWords, maxSearchLimit);
    }
}
