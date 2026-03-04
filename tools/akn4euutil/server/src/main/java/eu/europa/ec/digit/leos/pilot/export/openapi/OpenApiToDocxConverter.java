package eu.europa.ec.digit.leos.pilot.export.openapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.apache.poi.xwpf.usermodel.*;

public class OpenApiToDocxConverter {

    static class EndpointInfo {
        String method;
        String path;
        JsonNode operation;
        
        EndpointInfo(String method, String path, JsonNode operation) {
            this.method = method;
            this.path = path;
            this.operation = operation;
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("OPEN API DOC Generating in AKN4EU service");
        if (args.length < 2) {
            System.err.println("Usage: OpenApiToDocxConverter <input-json> <output-docx>");
            System.exit(1);
        }

        String inputJson = args[0];

        File jsonFile = new File(inputJson);
        if (!jsonFile.exists()) {
            System.err.println("Input JSON file not found: " + inputJson);
            System.exit(1);
        }
        // Compare with baseline
       // String baselineApiPath = "src/main/resources/openapi/openapi.json";
        String baselineApiPath = args[1] != null ? args[1] : "src/main/resources/openapi/openapi.json";
      //  String baselineDocxPath = "../../docs/REST/API/leos_service_api-documentation.docx";
        String baselineDocxPath = args[2] != null ? args[2] : "../../docs/REST/API/leos_akn4eu_api-documentation.docx";
        File baselineFile = new File(baselineApiPath);
        File baselineDocx = new File(baselineDocxPath);
        
        ObjectMapper mapper = new ObjectMapper();
        JsonNode newApi = mapper.readTree(jsonFile);

        if (!baselineFile.exists()) {
            System.out.println("No baseline API found. Creating baseline...");
            baselineFile.getParentFile().mkdirs();
            Files.copy(jsonFile.toPath(), baselineFile.toPath());
            System.out.println("Baseline created at: " + baselineApiPath);
            generateDocx(newApi, baselineDocxPath, mapper);
            return;
        }

        JsonNode baselineApi = mapper.readTree(baselineFile);
        Set<String> baselineEndpoints = extractEndpoints(baselineApi);
        Set<String> newEndpoints = extractEndpoints(newApi);

        Set<String> added = new HashSet<>(newEndpoints);
        added.removeAll(baselineEndpoints);
        Set<String> removed = new HashSet<>(baselineEndpoints);
        removed.removeAll(newEndpoints);

        if (added.isEmpty() && removed.isEmpty()) {
            System.out.println("No API changes detected.");
            if (!baselineDocx.exists()) {
                System.out.println("Documentation missing. Generating...");
                generateDocx(newApi, baselineDocxPath, mapper);
            } else {
                System.out.println("Skipping documentation generation.");
            }
            return;
        }

        if (!added.isEmpty()) {
            System.out.println("\n=== NEW APIs Added ===");
            added.forEach(System.out::println);
        }
        if (!removed.isEmpty()) {
            System.out.println("\n=== APIs Removed ===");
            removed.forEach(System.out::println);
        }

        System.out.println("\nUpdating baseline...");
        Files.copy(jsonFile.toPath(), baselineFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        System.out.println("Baseline updated: " + baselineApiPath);

        // Generate DOCX
        generateDocx(newApi, baselineDocxPath, mapper);
    }

    private static Set<String> extractEndpoints(JsonNode api) {
        Set<String> endpoints = new HashSet<>();
        JsonNode paths = api.path("paths");
        paths.fields().forEachRemaining(pathEntry -> {
            String path = pathEntry.getKey();
            JsonNode methods = pathEntry.getValue();
            methods.fields().forEachRemaining(methodEntry -> {
                String method = methodEntry.getKey().toUpperCase();
                endpoints.add(method + " " + path);
            });
        });
        return endpoints;
    }

    private static void generateDocx(JsonNode root, String outputDocx, ObjectMapper mapper) throws Exception {

        XWPFDocument doc = new XWPFDocument();

        addTitle(doc, root.path("info").path("title").asText("API Documentation"));
        addParagraph(doc, root.path("info").path("description").asText(""));
        addParagraph(doc, "Version: " + root.path("info").path("version").asText(""));
        doc.createParagraph();

        // Group endpoints by controller (tags)
        Map<String, List<EndpointInfo>> controllerMap = new LinkedHashMap<>();
        
        JsonNode paths = root.path("paths");
        Iterator<Map.Entry<String, JsonNode>> pathIterator = paths.fields();

        while (pathIterator.hasNext()) {
            Map.Entry<String, JsonNode> pathEntry = pathIterator.next();
            String path = pathEntry.getKey();
            JsonNode methods = pathEntry.getValue();

            Iterator<Map.Entry<String, JsonNode>> methodIterator = methods.fields();
            while (methodIterator.hasNext()) {
                Map.Entry<String, JsonNode> methodEntry = methodIterator.next();
                String method = methodEntry.getKey().toUpperCase();
                JsonNode operation = methodEntry.getValue();
                
                JsonNode tags = operation.path("tags");
                String controller = tags.isArray() && tags.size() > 0 ? tags.get(0).asText() : "Uncategorized";
                
                controllerMap.putIfAbsent(controller, new ArrayList<>());
                controllerMap.get(controller).add(new EndpointInfo(method, path, operation));
            }
        }

        // Generate documentation grouped by controller
        int controllerNumber = 1;
        for (Map.Entry<String, List<EndpointInfo>> entry : controllerMap.entrySet()) {
            String controller = entry.getKey();
            List<EndpointInfo> endpoints = entry.getValue();
            
            addControllerHeading(doc, controllerNumber++, controller);
            
            int endpointNumber = 1;
            for (EndpointInfo endpoint : endpoints) {
                addEndpoint(doc, controllerNumber - 1, endpointNumber++, endpoint.method, endpoint.path, endpoint.operation, controller);
            }
        }

        new File(outputDocx).getParentFile().mkdirs();
        try (FileOutputStream out = new FileOutputStream(outputDocx)) {
            doc.write(out);
        }
        doc.close();

        System.out.println("DOCX generated: " + outputDocx);
    }

    private static void addTitle(XWPFDocument doc, String text) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingAfter(300);
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setBold(true);
        r.setFontSize(28);
        r.setColor("1F4E78");
        r.addBreak();
    }

