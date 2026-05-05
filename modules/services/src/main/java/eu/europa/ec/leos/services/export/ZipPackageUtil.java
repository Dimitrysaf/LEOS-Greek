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
package eu.europa.ec.leos.services.export;

import eu.europa.ec.leos.domain.repository.common.LeosFile;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import static eu.europa.ec.leos.services.support.XmlHelper.*;
import static eu.europa.ec.leos.services.utils.FileUtils.validateBasePath;
import static java.nio.charset.StandardCharsets.UTF_8;

public class ZipPackageUtil {
    private static final Logger LOG = LoggerFactory.getLogger(ZipPackageUtil.class);

    public static LeosFile zipLeosFiles(String zipFileName, Map<String, Object> contentToZip, String language) throws IOException {
        String fileExtension = "." + FilenameUtils.getExtension(zipFileName);
        String fileName = FilenameUtils.getBaseName(zipFileName);
        LeosFile leosFile = new LeosFile();
        leosFile.generateFileName(fileName.concat(DOC_FILE_NAME_SEPARATOR), fileExtension);
        leosFile.setName(renameZipFile(language, fileExtension, leosFile.getName()));
        leosFile.setOriginalFileName(leosFile.getName());
        try {
            leosFile.setBytes(convertContentToByteArray(contentToZip));
        } catch (IOException e) {
            LOG.error("Error creating zip package: {}", e.getMessage());
            throw new IOException(e.getMessage());
        }
        return leosFile;
    }

    public static String renameZipFile(String language, String fileExtension, String zipName) {
        zipName = zipName.lastIndexOf(".") != -1 ? zipName.substring(0, zipName.lastIndexOf(".")) : zipName;
        zipName = StringUtils.isNotEmpty(language) ? zipName.concat(DOC_FILE_NAME_SEPARATOR).concat(language).
                concat(fileExtension) : zipName.concat(fileExtension);
        return zipName;
    }

