package eu.europa.ec.leos.domain.repository.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.ByteArrayResource;

import java.io.Serializable;

import static org.apache.jena.atlas.lib.RandomLib.random;

@Getter
@Setter
public class LeosFile implements Serializable {
    private byte[] bytes;
    private String name;
    private String originalFileName;
    private boolean directory = false;

    public LeosFile() {
        this.bytes = null;
        this.name = null;
        this.originalFileName = null;
    }

    public LeosFile(String name) {
        this.name = name;
        this.originalFileName = name;
    }

    public LeosFile(String name, boolean isDirectory) {
        this.name = name;
        this.originalFileName = name;
        this.directory = isDirectory;
    }

    public LeosFile(byte[] input, String name, String originalFileName) {
        this.bytes = input;
        this.name = name;
        this.originalFileName = originalFileName;
    }

    public boolean isEmpty() {
        return bytes == null || bytes.length == 0;
    }

    public long getSize() {
        return bytes.length;
    }

    public String getName() {
        if (name.lastIndexOf('/') == -1) {
            return name;
        } else {
            return name.substring(name.lastIndexOf('/') + 1);
        }
    }

    public ByteArrayResource getResource() {
        String name = this.name;
        return new ByteArrayResource(this.bytes) {
            @Override
            public String getFilename() {
                return name;
            }
        };
    }

    public void generateFileName(String prefix, String suffix) {
        long n = random.nextLong();
        if (n == Long.MIN_VALUE) {
            n = 0;      // corner case
        } else {
            n = Math.abs(n);
        }

        this.name = prefix + Long.toString(n) + suffix;
        this.originalFileName = this.name;
    }

    public String toString() {
        return this.name;
    }
}