    private static void addParagraph(XWPFDocument doc, String text) {
        if (text != null && !text.isEmpty()) {
            XWPFParagraph p = doc.createParagraph();
            p.setSpacingAfter(100);
            XWPFRun r = p.createRun();
            r.setText(text);
            r.setFontSize(11);
        }
    }

    private static void addControllerHeading(XWPFDocument doc, int number, String controller) {
        XWPFParagraph p = doc.createParagraph();
        p.setSpacingBefore(500);
        p.setSpacingAfter(200);
        XWPFRun r = p.createRun();
        r.setText(number + ". " + controller);
        r.setBold(true);
        r.setFontSize(18);
        r.setColor("1F4E78");
    }

    private static void addEndpoint(XWPFDocument doc, int controllerNum, int endpointNum, String method, String path, JsonNode operation, String controller) {
        XWPFParagraph methodPara = doc.createParagraph();
        methodPara.setSpacingBefore(300);
        methodPara.setSpacingAfter(150);
        methodPara.setIndentationLeft(400);
        
        XWPFRun numberRun = methodPara.createRun();
        numberRun.setText(controllerNum + "." + endpointNum + " ");
        numberRun.setBold(true);
        numberRun.setFontSize(13);
        numberRun.setColor("44546A");
        
        XWPFRun methodRun = methodPara.createRun();
        methodRun.setText(method);
        methodRun.setBold(true);
        methodRun.setFontSize(13);
        methodRun.setColor(getMethodColor(method));
        
        XWPFRun pathRun = methodPara.createRun();
        pathRun.setText("  " + path);
        pathRun.setBold(true);
        pathRun.setFontSize(13);
        pathRun.setColor("2E75B5");

        XWPFParagraph controllerPara = doc.createParagraph();
        controllerPara.setIndentationLeft(400);
        controllerPara.setSpacingAfter(50);
        XWPFRun controllerLabel = controllerPara.createRun();
        controllerLabel.setText("Controller: ");
        controllerLabel.setBold(true);
        controllerLabel.setFontSize(10);
        controllerLabel.setColor("7F7F7F");
        XWPFRun controllerName = controllerPara.createRun();
        controllerName.setText(controller);
        controllerName.setFontSize(10);
        controllerName.setColor("0070C0");

        XWPFParagraph methodInfoPara = doc.createParagraph();
        methodInfoPara.setIndentationLeft(400);
        methodInfoPara.setSpacingAfter(50);
        XWPFRun methodLabel = methodInfoPara.createRun();
        methodLabel.setText("Method: ");
        methodLabel.setBold(true);
        methodLabel.setFontSize(10);
        methodLabel.setColor("44546A");
        XWPFRun methodValue = methodInfoPara.createRun();
        String operationId = operation.path("operationId").asText("");
        methodValue.setText(operationId.isEmpty() ? method : operationId);
        methodValue.setBold(true);
        methodValue.setFontSize(10);
        methodValue.setColor(getMethodColor(method));

        String summary = operation.path("summary").asText("");
        if (!summary.isEmpty()) {
            XWPFParagraph p = doc.createParagraph();
            p.setIndentationLeft(400);
            p.setSpacingAfter(100);
            XWPFRun r = p.createRun();
            r.setText(summary);
            r.setFontSize(11);
        }

        String description = operation.path("description").asText("");
        if (!description.isEmpty()) {
            XWPFParagraph p = doc.createParagraph();
            p.setIndentationLeft(400);
            p.setSpacingAfter(100);
            XWPFRun r = p.createRun();
            r.setText(description);
            r.setFontSize(11);
            r.setColor("595959");
        }

        JsonNode parameters = operation.path("parameters");
        if (parameters.isArray() && parameters.size() > 0) {
            XWPFParagraph heading = doc.createParagraph();
            heading.setIndentationLeft(400);
            heading.setSpacingBefore(100);
            heading.setSpacingAfter(100);
            XWPFRun headingRun = heading.createRun();
            headingRun.setText("Parameters");
            headingRun.setBold(true);
            headingRun.setFontSize(12);
            headingRun.setColor("44546A");
            
            XWPFTable table = doc.createTable(parameters.size() + 1, 5);
            table.setWidth("100%");
            
            org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTbl ctTbl = table.getCTTbl();
            org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblPr tblPr = ctTbl.getTblPr();
            if (tblPr == null) {
                tblPr = ctTbl.addNewTblPr();
            }
            org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblWidth tblInd = tblPr.isSetTblInd() ? tblPr.getTblInd() : tblPr.addNewTblInd();
            tblInd.setW(java.math.BigInteger.valueOf(400));
            tblInd.setType(org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth.DXA);
            
            setTableHeader(table, new String[]{"Name", "In", "Required", "Type", "Description"});

            int row = 1;
            for (JsonNode param : parameters) {
                XWPFTableRow tableRow = table.getRow(row);
                if (row % 2 == 0) {
                    for (XWPFTableCell cell : tableRow.getTableCells()) {
                        cell.setColor("F2F2F2");
                    }
                }
                tableRow.getCell(0).setText(param.path("name").asText(""));
                tableRow.getCell(1).setText(param.path("in").asText(""));
                tableRow.getCell(2).setText(param.path("required").asBoolean(false) ? "Yes" : "No");
                String type = param.path("schema").path("type").asText("");
                String format = param.path("schema").path("format").asText("");
                tableRow.getCell(3).setText(format.isEmpty() ? type : type + " (" + format + ")");
                tableRow.getCell(4).setText(param.path("description").asText(""));
                row++;
            }
        }

        JsonNode requestBody = operation.path("requestBody");
        if (!requestBody.isMissingNode()) {
            XWPFParagraph heading = doc.createParagraph();
            heading.setIndentationLeft(400);
            heading.setSpacingBefore(100);
            heading.setSpacingAfter(100);
            XWPFRun headingRun = heading.createRun();
            headingRun.setText("Request Body");
            headingRun.setBold(true);
            headingRun.setFontSize(12);
            headingRun.setColor("44546A");
            
            XWPFParagraph p = doc.createParagraph();
            p.setIndentationLeft(400);
            p.setSpacingAfter(100);
            XWPFRun r = p.createRun();
            r.setText("Required: ");
            r.setBold(true);
            r.setFontSize(11);
            XWPFRun r2 = p.createRun();
            r2.setText(requestBody.path("required").asBoolean(false) ? "Yes" : "No");
            r2.setFontSize(11);
            r2.setColor(requestBody.path("required").asBoolean(false) ? "C00000" : "70AD47");
            
            JsonNode content = requestBody.path("content");
            Iterator<String> contentTypes = content.fieldNames();
            while (contentTypes.hasNext()) {
                String contentType = contentTypes.next();
                XWPFParagraph p2 = doc.createParagraph();
                p2.setIndentationLeft(400);
                p2.setSpacingAfter(50);
                XWPFRun r3 = p2.createRun();
                r3.setText("Content-Type: ");
                r3.setBold(true);
                r3.setFontSize(10);
                XWPFRun r4 = p2.createRun();
                r4.setText(contentType);
                r4.setFontSize(10);
                r4.setFontFamily("Courier New");
                
                JsonNode schema = content.path(contentType).path("schema");
                XWPFParagraph p3 = doc.createParagraph();
                p3.setIndentationLeft(400);
                p3.setSpacingAfter(100);
                XWPFRun r5 = p3.createRun();
                r5.setText("Schema: ");
                r5.setBold(true);
                r5.setFontSize(10);
                XWPFRun r6 = p3.createRun();
                r6.setText(getSchemaInfo(schema));
                r6.setFontSize(10);
                r6.setFontFamily("Courier New");
                r6.setColor("0070C0");
            }
        }

        JsonNode responses = operation.path("responses");
        if (!responses.isMissingNode()) {
            XWPFParagraph heading = doc.createParagraph();
            heading.setIndentationLeft(400);
            heading.setSpacingBefore(100);
            heading.setSpacingAfter(100);
            XWPFRun headingRun = heading.createRun();
            headingRun.setText("Responses");
            headingRun.setBold(true);
            headingRun.setFontSize(12);
            headingRun.setColor("44546A");
            
            XWPFTable table = doc.createTable();
            table.setWidth("100%");
            
            org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTbl ctTbl = table.getCTTbl();
            org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblPr tblPr = ctTbl.getTblPr();
            if (tblPr == null) {
                tblPr = ctTbl.addNewTblPr();
            }
            org.openxmlformats.schemas.wordprocessingml.x2006.main.CTTblWidth tblInd = tblPr.isSetTblInd() ? tblPr.getTblInd() : tblPr.addNewTblInd();
            tblInd.setW(java.math.BigInteger.valueOf(400));
            tblInd.setType(org.openxmlformats.schemas.wordprocessingml.x2006.main.STTblWidth.DXA);
            
            XWPFTableRow headerRow = table.getRow(0);
            headerRow.getCell(0).setText("Code");
            headerRow.addNewTableCell().setText("Description");
            headerRow.addNewTableCell().setText("Content-Type");
            headerRow.addNewTableCell().setText("Schema");
            setTableHeaderStyle(headerRow);

            int rowNum = 0;
            Iterator<Map.Entry<String, JsonNode>> responseIterator = responses.fields();
            while (responseIterator.hasNext()) {
                Map.Entry<String, JsonNode> response = responseIterator.next();
                String code = response.getKey();
                JsonNode responseNode = response.getValue();
                String desc = responseNode.path("description").asText("");
                
                JsonNode content = responseNode.path("content");
                if (content.isMissingNode()) {
                    XWPFTableRow row = table.createRow();
                    if (rowNum % 2 == 1) {
                        for (XWPFTableCell cell : row.getTableCells()) {
                            cell.setColor("F2F2F2");
                        }
                    }
                    row.getCell(0).setText(code);
                    row.getCell(1).setText(desc);
                    row.getCell(2).setText("-");
                    row.getCell(3).setText("-");
                    rowNum++;
                } else {
                    Iterator<String> contentTypes = content.fieldNames();
                    while (contentTypes.hasNext()) {
                        String contentType = contentTypes.next();
                        JsonNode schema = content.path(contentType).path("schema");
                        XWPFTableRow row = table.createRow();
                        if (rowNum % 2 == 1) {
                            for (XWPFTableCell cell : row.getTableCells()) {
                                cell.setColor("F2F2F2");
                            }
                        }
                        row.getCell(0).setText(code);
                        row.getCell(1).setText(desc);
                        row.getCell(2).setText(contentType);
                        row.getCell(3).setText(getSchemaInfo(schema));
                        rowNum++;
                    }
                }
            }
        }

        doc.createParagraph();
    }

