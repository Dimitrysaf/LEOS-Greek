package eu.europa.ec.leos.repository.model;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class LeosDocumentList {
    private List<LeosDocument> leosDocumentList = new LinkedList<>();

    @SuppressWarnings("unused")
    public LeosDocumentList() {
    }

    public LeosDocumentList(Iterable<LeosDocument> xmlDocs) {
        this.leosDocumentList = StreamSupport.stream(xmlDocs.spliterator(), false)
                .collect(Collectors.toList());
    }

    public  List<LeosDocument> getLeosDocumentList(){
        return leosDocumentList;
    }

    public void setLeosDocumentList(List<LeosDocument> leosDocumentList) {
        this.leosDocumentList = StreamSupport.stream(leosDocumentList.spliterator(), false)
                .collect(Collectors.toList());
    }
}
