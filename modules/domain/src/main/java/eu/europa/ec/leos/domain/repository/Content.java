package eu.europa.ec.leos.domain.repository;

import eu.europa.ec.leos.domain.repository.document.LeosDocument;

import java.io.InputStream;
import java.io.Serializable;

public interface Content extends Serializable {

    String getFileName();

    String getMimeType();

    long getLength();

    Content.Source getSource();

    interface Source extends Serializable {
        InputStream getInputStream();

        byte[] getBytes();
    }
}
