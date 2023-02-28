/*
 * Copyright 2023 European Commission
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

package eu.europa.ec.leos.services.document.util;

import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.document.Annex;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.dto.response.DocumentViewResponse;
import eu.europa.ec.leos.services.dto.response.VersionInfoVO;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.support.XmlHelper;
import eu.europa.ec.leos.services.user.UserHelperAPI;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import static eu.europa.ec.leos.util.LeosDomainUtil.CMIS_PROPERTY_SPLITTER;

@Service
public class DocumentViewService<T extends XmlDocument> {
    @Autowired
    DocumentContentService documentContentService;
    @Autowired
    SecurityContext securityContext;
    @Autowired
    PackageService packageService;
    @Autowired
    ProposalService proposalService;
    @Autowired
    UserHelperAPI userHelper;
    private static final DateTimeFormatter dateFormatter =  DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.systemDefault());

    public DocumentViewResponse getDocumentView(T document) {
        Proposal proposal = getProposalFromPackage(document);
        String editableXml = getEditableXml(document,proposal);
        VersionInfoVO versionInfoVO = getVersionInfo(document);
        return new DocumentViewResponse(getProposalRef(document.getId()),editableXml,versionInfoVO);
    }
    public VersionInfoVO getVersionInfo(T document) {
        String userId = document.getLastModifiedBy();
        User user = userHelper.getUser(userId);

        String versionLabel = null;
        String versionComment = null;
        if(document instanceof  Annex) {
            String baseRevisionId = ((Annex) document).getBaseRevisionId();
            if (StringUtils.isNotBlank(baseRevisionId) && baseRevisionId.split(CMIS_PROPERTY_SPLITTER).length >= 3) {
                versionLabel = baseRevisionId.split(CMIS_PROPERTY_SPLITTER)[1];
                versionComment = baseRevisionId.split(CMIS_PROPERTY_SPLITTER)[2];
            }
        }
        return new VersionInfoVO(
                document.getVersionLabel(),
                user.getName(), user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                dateFormatter.format(document.getLastModificationInstant()),
                document.getVersionType(), versionLabel, versionComment);
    }
    private String getEditableXml(T document, Proposal proposal) {
        securityContext.getPermissions(proposal);
        byte[] coverPageContent = new byte[0];
        //handle cover page type
        if(document instanceof Proposal) {
           byte[] proposalContent = proposal.getContent().get().getSource().getBytes();
           boolean isCoverPageExists = documentContentService.isCoverPageExists(proposalContent);
            if(isCoverPageExists) {
                byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
                coverPageContent = documentContentService.getCoverPageContent(xmlContent);
            }
            String editableXml = documentContentService.toEditableContent(proposal, "", securityContext, coverPageContent);
            editableXml = XmlHelper.removeSelfClosingElements(editableXml);
            return StringEscapeUtils.unescapeXml(editableXml);
        }
        //handle other types
        byte[] documentContent = document.getContent().get().getSource().getBytes();
        boolean isCoverPageExists = documentContentService.isCoverPageExists(documentContent);
        if(!isCoverPageExists) {
            byte[] xmlContent = proposal.getContent().get().getSource().getBytes();
            coverPageContent = documentContentService.getCoverPageContent(xmlContent);
        }
        String editableXml = documentContentService.toEditableContent(document,
                "", securityContext, coverPageContent);
        return StringEscapeUtils.unescapeXml(editableXml);
    }


    private Proposal getProposalFromPackage(T document) {
        Proposal proposal = null;
        if (document != null) {
            LeosPackage leosPackage = this.packageService.findPackageByDocumentId(document.getId());
            proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());
        }
        return proposal;
    }

    private String getProposalRef(String documentId){
        LeosPackage leosPackage = packageService.findPackageByDocumentId(documentId);
        Proposal proposal = this.proposalService.findProposalByPackagePath(leosPackage.getPath());
        return proposal.getMetadata().getOrNull().getRef();
    }
}
