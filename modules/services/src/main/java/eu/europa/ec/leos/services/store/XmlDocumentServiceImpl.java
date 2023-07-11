package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;

import static eu.europa.ec.leos.cmis.support.RepositoryUtil.updateDocumentProperties;

@Service
public class XmlDocumentServiceImpl implements XmlDocumentService {
    
    private final LeosRepository leosRepository;
    private final XmlContentProcessor xmlContentProcessor;
    private final MessageHelper messageHelper;

    @Autowired
    public XmlDocumentServiceImpl(LeosRepository leosRepository, XmlContentProcessor xmlContentProcessor, MessageHelper messageHelper) {
        this.leosRepository = leosRepository;
        this.xmlContentProcessor = xmlContentProcessor;
        this.messageHelper = messageHelper;
    }
    
    public boolean updateInternalReferences(XmlDocument xmlDocument) throws Exception {
        byte[] content = xmlDocument.getContent().get().getSource().getBytes();
        byte[] newContent = xmlContentProcessor.updateReferences(content);
    
        boolean updated = ((newContent != null) && !Arrays.equals(newContent,content));
        if(updated) {
            String message = messageHelper.getMessage("internal.ref.checkinComment");
            leosRepository.updateDocument(xmlDocument.getId(), newContent, (Map<String, Object>) updateDocumentProperties(xmlDocument.getMetadata().get()), VersionType.MINOR,
                    message, XmlDocument.class);
        }
        return updated;
    }
}
