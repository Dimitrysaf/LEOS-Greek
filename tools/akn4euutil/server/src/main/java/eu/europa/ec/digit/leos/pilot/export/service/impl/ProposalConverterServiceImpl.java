/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.model.DocumentVO;
import eu.europa.ec.digit.leos.pilot.export.model.LeosCategory;
import eu.europa.ec.digit.leos.pilot.export.model.MetadataVO;
import eu.europa.ec.digit.leos.pilot.export.service.processor.content.XmlContentProcessor;
import eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor;
import eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeProcessor;
import eu.europa.ec.digit.leos.pilot.export.util.XPathCatalog;
import eu.europa.ec.digit.leos.pilot.export.util.ZipUtil;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.ANNEX_INDEX_META;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.ANNEX_NUMBER_META;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.ANNEX_TITLE_META;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_EEA_RELEVANCE_COVER;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_LANGUAGE;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_PURPOSE_META;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_SPECIFIC_TEMPLATE;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_STAGE_META;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_TEMPLATE;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_TYPE_META;
import static eu.europa.ec.digit.leos.pilot.export.service.processor.node.XmlNodeConfigProcessor.DOC_VERSION;
import static eu.europa.ec.digit.leos.pilot.export.util.XmlUtil.XML_DOC_EXT;
import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class ProposalConverterServiceImpl implements ProposalConverterService {

    private static final Logger LOG = LoggerFactory.getLogger(ProposalConverterServiceImpl.class);

    private final XmlNodeProcessor xmlNodeProcessor;
    private final XmlNodeConfigProcessor xmlNodeConfigProcessor;
    protected final XmlContentProcessor xmlContentProcessor;
    protected final XPathCatalog xPathCatalog;

    public static final String PROPOSAL_FILE = "main";

    @Autowired
    ProposalConverterServiceImpl(
            XmlNodeProcessor xmlNodeProcessor,
            XmlNodeConfigProcessor xmlNodeConfigProcessor,
            XmlContentProcessor xmlContentProcessor, XPathCatalog xPathCatalog) {
        this.xmlNodeProcessor = xmlNodeProcessor;
        this.xmlNodeConfigProcessor = xmlNodeConfigProcessor;
        this.xmlContentProcessor = xmlContentProcessor;
        this.xPathCatalog = xPathCatalog;
    }

    public DocumentVO createProposalFromLegFile(Map<String, Object> unzippedFiles, boolean canModifySource) {
        DocumentVO proposal = new DocumentVO(LeosCategory.PROPOSAL);

        try {
            String proposalFileKey = unzippedFiles.keySet().stream().filter(x -> x.startsWith(PROPOSAL_FILE) && x.endsWith(XML_DOC_EXT)).findFirst().orElse("");
            if (unzippedFiles.containsKey(proposalFileKey)) {
                List<DocumentVO> propChildDocs = new ArrayList<>();
                byte[] proposalContent = (byte[]) unzippedFiles.get(proposalFileKey);
                File proposalFile = convertToFile(proposalContent);
                updateSource(proposal, proposalFile, canModifySource);
                updateDocIdFromXml(proposal, LeosCategory.PROPOSAL, proposalFileKey);
                updateMetadataVO(proposal);
                List<DocumentVO> billChildDocs = new ArrayList<>();
                DocumentVO billDoc = null;
                HashMap<Integer, DocumentVO> annexes = new HashMap<>();
                for (String docName : unzippedFiles.keySet()) {
                    if(docName.startsWith(PROPOSAL_FILE)) {
                        continue;
                    }
                    byte[] docContent = (byte[]) unzippedFiles.get(docName);
                    File docFile = convertToFile(docContent);
                    DocumentVO doc = createDocument(docName, docFile, canModifySource);
                    if (doc != null) {
                        if (doc.getCategory() == LeosCategory.ANNEX) {
                            annexes.put(new Integer(doc.getMetadata().getIndex()), doc);
                        } else if (doc.getCategory() == LeosCategory.MEDIA) {
                            billChildDocs.add(doc);
                        } else if (doc.getCategory() == LeosCategory.BILL) {
                            billDoc = doc;
                        } else {
                            propChildDocs.add(doc);
                        }
                    }
                }
                billChildDocs.addAll(annexes.values());
                if (billDoc != null) {
                    billDoc.setChildDocuments(billChildDocs);
                    propChildDocs.add(billDoc);
                }
                proposal.setChildDocuments(propChildDocs);
            }
        } catch (Exception e) {
            LOG.error("Error generating the map of the document: {}", e);
        }
        return proposal;
    }

    private File convertToFile(byte[] proposal) {
        File file = new File("proposal.xml");
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(proposal);
        } catch (IOException e) {
            LOG.error("Error in converting the proposal to a file: {}", e);
        }
        return file;
    }

    private void updateDocIdFromXml(final DocumentVO documentVO, LeosCategory docCategory, String docName) {
        Map<String, String> metadataMap = xmlNodeProcessor.getValuesFromXml(documentVO.getSource(),
                new String[]{XmlNodeConfigProcessor.DOC_OBJECT_ID, XmlNodeConfigProcessor.DOC_REF_META},
                xmlNodeConfigProcessor.getConfig(docCategory));
        String docId = metadataMap.get(XmlNodeConfigProcessor.DOC_OBJECT_ID);
        String docRef = metadataMap.get(XmlNodeConfigProcessor.DOC_REF_META);
        documentVO.setId(docId != null ? docId : docName);
        documentVO.setRef(docRef != null ? docRef : docName);
        documentVO.setName(docName);
    }

    @Override
    public DocumentVO createDocument(String docName, File docFile, boolean canModifySource) {
        DocumentVO doc = null;
        try {
            if (docName.endsWith(XML_DOC_EXT)) {
                byte[] xmlBytes = Files.readAllBytes(docFile.toPath());
                LeosCategory category = xmlContentProcessor.identifyCategory(docName, xmlBytes);
                if (category != null) {
                    doc = new DocumentVO(category);
                    updateSource(doc, docFile, canModifySource);
                    updateDocIdFromXml(doc, category, docName);
                    updateMetadataVO(doc);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error occurred while reading doc file", e);
        }
        return doc;
    }

    public void updateSource(final DocumentVO document, File documentFile, boolean canModifySource) {
        try {
            byte[] xmlBytes = Files.readAllBytes(documentFile.toPath());
            String xmlContent = new String(xmlBytes, UTF_8);
            xmlBytes = xmlContent.getBytes(UTF_8);
            if (document.getCategory() == LeosCategory.BILL && canModifySource) {
                // We have to remove the references to the annexes, we will add them when importing
                xmlBytes = xmlContentProcessor.removeElements(xmlBytes, xPathCatalog.getXPathAttachments(), 0);
            }
            document.setSource(xmlBytes);
        } catch (Exception e) {
            LOG.error("Error updating the source of the document: {}", e);
            // the post validation will take care to analyse wether the source is there or not
            document.setSource(null);
        }
    }

    private void updateMetadataVO(final DocumentVO document) {
        if (document.getSource() != null) {
            try {
                MetadataVO metadata = document.getMetadata();
                Map<String, String> metadataVOMap = xmlNodeProcessor.getValuesFromXml(document.getSource(), new String[]{
                        DOC_PURPOSE_META,
                        DOC_STAGE_META,
                        DOC_TYPE_META,
                        DOC_LANGUAGE,
                        DOC_VERSION,
                        DOC_SPECIFIC_TEMPLATE,
                        DOC_TEMPLATE,
                        DOC_EEA_RELEVANCE_COVER,
                        ANNEX_TITLE_META,
                        ANNEX_INDEX_META,
                        ANNEX_NUMBER_META,
                }, xmlNodeConfigProcessor.getConfig(document.getCategory()));

                metadata.setDocVersion(metadataVOMap.get(DOC_VERSION));
                metadata.setDocPurpose(metadataVOMap.get(DOC_PURPOSE_META));
                metadata.setDocStage(metadataVOMap.get(DOC_STAGE_META));
                metadata.setDocType(metadataVOMap.get(DOC_TYPE_META));
                metadata.setLanguage(metadataVOMap.get(DOC_LANGUAGE));
                metadata.setDocTemplate(metadataVOMap.get(DOC_SPECIFIC_TEMPLATE));
                metadata.setTemplate(metadataVOMap.get(DOC_TEMPLATE));
                metadata.setTitle(metadataVOMap.get(ANNEX_TITLE_META));

                metadata.setIndex(metadataVOMap.get(ANNEX_INDEX_META));
                metadata.setNumber(metadataVOMap.get(ANNEX_NUMBER_META));

                // For now, only check for the existence of an eeaRelevance: text-> boolean
                String eeaRelevanceText = metadataVOMap.get(DOC_EEA_RELEVANCE_COVER);
                metadata.setEeaRelevance(eeaRelevanceText != null && !eeaRelevanceText.isEmpty());

                document.setMetaData(metadata);
            } catch (Exception e) {
                LOG.error("Error parsing metadata {}", e);
            }
        }
    }

    private void deleteFiles(File mainFile, Map<String, Object> unzippedFiles, String unzipPath) {
        if (!mainFile.delete()) {
            LOG.info("File not deleted {}", mainFile.getPath());
        }
        List<String> parentFolders = new ArrayList<>();
        for (String docName : unzippedFiles.keySet()) {
            File unzippedFile = (File) unzippedFiles.get(docName);
            String parent = unzippedFile.getParent();
            if (!parentFolders.contains(parent)) {
                parentFolders.add(parent);
            }
            if (!unzippedFile.delete()) {
                LOG.info("File not deleted {}", unzippedFile.getPath());
            }
        }
        try {
            // we must clean also the folder.
            for (String parent : parentFolders) {
                FileUtils.deleteDirectory(new File(parent));
            }
        } catch (IOException e) {
            LOG.error("Error deleting the folder {}", e);
        }
    }
}
