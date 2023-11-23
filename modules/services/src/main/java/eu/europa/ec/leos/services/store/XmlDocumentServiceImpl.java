package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.cmis.support.RepositoryUtil.updateDocumentProperties;

@Service
public class XmlDocumentServiceImpl implements XmlDocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(XmlDocumentServiceImpl.class);

    private final LeosRepository leosRepository;
    private final XmlContentProcessor xmlContentProcessor;
    private final PackageService packageService;
    private final WorkspaceService workspaceService;
    private final MessageHelper messageHelper;

    private static final List<LeosCategory> DOCUMENTS_TO_IGNORE = Arrays.asList(LeosCategory.PROPOSAL, LeosCategory.MEMORANDUM);

    @Autowired
    public XmlDocumentServiceImpl(LeosRepository leosRepository, XmlContentProcessor xmlContentProcessor, PackageService packageService,
            WorkspaceService workspaceService, MessageHelper messageHelper) {
        this.leosRepository = leosRepository;
        this.xmlContentProcessor = xmlContentProcessor;
        this.packageService = packageService;
        this.workspaceService = workspaceService;
        this.messageHelper = messageHelper;
    }

    @Override
    @Async("delegatingSecurityContextAsyncTaskExecutor")
    public void updateInternalReferencesAsync(UpdateInternalReferencesMessage message) {
        LOG.debug("Processing internal references for document {}", message.getDocumentRef());
        LeosPackage leosPackage = packageService.findPackageByDocumentId(message.getDocumentId());
        List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
        for (XmlDocument document : documents) {
            String ref = document.getMetadata().get().getRef();
            boolean isDifferentDocument = !ref.equals(message.getDocumentRef());
            boolean canProcess = DOCUMENTS_TO_IGNORE.stream().noneMatch(p -> document.getMetadata().get().getCategory().equals(p));
            if (isDifferentDocument && canProcess) {
                try {
                    XmlDocument xmlDocument = workspaceService.findDocumentById(document.getId(), XmlDocument.class);
                    boolean updated = updateInternalReference(xmlDocument);
                    LOG.debug("updateInternalReferences processed for {}, isXmlChanged {}: ", ref, updated);
                } catch (Exception e) {
                    LOG.error("Error occurred calling updateInternalRef() for doc {}", ref, e);
                }
            }
        }
    }

    private boolean updateInternalReference(XmlDocument xmlDocument) throws Exception {
        byte[] content = xmlDocument.getContent().get().getSource().getBytes();
        byte[] newContent = xmlContentProcessor.updateReferences(content);
        boolean updated = ((newContent != null) && !Arrays.equals(newContent,content));
        if(updated) {
            String message = messageHelper.getMessage("internal.ref.checkinComment");
            leosRepository.updateDocument(xmlDocument.getId(), newContent,
                    (Map<String, Object>) updateDocumentProperties(xmlDocument.getMetadata().get()), VersionType.MINOR,
                    message, XmlDocument.class);
        }
        return updated;
    }
}
