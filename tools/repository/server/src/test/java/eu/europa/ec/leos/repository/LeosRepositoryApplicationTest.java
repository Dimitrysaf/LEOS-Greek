package eu.europa.ec.leos.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTO;
import eu.europa.ec.leos.repository.entity.DocPackage;
import eu.europa.ec.leos.repository.entity.Document;
import eu.europa.ec.leos.repository.entity.MinorVersion;
import eu.europa.ec.leos.repository.jdbc.template.JdbcTest;
import eu.europa.ec.leos.repository.service.DocService;
import eu.europa.ec.leos.repository.service.impl.TestPkg;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class LeosRepositoryApplicationTest {

	@Autowired
	DocService docService;
	
	@Autowired
	JdbcTest jtest;

	@Test
	void jdhello() {
		jtest.doSomething();
	}

	@Test
	void jdversions() {
		Long id = docService.createPackage("<xml>dummy</xml>",1, "jdtest", "jdtest").pkgId;
		List<MinorVersionJDTO>ret=docService.getLast100("jdtest",(long) 1,"ASC");
		for(MinorVersionJDTO d:ret) {
			System.out.println(d.name);
		}
		assertTrue(1<= ret.size());
	}

	@Test
	void testJpaVersions() {
		TestPkg tp = docService.createPackage("<xml></xml>", 1, "jpaversions", "test");
		List<MinorVersion>ret=docService.jpaGetLast100("jpaversions");
		assertTrue(1<= ret.size());
	}

	@Test
	void contextLoads() {
	}
	
	@Test
	void testCreateTestPackage() {
		Long id =docService.createPackage("<xml>dummy</xml>",1, null,"test").pkgId;
		System.out.println("package created " +id);
		//let's check everything is persisted
		DocPackage fresh =docService.testGetAllPackageInitialized(id);
		System.out.println("number of document " +fresh.getDocuments().size());
		assertEquals(fresh.getDocuments().size(),1);
		Document d=fresh.getDocuments().get(0);
		MinorVersion miv = d.getMinorVersions().get(0);
		assertEquals(miv.getXmls().size(),1);
		assertEquals(miv.getLatestVersion(),true);
	}
	
	@Test
	void testCreateTestPackage100miv() {
		Long id =docService.createPackage("<xml>dummy</xml>",100, null, "test").pkgId;
		System.out.println("package created " +id);
		//let's check everything is persisted
		DocPackage fresh =docService.testGetAllPackageInitialized(id);
		Document d=fresh.getDocuments().get(0);
		MinorVersion miv = d.getMinorVersions().get(99); //   mav.getMinorVersions().get(99);
		assertEquals(miv.getXmls().size(),1);
		assertEquals(miv.getLatestVersion(),true);
		
		for(MinorVersion tmiv : d.getMinorVersions()) 
		{
			assertEquals(tmiv.getXmls().size(),1);
		
		}
	}

	@Test
	void testSaveLatestMinorVersionFromCuid() {
		TestPkg tp = docService.createPackage("<xml></xml>", 1, "smv", "test");
		Long mivId=docService.saveMinorVersionFromCuid("smv", "bla",false,false);
		DocPackage pkg = docService.testGetAllPackageInitialized(tp.pkgId);
		assertEquals(pkg.getDocuments().get(0).getMinorVersions().size(),2);
	}
	
	@Test
	void testSaveLatestMinorVersionFromCuidJpqlUpdateLink() {
		TestPkg tp = docService.createPackage("<xml></xml>", 1, "jpqlsmv", "test");
		Long mivId=docService.saveMinorVersionFromCuid("jpqlsmv", "bla",false,true);
		DocPackage pkg = docService.testGetAllPackageInitialized(tp.pkgId);
		assertEquals(pkg.getDocuments().get(0).getMinorVersions().size(),2);
	}
}
