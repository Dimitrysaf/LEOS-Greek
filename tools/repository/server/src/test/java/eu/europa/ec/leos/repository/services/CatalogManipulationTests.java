package eu.europa.ec.leos.repository.services;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CatalogManipulationTests {

//    @Autowired
//    private CatalogServiceImpl catalogService;
//
//    @Test
//    public void testCreateCatalogWithCategoriesOnly_CompleteValidation() throws Exception {
//        String result = catalogService.createCatalogWithCategoriesOnly();
//
//        assertNotNull("Result should not be null", result);
//        assertTrue("Should start with XML declaration", result.startsWith("<?xml"));
//
//        Document doc = parseXml(result);
//        validateXmlStructure(doc);
//
//        CatalogStructure structure = analyzeCatalogStructure(doc);
//
//        assertEquals("Should have no templates", 0, structure.templateCount);
//        assertEquals("Should have no documents", 0, structure.documentCount);
//        assertTrue("Should have categories", structure.categoryCount > 0);
//
//        for (Element category : structure.categories) {
//            validateCategoryStructure(category);
//        }
//
//        String reparsed = documentToString(doc);
//        Document reDoc = parseXml(reparsed);
//        assertNotNull("Re-parsed document should be valid", reDoc);
//    }
//
//    @Test
//    public void testInsertTemplateIntoCatalog_CompleteValidation() throws Exception {
//        String originalCatalog = CatalogTestData.BASE_CATALOG_XML;
//        Document originalDoc = parseXml(originalCatalog);
//        CatalogStructure originalStructure = analyzeCatalogStructure(originalDoc);
//
//        String result = catalogService.insertTemplateIntoCatalog(originalCatalog, "SJ-023", "Test Template", "123");
//
//        assertNotNull("Result should not be null", result);
//        Document resultDoc = parseXml(result);
//        validateXmlStructure(resultDoc);
//
//        CatalogStructure resultStructure = analyzeCatalogStructure(resultDoc);
//
//        assertTrue("Should have more templates", resultStructure.templateCount > originalStructure.templateCount);
//        assertEquals("Category count should remain same", originalStructure.categoryCount, resultStructure.categoryCount);
//
//        Element insertedTemplate = findTemplateByKey(resultDoc, "SJ-023");
//        assertNotNull("SJ-023 template should exist", insertedTemplate);
//        validateTemplateStructure(insertedTemplate);
//
//        // Validate custom attributes
//        assertEquals("Should have custom-name attribute", "Test Template", insertedTemplate.getAttribute("custom-name"));
//        assertEquals("Should have custom-key attribute", "SJ-023/123", insertedTemplate.getAttribute("custom-key"));
//
//        Element parentCategory = (Element) insertedTemplate.getParentNode();
//        assertEquals("Template parent should be category", "CATEGORY", parentCategory.getAttribute("type"));
//
//        for (String categoryKey : originalStructure.categoryKeys) {
//            Element category = findCategoryByKey(resultDoc, categoryKey);
//            assertNotNull("Original category " + categoryKey + " should be preserved", category);
//            validateCategoryStructure(category);
//        }
//
//        String formatted = documentToString(resultDoc);
//        assertTrue("Should be properly formatted XML", formatted.contains("<?xml"));
//        assertTrue("Should contain the template", formatted.contains("SJ-023"));
//
//        Document reDoc = parseXml(formatted);
//        assertNotNull("Formatted XML should be re-parseable", reDoc);
//    }
//
//    @Test
//    public void testCombinedOperations_FullValidation() throws Exception {
//        String categoriesOnly = catalogService.createCatalogWithCategoriesOnly();
//        Document categoriesDoc = parseXml(categoriesOnly);
//        CatalogStructure categoriesStructure = analyzeCatalogStructure(categoriesDoc);
//
//        assertEquals("Categories-only should have no templates", 0, categoriesStructure.templateCount);
//        assertTrue("Should have categories", categoriesStructure.categoryCount > 0);
//
//        String withTemplate = catalogService.insertTemplateIntoCatalog(categoriesOnly, "SJ-023", "Test Template", "123");
//        Document finalDoc = parseXml(withTemplate);
//        CatalogStructure finalStructure = analyzeCatalogStructure(finalDoc);
//
//        assertTrue("Should have templates after insertion", finalStructure.templateCount > 0);
//        assertEquals("Category count should be preserved", categoriesStructure.categoryCount, finalStructure.categoryCount);
//
//        Element template = findTemplateByKey(finalDoc, "SJ-023");
//        assertNotNull("SJ-023 should exist", template);
//        validateTemplateStructure(template);
//
//        for (String categoryKey : categoriesStructure.categoryKeys) {
//            Element category = findCategoryByKey(finalDoc, categoryKey);
//            assertNotNull("Category " + categoryKey + " should be preserved", category);
//        }
//
//        validateXmlStructure(finalDoc);
//    }
//
//    @Test
//    public void testInsertTemplateIntoCatalog_CustomAttributes() throws Exception {
//        String result = catalogService.insertTemplateIntoCatalog(
//            CatalogTestData.BASE_CATALOG_XML,
//            "SJ-023",
//            "My Custom Template",
//            "456"
//        );
//
//        Document doc = parseXml(result);
//        Element template = findTemplateByKey(doc, "SJ-023");
//
//        assertNotNull("Template should exist", template);
//        assertEquals("Should have custom-name attribute", "My Custom Template", template.getAttribute("custom-name"));
//        assertEquals("Should have custom-key attribute", "SJ-023/456", template.getAttribute("custom-key"));
//
//        // Verify original attributes are preserved
//        assertEquals("Original key should be preserved", "SJ-023", template.getAttribute("key"));
//        assertTrue("Should have type attribute", template.hasAttribute("type"));
//        assertEquals("Should be template type", "TEMPLATE", template.getAttribute("type"));
//    }
//
//    @Test(expected = Exception.class)
//    public void testInsertTemplateIntoCatalog_NonExistentTemplate() throws Exception {
//        catalogService.insertTemplateIntoCatalog(CatalogTestData.BASE_CATALOG_XML, "NONEXISTENT_TEMPLATE", "Test", "123");
//    }
//
//    @Test
//    public void testInsertTemplateIntoCatalog_MalformedXml() throws Exception {
//        try {
//            catalogService.insertTemplateIntoCatalog(CatalogTestData.MALFORMED_XML, "SJ-023", "Test", "123");
//            fail("Should throw exception for malformed XML");
//        } catch (Exception e) {
//            // Expected
//        }
//    }
//
//    @Test(expected = Exception.class)
//    public void testInsertTemplateIntoCatalog_NullInputs() throws Exception {
//        catalogService.insertTemplateIntoCatalog(null, "SJ-023", "Test", "123");
//    }
//
//    @Test(expected = Exception.class)
//    public void testInsertTemplateIntoCatalog_NullTemplateKey() throws Exception {
//        catalogService.insertTemplateIntoCatalog(CatalogTestData.BASE_CATALOG_XML, null, "Test", "123");
//    }
//
//    @Test(expected = Exception.class)
//    public void testInsertTemplateIntoCatalog_EmptyTemplateKey() throws Exception {
//        catalogService.insertTemplateIntoCatalog(CatalogTestData.BASE_CATALOG_XML, "", "Test", "123");
//    }
//
//    @Test
//    public void testCreateCatalogWithCategoriesOnly_TemplatesRemoved() throws Exception {
//        String result = catalogService.createCatalogWithCategoriesOnly();
//
//        Document doc = parseXml(result);
//        CatalogStructure structure = analyzeCatalogStructure(doc);
//
//        assertEquals("Should have no templates", 0, structure.templateCount);
//        assertEquals("Should have no documents", 0, structure.documentCount);
//        assertTrue("Should have categories", structure.categoryCount > 0);
//
//        NodeList items = doc.getElementsByTagName("item");
//        for (int i = 0; i < items.getLength(); i++) {
//            Element item = (Element) items.item(i);
//            String type = item.getAttribute("type");
//            assertNotEquals("No templates should remain", "TEMPLATE", type);
//            assertNotEquals("No documents should remain", "DOCUMENT", type);
//        }
//    }
//
//    @Test
//    public void testInsertTemplateIntoCatalogByCategory_ValidCategory() throws Exception {
//        String result = catalogService.insertTemplateIntoCatalogByCategory(
//            CatalogTestData.BASE_CATALOG_XML,
//            "SJ-023",
//            "LAW_INITIATIVE",
//            "Test Template",
//            "123"
//        );
//
//        Document doc = parseXml(result);
//        validateXmlStructure(doc);
//
//        Element template = findTemplateByKey(doc, "SJ-023");
//        assertNotNull("SJ-023 template should exist", template);
//        validateTemplateStructure(template);
//
//        Element targetCategory = findCategoryByKey(doc, "LAW_INITIATIVE");
//        assertNotNull("LAW_INITIATIVE category should exist", targetCategory);
//    }
//
//    @Test(expected = Exception.class)
//    public void testInsertTemplateIntoCatalogByCategory_InvalidCategory() throws Exception {
//        catalogService.insertTemplateIntoCatalogByCategory(
//            CatalogTestData.BASE_CATALOG_XML,
//            "SJ-023",
//            "NONEXISTENT_CATEGORY",
//            "Test",
//            "123"
//        );
//    }
//
//    @Test
//    public void testInsertTemplateIntoCatalog_PreserveExistingStructure() throws Exception {
//        String originalCatalog = CatalogTestData.BASE_CATALOG_XML;
//        Document originalDoc = parseXml(originalCatalog);
//        CatalogStructure originalStructure = analyzeCatalogStructure(originalDoc);
//
//        String result = catalogService.insertTemplateIntoCatalog(originalCatalog, "SJ-023", "Test Template", "123");
//        Document resultDoc = parseXml(result);
//        CatalogStructure resultStructure = analyzeCatalogStructure(resultDoc);
//
//        assertEquals("All categories should be preserved", originalStructure.categoryCount, resultStructure.categoryCount);
//
//        for (String categoryKey : originalStructure.categoryKeys) {
//            Element originalCategory = findCategoryByKey(originalDoc, categoryKey);
//            Element resultCategory = findCategoryByKey(resultDoc, categoryKey);
//
//            assertNotNull("Category " + categoryKey + " should exist in result", resultCategory);
//            assertEquals("Category enabled should be preserved",
//                originalCategory.getAttribute("enabled"), resultCategory.getAttribute("enabled"));
//            assertEquals("Category id should be preserved",
//                originalCategory.getAttribute("id"), resultCategory.getAttribute("id"));
//        }
//
//        validateXmlStructure(resultDoc);
//    }
//
//    // Helper methods
//
//    private void validateXmlStructure(Document doc) {
//        assertNotNull("Document should not be null", doc);
//        Element root = doc.getDocumentElement();
//        assertNotNull("Root element should exist", root);
//        assertEquals("Root should be catalog", "catalog", root.getTagName());
//        assertTrue("Root should have lang attribute", root.hasAttribute("lang"));
//    }
//
//    private void validateCategoryStructure(Element category) {
//        assertEquals("Should be category type", "CATEGORY", category.getAttribute("type"));
//        assertTrue("Category should have id", category.hasAttribute("id"));
//        assertTrue("Category should have key", category.hasAttribute("key"));
//
//        NodeList names = category.getElementsByTagName("names");
//        assertTrue("Category should have names", names.getLength() > 0);
//
//        NodeList descriptions = category.getElementsByTagName("descriptions");
//        assertTrue("Category should have descriptions", descriptions.getLength() > 0);
//    }
//
//    private void validateTemplateStructure(Element template) {
//        assertEquals("Should be template type", "TEMPLATE", template.getAttribute("type"));
//        assertTrue("Template should have id", template.hasAttribute("id"));
//        assertTrue("Template should have key", template.hasAttribute("key"));
//
//        NodeList names = template.getElementsByTagName("names");
//        assertTrue("Template should have names", names.getLength() > 0);
//    }
//
//    private CatalogStructure analyzeCatalogStructure(Document doc) {
//        CatalogStructure structure = new CatalogStructure();
//        NodeList items = doc.getElementsByTagName("item");
//
//        for (int i = 0; i < items.getLength(); i++) {
//            Element item = (Element) items.item(i);
//            String type = item.getAttribute("type");
//            String key = item.getAttribute("key");
//
//            switch (type) {
//                case "CATEGORY":
//                    structure.categoryCount++;
//                    structure.categories.add(item);
//                    if (!key.isEmpty()) {
//                        structure.categoryKeys.add(key);
//                    }
//                    break;
//                case "TEMPLATE":
//                    structure.templateCount++;
//                    structure.templates.add(item);
//                    if (!key.isEmpty()) {
//                        structure.templateKeys.add(key);
//                    }
//                    break;
//                case "DOCUMENT":
//                    structure.documentCount++;
//                    break;
//            }
//        }
//
//        return structure;
//    }
//
//    private Element findTemplateByKey(Document doc, String key) {
//        NodeList items = doc.getElementsByTagName("item");
//        for (int i = 0; i < items.getLength(); i++) {
//            Element item = (Element) items.item(i);
//            if ("TEMPLATE".equals(item.getAttribute("type")) && key.equals(item.getAttribute("key"))) {
//                return item;
//            }
//        }
//        return null;
//    }
//
//    private Element findCategoryByKey(Document doc, String key) {
//        NodeList items = doc.getElementsByTagName("item");
//        for (int i = 0; i < items.getLength(); i++) {
//            Element item = (Element) items.item(i);
//            if ("CATEGORY".equals(item.getAttribute("type")) && key.equals(item.getAttribute("key"))) {
//                return item;
//            }
//        }
//        return null;
//    }
//
//    private String documentToString(Document doc) throws Exception {
//        TransformerFactory tf = TransformerFactory.newInstance();
//        Transformer transformer = tf.newTransformer();
//        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
//        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
//
//        StringWriter writer = new StringWriter();
//        transformer.transform(new DOMSource(doc), new StreamResult(writer));
//        return writer.toString();
//    }
//
//    private Document parseXml(String xml) throws Exception {
//        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//        DocumentBuilder builder = factory.newDocumentBuilder();
//        return builder.parse(new ByteArrayInputStream(xml.getBytes("UTF-8")));
//    }
//
//    @Test
//    public void testRemoveTemplateFromCatalog_ExistingTemplate() throws Exception {
//        String catalogWithTemplate = catalogService.insertTemplateIntoCatalog(
//            CatalogTestData.BASE_CATALOG_XML, "SJ-023", "Test Template", "123");
//
//        Document beforeDoc = parseXml(catalogWithTemplate);
//        CatalogStructure beforeStructure = analyzeCatalogStructure(beforeDoc);
//
//        Element templateBefore = findTemplateByCustomKey(beforeDoc, "SJ-023/123");
//        assertNotNull("Template should exist before removal", templateBefore);
//
//        String result = catalogService.removeTemplateFromCatalog(catalogWithTemplate, "SJ-023/123");
//
//        Document afterDoc = parseXml(result);
//        CatalogStructure afterStructure = analyzeCatalogStructure(afterDoc);
//
//        assertTrue("Template count should decrease (template contains nested items)",
//            afterStructure.templateCount < beforeStructure.templateCount);
//        assertEquals("Category count should remain same",
//            beforeStructure.categoryCount, afterStructure.categoryCount);
//
//        Element templateAfter = findTemplateByCustomKey(afterDoc, "SJ-023/123");
//        assertNull("Template should not exist after removal", templateAfter);
//
//        validateXmlStructure(afterDoc);
//    }
//
//    @Test
//    public void testRemoveTemplateFromCatalog_NonExistentTemplate() throws Exception {
//        String originalCatalog = CatalogTestData.BASE_CATALOG_XML;
//        Document originalDoc = parseXml(originalCatalog);
//        CatalogStructure originalStructure = analyzeCatalogStructure(originalDoc);
//
//        String result = catalogService.removeTemplateFromCatalog(originalCatalog, "NONEXISTENT/123");
//
//        Document resultDoc = parseXml(result);
//        CatalogStructure resultStructure = analyzeCatalogStructure(resultDoc);
//
//        assertEquals("Template count should remain same",
//            originalStructure.templateCount, resultStructure.templateCount);
//        assertEquals("Category count should remain same",
//            originalStructure.categoryCount, resultStructure.categoryCount);
//
//        validateXmlStructure(resultDoc);
//    }
//
//    @Test
//    public void testRemoveTemplateFromCatalog_MultipleTemplates() throws Exception {
//        String catalog = CatalogTestData.BASE_CATALOG_XML;
//
//        // Insert multiple templates
//        catalog = catalogService.insertTemplateIntoCatalog(catalog, "SJ-023", "Template 1", "123");
//        catalog = catalogService.insertTemplateIntoCatalog(catalog, "SJ-024", "Template 2", "456");
//
//        Document beforeDoc = parseXml(catalog);
//        CatalogStructure beforeStructure = analyzeCatalogStructure(beforeDoc);
//
//        // Remove one template
//        String result = catalogService.removeTemplateFromCatalog(catalog, "SJ-023/123");
//
//        Document afterDoc = parseXml(result);
//        CatalogStructure afterStructure = analyzeCatalogStructure(afterDoc);
//
//        assertTrue("Template count should decrease (template contains nested items)",
//            afterStructure.templateCount < beforeStructure.templateCount);
//
//        assertNull("First template should be removed", findTemplateByCustomKey(afterDoc, "SJ-023/123"));
//        assertNotNull("Second template should remain", findTemplateByCustomKey(afterDoc, "SJ-024/456"));
//
//        validateXmlStructure(afterDoc);
//    }
//
//    @Test
//    public void testRemoveTemplateFromCatalog_LastTemplate() throws Exception {
//        String categoriesOnly = catalogService.createCatalogWithCategoriesOnly();
//        String withTemplate = catalogService.insertTemplateIntoCatalog(
//            categoriesOnly, "SJ-023", "Only Template", "123");
//
//        Document beforeDoc = parseXml(withTemplate);
//        CatalogStructure beforeStructure = analyzeCatalogStructure(beforeDoc);
//        assertTrue("Should have templates (template contains nested items)", beforeStructure.templateCount > 0);
//
//        String result = catalogService.removeTemplateFromCatalog(withTemplate, "SJ-023/123");
//
//        Document afterDoc = parseXml(result);
//        CatalogStructure afterStructure = analyzeCatalogStructure(afterDoc);
//
//        assertEquals("Should have no templates", 0, afterStructure.templateCount);
//        assertEquals("Categories should be preserved",
//            beforeStructure.categoryCount, afterStructure.categoryCount);
//
//        validateXmlStructure(afterDoc);
//    }
//
//    @Test
//    public void testRemoveTemplateFromCatalog_PreserveCategoryStructure() throws Exception {
//        String catalog = catalogService.insertTemplateIntoCatalog(
//            CatalogTestData.BASE_CATALOG_XML, "SJ-023", "Test Template", "123");
//
//        Document beforeDoc = parseXml(catalog);
//        CatalogStructure beforeStructure = analyzeCatalogStructure(beforeDoc);
//
//        String result = catalogService.removeTemplateFromCatalog(catalog, "SJ-023/123");
//
//        Document afterDoc = parseXml(result);
//        CatalogStructure afterStructure = analyzeCatalogStructure(afterDoc);
//
//        assertEquals("All categories should be preserved",
//            beforeStructure.categoryCount, afterStructure.categoryCount);
//
//        for (String categoryKey : beforeStructure.categoryKeys) {
//            Element beforeCategory = findCategoryByKey(beforeDoc, categoryKey);
//            Element afterCategory = findCategoryByKey(afterDoc, categoryKey);
//
//            assertNotNull("Category " + categoryKey + " should exist after removal", afterCategory);
//            assertEquals("Category attributes should be preserved",
//                beforeCategory.getAttribute("enabled"), afterCategory.getAttribute("enabled"));
//            validateCategoryStructure(afterCategory);
//        }
//    }
//
//    @Test
//    public void testInsertAndRemoveTemplate_RoundTrip() throws Exception {
//        String originalCatalog = CatalogTestData.BASE_CATALOG_XML;
//        Document originalDoc = parseXml(originalCatalog);
//        CatalogStructure originalStructure = analyzeCatalogStructure(originalDoc);
//
//        // Insert template
//        String withTemplate = catalogService.insertTemplateIntoCatalog(
//            originalCatalog, "SJ-023", "Test Template", "123");
//
//        Document withTemplateDoc = parseXml(withTemplate);
//        CatalogStructure withTemplateStructure = analyzeCatalogStructure(withTemplateDoc);
//
//        assertTrue("Should have more templates (template contains nested items)",
//            withTemplateStructure.templateCount > originalStructure.templateCount);
//
//        // Remove template
//        String backToOriginal = catalogService.removeTemplateFromCatalog(withTemplate, "SJ-023/123");
//
//        Document backDoc = parseXml(backToOriginal);
//        CatalogStructure backStructure = analyzeCatalogStructure(backDoc);
//
//        assertEquals("Should have original template count",
//            originalStructure.templateCount, backStructure.templateCount);
//        assertEquals("Should have original category count",
//            originalStructure.categoryCount, backStructure.categoryCount);
//
//        validateXmlStructure(backDoc);
//    }
//
//    @Test(expected = Exception.class)
//    public void testRemoveTemplateFromCatalog_MalformedXml() throws Exception {
//        catalogService.removeTemplateFromCatalog(CatalogTestData.MALFORMED_XML, "SJ-023/123");
//    }
//
//    @Test(expected = Exception.class)
//    public void testRemoveTemplateFromCatalog_NullCatalogXml() throws Exception {
//        catalogService.removeTemplateFromCatalog(null, "SJ-023/123");
//    }
//
//    @Test(expected = Exception.class)
//    public void testRemoveTemplateFromCatalog_EmptyCatalogXml() throws Exception {
//        catalogService.removeTemplateFromCatalog("", "SJ-023/123");
//    }
//
//    @Test(expected = Exception.class)
//    public void testRemoveTemplateFromCatalog_NullCustomKey() throws Exception {
//        catalogService.removeTemplateFromCatalog(CatalogTestData.BASE_CATALOG_XML, null);
//    }
//
//    @Test(expected = Exception.class)
//    public void testRemoveTemplateFromCatalog_EmptyCustomKey() throws Exception {
//        catalogService.removeTemplateFromCatalog(CatalogTestData.BASE_CATALOG_XML, "");
//    }
//
//    @Test
//    public void testRemoveTemplateFromCatalog_DifferentPackageIds() throws Exception {
//        String catalog = CatalogTestData.BASE_CATALOG_XML;
//
//        // Insert templates with different package IDs
//        catalog = catalogService.insertTemplateIntoCatalog(catalog, "SJ-023", "Template 1", "123");
//        catalog = catalogService.insertTemplateIntoCatalog(catalog, "SJ-023", "Template 2", "456");
//
//        Document beforeDoc = parseXml(catalog);
//        CatalogStructure beforeStructure = analyzeCatalogStructure(beforeDoc);
//
//        // Remove only one template
//        String result = catalogService.removeTemplateFromCatalog(catalog, "SJ-023/123");
//
//        Document afterDoc = parseXml(result);
//        CatalogStructure afterStructure = analyzeCatalogStructure(afterDoc);
//
//        assertTrue("Template count should decrease (template contains nested items)",
//            afterStructure.templateCount < beforeStructure.templateCount);
//
//        assertNull("First template should be removed", findTemplateByCustomKey(afterDoc, "SJ-023/123"));
//        assertNotNull("Second template should remain", findTemplateByCustomKey(afterDoc, "SJ-023/456"));
//    }
//
//    private Element findTemplateByCustomKey(Document doc, String customKey) {
//        NodeList items = doc.getElementsByTagName("item");
//        for (int i = 0; i < items.getLength(); i++) {
//            Element item = (Element) items.item(i);
//            if ("TEMPLATE".equals(item.getAttribute("type")) &&
//                customKey.equals(item.getAttribute("custom-key"))) {
//                return item;
//            }
//        }
//        return null;
//    }
//
//    private static class CatalogStructure {
//        int categoryCount = 0;
//        int templateCount = 0;
//        int documentCount = 0;
//        List<Element> categories = new ArrayList<>();
//        List<Element> templates = new ArrayList<>();
//        List<String> categoryKeys = new ArrayList<>();
//        List<String> templateKeys = new ArrayList<>();
//    }
}