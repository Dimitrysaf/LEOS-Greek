package eu.europa.ec.leos.rest.support.model;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class LeosDocumentList {
    private List<LeosDocument> leosDocumentList = new LinkedList<>();

    public LeosDocumentList() {
    }

    public  List<LeosDocument> getLeosDocumentList(){
        return leosDocumentList;
    }

    public void setLeosDocumentList(List<LeosDocument> xmlDocs) {
        this.leosDocumentList = StreamSupport.stream(xmlDocs.spliterator(), false)
                .collect(Collectors.toList());
    }
}
