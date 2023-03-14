package eu.europa.ec.leos.repository.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import eu.europa.ec.leos.repository.entity.DocPackage;
import eu.europa.ec.leos.repository.service.DocService;
import eu.europa.ec.leos.repository.service.impl.TestPkg;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.util.Converter;

@RestController
public class PackageController {
	@Autowired
	DocService docService;

	ObjectMapper mapper = new ObjectMapper();

	

	
	//alternate to json embed the xml
	// just because jmeter and eclise text editors dont like 110k on one line
	@PostMapping(path="/package/test/multipart/createFromXml/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> uploadFile(
			@RequestParam("metadata") String json, 
			@RequestParam("file") MultipartFile file) 
	{
		try {
//			System.out.println(json);
			JsonNode actualObj = mapper.readTree(json);
			String xml=new String(file.getBytes());
			Long numVersions=actualObj.get("numVersions").asLong();
			String cuid=actualObj.get("cuid").asText();
			//test reload
			TestPkg tp = docService.createPackage(xml,numVersions,cuid,cuid);

		    // create a JSON object
		    ObjectNode jpkg = mapper.createObjectNode();
		    Long myPkgId=tp.pkgId;
		    System.out.println(myPkgId);
//		    jpkg.put("pkgid",myPkgId) ;
		    //long mavId = tp.mavId;
		    //jpkg.put("mavid", mavId);
		    long lastMivId=tp.latestMivId;
//		    System.out.println("last miv id "+lastMivId);
			jpkg.put("lastmivid", lastMivId);
			
		    // convert `ObjectNode` to pretty-print JSON
		    // without pretty-print, use `user.toString()` method
		    String ret = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jpkg);
			
			
			
		return new ResponseEntity<>(ret, HttpStatus.OK);
		}catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	

	//alternate to json embed the xml
	// just because jmeter and eclise text editors dont like 110k on one line
	@PostMapping(path="/package/test/multipart/createpackagesversionsFromXml/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> createFullTestSet(
			@RequestParam("metadata") String json, 
			@RequestParam("file") MultipartFile file) 
	{
		try {
			System.out.println(json);
			JsonNode actualObj = mapper.readTree(json);
			String xml=new String(file.getBytes());
			Long numVersions=actualObj.get("numVersions").asLong();
			Long numPackages=actualObj.get("numPackages").asLong();			
			Long startNumPackage=actualObj.get("startNumPackage").asLong();			
			String cuid=actualObj.get("cuid").asText();
			//test reload
			List<TestPkg> created=new ArrayList<TestPkg>();
			
			for(int i=1;i<=numPackages;i++) {
				long index= i+startNumPackage-1;
				TestPkg tp = docService.createPackage(xml,numVersions,cuid+"_"+i,cuid);
				created.add(tp);
			}

//		    // create a JSON object
//		    ObjectNode jpkg = mapper.createObjectNode();
//		    Long myPkgId=tp.pkgId;
//		    System.out.println(myPkgId);
//		    jpkg.put("pkgid",myPkgId) ;
//		    long mavId = tp.mavId;
//		    jpkg.put("mavid", mavId);
//		    long lastMivId=tp.latestMivId;
//		    System.out.println("last miv id "+lastMivId);
//			jpkg.put("lastmivid", lastMivId);
//		    // convert `ObjectNode` to pretty-print JSON
//		    // without pretty-print, use `user.toString()` method
//		    String ret = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jpkg);
		String ret="full test set ready to rock edit rules'";
			
			
		return new ResponseEntity<>(ret, HttpStatus.OK);
		}catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	
	
	//hydrates all tree of object to get ids, could be slow with many version
	@PostMapping(value = {"/package/test/createFromXml"}, produces = "application/json")
	public ResponseEntity<String> createFromXml(
			@RequestBody String json
	) {
		try {
			System.out.println(json);
			JsonNode actualObj = mapper.readTree(json);
//			String name = actualObj.get("name").asText();
			String xml=actualObj.get("xml").asText();
			String cuid_batch = null;
			Long numVersions=actualObj.get("numVersions").asLong();
		
			TestPkg tp = docService.createPackage(xml,numVersions,"default cuid"+System.currentTimeMillis(),cuid_batch);

		    // create a JSON object
		    ObjectNode jpkg = mapper.createObjectNode();
		    Long myPkgId=tp.pkgId;
		    System.out.println(myPkgId);
		    jpkg.put("pkgid",myPkgId) ;
		    //long mavId = tp.mavId;
		    //jpkg.put("mavid", mavId);
		    long lastMivId=tp.latestMivId;
		    System.out.println("last miv id "+lastMivId);
			jpkg.put("lastmivid", lastMivId);
			

		    // convert `ObjectNode` to pretty-print JSON
		    // without pretty-print, use `user.toString()` method
		    String ret = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(jpkg);
			
			
			
		return new ResponseEntity<>(ret, HttpStatus.OK);
		}catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
