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

package eu.europa.ec.leos.services.api;

import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.ProposalService;
import eu.europa.ec.leos.services.exception.ExportException;
import eu.europa.ec.leos.services.export.*;
import eu.europa.ec.leos.services.store.PackageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Instance(InstanceType.COUNCIL)
@Service
public class DocumentApiServiceMandateImpl extends DocumentApiServiceImpl {

    private static final Logger LOG = LoggerFactory.getLogger(DocumentApiServiceMandateImpl.class);

    public DocumentApiServiceMandateImpl(DocumentContentService documentContentService, PackageService packageService,
                                         ProposalService proposalService, ExportService exportService, SecurityContext securityContext,
                                         MessageHelper messageHelper) {
        super(documentContentService, packageService, proposalService, exportService, securityContext, messageHelper);
    }

    @Override
    protected ExportOptions getExportOptions(XmlDocument original, XmlDocument currentDocument, Class<XmlDocument> clazz, boolean isWithAnnotations) {
        ExportOptions exportOptions = new ExportDW(ExportOptions.Output.WORD, clazz, isWithAnnotations);
        exportOptions.setExportVersions(new ExportVersions<>(original, currentDocument));
        return exportOptions;
    }

    @Override
    protected byte[] doDownloadVersion(String proposalId, ExportOptions exportOptions) {
        try {
            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".docx";
            byte[] exportedBytes = exportService.createDocuWritePackage(FileHelper.getReplacedExtensionFilename(jobFileName, "zip"), proposalId, exportOptions);
            LOG.info("Downloaded DocuWrite Document: {}", jobFileName);
            return exportedBytes;
        } catch (Exception e) {
            throw new ExportException(messageHelper.getMessage("export.docuwrite.error.message"));
        }
    }

}
