package eu.europa.ec.leos.repository.dao;

import eu.europa.ec.leos.repository.entity.DocPackage;

public interface DocPackageDao {

	public Long save(DocPackage pkg);
	public DocPackage findById(Long id);
	public DocPackage findByName(String name);
	
	
}
