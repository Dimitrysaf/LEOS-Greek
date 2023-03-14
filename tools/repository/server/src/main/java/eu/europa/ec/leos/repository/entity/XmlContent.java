package eu.europa.ec.leos.repository.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "XML_CONTENT")
public class XmlContent {

	@SequenceGenerator(
	        name="XML_CONTENT_SEQUENCE_GENERATOR",
	        sequenceName="XML_CONTENT_SEQ",
	        initialValue=1,
	        allocationSize=1//check if automated schema creation is compatible
	        //50
	    )
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="XML_CONTENT_SEQUENCE_GENERATOR")
	@Id 
	@Column(name = "ID")
	long id;

	@Lob
	@Column(name="XML")
	String xml;
	
	/*
	@Column(name = "CREATED_DATE")
	private java.sql.Timestamp CREATED_DATE;
	*/
	
	public String getXml() {
		return xml;
	}

	public void setXml(String xml) {
		this.xml = xml;
	}

	public XmlContent() {

	}


	@ManyToOne
	@JoinColumn(name = "MINOR_VERSION_ID")
	private MinorVersion minorVersion;

	
	

	public MinorVersion getMinorVersion() {
		return minorVersion;
	}

	public void setMinorVersion(MinorVersion minorVersion) {
		this.minorVersion = minorVersion;
	}


	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}


	@Override
	public String toString() {
		StringBuilder sBuilder = new StringBuilder();
		sBuilder

			.append(" xml [").append(this.getId()).append("] ")
			;

		return sBuilder.toString();
	}

}
