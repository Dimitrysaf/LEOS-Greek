package eu.europa.ec.leos.repository.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Version;

@Entity
@Table(name = "MINOR_VERSION")
public class MinorVersion {

	@SequenceGenerator(
	        name="MINOR_VERSION_SEQUENCE_GENERATOR",
	        sequenceName="MINOR_VERSION_SEQ",
	        initialValue=1,
	        allocationSize=1
	    )
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="MINOR_VERSION_SEQUENCE_GENERATOR")
	@Id 
	@Column(name = "ID")
	long id;

	@Version 
	@Column(name = "VERSION")
	long version;
	
	@ManyToOne
	@JoinColumn(name = "DOCUMENT_ID")
	private Document document;

	
	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

	public long getVersion() {
		return version;
	}

	public void setVersion(long version) {
		this.version = version;
	}

	public Boolean getLatestVersion() {
		return latestVersion;
	}

	public void setLatestVersion(Boolean latestVersion) {
		this.latestVersion = latestVersion;
	}

	public Boolean getOldestVersion() {
		return oldestVersion;
	}

	public void setOldestVersion(Boolean oldestVersion) {
		this.oldestVersion = oldestVersion;
	}


	@Column(name = "NAME")
	String name;

	@Column(name = "MNNUMBER")
	int minorVersionNumber;
	
	@Column(name = "MNLATEST")
	Boolean latestVersion;

	@Column(name = "MNOLDEST")
	Boolean oldestVersion;
	

	
	public MinorVersion() {
		this.latestVersion=false;
		this.oldestVersion=false;
	}

	
	//@ManyToOne
//	@JoinColumn(name = "MAJOR_VERSION_ID")
	//MajorVersion majorVersion;
	
	public long getId() {
		return id;
	}

	public void setId(long idmiv) {
		this.id = idmiv;
	}

	
	@OneToMany(
			cascade = CascadeType.ALL
			, mappedBy = "minorVersion"
			, fetch = FetchType.LAZY
			)
	/* */
	
	// I let spring handle the entity manager so I can stay with my jpa annotations and not mix with pure Hibernate annotations
	//@Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE, org.hibernate.annotations.CascadeType.DELETE})
	private List<XmlContent> xmls = new ArrayList<XmlContent>();

	
	
	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}


	public int getMinorVersionNumber() {
		return minorVersionNumber;
	}

	public void setMinorVersionNumber(int mvn) {
		this.minorVersionNumber = mvn;
	}

	//WIP POSSIBLE OPTIMIZATION,TO TEST (store FK of latest miv as a field in parent entity for easy querying)
//	@ManyToOne
	//@JoinColumn(name = "LTST_FOR_MAJOR_VERSION_ID")
//	MajorVersion latestForMajorVersion;
	

	@Override
	public String toString() {
		StringBuilder sBuilder = new StringBuilder();
		sBuilder
			.append(" name [").append(this.getName()).append("] ")

			.append("  [").append(this.getMinorVersionNumber()).append("] ")

			;

		return sBuilder.toString();
	}

	public List<XmlContent> getXmls() {
		return xmls;
	}

	public void setXmls(List<XmlContent> xmls) {
		this.xmls = xmls;
	}

}
