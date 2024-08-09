package eu.europa.ec.leos.repository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("oracle")
public class LoadTemplatesCommandLineRunner implements CommandLineRunner {

    private final TemplatesUploadService templatesUploadService;

    public LoadTemplatesCommandLineRunner(TemplatesUploadService templatesUploadService) {
        this.templatesUploadService = templatesUploadService;
    }

    @Override
    public void run(String... args) {
        if (args.length > 0) {
            String subdirectory = args[0];
            templatesUploadService.loadConfigDataFromFilesInFolder(subdirectory);
        } else {
            System.out.println("No subdirectory specified, skipping data initialization.");
        }
    }
}
