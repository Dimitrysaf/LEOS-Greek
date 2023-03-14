package eu.europa.ec.leos.repository.dao;

import java.util.List;

import eu.europa.ec.leos.repository.dao.jdbc.MetadataXmlRow;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTO;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTORow;
import eu.europa.ec.leos.repository.entity.MinorVersion;

public interface MinorVersionDao {

	MinorVersion find(long id);
	
	Long save(MinorVersion miv);
	
	Long saveMinorVersionWithXml(String name,String xml);
	
	List<MinorVersion> list();

	List<MinorVersion> listWithXmls();
	
	List<MinorVersion> findVersionsWithDocumentId(long idDoc);

	MinorVersion  getLatestMinorVersionFromCuid(String cuid);
	List<MinorVersionJDTORow>  getLatestMinorVersionFromCuidJpa(String cuid);	
	
	List<MinorVersionJDTO> jdGetLast100Versiont(String cuid, Long limit, String orderBy);
	List<MetadataXmlRow> jdGetFirstLast(String cuid, String position);	

	List<MinorVersion> jpaGetLast100Version(String cuid);

	
}
