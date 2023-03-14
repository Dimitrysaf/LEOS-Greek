package eu.europa.ec.leos.repository.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = TestNotLinked.TESTNOTLINKED)
public class TestNotLinked implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public static final String TESTNOTLINKED= "TESTNOTLINKED";
	
	@SequenceGenerator(
	        name="TESTNOTLINKED_SEQUENCE_GENERATOR",
	        sequenceName="TESTNOTLINKED_SEQ",
	        initialValue=1,
	        allocationSize=1
	    )
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="TESTNOTLINKED_SEQUENCE_GENERATOR")
	@Id
	@Column(name = "ID")
	long id;
	
	@Column(name = "NAME")
	private String name;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	
}
