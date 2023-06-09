package eu.europa.ec.leos.notice.backend.thirdparty;

import eu.europa.ec.leos.notice.common.TxtLinesReader;
import org.apache.commons.lang.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Converts text from generated <tt>THIRD-PARTY.txt</tt> files to a list of <tt>ThirdPartyLibrary</tt> instances.
 */
public class ThirdPartyConverter {
    public List<ThirdPartyLibrary> convertTxt(Path txtFile) throws IOException {
        return readLines(txtFile)
                .map(this::convertLine)
                .filter(this::filterLeosJars)
                .distinct()
                .collect(Collectors.toList());
    }

    private boolean filterLeosJars(ThirdPartyLibrary thirdPartyLibrary) {
        return !thirdPartyLibrary.getGroupId().equals("eu.europa.ec.leos.pilot");
    }

    private static Stream<String> readLines(Path txtFile) throws IOException {
        return new TxtLinesReader(Files.newBufferedReader(txtFile))
                .readAllLines()
                .stream()
                .filter(line -> !StringUtils.isBlank(line)) // skip empty lines
                .map(String::trim)
                .filter(line -> line.startsWith("(") && line.endsWith(")"))
//                .map(ThirdPartyConverter::removeFromRow)
                ;
    }

    private static String removeFromRow( String line) {
        return line.replaceAll("\\(without dependencies\\) ", "")
                .replaceAll("\\(SpEL\\) ", "")
                .replaceAll("\\(SPARQL 1.1 Query Engine\\)", "")
                .replaceAll("\\(Native Triple Store\\)", "")
                .replaceAll("\\(Aggregator\\) ", "");
    }

    // Process a line like:
    // (ASF 2.0) Code Generation Library (cglib:cglib:2.2.2 - http://cglib.sourceforge.net/)
    ThirdPartyLibrary convertLine(String line) {
        line = removeFromRow(line);
        int end = line.indexOf(')');
        if(line.charAt(end + 2) == '(' ) {
            end = line.indexOf(')', end + 1);
            if(line.charAt(end + 2) == '(' ) {
                end = line.indexOf(')', end + 1);
                if(line.charAt(end + 2) == '(' ) {
                    end = line.indexOf(')', end + 1);
                    // Up to 4 licenses:
                    // (Apache License 2.0) (LGPL 2.1) (MPL 1.1) (Lic 4) Javassist (org.javassist:javassist:3.21.0-GA - http://www.javassist.org/)
                }
            }
        } else {
            if (line.charAt(end + 1) == ')') {
                end = end + 1;
            }
        }
        final String[] licenseAliases = extractLicenses(line.substring(1, end));

        final int start = line.indexOf('(', end + 1);
        final String name = line.substring(end + 1, start).trim();
        final String[] artifactAndUrl = extractArtifactAndUrl(line.substring(start + 1, line.length() - 1));
        final String[] artifactData = extractArtifactData(artifactAndUrl[0]);
        final String url = artifactAndUrl[1];

        final ThirdPartyLibrary library = new ThirdPartyLibrary();
        library.setName(name);
        library.setGroupId(artifactData[0]);
        library.setArtifactId(artifactData[1]);
        library.setVersion(artifactData[2]);
        library.setProjectUrl(url);
        library.setLicenseAliases(Arrays.asList(licenseAliases));
        library.validate();
        return library;
    }

    private static String[] extractArtifactData(String text) {
        // text should be like: cglib:cglib:2.2.2
        final String[] data = text.split(":");
        if (data.length != 3) {
            throw new IllegalStateException("Could not extract groupId, artifactId and version from: " + text);
        }
        return data;
    }

    private static String[] extractArtifactAndUrl(String text) {
        // text should be like: cglib:cglib:2.2.2 - http://cglib.sourceforge.net/
        String[] artifactAndUrl = new String[2];
        final String[] split = text.split(" - ");
        if (split.length != 2) {
            if (split.length != 1) {
                throw new IllegalStateException("Could not extract artifact info and url from: " + text);
            } else {
                if (text.split(":").length == 3) {  //it means is in the format "org.apache.activemq:activemq-artemis-native:1.0.2 - "
                    artifactAndUrl[0] = split[0];
                    artifactAndUrl[1] = "";
                } else {
                    artifactAndUrl = split;
                }
            }
        } else {
            artifactAndUrl = split;
        }
        return artifactAndUrl;
    }

    private static String[] extractLicenses(String text) {
        if (text.contains(" OR ")) {
            return text.split(" OR ");
        }
        if (text.contains(" AND ")) {
            return text.split(" AND ");
        }
        if (text.contains(") (")) {
            return text.split("\\) \\(");
        }
        String[] result = new String[1];
        result[0] = text;
        return result;
    }
}
