package eu.europa.ec.leos.repository;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;

public class TestUtils {

    public static byte[] getBytesFromFile(String path, String fileName) {
        return getBytesFromFile(path + fileName);
    }

    public static byte[] getBytesFromFile(String path) {
        try {
            File file = new File(path);
            return FileUtils.readFileToByteArray(file);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read bytes from file: " + path);
        }
    }

    public static byte[] getFileContent(String path, String fileName) {
        return getFileContent(path + fileName);
    }
    
    public static byte[] getFileContent(String fileName) {
        try {
            InputStream inputStream = TestUtils.class.getResource(fileName).openStream();
            byte[] content = new byte[inputStream.available()];
            inputStream.read(content);
            inputStream.close();
            return content;
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read bytes from file: " + fileName);
        }
    }

    public static Object getDeserializeObject(String fileName) {
        try {
            InputStream inputStream = TestUtils.class.getResource(fileName).openStream();
            return new ObjectInputStream(inputStream).readObject();
        } catch (ClassNotFoundException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}
