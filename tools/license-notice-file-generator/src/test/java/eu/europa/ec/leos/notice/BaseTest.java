package eu.europa.ec.leos.notice;

import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public abstract class BaseTest {
    protected Path getPathFromClasspath(String name) throws URISyntaxException {
        return Paths.get(getClass().getResource(name).toURI());
    }

    protected static <T> T first(List<T> xmlLibraries) {
        return xmlLibraries.get(0);
    }

    protected static <T> T second(List<T> xmlLibraries) {
        return xmlLibraries.get(1);
    }
}
