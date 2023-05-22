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

import eu.europa.ec.leos.domain.cmis.LeosCategoryClass;
import eu.europa.ec.leos.domain.cmis.LeosExportStatus;
import eu.europa.ec.leos.services.dto.request.DownloadComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportComparedVersionRequest;
import eu.europa.ec.leos.services.dto.request.ExportToConsiliumRequest;
import eu.europa.ec.leos.services.dto.response.DownloadVersionResponse;

import java.io.IOException;

public interface DocumentApiService {

    DownloadVersionResponse downloadVersion(LeosCategoryClass documentType, String documentRef, String filteredAnnotations, boolean isWithAnnotations);

    DownloadVersionResponse downloadXMLComparisonFiles(LeosCategoryClass documentType, String documentRef,
                                                       DownloadComparedVersionRequest comparedVersionRequest) throws IOException;

    LeosExportStatus exportComparedVersionAsPDF(LeosCategoryClass documentType, String documentRef, DownloadComparedVersionRequest downloadComparedVersionRequest);

    DownloadVersionResponse downloadComparedVersionAsDocuwrite(LeosCategoryClass documentType, String documentRef, DownloadComparedVersionRequest downloadComparedVersionRequest)
            throws Exception;

    LeosExportStatus exportToConsilium(LeosCategoryClass documentType, String documentRef, ExportToConsiliumRequest exportToConsiliumRequest);

    String doubleCompare(LeosCategoryClass documentType, String documentRef, String originalProposalId, String intermediateMajorId, String currentId);
}
