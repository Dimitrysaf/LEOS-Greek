package eu.europa.ec.leos.notice.common;

import eu.europa.ec.leos.notice.backend.xml.MavenXmlCopyrightsMapping;

import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

public class PathRetriever {
    public Path fromClasspath(String resourcePath) throws URISyntaxException {
        final URL resource = MavenXmlCopyrightsMapping.class.getResource(resourcePath);
        if (null == resource) {
            throw new IllegalArgumentException(
                    String.format("Cannot find classpath resource with name: '%s'", resourcePath));
        }
        return Paths.get(resource.toURI());
    }
}
