package eu.europa.ec.leos.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class CopyFilesToConsolidatedRunner {
    public static final Logger LOG = LoggerFactory.getLogger(CopyFilesToConsolidatedRunner.class);
    public static void main(String[] args) {
        String inputPathStr = args.length > 0 ? args[0] : "server/src/main/resources/leos/templates";
        String consolidated = args.length > 1 ? args[1] : "consolidated";

        try {
            LOG.info("Args[0] = {}",  args.length > 0 ? args[0] : "");
            LOG.info("Args[1] = {}",  args.length > 1 ? args[1] : "");
            copyFilesToConsolidated(inputPathStr, consolidated);
            LOG.info("Files copied successfully");
        } catch (IOException e) {
            LOG.error("Error copying files: ", e);
        }
    }

    public static void copyFilesToConsolidated(String inputPathStr, String consolidated) throws IOException {
        // Define root directory inside src/main/resources/leos/templates
        Path moduleRoot = Paths.get("").toAbsolutePath();
        Path templatesDir = moduleRoot.resolve(inputPathStr);
        Path consolidatedDir = templatesDir.resolve(consolidated);

        // Create consolidated directory and subfolders (os, ec, cn) if they don't exist
        List<String> subfolders = Arrays.asList("os", "ec", "cn");
        for (String subfolder : subfolders) {
            Path subfolderPath = consolidatedDir.resolve(subfolder);
            if (!Files.exists(subfolderPath)) {
                Files.createDirectories(subfolderPath);
            }
        }

        // Get list of version folders (e.g., 5.2.0, 5.2.1, etc.) and sort them
        List<Path> versionFolders = new ArrayList<>();
        Files.list(templatesDir)
                .filter(Files::isDirectory)
                .filter(path -> path.getFileName().toString().matches("\\d+\\.\\d+\\.\\d+"))
                .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                .forEach(versionFolders::add);

        // Process each version folder
        for (Path versionFolder : versionFolders) {
            for (String subfolder : subfolders) {
                Path sourceSubfolder = versionFolder.resolve(subfolder);
                Path destSubfolder = consolidatedDir.resolve(subfolder);

                // Skip if source subfolder doesn't exist
                if (!Files.exists(sourceSubfolder)) {
                    continue;
                }

                // Walk through source subfolder and copy files
                Files.walk(sourceSubfolder)
                        .filter(Files::isRegularFile) // Only process files
                        .forEach(sourcePath -> {
                            try {
                                Path destPath = destSubfolder.resolve(sourceSubfolder.relativize(sourcePath));
                                // Create parent directories if they don't exist
                                Files.createDirectories(destPath.getParent());
                                // Copy file to destination with REPLACE_EXISTING
                                Files.copy(sourcePath, destPath, StandardCopyOption.REPLACE_EXISTING);
                            } catch (IOException e) {
                                // Log error and continue with next file
                                LOG.error("Error copying file {} : {}", sourcePath, e);
                            }
                        });
            }
        }
    }
}