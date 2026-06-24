package eu.europa.ec.leos.services.export;

import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.domain.repository.common.LeosFile;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.integration.AKN4EUService;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.clone.CloneContext;
import eu.europa.ec.leos.services.document.AnnexService;
import eu.europa.ec.leos.services.document.BillService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.store.LegService;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.structure.StructureContext;
import jakarta.inject.Provider;
import org.apache.commons.lang3.Validate;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
@Instance(InstanceType.OS)
public class OSExportServiceImpl extends ExportServiceImpl {

    private static final Logger LOG = LoggerFactory.getLogger(OSExportServiceImpl.class);

    private final AKN4EUService akn4euService;
    private final CloneContext cloneContext;

    @Autowired
    OSExportServiceImpl(LegService legService, PackageService packageService, SecurityContext securityContext,
                        ExportHelper exportHelper, BillService billService, AnnexService annexService,
                        TransformationService transformationService, AKN4EUService akn4euService,
                        CloneContext cloneContext, Provider<StructureContext> structureContextProvider) {
        super(legService, packageService, securityContext, exportHelper, billService, annexService,
                transformationService, structureContextProvider);
        this.akn4euService = akn4euService;
        this.cloneContext = cloneContext;
    }

    @Override
    public String exportToToolboxCoDe(String documentId, ExportOptions exportOptions) throws Exception {
        LOG.debug("OS export: converting document {} via akn4euutil", documentId);
        LegPackage legPackage = legService.createLegPackage(documentId, exportOptions);
        String outputDescriptor = exportOptions.getExportVersions() != null
                ? exportHelper.createJsonOutputDescriptorFile(exportOptions, cloneContext.isClonedProposal())
                : null;
        akn4euService.convert(legPackage.getFile(), securityContext.getUser(), outputDescriptor);
        return "local-akn4eu-export";
    }

    @Override
    public byte[] exportToToolboxCoDeDownload(String documentId, ExportOptions exportOptions) throws Exception {
        LOG.debug("OS export download: generating PDF for document {} via akn4euutil+weasyprint", documentId);
        LegPackage legPackage = legService.createLegPackage(documentId, exportOptions);

        Map<String, byte[]> htmlRenditions;
        try {
            htmlRenditions = akn4euService.getHtmlRenditions(legPackage.getFile(), securityContext.getUser());
        } catch (Exception e) {
            LOG.warn("Failed to get HTML renditions from akn4euutil, falling back to LEG package: {}", e.getMessage());
            return legPackage.getFile().getBytes();
        }

        if (htmlRenditions.isEmpty()) {
            LOG.warn("No HTML renditions produced; returning raw LEG package");
            return legPackage.getFile().getBytes();
        }

        List<byte[]> pdfs = new ArrayList<>();
        for (Map.Entry<String, byte[]> entry : htmlRenditions.entrySet()) {
            try {
                byte[] pdf = renderHtmlZipToPdf(entry.getValue());
                if (pdf != null && pdf.length > 0) {
                    pdfs.add(pdf);
                }
            } catch (Exception e) {
                LOG.error("WeasyPrint failed for {}: {}", entry.getKey(), e.getMessage());
            }
        }

        if (pdfs.isEmpty()) {
            LOG.warn("WeasyPrint produced no output; returning raw LEG package");
            return legPackage.getFile().getBytes();
        }

        return pdfs.size() == 1 ? pdfs.get(0) : mergePdfs(pdfs);
    }

    @Override
    public void createDocumentPackage(String jobFileName, String proposalId, ExportOptions exportOptions, User user) throws Exception {
        LOG.debug("OS createDocumentPackage: converting proposal {} via akn4euutil", proposalId);
        Validate.notNull(exportOptions);
        Validate.notNull(proposalId);
        exportOptions.setDocuwrite(false);
        LegPackage legPackage = legService.createLegPackage(proposalId, exportOptions);
        String outputDescriptor = exportOptions.getExportVersions() != null
                ? exportHelper.createJsonOutputDescriptorFile(exportOptions, cloneContext.isClonedProposal())
                : null;
        akn4euService.convert(legPackage.getFile(), user, outputDescriptor);
    }

    @Override
    public byte[] exportToToolboxCoDe(LeosFile legFile, ExportOptions exportOptions) throws Exception {
        LOG.debug("OS export LEG file {} via akn4euutil", legFile.getName());
        byte[] result = akn4euService.applyMetadata(legFile, securityContext.getUser());
        if (result == null || result.length == 0) {
            LOG.warn("akn4euutil returned empty response; returning raw LEG file");
            return legFile.getBytes();
        }
        return result;
    }

    private byte[] renderHtmlZipToPdf(byte[] htmlZipBytes) throws Exception {
        Path tempDir = Files.createTempDirectory("leos-pdf-");
        try {
            try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(htmlZipBytes))) {
                ZipEntry entry;
                while ((entry = zis.getNextEntry()) != null) {
                    Path target = tempDir.resolve(entry.getName()).normalize();
                    if (!target.startsWith(tempDir)) continue; // zip slip protection
                    Files.createDirectories(target.getParent());
                    try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                        StreamUtils.copy(zis, bos);
                        Files.write(target, bos.toByteArray());
                    }
                }
            }

            Optional<Path> htmlFile = Files.list(tempDir)
                    .filter(p -> p.getFileName().toString().endsWith(".html"))
                    .findFirst();
            if (!htmlFile.isPresent()) {
                throw new Exception("No HTML file found in renditions ZIP");
            }

            Path pdfOutput = tempDir.resolve("output.pdf");
            ProcessBuilder pb = new ProcessBuilder(
                    "weasyprint",
                    htmlFile.get().toAbsolutePath().toString(),
                    pdfOutput.toAbsolutePath().toString()
            );
            pb.directory(tempDir.toFile());
            pb.redirectErrorStream(true);
            Process process = pb.start();
            String processOutput = new String(process.getInputStream().readAllBytes());
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new Exception("WeasyPrint failed (exit " + exitCode + "): " + processOutput);
            }

            if (!Files.exists(pdfOutput)) {
                throw new Exception("WeasyPrint produced no output file");
            }
            LOG.debug("WeasyPrint rendered PDF ({} bytes)", Files.size(pdfOutput));
            return Files.readAllBytes(pdfOutput);
        } finally {
            deleteTempDir(tempDir);
        }
    }

    private byte[] mergePdfs(List<byte[]> pdfList) throws Exception {
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        merger.setDestinationStream(out);
        for (byte[] pdf : pdfList) {
            merger.addSource(new RandomAccessReadBuffer(pdf));
        }
        merger.mergeDocuments(null);
        return out.toByteArray();
    }

    private void deleteTempDir(Path dir) {
        try {
            Files.walk(dir).sorted(Comparator.reverseOrder()).forEach(p -> {
                try { Files.delete(p); } catch (Exception ignored) { /* best-effort */ }
            });
        } catch (IOException e) {
            LOG.warn("Failed to delete temp dir {}", dir, e);
        }
    }
}
