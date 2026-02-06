package eu.europa.ec.leos.services.structure.details;
/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence")
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.repository.document.ConfigDocument;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.repository.metadata.SignatureMetadata;
import eu.europa.ec.leos.model.proposal.ProposalDetailsLists;
import eu.europa.ec.leos.repository.store.ConfigurationRepository;
import eu.europa.ec.leos.services.store.TemplateService;
import eu.europa.ec.leos.services.structure.lang.LanguageGroupService;
import eu.europa.ec.leos.services.support.XercesUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static eu.europa.ec.leos.services.support.XmlHelper.ORGANIZATION;
import static eu.europa.ec.leos.services.support.XmlHelper.PERSON;
import static eu.europa.ec.leos.services.support.XmlHelper.REFERS_TO_ATTR;
import static eu.europa.ec.leos.services.support.XmlHelper.ROLE;
import static eu.europa.ec.leos.services.support.XmlHelper.SIGNATURE;

@Component
public class ProposalDetailsService {

    private static final Logger LOG = LoggerFactory.getLogger(ProposalDetailsService.class);

    @Value("${leos.templates.path}")
    private String proposalDetailsPath;

    @Value("${leos.proposal.details.name}")
    private String proposalDetailsName;

    private final ConfigurationRepository configurationRepository;
    private final TemplateService templateService;
    private final LanguageGroupService languageService;

    @Autowired
    public ProposalDetailsService(ConfigurationRepository configurationRepository, TemplateService templateService, LanguageGroupService languageService) {
        this.configurationRepository = configurationRepository;
        this.templateService = templateService;
        this.languageService = languageService;
    }

    public ProposalDetailsLists populateTemplateSignatures(ProposalDetailsLists proposalDetailsLists, List<XmlDocument> proposalDocs) {
        Optional<XmlDocument> legalAct = proposalDocs.stream().filter((d) -> d.getCategory().equals(LeosCategory.BILL)).findAny();
        if (legalAct.isPresent()) {
            String template = legalAct.get().getMetadata().get().getDocTemplate();
            XmlDocument templateDocument = templateService.getTemplate(template);
            List<SignatureMetadata> templateSignatures = extractSignatures(templateDocument.getContent().get().getSource().getBytes());
            proposalDetailsLists.setTemplateSignatures(templateSignatures);
        }
        return proposalDetailsLists;
    }

    private List<SignatureMetadata> extractSignatures(byte[] source) {
        List<SignatureMetadata> signatures = new ArrayList<>();
        try {
            Document document = XercesUtils.createXercesDocument(source, true);
            NodeList signatureNodes = XercesUtils.getElementsByName(document, SIGNATURE);
            for (int i=0;i < signatureNodes.getLength();i++) {
                Node signatureNode = signatureNodes.item(i);
                SignatureMetadata signature = new SignatureMetadata();
                List<Node> children = XercesUtils.getChildren(signatureNode);
                for (Node child : children) {
                    if (child.getNodeName().equals(ROLE)) {
                        signature.setCommissionerTitle(XercesUtils.getAttributeValue(child, REFERS_TO_ATTR).replaceAll("~",""));
                    }
                    if (child.getNodeName().equals(ORGANIZATION)) {
                        signature.setSpecialMention(XercesUtils.getAttributeValue(child, REFERS_TO_ATTR).replaceAll("~",""));
                    }
                    if (child.getNodeName().equals(PERSON)) {
                        signature.setSigningCommissioner(child.getTextContent());
                    }
                }
                signatures.add(signature);
            }
        } catch (Exception ex) {
            return signatures;
        }
        return signatures;
    }

    public ProposalDetailsLists getProposalDetailsLists() {
        byte[] proposalDetailsDocument = getProposalDetailsDocument();
        return loadProposalDetailsFromFile(proposalDetailsDocument);
    }

    public byte[] getProposalDetailsDocument() {
        ConfigDocument proposalDetailsDocument = configurationRepository.findConfiguration(proposalDetailsPath, proposalDetailsName);
        return proposalDetailsDocument.getContent().get().getSource().getBytes();
    }

    private ProposalDetailsLists loadProposalDetailsFromFile(byte[] fileBytes) {
        try {
            String json = new String(fileBytes);
            ObjectMapper mapper = new ObjectMapper();
            ProposalDetailsLists propDetails = mapper
                    .readValue(json, new TypeReference<ProposalDetailsLists>(){});
            return propDetails;
        } catch (Exception e) {
            LOG.debug("Error in loadProposalDetailsFromFile", e);
            throw new IllegalStateException("Error loading proposal details configurations", e);
        }
    }
}
