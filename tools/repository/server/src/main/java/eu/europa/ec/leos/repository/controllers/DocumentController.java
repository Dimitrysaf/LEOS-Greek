package eu.europa.ec.leos.repository.controllers;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.stream.Stream;

import eu.europa.ec.leos.repository.entities.Document;
import eu.europa.ec.leos.repository.entities.PackageV;
import eu.europa.ec.leos.repository.repositories.DocumentRepository;
import eu.europa.ec.leos.repository.repositories.PackageVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class DocumentController {
    @Autowired
    PackageVRepository packageRepository;

    @Autowired
    DocumentRepository documentRepository;

    ObjectMapper mapper = new ObjectMapper();

    @PostMapping(path="/package/documents/{name}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> getDocumentsFromPackageName(@PathVariable String name)
    {
        try {
            PackageV p = packageRepository.findPackageByName(name);
            Stream<Document> docs = Stream.of();
            if (p != null) {
                docs = documentRepository.findDocumentsFromPackageId(p.getPackageId());
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            mapper.writeValue(baos, docs);
            byte[] bs = baos.toByteArray();
            return new ResponseEntity<>(new String(bs), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(path="/package/id/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> getPackageFromId(@PathVariable("id") String id)
    {
        try {
            PackageV p = packageRepository.findPackageById(new BigDecimal(id));
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            mapper.writeValue(baos, p);
            byte[] bs = baos.toByteArray();
            return new ResponseEntity<>(new String(bs), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
