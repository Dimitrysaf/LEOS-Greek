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
package eu.europa.ec.digit.leos.pilot.export.util;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import static java.nio.charset.StandardCharsets.UTF_8;

public class ZipUtil {

    private static Logger LOG = LoggerFactory.getLogger(ZipUtil.class);

    public static final String APPLICATION_ZIP_VALUE = "application/zip";
    public static final String DOC_FILE_NAME_SEPARATOR = "-";

    public static LeosFile zipLeosFiles(String zipFileName, Map<String, Object> contentToZip) throws IOException {
        String fileExtension = "." + FilenameUtils.getExtension(zipFileName);
        String fileName = FilenameUtils.getBaseName(zipFileName);
        LeosFile leosFile = new LeosFile();
        leosFile.generateFileName(fileName.concat(DOC_FILE_NAME_SEPARATOR), fileExtension);
        leosFile.setName(renameZipFile(fileExtension, leosFile.getName()));
        leosFile.setOriginalFileName(leosFile.getName());
        try {
            leosFile.setBytes(convertContentToByteArray(contentToZip));
        } catch (IOException e) {
            LOG.error("Error creating zip package: {}", e.getMessage());
            throw new IOException(e.getMessage());
        }
        return leosFile;
    }

    public static String renameZipFile(String fileExtension, String zipName) {
        zipName = zipName.lastIndexOf(".") != -1 ? zipName.substring(0, zipName.lastIndexOf(".")) : zipName;
        zipName = zipName.concat(fileExtension);
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
            if (value instanceof File) {
                File fileValue = (File) value;
                Path safePath = validatePath(fileValue, "./");
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
            if (value instanceof File) {
                File fileValue = (File) value;
                Path safePath = validatePath(fileValue, "./");
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

    /**
     * check if a ZIP file contains a certain file
     * <p>note: does not check if the file has any content</p>
     *
     * @param zippedData the zip, as byte array
     * @param fileName the wanted file name
     * @return
     */
    public static boolean containsFile(byte[] zippedData, String fileName) {

        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zippedData))) {
            ZipEntry ze;
            while ((ze = zis.getNextEntry()) != null) {
                if (ze.isDirectory()) {
                    continue;
                }
                if(fileName.equals(ze.getName())) {
                    zis.closeEntry();
                    return true;
                }

            }
            zis.closeEntry();
        } catch (IOException e) {
            LOG.error("Error examining ZIP file content: {}", e.getMessage());
        }

        return false;
    }

    /**
     * extract a certain file specified by its name from a given ZIP
     *
     * @param fileName wanted file name
     * @param zippedData the ZIP file data
     * @return extracted file content in byte format
     *
     * @throws IOException
     */
    public static byte[] unzipSingleFile(String fileName, byte[] zippedData) throws IOException {

        if(!StringUtils.hasLength(fileName)) {
            throw new InvalidParameterException("fileName is missing");
        }

        if(zippedData == null) {
            throw new InvalidParameterException("Given ZIP is empty");
        }

        Map<String, Object> unzippedData = unzipByteArray(zippedData);
        if(unzippedData == null || unzippedData.isEmpty()) {
            throw new IOException(String.format("File '%s' did not contain any files.", fileName));
        }

        if(!unzippedData.containsKey(fileName)) {
            throw new IOException(String.format("File '%s' is not contained in ZIP file.", fileName));
        }

        return (byte[]) unzippedData.get(fileName);
    }

    public static Map<String, LeosFile> unzipByteArrayToFile(byte[] byteArray) {
        Map<String, LeosFile> unzippedFiles = new HashMap();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArray);

        ZipEntry ze;
        try (ZipInputStream zis = new ZipInputStream(byteArrayInputStream)) {
            while((ze = zis.getNextEntry()) != null) {
                LeosFile newFile = newLeosFile(ze, zis);
                if (ze.isDirectory()) {
                    if (!newFile.isDirectory()) {
                        throw new IOException("Failed to create directory " + newFile);
                    }
                } else {
                    unzippedFiles.put(newFile.getName(), newFile);
                }
            }
        } catch (IOException ex) {
            LOG.error("Error unzipping : {}", ex.getMessage());
        }

        return unzippedFiles;
    }

    public static String encodeParam(String value) {
        return UriUtils.encodePath(value, StandardCharsets.UTF_8);
    }

    public static Path validatePath(File file, String allowedBaseDir) {
        if (file == null || allowedBaseDir == null) {
            throw new SecurityException("Invalid path");
        }
        try {
            Path basePath = Paths.get(allowedBaseDir).toRealPath();
            Path filePath = file.toPath().toRealPath();
            if (!filePath.startsWith(basePath)) {
                throw new SecurityException("Access outside allowed directory");
            }
            return filePath;
        } catch (IOException e) {
            throw new SecurityException("Invalid path", e);
        }
    }
}
