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


import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Annex;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.AnnexContextService;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.export.ExportDW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.structure.StructureContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Provider;

@Service("mandateAnnex")
@Instance(InstanceType.COUNCIL)
public class MandateAnnexApiServiceImpl extends AnnexApiServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(MandateAnnexApiServiceImpl.class);

    MandateAnnexApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext, Provider<BillContextService> context, Provider<AnnexContextService> annexContext) {
        super(structureContext, cloneContext, context, annexContext);
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        if (isWithAnnotations) {
            //get filters
            return new byte[0];
        }
        return this.doDownloadVersion(documentRef, false, null);
    }

    private byte[] doDownloadVersion(String documentRef, boolean isWithAnnotations, String annotations) throws Exception {
        try {
            Annex annex = this.annexService.findAnnexByRef(documentRef);

            LeosPackage leosPackage = packageService.findPackageByDocumentRef(annex.getMetadata().get().getRef(), Annex.class);
            contex.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(annex);

            XmlDocument original = documentContentService.getOriginalAnnex(annex);
            ExportOptions exportOptions;

            boolean isLiveDiffing = annex.isLiveDiffingRequired() || !documentContentService.isRevisionAnnex(annex);
            if (!isLiveDiffing) {
                original = annex; // For NO Diffing
            }
            exportOptions = new ExportDW(ExportOptions.Output.WORD, Annex.class, false);
            exportOptions.setExportVersions(new ExportVersions<>(original, annex));
            exportOptions.setWithCoverPage(false);
            exportOptions.setWithFilteredAnnotations(isWithAnnotations);
            exportOptions.setFilteredAnnotations(annotations);
            String proposalId = proposal.getId();

            final String jobFileName = "Proposal_" + proposalId + "_AKN2DW_" + System.currentTimeMillis() + ".docx";
            return exportService.createDocuWritePackage(jobFileName, proposalId, exportOptions);

        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
            throw new Exception("Unexpected error occured while using Export service", e);
        }
    }
}
