package eu.europa.ec.leos.services.controllers;

import eu.europa.ec.leos.services.dto.request.PublishTemplateRequest;
import eu.europa.ec.leos.services.template.CustomTemplateService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class CatalogControllerTest {

    private static final String LEG_FILE_ID = "legFile-123";
    private static final String TEMPLATE_NAME = "Test Template";

    @Mock
    private CustomTemplateService customTemplateService;

    @InjectMocks
    private CatalogController catalogController;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testPublishTemplateToCatalog_Success() {
        PublishTemplateRequest request = new PublishTemplateRequest();
        request.setTemplateName(TEMPLATE_NAME);
        request.setDgCodes(Arrays.asList("AGRI", "CLIMA"));

        doNothing().when(customTemplateService).publishTemplate(
                LEG_FILE_ID,
                request.getTemplateName(),
                request.getDgCodes()
        );

        ResponseEntity<Object> response = catalogController.publishTemplateToCatalog(LEG_FILE_ID, request);

        verify(customTemplateService, times(1)).publishTemplate(
                LEG_FILE_ID,
                request.getTemplateName(),
                request.getDgCodes()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Template published successfully", responseBody.get("message"));
    }

    @Test
    public void testPublishTemplateToCatalog_Exception() {
        PublishTemplateRequest request = new PublishTemplateRequest();
        request.setTemplateName(TEMPLATE_NAME);
        request.setDgCodes(Arrays.asList("AGRI"));

        Exception exception = new RuntimeException("Service error");
        doThrow(exception).when(customTemplateService).publishTemplate(
                LEG_FILE_ID,
                request.getTemplateName(),
                request.getDgCodes()
        );

        ResponseEntity<Object> response = catalogController.publishTemplateToCatalog(LEG_FILE_ID, request);

        verify(customTemplateService, times(1)).publishTemplate(
                LEG_FILE_ID,
                request.getTemplateName(),
                request.getDgCodes()
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Unexpected error occurred while publishing template", responseBody.get("error"));
    }

    @Test
    public void testPublishTemplateToCatalog_EmptyDgCodes() {
        PublishTemplateRequest request = new PublishTemplateRequest();
        request.setTemplateName(TEMPLATE_NAME);
        request.setDgCodes(Arrays.asList());

        doNothing().when(customTemplateService).publishTemplate(
                LEG_FILE_ID,
                request.getTemplateName(),
                request.getDgCodes()
        );

        ResponseEntity<Object> response = catalogController.publishTemplateToCatalog(LEG_FILE_ID, request);

        verify(customTemplateService, times(1)).publishTemplate(
                LEG_FILE_ID,
                request.getTemplateName(),
                request.getDgCodes()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertEquals("Template published successfully", responseBody.get("message"));
    }
}