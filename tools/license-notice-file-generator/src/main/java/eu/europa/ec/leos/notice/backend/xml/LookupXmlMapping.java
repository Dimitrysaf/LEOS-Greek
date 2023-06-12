package eu.europa.ec.leos.notice.backend.xml;

import eu.europa.ec.leos.notice.common.PathRetriever;
import eu.europa.ec.leos.notice.common.xml.BaseXmlLoader;
import eu.europa.ec.leos.notice.frontend.xml.CopyrightsAndLicenseAliases;
import eu.europa.ec.leos.notice.frontend.xml.XmlArtifact;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Provide copyrights and license aliases information based on groupId, artifactId and version or a Java dependency.
 */
public class LookupXmlMapping extends BaseXmlLoader {

    List<Dependency> dependencies = new ArrayList<>();

    public LookupXmlMapping(Path copyrightsXml) throws ParserConfigurationException, IOException, SAXException {
        final Document document = parseXmlFile(copyrightsXml);
        final Optional<Element> copyrightsLookup = findCopyrightsLookup(document);
        if (copyrightsLookup.isPresent()) {
            processRootElement(copyrightsLookup.get());
        } else {
            logWarnForMissingRootElement(copyrightsXml);
        }
    }

    private Runnable logWarnForMissingRootElement(Path copyrightsXml) {
        return () -> log.warn("No <copyrights-lookup/> found inside file: '{}'", copyrightsXml);
    }

    private void processRootElement(Element element) {
        extractXmlArtifacts(element)
                .forEach(this::populateMaps);
    }

    public void convertNoticeToXml(OutputStream os) throws ParserConfigurationException, TransformerException {
        XmlWriter writer = new XmlWriter();
        dependencies.forEach(writer::addDependency);
        writer.writeXml(os);
    }

    private void populateMaps(XmlArtifact xmlArtifact) {
        MavenPackage mavenPackage = new MavenPackage(xmlArtifact.getGroupId(), xmlArtifact.getArtifactIds().get(0), xmlArtifact.getVersion());
        String license = "";
        if(xmlArtifact.getCopyrightsAndLicenseAliases().getLicenseAliases().size() > 0 ) {
            license = xmlArtifact.getCopyrightsAndLicenseAliases().getLicenseAliases().get(0);
        }
        Dependency dependency = new Dependency(mavenPackage, null, license, Collections.emptyList());
        dependencies.add(dependency);
    }

    private static String groupIdAndArtifactId(String groupId, String artifactId) {
        return String.format("%s:%s", groupId, artifactId);
    }

    private static String groupIdAndArtifactIdAndVersion(String groupId, String artifactId, String version) {
        return String.format("%s:%s:%s", groupId, artifactId, version);
    }

    private List<XmlArtifact> extractXmlArtifacts(Element element) {
        return getChildElements(element, "artifact")
                .stream()
                .map(this::convertXml)
                .collect(Collectors.toList());
    }

    private XmlArtifact convertXml(Element xmlArtifact) {
        String groupIdContent = getGroupId(xmlArtifact);
        String[] groupIdArtifact_version = groupIdContent.split(" ");
        String groupIdArtifactId = groupIdArtifact_version[0];
        String[] groupId_artifactId = groupIdArtifactId.split("/");

        List<String> artifactIds;
        String groupId = "-";
        String artifactId;
        if (groupId_artifactId.length > 1) {
            groupId = groupId_artifactId[0];
            artifactId = groupId_artifactId[1];
        } else {
            artifactId = groupId_artifactId[0];
        }
        artifactIds = Collections.singletonList(artifactId);

        String version = groupIdArtifact_version[1];
        List<String> copyrights = getCopyrights(xmlArtifact);
        List<String> licenseAliases = Collections.singletonList(getLicense(xmlArtifact));

        return new XmlArtifact(groupId, artifactIds, version,
                new CopyrightsAndLicenseAliases(copyrights, licenseAliases));
    }

    private String getLicense(Element xmlArtifact) {
        return getChildText(xmlArtifact, "license");
    }

    private List<String> getCopyrights(Element xmlArtifact) {
        return getChildElements(xmlArtifact, "copyright")
                .stream()
                .map(element -> element.getTextContent().trim())
                .distinct()
                .collect(Collectors.toList());
    }

    private String getGroupId(Element xmlArtifact) {
        return getChildText(xmlArtifact, "groupId");
    }

    private Optional<Element> findCopyrightsLookup(Document doc) {
        final NodeList nodeList = doc.getChildNodes();
        if (nodeList.getLength() == 0) {
            return Optional.empty();
        }
        if (nodeList.getLength() > 0) {
            for (int i = 0; i < nodeList.getLength(); i++) {
                final Node item = nodeList.item(i);
                if (item.getNodeType() == Node.ELEMENT_NODE && item.getNodeName().equals("copyrights-lookup")) {
                    return Optional.of((Element) item);
                }
            }
        }

        return Optional.empty();
    }

    public static void main(String[] args) throws URISyntaxException, ParserConfigurationException, IOException, SAXException {
        final Path xmlPath = new PathRetriever().fromClasspath("/copyrights-lookup-leos-maven.xml");
        new LookupXmlMapping(xmlPath);
    }
}
