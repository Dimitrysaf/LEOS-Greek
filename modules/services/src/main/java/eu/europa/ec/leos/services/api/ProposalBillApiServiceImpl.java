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

import eu.europa.ec.leos.domain.cmis.LeosPackage;
import eu.europa.ec.leos.domain.cmis.document.Bill;
import eu.europa.ec.leos.domain.cmis.document.Proposal;
import eu.europa.ec.leos.domain.cmis.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.collection.document.BillContextService;
import eu.europa.ec.leos.services.export.ExportLW;
import eu.europa.ec.leos.services.export.ExportOptions;
import eu.europa.ec.leos.services.export.ExportVersions;
import eu.europa.ec.leos.services.toc.StructureContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Provider;

@Service("proposalBill")
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class ProposalBillApiServiceImpl extends BillApiServiceImpl {
    private static final Logger LOG = LoggerFactory.getLogger(ProposalBillApiServiceImpl.class);

    ProposalBillApiServiceImpl(Provider<StructureContext> structureContext, Provider<CloneContext> cloneContext, Provider<BillContextService> context) {
        super(structureContext, cloneContext, context);
    }

    @Override
    public byte[] downloadVersion(String documentRef, boolean isWithAnnotations) throws Exception {
        if (isWithAnnotations) {
            //get filters
            return new byte[0];
        }
        return this.doDownloadVersion(documentRef, false, null);
    }


    private byte[] doDownloadVersion(String documentRef, boolean isWithAnnotations, String annotations){
        try {
            final Bill currentDocument = this.billService.findBillByRef(documentRef);

            LeosPackage leosPackage = packageService.findPackageByDocumentId(currentDocument.getId());
            contex.get().usePackage(leosPackage);
            Proposal proposal = this.documentViewService.getProposalFromPackage(currentDocument);
            populateCloneProposalMetadata(proposal);

            ExportOptions exportOptions;
            XmlDocument original = documentContentService.getOriginalBill(currentDocument);
            exportOptions = new ExportLW(ExportOptions.Output.PDF, Bill.class, false);
            exportOptions.setExportVersions(new ExportVersions(isClonedProposal() ? original : null, currentDocument));
            exportOptions.setWithFilteredAnnotations(isWithAnnotations);
            exportOptions.setFilteredAnnotations(annotations);
            exportOptions.setWithCoverPage(false);

            String proposalId = proposal.getId();
            if (proposalId != null) {
                createPackageForExport(exportOptions);
            }
            LOG.info("The actual version of Bill {} downloaded in {} milliseconds ({} sec)", currentDocument.getName());
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using ExportService", e);
        }
        return null;
    }

    private void createPackageForExport(ExportOptions exportOptions) {
        try {
            this.createDocumentPackageForExport(exportOptions);
        } catch (Exception e) {
            LOG.error("Unexpected error occurred while using LegisWriteExportService", e);
        }
    }

}
