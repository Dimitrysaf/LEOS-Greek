package eu.europa.ec.leos.repository.dao;

import java.util.List;

import eu.europa.ec.leos.repository.entity.Document;

public interface DocumentDao {

	void save(Document doc);
	List<Document> list();
	
	public Document findById(long idDocument);
	
	Document findDocumentWithMVById(long idDocument);
	
	List<Document> findByPackageId(long packageId);
}
