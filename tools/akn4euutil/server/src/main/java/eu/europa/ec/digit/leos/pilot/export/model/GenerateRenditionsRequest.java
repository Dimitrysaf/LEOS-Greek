package eu.europa.ec.digit.leos.pilot.export.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
public class GenerateRenditionsRequest {
    private MultipartFile multipartFile;
}
