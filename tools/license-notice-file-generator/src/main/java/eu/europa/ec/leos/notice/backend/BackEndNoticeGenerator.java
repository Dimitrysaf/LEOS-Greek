package eu.europa.ec.leos.notice.backend;

import eu.europa.ec.leos.notice.backend.thirdparty.ThirdPartyConverter;
import eu.europa.ec.leos.notice.backend.thirdparty.ThirdPartyLibrary;
import eu.europa.ec.leos.notice.backend.xml.MavenXmlCopyrightsMapping;
import eu.europa.ec.leos.notice.common.PathRetriever;
import eu.europa.ec.leos.notice.common.Product;
import eu.europa.ec.leos.notice.frontend.xml.CopyrightsResult;
import eu.europa.ec.leos.notice.generator.LibraryNoticeV3;
import eu.europa.ec.leos.notice.generator.NoticeFileGeneratorV3;
import eu.europa.ec.leos.notice.license.*;
import eu.europa.ec.leos.notice.remote.NoticeService;
import eu.europa.ec.leos.notice.remote.RemoteNotice;
import org.silentsoft.oss.LicenseDictionary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Generate a Notice file for Maven dependencies read from a THIRD-PARTY.txt file with content like:
 * <pre>
 * (Apache License, Version 2.0) tomcat-embed-websocket (org.apache.tomcat.embed:tomcat-embed-websocket:9.0.64 - https://tomcat.apache.org/)
 * (Apache License, version 2.0) JBoss Logging 3 (org.jboss.logging:jboss-logging:3.4.1.Final - http://www.jboss.org)
 * (BSD 2-Clause) LatencyUtils (org.latencyutils:LatencyUtils:2.0.3 - http://latencyutils.github.io/LatencyUtils/)
 * (BSD-3-Clause) Hamcrest (org.hamcrest:hamcrest:2.2 - http://hamcrest.org/JavaHamcrest/)
 * (BSD License) AntLR Parser Generator (antlr:antlr:2.7.7 - http://www.antlr.org/)
 * </pre>
 */
public class BackEndNoticeGenerator {
    private final Logger log = LoggerFactory.getLogger(getClass());
    private final Product product;
    private final Path thirdPartyTxtFile;
    private final MavenXmlCopyrightsMapping xmlCopyrightsMapping;

    public BackEndNoticeGenerator(Product product, Path thirdPartyTxtFile, MavenXmlCopyrightsMapping xmlCopyrightsMapping) {
        Objects.requireNonNull(product);
        Objects.requireNonNull(thirdPartyTxtFile);
        Objects.requireNonNull(xmlCopyrightsMapping);

        this.product = product;
        this.thirdPartyTxtFile = thirdPartyTxtFile;
        this.xmlCopyrightsMapping = xmlCopyrightsMapping;

        registerExtraLicenses();
    }

    public void generateNotice(OutputStream os) throws IOException, InterruptedException {
        final PrintStream ps = new PrintStream(os, true);
        final NoticeFileGeneratorV3.NoticeFileBuilder noticeBuilder = NoticeFileGeneratorV3.newInstance(product.getName(), product.getOwner());
//        noticeBuilder.addText("Version: " + product.getVersion());
        noticeBuilder.addText(product.getLicenseContent());
        noticeBuilder.addText("This product includes dynamically linked software developed by third parties which is provided under their respective licences:");

        final List<ThirdPartyLibrary> thirdPartyLibraries = loadThirdPartyLibraries();
        log.warn("Total UNIQUE thirdPartyLibraries: {}", thirdPartyLibraries.size());
        final List<String> namespaceAndNames = extractNamespaceAndNes(thirdPartyLibraries);
        final List<RemoteNotice> remoteNotices = retrieveMavenNotices(namespaceAndNames);

        merge(thirdPartyLibraries, remoteNotices)
                .forEach(noticeBuilder::addLibrary);

        String markdown = noticeBuilder.generate();
        ps.print(markdown);
    }

    private List<ThirdPartyLibrary> loadThirdPartyLibraries() throws IOException {
        return new ThirdPartyConverter().convertTxt(thirdPartyTxtFile);
    }

    private static List<String> extractNamespaceAndNes(List<ThirdPartyLibrary> thirdPartyLibraries) {
        return thirdPartyLibraries.stream()
                                  .map(ThirdPartyLibrary::fullDependencyPath)
                                  .collect(Collectors.toList());
    }

    private static List<RemoteNotice> retrieveMavenNotices(List<String> namespaceAndNames) throws IOException, InterruptedException {
        final NoticeService noticeService = new NoticeService();
        noticeService.setUseExistingResponses(true);
        return noticeService.retrieveNotices(namespaceAndNames, NoticeService.NoticeProvider.MAVENCENTRAL);
    }

    private void registerExtraLicenses() {
        LicenseDictionary.put(new BSDJavaLicense(), new CDDL1_0License(), new SAXLicense(), new W3CLicense());
    }

    private Collection<LibraryNoticeV3> merge(Collection<ThirdPartyLibrary> libraries, List<RemoteNotice> remoteNotices) {
        final Map<String, RemoteNotice> fullNameToRemoteNotice = remoteNotices
                .stream()
                .collect(Collectors.toMap(RemoteNotice::getFullName,
                        Function.identity()));
        return libraries
                .stream()
                .map(thirdPartyLibrary ->
                        toLibraryNotice(thirdPartyLibrary, fullNameToRemoteNotice.get(thirdPartyLibrary.fullDependencyPath())))
                .collect(Collectors.toList());
    }

    private LibraryNoticeV3 toLibraryNotice(ThirdPartyLibrary thirdPartyLibrary, RemoteNotice remoteNotice) {
        LibraryNoticeV3 libNotice = new LibraryNoticeV3()
                .withName(thirdPartyLibrary.groupIdAndArtifactId())
                .withVersion(thirdPartyLibrary.getVersion())
                .withWebsite(thirdPartyLibrary.getProjectUrl())
                .withLicenseAlias(thirdPartyLibrary.getLicenseAliases());

        final Optional<CopyrightsResult> copyrightMatch = xmlCopyrightsMapping.match(
                thirdPartyLibrary.getGroupId(), thirdPartyLibrary.getArtifactId(), thirdPartyLibrary.getVersion());

        if (copyrightMatch.isPresent()) {
            final CopyrightsResult copyrightsResult = copyrightMatch.get();
            libNotice.withCopyrights(copyrightsResult.getCopyrights());
            if (!copyrightsResult.getLicenseAliases().isEmpty()) {
                libNotice.withLicenseAlias(copyrightsResult.getLicenseAliases());
            }
        } else if (null != remoteNotice) {
            // use mainly copyright from RemoteNotice
            if (remoteNotice.hasCopyrights()) {
                libNotice.withCopyrights(remoteNotice.getCopyrights());
            }
            if (remoteNotice.hasWebsite() && !remoteNotice.getWebsite().equals(thirdPartyLibrary.getProjectUrl())) {
                log.warn("Got different website for {}. From XML: {}, from remote: {}",
                        thirdPartyLibrary.groupIdAndArtifactId(),
                        thirdPartyLibrary.getProjectUrl(),
                        remoteNotice.getWebsite());
            }
        }

        libNotice.validate();
        return libNotice;
    }

    public static void main(String[] args) throws URISyntaxException, IOException, InterruptedException, ParserConfigurationException, SAXException {
        final Path xmlCopyrights = new PathRetriever().fromClasspath("/copyrights-lookup-maven.xml");
        MavenXmlCopyrightsMapping mappings = new MavenXmlCopyrightsMapping(xmlCopyrights);

        final Path trustedAppTxtFile = Paths.get("target/generated-sources/license/THIRD-PARTY.txt");
        final Product trustedApp = new Product("LEOS", "2022 European Union", "1.0", EUPLv1_2Content.content());

        final BackEndNoticeGenerator trustedAppNoticeGenerator = new BackEndNoticeGenerator(trustedApp, trustedAppTxtFile, mappings);
        try (PrintStream ps = new PrintStream("NOTICE_BE.md")) {
            trustedAppNoticeGenerator.generateNotice(ps);
        }
    }
}
