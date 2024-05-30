package eu.europa.ec.leos.repository.model;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class LinkedPackageList {
    private List<LinkedPackage> linkedPackageList = new LinkedList<>();

    public LinkedPackageList() {
    }

    public LinkedPackageList(Iterable<LinkedPackage> linkedPackages) {
        this.linkedPackageList = StreamSupport.stream(linkedPackages.spliterator(), false)
                .collect(Collectors.toList());
    }

    public  List<LinkedPackage> getLinkedPackageList(){
        return linkedPackageList;
    }

    public void setLinkedPackageList(List<LinkedPackage> linkedPackages) {
        this.linkedPackageList = StreamSupport.stream(linkedPackages.spliterator(), false)
                .collect(Collectors.toList());
    }
}
