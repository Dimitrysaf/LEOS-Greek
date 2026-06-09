package eu.europa.ec.leos.services.utils;

import eu.europa.ec.leos.services.api.exception.LeosExceptionResponse;
import eu.europa.ec.leos.services.support.XmlHelper;
import org.apache.commons.io.FilenameUtils;
import org.apache.tika.Tika;
import org.apache.tika.io.TikaInputStream;
import org.springframework.web.multipart.MultipartFile;
import org.verapdf.pdfa.Foundries;
import org.verapdf.pdfa.PDFAParser;
import org.verapdf.pdfa.PDFAValidator;
import org.verapdf.pdfa.results.ValidationResult;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import static eu.europa.ec.leos.services.api.exception.ErrorCode.CA001;

public class FileUtils {

    public static void validateHybridDocument(MultipartFile foreignAnnexFile) throws Exception {
        validatePath(FilenameUtils.normalize(foreignAnnexFile.getOriginalFilename()));
        if (!isValidFileNameForForeignAnnex(foreignAnnexFile.getOriginalFilename())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.invalid.file.name");
        }
        if (!isValidMimeTypeForForeignAnnex(foreignAnnexFile.getBytes(), foreignAnnexFile.getOriginalFilename())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.invalid.file");
        }
        if (!isValidSizeFileForBinaryFile(foreignAnnexFile.getSize())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.max.size.error");
        }
        String extension = getFileExtension(foreignAnnexFile.getOriginalFilename());
        if (extension.equals("PDF") && !isPdfA(foreignAnnexFile.getBytes())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.not.pdfa");
        }
    }

    public static boolean isPdfA(byte[] binaryContent) throws Exception {
        try (InputStream is = new ByteArrayInputStream(binaryContent);
                PDFAParser parser = Foundries.defaultInstance().createParser(is);
                PDFAValidator validator = Foundries.defaultInstance().createValidator(parser.getFlavour(), false)) {
            ValidationResult result = validator.validate(parser);
            return result.isCompliant();
        }
    }

    public static void validateRenditionHybridDocument(MultipartFile foreignAnnexRendition) throws Exception {
        validatePath(FilenameUtils.normalize(foreignAnnexRendition.getOriginalFilename()));
        if (!isValidFileNameForForeignAnnexRendition(foreignAnnexRendition.getOriginalFilename())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.invalid.rendition.file.name");
        }
        if (!isValidMimeTypeForForeignAnnexRendition(foreignAnnexRendition.getBytes(), foreignAnnexRendition.getOriginalFilename())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.invalid.rendition.file");
        }
        if (!isValidSizeFileForBinaryFile(foreignAnnexRendition.getSize())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.max.size.error");
        }
        String extension = getFileExtension(foreignAnnexRendition.getOriginalFilename());
        if (extension.equals("PDF") && !isPdfA(foreignAnnexRendition.getBytes())) {
            throw new LeosExceptionResponse(CA001.name(), "page.collection.drafts.annex.not.pdfa");
        }
    }

    public static void validatePath(String path) {
        if (path != null && path.contains("../")) {
            path = XmlHelper.encodeParam(path);
            throw new SecurityException("you are not allowed to write in the path:" + path);
        }
    }

    public static Path validateBasePath(Path path, String baseDir) {
        if (path == null || baseDir == null) {
            throw new SecurityException("Invalid path");
        }
        try {
            Path basePath = Paths.get(baseDir).toRealPath();
            Path resolved = basePath.resolve(path).toRealPath();
            if (!resolved.startsWith(basePath)) {
                throw new SecurityException("Access outside allowed directory");
            }
            return resolved;
        } catch (IOException e) {
            throw new SecurityException("Invalid path", e);
        }
    }

    public static String sanitizeFilename(String filename) {
        if (filename == null || filename.isEmpty()) {
            throw new SecurityException("Invalid filename: " + filename);
        }
        String normalized = FilenameUtils.normalize(filename);
        if (normalized == null || normalized.isEmpty()) {
            throw new SecurityException("Invalid filename: " + filename);
        }
        if (normalized.contains("..") || !normalized.matches("^[A-Za-z0-9._-]+$")) {
            throw new SecurityException("Filename contains invalid characters: " + filename);
        }
        return normalized;
    }

    public static boolean isValidFileName(String fileName) {
        Pattern pattern = Pattern.compile("^[A-Za-z0-9\\.\\-_]+\\.leg$");
        if (fileName.length() > 400) {
            return false;
        }
        return pattern.matcher(fileName).matches();
    }

    public static boolean isValidFileNameForForeignAnnex(String fileName) {
        Pattern pattern = Pattern.compile("^[A-Za-z0-9\\.\\-_ ()]+\\.(pdf|docx|xlsx|PDF|DOCX|XLSX)$");
        if (fileName.length() > 400) {
            return false;
        }
        return pattern.matcher(fileName).matches();
    }

    public static boolean isValidFileNameForForeignAnnexRendition(String fileName) {
        Pattern pattern = Pattern.compile("^[A-Za-z0-9\\.\\-_ ()]+\\.(pdf|PDF)$");
        if (fileName.length() > 400) {
            return false;
        }
        return pattern.matcher(fileName).matches();
    }

    public static boolean isValidMimeTypeForForeignAnnex(byte[] binaryContent, String fileName) throws IOException {
        Tika tika = new Tika();
        String mimeType = tika.detect(TikaInputStream.get(binaryContent), fileName);
        String extension = getFileExtension(fileName);
        boolean valid = false;
        if (extension.equals("PDF") && mimeType.equals("application/pdf")) {
            valid = true;
        } else if (extension.equals("DOCX") && mimeType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            valid = true;
        } else if (extension.equals("XLSX") && mimeType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            valid = true;
        }
        return valid;
    }

    public static boolean isValidMimeTypeForForeignAnnexRendition(byte[] binaryContent, String fileName) throws IOException {
        Tika tika = new Tika();
        String mimeType = tika.detect(TikaInputStream.get(binaryContent), fileName);
        List<String> allowedTypes = Arrays.asList(
                "application/pdf");
        return allowedTypes.contains(mimeType);
    }

    public static String getFileName(String fileName) {
        return fileName.substring(0, fileName.lastIndexOf(".")).toUpperCase();
    }

    public static String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
    }

    public static String getMimeType(String extension) {
        String mimeType = "";
        switch (extension) {
            case "DOCX":
                mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                break;
            case "XLSX":
                mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                break;
            case "PDF":
                mimeType = "application/pdf";
                break;
        }
        return mimeType;
    }

    public static boolean isValidSizeFileForBinaryFile(long sizeofBinaryFile) {
        // Max 50 MB
        if (sizeofBinaryFile > (50 * 1024 * 1024)) {
            return false;
        }
        return true;
    }

    public static boolean isValidFileNameForZipFile(String fileName) {
        Pattern pattern = Pattern.compile("^[A-Za-z0-9\\.\\-_]+\\.zip$");
        if (fileName.length() > 400) {
            return false;
        }
        return pattern.matcher(fileName).matches();
    }

    public static boolean isValidMimeTypeForLegFile(byte[] binaryContent) throws IOException {
        Tika tika = new Tika();
        String mimeType = tika.detect(TikaInputStream.get(binaryContent));
        List<String> allowedTypes = Arrays.asList(
                "application/zip");
        return allowedTypes.contains(mimeType);
    }

    public static String getFormattedByteAsKB(Long bytes) {
        return String.format("%.2f KB", bytes / 1024.0).replace('.', ',');
    }

}
