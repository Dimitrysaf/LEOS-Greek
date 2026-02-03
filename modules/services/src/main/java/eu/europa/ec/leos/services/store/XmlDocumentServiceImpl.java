package eu.europa.ec.leos.services.store;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.common.VersionType;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.model.messaging.UpdateInternalReferencesMessage;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.model.xml.Element;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.dto.coedition.CoEditionContext;
import eu.europa.ec.leos.services.dto.coedition.UpdateCoEditionResponse;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.vo.coedition.InfoType;
import io.atlassian.fugue.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.leos.rest.support.RepositoryUtil.updateDocumentProperties;
import static eu.europa.ec.leos.services.support.XercesUtils.createXercesDocument;
import static eu.europa.ec.leos.services.support.XercesUtils.nodeToByteArray;

@Service
public class XmlDocumentServiceImpl implements XmlDocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(XmlDocumentServiceImpl.class);

    private final LeosRepository leosRepository;
    private final XmlContentProcessor xmlContentProcessor;
    private final PackageService packageService;
    private final WorkspaceService workspaceService;
    private final MessageHelper messageHelper;
    private final SecurityContext securityContext;
    private final SimpMessagingTemplate simpMessagingTemplate;

    private static final List<LeosCategory> DOCUMENTS_TO_IGNORE = Arrays.asList(LeosCategory.PROPOSAL, LeosCategory.MEMORANDUM);

    @Autowired
    public XmlDocumentServiceImpl(LeosRepository leosRepository, XmlContentProcessor xmlContentProcessor, PackageService packageService,
                                  WorkspaceService workspaceService, MessageHelper messageHelper, SecurityContext securityContext, SimpMessagingTemplate simpMessagingTemplate) {
        this.leosRepository = leosRepository;
        this.xmlContentProcessor = xmlContentProcessor;
        this.packageService = packageService;
        this.workspaceService = workspaceService;
        this.messageHelper = messageHelper;
        this.securityContext = securityContext;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    @Async("delegatingSecurityContextAsyncTaskExecutor")
    public void updateInternalReferencesAsync(UpdateInternalReferencesMessage message) {
        LOG.debug("Processing internal references for document {}", message.getDocumentRef());
        LeosPackage leosPackage = packageService.findPackageByDocumentId(message.getDocumentId());
        List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
        for (XmlDocument document : documents) {
            String ref = document.getMetadata().get().getRef();
            boolean canProcess = DOCUMENTS_TO_IGNORE.stream().noneMatch(p -> document.getMetadata().get().getCategory().equals(p));
            List<Element> updatedElts = new ArrayList<>();
            if (canProcess) {
                try {
                    XmlDocument xmlDocument = workspaceService.findDocumentById(document.getId(), XmlDocument.class);
                    updatedElts = updateInternalReference(xmlDocument);
                    LOG.debug("updateInternalReferences processed for {}, isXmlChanged {}: ", ref, !updatedElts.isEmpty());
                } catch (Exception e) {
                    LOG.error("Error occurred calling updateInternalRef() for doc {}", ref, e);
                }
            }
            if (!updatedElts.isEmpty()) {
                User user = securityContext.getUser();
                simpMessagingTemplate.convertAndSend(CoEditionContext.TOPIC_DOCUMENT_SLASH + ref,
                        new UpdateCoEditionResponse(user, null, ref, InfoType.DOCUMENT_POST_PROCESSING,
                                updatedElts));
            }
        }
    }

    @Override
    @Async("delegatingSecurityContextAsyncTaskExecutor")
    public void updateExternalReferencesAsync(UpdateInternalReferencesMessage message) {
        LOG.debug("Processing external references for document {}", message.getDocumentRef());
        LeosPackage leosPackage = packageService.findPackageByDocumentId(message.getDocumentId());
        List<XmlDocument> documents = packageService.findDocumentsByPackagePath(leosPackage.getPath(), XmlDocument.class, false);
        for (XmlDocument document : documents) {
            String ref = document.getMetadata().get().getRef();
            boolean canProcess = DOCUMENTS_TO_IGNORE.stream().noneMatch(p -> document.getMetadata().get().getCategory().equals(p));
            List<Element> updatedElts = new ArrayList<>();
            if (canProcess) {
                try {
                    XmlDocument xmlDocument = workspaceService.findDocumentById(document.getId(), XmlDocument.class);
                    updatedElts = updateExternalReferences(xmlDocument);
                    LOG.debug("updateExternalReferences processed for {}, isXmlChanged {}: ", ref, !updatedElts.isEmpty());
                } catch (Exception e) {
                    LOG.error("Error occurred calling updateExternalRef() for doc {}", ref, e);
                }
            }
            if (!updatedElts.isEmpty()) {
                User user = securityContext.getUser();
                simpMessagingTemplate.convertAndSend(CoEditionContext.TOPIC_DOCUMENT_SLASH + ref,
                        new UpdateCoEditionResponse(user, null, ref, InfoType.DOCUMENT_POST_PROCESSING,
                                updatedElts));
            }
        }
    }

    private List<Element> updateInternalReference(XmlDocument xmlDocument) throws Exception {
        byte[] content = xmlDocument.getContent().get().getSource().getBytes();
        Pair<byte[], List<Element>> result = xmlContentProcessor.updateReferences(content);
        updateDocumentWithNewRefs(xmlDocument, result);
        return result.right();
    }


    private List<Element> updateExternalReferences(XmlDocument xmlDocument) throws Exception {
        byte[] content = xmlDocument.getContent().get().getSource().getBytes();
        Pair<byte[], List<Element>> result = xmlContentProcessor.updateExternalReferences(content);
        updateDocumentWithNewRefs(xmlDocument, result);
        return result.right();
    }

    private void updateDocumentWithNewRefs(XmlDocument xmlDocument, Pair<byte[], List<Element>> result) throws Exception {
        if(!result.right().isEmpty()) {
            xmlDocument = workspaceService.findDocumentById(xmlDocument.getId(), XmlDocument.class);
            byte[] content = xmlDocument.getContent().get().getSource().getBytes();
            Document document = createXercesDocument(content);

            for (Element element : result.right()) {
                Node elementNode = XercesUtils.getElementById(document, element.getElementId());
                if (elementNode != null) {
                    XercesUtils.replaceElement(elementNode, element.getElementFragment());
                }
            }

            content = XercesUtils.nodeToByteArray(document);
            String message = messageHelper.getMessage("internal.ref.checkinComment");
            leosRepository.updateDocument(xmlDocument.getId(), content,
                    (Map<String, Object>) updateDocumentProperties(xmlDocument.getMetadata().get()), VersionType.MINOR,
                    message, XmlDocument.class);
        }
    }
}
