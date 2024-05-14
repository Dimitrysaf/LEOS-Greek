package eu.europa.ec.leos.repository.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "LINKED_PACKAGE", schema = "", catalog = "")
@NamedQueries({
        @NamedQuery(name = "LinkedPackage.findAll", query = "SELECT p FROM LinkedPackage p"),
        @NamedQuery(name = "LinkedPackage.findById", query = "SELECT p FROM LinkedPackage p WHERE p.id = :id")
})
public class LinkedPackage implements Serializable {
    private static final long serialVersionUID = 1L;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    private BigDecimal id;
    @JoinColumn(name = "PACKAGE_ID", referencedColumnName = "ID")
    @Column(name = "PACKAGE_ID")
    private BigDecimal packageId;
    @Column(name = "LINKED_PACKAGE_ID")
    private BigDecimal linkedPackageId;

    public LinkedPackage() {
    }

    public LinkedPackage(BigDecimal id) {
        this.id = id;
    }

    public BigDecimal getId() {
        return id;
    }

    public void setId(BigDecimal id) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        LinkedPackage that = (LinkedPackage) o;
        return Objects.equals(id, that.id) && Objects.equals(packageId, that.packageId) && Objects.equals(linkedPackageId,
                that.linkedPackageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, packageId, linkedPackageId);
    }

    @Override
    public String toString() {
        return "LinkedPackage{" +
                "id=" + id +
                ", packageId='" + packageId + '\'' +
                ", linkedPackageId='" + linkedPackageId + '\'' +
                '}';
    }
}