    private static void setTableHeader(XWPFTable table, String[] headers) {
        XWPFTableRow headerRow = table.getRow(0);
        for (int i = 0; i < headers.length; i++) {
            XWPFTableCell cell = headerRow.getCell(i);
            cell.setText(headers[i]);
            cell.setColor("2E75B5");
            if (!cell.getParagraphs().isEmpty() && !cell.getParagraphs().get(0).getRuns().isEmpty()) {
                XWPFRun run = cell.getParagraphs().get(0).getRuns().get(0);
                run.setBold(true);
                run.setColor("FFFFFF");
                run.setFontSize(11);
            }
        }
    }

    private static void setTableHeaderStyle(XWPFTableRow row) {
        for (XWPFTableCell cell : row.getTableCells()) {
            cell.setColor("2E75B5");
            if (!cell.getParagraphs().isEmpty() && !cell.getParagraphs().get(0).getRuns().isEmpty()) {
                XWPFRun run = cell.getParagraphs().get(0).getRuns().get(0);
                run.setBold(true);
                run.setColor("FFFFFF");
                run.setFontSize(11);
            }
        }
    }

    private static String getMethodColor(String method) {
        switch (method) {
            case "GET": return "70AD47";
            case "POST": return "4472C4";
            case "PUT": return "FFC000";
            case "DELETE": return "C00000";
            case "PATCH": return "7030A0";
            default: return "7F7F7F";
        }
    }

    private static String getSchemaInfo(JsonNode schema) {
        if (schema.has("$ref")) {
            String ref = schema.path("$ref").asText("");
            return ref.substring(ref.lastIndexOf("/") + 1);
        }
        if (schema.has("type")) {
            String type = schema.path("type").asText("");
            if ("array".equals(type)) {
                JsonNode items = schema.path("items");
                return "array[" + getSchemaInfo(items) + "]";
            }
            String format = schema.path("format").asText("");
            return format.isEmpty() ? type : type + " (" + format + ")";
        }
        return "object";
    }
}
