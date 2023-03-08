package eu.europa.ec.leos.repository.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "DOCUMENT")
public class Document {

	@SequenceGenerator(name = "DOCUMENT_SEQUENCE_GENERATOR", sequenceName = "DOCUMENT_SEQ", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DOCUMENT_SEQUENCE_GENERATOR")
	@Id
	@Column(name = "ID")
	private long id;

	@Column(name = "NAME")
	private String name;

	/**
	 * owning side of the relationship with player
	 */
	@ManyToOne(optional = true)
	@JoinColumn(name = "PACKAGE_ID", nullable = true, unique = false, updatable = true)
	private DocPackage docPackage;

	@Column(name = "CUID", unique = true)
	String cuid;

	public String getCuid() {
		return cuid;
	}

	public void setCuid(String cuid) {
		this.cuid = cuid;
	}

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "document", fetch = FetchType.LAZY)
	private List<MinorVersion> minorVersions = new ArrayList<MinorVersion>();

	public List<MinorVersion> getMinorVersions() {
		return minorVersions;
	}

	public void setMinorVersions(List<MinorVersion> minorVersions) {
		this.minorVersions = minorVersions;
	}

	public Document() {
	}

	public Document(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public DocPackage getDocPackage() {
		return docPackage;
	}

	public void setDocPackage(DocPackage pkg) {
		this.docPackage = pkg;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Document : [").append(this.getId()).append("] name [").append(this.getName()).append("]");
		return sb.toString();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	/* */
}