    public static byte[] zipByteArray(Map<String, Object> contentToZip) throws IOException {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(bos)) {
            addContentToOutputStream(zos, contentToZip);
            zos.close();
            return bos.toByteArray();
        }
    }

    public static void addContentToOutputStream(ZipOutputStream zipOutputStream, Map<String, Object> contentToZip) throws IOException {
        for (Map.Entry<String, Object> entry : contentToZip.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof File fileValue) {
                Path safePath = validateBasePath(fileValue.toPath(), "./");
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                try (InputStream is = Files.newInputStream(safePath)) {
                    IOUtils.copy(is, zipOutputStream);
                }
                zipOutputStream.closeEntry();
            } else if (value instanceof ByteArrayOutputStream) {
                ByteArrayOutputStream byteArrayOutputStreamValue = (ByteArrayOutputStream) value;
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(byteArrayOutputStreamValue.toByteArray());
                zipOutputStream.closeEntry();
                byteArrayOutputStreamValue.close();
            } else if (value instanceof String) {
                String stringValue = (String) value;
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(stringValue.getBytes(UTF_8));
                zipOutputStream.closeEntry();
            } else if (value instanceof byte[]) {
                byte[] byteArrayValue = (byte[]) value;
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(byteArrayValue);
                zipOutputStream.closeEntry();
            } else if (value instanceof LeosFile) {
                byte[] byteArrayValue = ((LeosFile) value).getBytes();
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(byteArrayValue);
                zipOutputStream.closeEntry();
            }
        }
    }

    public static byte[] convertContentToByteArray(Map<String, Object> contentToZip) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream);
        for (Map.Entry<String, Object> entry : contentToZip.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof File fileValue) {
                Path safePath = validateBasePath(fileValue.toPath(), "./");
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                try (InputStream is = Files.newInputStream(safePath)) {
                    IOUtils.copy(is, zipOutputStream);
                }
                zipOutputStream.closeEntry();
            } else if (value instanceof ByteArrayOutputStream) {
                ByteArrayOutputStream byteArrayOutputStreamValue = (ByteArrayOutputStream) value;
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(byteArrayOutputStreamValue.toByteArray());
                zipOutputStream.closeEntry();
                byteArrayOutputStreamValue.close();
            } else if (value instanceof String) {
                String stringValue = (String) value;
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(stringValue.getBytes(UTF_8));
                zipOutputStream.closeEntry();
            } else if (value instanceof byte[]) {
                byte[] byteArrayValue = (byte[]) value;
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(byteArrayValue);
                zipOutputStream.closeEntry();
            } else if (value instanceof LeosFile) {
                byte[] byteArrayValue = ((LeosFile) value).getBytes();
                ZipEntry ze = new ZipEntry(key);
                zipOutputStream.putNextEntry(ze);
                zipOutputStream.write(byteArrayValue);
                zipOutputStream.closeEntry();
            }
        }
        zipOutputStream.close();
        return byteArrayOutputStream.toByteArray();
    }

    public static Map<String, Object> unzipByteArray(byte[] zipppedData) throws IOException {
        Map<String, Object> unzippedFiles = new HashMap<>();
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipppedData))) {
            ZipEntry ze;
            while ((ze = zis.getNextEntry()) != null) {
                if (ze.isDirectory()) {
                    continue;
                }
                unzippedFiles.put(ze.getName(), IOUtils.toByteArray(zis));
            }
            zis.closeEntry();
        }
        return unzippedFiles;
    }

    public static Map<String, Object> unzipFiles(LeosFile file) {
        return unzipFilesFromByteArray(file.getBytes());
    }

    public static Map<String, Object> unzipFilesFromByteArray(byte[] byteArray) {
        Map<String, Object> unzippedFiles = new HashMap<>();
        // get the zip file content with try-with-resources
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArray);
        try (ZipInputStream zis = new ZipInputStream(byteArrayInputStream)) {
            // get the zipped file list entry
            ZipEntry ze;
            while ((ze = zis.getNextEntry()) != null) {
                final LeosFile newFile = newLeosFile(ze, zis);
                if (ze.isDirectory()) {
                    if (!newFile.isDirectory()) {
                        throw new IOException("Failed to create directory " + newFile);
                    }
                } else {
                    unzippedFiles.put(newFile.getName(), newFile);
                }
            }
            // closeEntry should not be required. In the next step the stream will be closed.
            // close will be done by the try-with-resources block
        } catch (IOException ex) {
            LOG.error("Error unzipping : {}", ex.getMessage());
        }
        return unzippedFiles;
    }

    /**
     * @see <a href="https://snyk.io/research/zip-slip-vulnerability">...</a>
     */
    private static LeosFile newLeosFile(ZipEntry zipEntry, ZipInputStream zis) throws IOException {
        LeosFile leosFile = new LeosFile(zipEntry.getName(), zipEntry.isDirectory());
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        IOUtils.copy(zis, byteArrayOutputStream);
        leosFile.setBytes(byteArrayOutputStream.toByteArray());
        return leosFile;
    }

    public static LeosFile unzipFile(LeosFile singleZipInput, String singleZipEntryName) throws Exception {
        byte [] entryContent = unzipFileToByteArray(singleZipInput, singleZipEntryName);
        String fileExtension = "." + FilenameUtils.getExtension(singleZipEntryName);
        String fileName = FilenameUtils.getBaseName(singleZipEntryName);
        LeosFile unzippedFile = new LeosFile();
        unzippedFile.generateFileName(fileName + "_", fileExtension);
        unzippedFile.setBytes(entryContent);
        return unzippedFile;
    }

    public static byte[] unzipFileToByteArray(LeosFile singleZipInput, String singleZipEntryName) throws Exception {
        Map<String, Object> entries = unzipByteArray(singleZipInput.getBytes());
        return (byte[]) entries.get(singleZipEntryName);
    }

    /*
        Bills are always named Bill.docx, but Annexes are multiple and could be Annex_1, Annex_2, depending on which Annex was downloaded
        Looks for the matching *Annex_* filename in the zip file and returns that filename
     */
    public static String obtainRealDocName(LeosFile singleZipInput, String singleZipEntryName) throws Exception {

        if(!"Annex".equalsIgnoreCase(singleZipEntryName) && !"Explanatory".equalsIgnoreCase(singleZipEntryName)) {
            return singleZipEntryName + ".docx";
        }

        Map<String, Object> entries = unzipByteArray(singleZipInput.getBytes());
        for (Map.Entry<String, Object> entry : entries.entrySet()) {
            String fileName = entry.getKey();
            if(fileName.startsWith("Annex_") || fileName.startsWith("Council_explanatory_")) {
                return fileName;
            }
        }
        return singleZipEntryName;
    }
}
