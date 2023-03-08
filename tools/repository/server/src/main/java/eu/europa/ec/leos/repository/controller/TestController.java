package eu.europa.ec.leos.repository.controller;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import eu.europa.ec.leos.repository.dao.DocumentDao;

@RestController
public class TestController {

	// define field for entitymanager	
	@Autowired
	private EntityManager entityManager;
	
	@Autowired
	DocumentDao documentDao;
	
//	@Autowired
//	MajorVersionDao majorVersionDao;
	
    @Autowired
    private PlatformTransactionManager transactionManager;
	
    
//    https://www.sourcecodeexamples.net/2021/06/spring-boot-hibernate-dao-with-mysql.html
	@GetMapping(value = {"/test/{id}"}, produces = "application/json")
	public ResponseEntity<String> exportNotification(
	@PathVariable String id
	) {
		TransactionTemplate tt = new TransactionTemplate(transactionManager);
		 tt.execute(new TransactionCallback() {

			@Override
			public Object doInTransaction(TransactionStatus status) {
				documentDao.list();
				return null;
			}
		});
		System.out.println(entityManager);
		return new ResponseEntity<>("test"+id, HttpStatus.OK);
	}
	
	@Value("${trab.test}")
	String testProp;
	
	@GetMapping(value = {"/ping/{id}"}, produces = "application/json")
	public ResponseEntity<String> ping(
	@PathVariable String id
	) {
		
		return new ResponseEntity<>("test"+id+" test prop "+testProp, HttpStatus.OK);
	}
		

	
	
}
