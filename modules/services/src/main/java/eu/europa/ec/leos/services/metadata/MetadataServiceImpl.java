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
package eu.europa.ec.leos.services.metadata;

import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.integration.AKN4EUService;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.export.LegPackage;
import eu.europa.ec.leos.services.export.ZipPackageUtil;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class MetadataServiceImpl implements MetadataService {

    private static final Logger LOG = LoggerFactory.getLogger(MetadataServiceImpl.class);
    protected final MetadataHelper metadataHelper;
    protected final AKN4EUService akn4euService;

    public static final String FILE_NOT_DELETED = "File not deleted {}";

    @Autowired
    MetadataServiceImpl(MetadataHelper metadataHelper, AKN4EUService akn4euService) {
        this.metadataHelper = metadataHelper;
        this.akn4euService = akn4euService;
    }

    protected LeosFile createZipFile(LegPackage legPackage, String jobFileName, MetadataOptions metadataOptions) throws Exception {
        Validate.notNull(legPackage);
        Validate.notNull(jobFileName);
        Validate.notNull(metadataOptions);
        try (ByteArrayOutputStream contentFileContent = metadataHelper.createContentFile(metadataOptions, legPackage.getExportResource())) {
            Map<String, Object> contentToZip = new HashMap<>();
            contentToZip.put("content.xml", contentFileContent.toByteArray());
            String propActFileName = legPackage.getExportResource().getName() + ".leg";
            contentToZip.put(propActFileName, legPackage.getFile().getBytes());
            return ZipPackageUtil.zipLeosFiles(jobFileName, contentToZip, "");
        }
    }

    @Override
    public Map<String, Object> applyMetadata(LegPackage legPackage, Proposal proposal, MetadataOptions metadataOptions, User user) throws Exception {
        Validate.notNull(metadataOptions);
        Validate.notNull(proposal);
        LeosFile legFile = null;
        long start = System.currentTimeMillis();
        try {
            legFile = createZipFile(legPackage, "job.zip", metadataOptions);
            LOG.info("[PERF-UPDATE-METADATA] createZipFile completed in {} ms", System.currentTimeMillis() - start);
            byte[] zipBytes = akn4euService.applyMetadata(legFile, user);
            LOG.info("[PERF-UPDATE-METADATA] akn4euService.applyMetadata completed in {} ms", System.currentTimeMillis() - start);
            Map<String, Object> zipContent = ZipPackageUtil.unzipByteArray(zipBytes);
            for (String fileName : zipContent.keySet()) {
                if (fileName.endsWith(".leg")) {
                    Map<String, Object> result = ZipPackageUtil.unzipByteArray((byte[]) zipContent.get(fileName));
                    LOG.info("[PERF-UPDATE-METADATA] applyMetadata total completed in {} ms", System.currentTimeMillis() - start);
                    return result;
                }
            }
            LOG.error("An exception occurred while updating proposal's metadata");
            throw new Exception("An exception occurred while updating proposal's metadata");
        } catch (Exception e) {
            LOG.error("An exception occurred while updating proposal's metadata: ", e);
            throw e;
        }
    }
}
