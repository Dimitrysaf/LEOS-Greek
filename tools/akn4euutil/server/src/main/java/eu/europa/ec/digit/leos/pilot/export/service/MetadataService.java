package eu.europa.ec.digit.leos.pilot.export.service;

import org.springframework.web.multipart.MultipartFile;

public interface MetadataService {
    byte[] applyMetadata(MultipartFile inputFile);
    void applyMetadataAsync(MultipartFile inputFile, String callbackUrl);
}