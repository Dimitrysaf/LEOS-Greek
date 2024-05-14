package eu.europa.ec.leos.repository.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;

public class LinkedPackage {
    private static final Logger LOG = LoggerFactory.getLogger(LinkedPackage.class);

    private String id;
    private BigDecimal packageId;
    private BigDecimal linkedPackageId;

    public LinkedPackage(eu.europa.ec.leos.repository.entities.LinkedPackage linkedPackage) {
        this.id = linkedPackage.getId().toString();
        this.packageId = linkedPackage.getPackageId();
        this.linkedPackageId = linkedPackage.getLinkedPackageId();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BigDecimal getPackageId() {
        return packageId;
    }

    public void setPackageId(BigDecimal packageId) {
        this.packageId = packageId;
    }

    public BigDecimal getLinkedPackageId() {
        return linkedPackageId;
    }

    public void setLinkedPackageId(BigDecimal linkedPackageId) {
        this.linkedPackageId = linkedPackageId;
    }
}
