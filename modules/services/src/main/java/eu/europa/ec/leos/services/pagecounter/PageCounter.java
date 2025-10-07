package eu.europa.ec.leos.services.pagecounter;

public interface PageCounter {

    int charCount(byte[] xmlContent);
    String countPages(int charCount);

}
