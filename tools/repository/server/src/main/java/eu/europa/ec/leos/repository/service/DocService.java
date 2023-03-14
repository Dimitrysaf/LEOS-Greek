package eu.europa.ec.leos.repository.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import eu.europa.ec.leos.repository.dao.jdbc.MetadataXmlRow;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTO;
import eu.europa.ec.leos.repository.entity.DocPackage;
import eu.europa.ec.leos.repository.entity.MinorVersion;
import eu.europa.ec.leos.repository.service.impl.TestPkg;

//main poc service
public interface DocService {

	public Long saveMinorVersionFromCuid(String cuid,String xml,boolean testExtraWait,boolean jpql);

	DocPackage testGetAllPackageInitialized(Long id) ;

	public TestPkg createPackage(String xml,long minVerNum, String cuid, String cuid_batch);
	
	public List<MinorVersionJDTO> getLast100(String cuid, Long limit, String orderBy);

	public List<MetadataXmlRow> getFirstLast(String cuid, String position);
	
	public List<MinorVersion> jpaGetLast100(String cuid);
	
}
