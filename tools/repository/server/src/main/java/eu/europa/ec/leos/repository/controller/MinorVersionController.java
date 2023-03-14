package eu.europa.ec.leos.repository.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import javax.persistence.OptimisticLockException;

import org.hibernate.StaleStateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import eu.europa.ec.leos.repository.dao.jdbc.MetadataXmlRow;
import eu.europa.ec.leos.repository.dao.jdbc.MinorVersionJDTO;
import eu.europa.ec.leos.repository.entity.MinorVersion;
import eu.europa.ec.leos.repository.service.DocService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class MinorVersionController {

	ObjectMapper mapper = new ObjectMapper();

	@Autowired
	DocService docService;

	Logger logger = LoggerFactory.getLogger(MinorVersionController.class);

	// alternate to json embed the xml
	// just because jmeter and eclise text editors dont like 110k on one line
	@PostMapping(path = "/minorversion/query/", produces = "application/json")
	public ResponseEntity<String> last100(@RequestBody String json) {
		try {
			JsonNode actualObj = mapper.readTree(json);

			String cuid = actualObj.get("cuid").asText();
			Long limit = actualObj.get("limit").asLong();	
			String orderBy = actualObj.get("orderby").asText();
			// TODO for some reason works in unit test, but here returns empty list
			List<MinorVersionJDTO> ret = docService.getLast100(cuid, limit, orderBy);
//			List<MinorVersion> ret = docService.jpaGetLast100(cuid);
			System.out.println(cuid + " num versions " + ret.size());
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			mapper.writeValue(baos, ret);
			byte[] bs = baos.toByteArray();
//			System.out.println(baos.toString());
			return new ResponseEntity<>(new String(bs), HttpStatus.OK);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PostMapping(path = "/minorversion/getfirstlast/", produces = "application/json")
	public ResponseEntity<String> getFirstLast(@RequestBody String json) {
		try {
			JsonNode actualObj = mapper.readTree(json);
			String cuid = actualObj.get("cuid").asText();
			String position = actualObj.get("position").asText();
			List<MetadataXmlRow> ret = docService.getFirstLast(cuid,position);
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			mapper.writeValue(baos, ret);
			byte[] bs = baos.toByteArray();
			return new ResponseEntity<>(new String(bs), HttpStatus.OK);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}	

	// alternate to json embed the xml
	// just because jmeter and eclise text editors dont like 110k on one line
	@PostMapping(path = "/minorversion/multipart/createFromXml/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> uploadFile(@RequestParam("metadata") String json,
			@RequestParam("file") MultipartFile file) {
		try {

			JsonNode actualObj = mapper.readTree(json);
			String cuid = actualObj.get("cuid").asText();
			String xml = new String(file.getBytes());
//			boolean wait = actualObj.get("wait").asBoolean();
			boolean wait = false;			
//			System.out.println(xml);
			long id = docService.saveMinorVersionFromCuid(cuid, xml, wait, false);
			String ret = Long.toString(id);
			return new ResponseEntity<>("save success " + ret, HttpStatus.OK);
		} catch (StaleStateException e) {
//			e.printStackTrace();
			// optimistick lock is a feature, should not cause request to fail (business
			// exception)
			logger.error("optimistic lock");
			return new ResponseEntity<>("concurrency error", HttpStatus.OK);
		} catch (OptimisticLockException e) {
//			e.printStackTrace();
			// optimistick lock is a feature, should not cause request to fail (business
			// exception)
			logger.error("optimistic lock");
			return new ResponseEntity<>("concurrency error", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	
	@PostMapping(value = { "/minorversion/createFromJson" }, produces = "application/json")
	public ResponseEntity<String> userEdits(@RequestBody String json) {

		try {
			JsonNode actualObj = mapper.readTree(json);
			System.out.println("json "+json);
//			Long mavid = actualObj.get("mavid").asLong();
			String xml = actualObj.get("xml").asText();
			System.out.println(xml);
//			long id = docService.saveMinorVersionFromMavId(mavid, xml);
//			String ret = Long.toString(id);
			return new ResponseEntity<>("test ok", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("post NOT ok", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	

}
