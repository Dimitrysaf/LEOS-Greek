package eu.europa.ec.leos.services.api.openapi;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import java.util.function.Function;
import java.awt.Color;
import java.io.IOException;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.*;

public class OpenApiToPdfConverter {

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
    static class RequestBodyInfo {
        String required;
        String contentType;
        String schema;

        RequestBodyInfo(String required, String contentType, String schema) {
            this.required = required;
            this.contentType = contentType;
            this.schema = schema;
        }
    }

    static class ResponseInfo {
        String statusCode;
        String description;
        String contentType;
        String schema;

        ResponseInfo(String statusCode, String description, String contentType, String schema) {
            this.statusCode = statusCode;
            this.description = description;
            this.contentType = contentType;
            this.schema = schema;
        }
    }

    private static final float MARGIN = 50;
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static float yPosition;
    private static PDDocument document;
    private static PDPage currentPage;
    private static PDPageContentStream contentStream;

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: OpenApiToPdfConverter <input-json> <output-pdf>");
            System.exit(1);
        }

        File jsonFile = new File(args[0]);
        if (!jsonFile.exists()) {
            System.err.println("Input JSON file not found: " + args[0]);
            System.exit(1);
        }

        // Compare with baseline
        String baselineApiPath = args[1] != null ? args[1] : "src/main/resources/openapi/openapi.json";
        String baselineDocxPath = args[2] != null ? args[2] : "../../docs/REST/API/leos_service_api-documentation.pdf";
        File baselineFile = new File(baselineApiPath);
        File baselineDocx = new File(baselineDocxPath);


        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(jsonFile);

        if (!baselineFile.exists()) {
            System.out.println("No baseline API found. Creating baseline...");
            baselineFile.getParentFile().mkdirs();
            Files.copy(jsonFile.toPath(), baselineFile.toPath());
            System.out.println("Baseline created at: " + baselineApiPath);
            generatePdf(root, baselineDocxPath);
            return;
        }

        JsonNode baselineApi = mapper.readTree(baselineFile);
        Set<String> baselineEndpoints = extractEndpoints(baselineApi);
        Set<String> newEndpoints = extractEndpoints(root);

        Set<String> added = new HashSet<>(newEndpoints);
        added.removeAll(baselineEndpoints);
        Set<String> removed = new HashSet<>(baselineEndpoints);
        removed.removeAll(newEndpoints);

        if (added.isEmpty() && removed.isEmpty()) {
            System.out.println("No API changes detected.");
            if (!baselineDocx.exists()) {
                System.out.println("Documentation missing. Generating...");
                generatePdf(root, baselineDocxPath);
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

        generatePdf(root, baselineDocxPath);
        System.out.println("PDF generated: " +baselineDocxPath);
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

    private static void generatePdf(JsonNode root, String outputPdf) throws Exception {
        document = new PDDocument();
        addNewPage();

        // Title
        writeText(root.path("info").path("title").asText("API Documentation"), 28, true, new Color(31, 78, 120));
        yPosition -= 20;

        // Description
        String desc = root.path("info").path("description").asText("");
        if (!desc.isEmpty()) {
            writeText(desc, 11, false, Color.BLACK);
            yPosition -= 10;
        }

        // Version
        writeText("Version: " + root.path("info").path("version").asText(""), 11, false, Color.BLACK);
        yPosition -= 20;

        Map<String, java.util.List<EndpointInfo>> controllerMap = new LinkedHashMap<>();
        JsonNode paths = root.path("paths");
        paths.fields().forEachRemaining(pathEntry -> {
            String path = pathEntry.getKey();
            pathEntry.getValue().fields().forEachRemaining(methodEntry -> {
                String method = methodEntry.getKey().toUpperCase();
                JsonNode operation = methodEntry.getValue();
                JsonNode tags = operation.path("tags");
                String controller = tags.isArray() && tags.size() > 0 ? tags.get(0).asText() : "Uncategorized";
                controllerMap.putIfAbsent(controller, new ArrayList<>());
                controllerMap.get(controller).add(new EndpointInfo(method, path, operation));
            });
        });

        int controllerNumber = 1;
        for (Map.Entry<String, java.util.List<EndpointInfo>> entry : controllerMap.entrySet()) {
            checkNewPage(100);

            // Add extra space before controller (except first one)
            if (controllerNumber > 1) {
                yPosition -= 30;
            }

            writeText(controllerNumber++ + ". " + entry.getKey(), 18, true, new Color(31, 78, 120));
            yPosition -= 10;

            int endpointNumber = 1;
            for (EndpointInfo endpoint : entry.getValue()) {
                checkNewPage(150);
                yPosition -= 15;

                // Endpoint number, method and path
                String endpointNum = (controllerNumber - 1) + "." + endpointNumber++ + " ";
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                contentStream.setNonStrokingColor(new Color(33, 37, 41));
                contentStream.newLineAtOffset(MARGIN + 20, yPosition);
                contentStream.showText(endpointNum);
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                contentStream.setNonStrokingColor(getMethodColor(endpoint.method));
                contentStream.newLineAtOffset(MARGIN + 20 + (endpointNum.length() * 8.5f), yPosition);
                contentStream.showText(endpoint.method + " ");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                contentStream.setNonStrokingColor(new Color(33, 37, 41));
                contentStream.newLineAtOffset(MARGIN + 20 + (endpointNum.length() * 8.5f) + (endpoint.method.length() * 8.5f) + 5, yPosition);
                contentStream.showText(endpoint.path);
                contentStream.endText();
                yPosition -= 25;

                // Summary
                String summary = endpoint.operation.path("summary").asText("");
                if (!summary.isEmpty()) {
                    drawLabelValue("Overview", summary, MARGIN + 40, Color.BLACK);
                }

                // Description
                String description = endpoint.operation.path("description").asText("");
                if (!description.isEmpty()) {
                    drawLabelValue("Description", description, MARGIN + 40, Color.BLACK);
                }

                // Controller
                String controllerValue = entry.getKey();
                drawLabelValue("Controller", controllerValue, MARGIN + 40, new Color(0, 102, 204));

                // Method - use same color as HTTP method
                String operationId = endpoint.operation.path("operationId").asText("");
                drawLabelValue("Method", (operationId.isEmpty() ? endpoint.method : operationId), MARGIN + 40, getMethodColor(endpoint.method));

                // Parameters
                JsonNode parameters = endpoint.operation.path("parameters");
                if (parameters.isArray() && parameters.size() > 0) {
                    yPosition -= 10;
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                    contentStream.setNonStrokingColor(Color.BLACK);
                    contentStream.newLineAtOffset(MARGIN + 40, yPosition);
                    contentStream.showText("Parameters");
                    contentStream.endText();
                    yPosition -= 10;
                    drawTable(new String[]{"Name", "In", "Required", "Type", "Description"},
                            parameters, 40, (param) -> new String[]{
                                    param.path("name").asText(""),
                                    param.path("in").asText(""),
                                    param.path("required").asBoolean(false) ? "Yes" : "No",
                                    getParamType(param),
                                    param.path("description").asText("")
                            });
                }

                // Request Body
                JsonNode requestBody = endpoint.operation.path("requestBody");
                if (!requestBody.isMissingNode()) {
                    yPosition -= 10;
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                    contentStream.setNonStrokingColor(Color.BLACK);
                    contentStream.newLineAtOffset(MARGIN + 40, yPosition);
                    contentStream.showText("Request Body");
                    contentStream.endText();
                    yPosition -= 10;

                    java.util.List<RequestBodyInfo> requestBodyList = new ArrayList<>();
                    boolean required = requestBody.path("required").asBoolean(false);
                    JsonNode content = requestBody.path("content");
                    if (!content.isMissingNode()) {
                        content.fields().forEachRemaining(contentEntry -> {
                            String contentType = contentEntry.getKey();
                            JsonNode schema = contentEntry.getValue().path("schema");
                            String schemaInfo = getSchemaInfo(schema);
                            requestBodyList.add(new RequestBodyInfo(required ? "Yes" : "No", contentType, schemaInfo));
                        });
                    }
                    drawRequestBodyTable(requestBodyList, 40);
                }

                // Responses
                JsonNode responses = endpoint.operation.path("responses");
                if (!responses.isMissingNode()) {
                    yPosition -= 10;
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                    contentStream.setNonStrokingColor(Color.BLACK);
                    contentStream.newLineAtOffset(MARGIN + 40, yPosition);
                    contentStream.showText("Responses");
                    contentStream.endText();
                    yPosition -= 10;
                    java.util.List<ResponseInfo> responseList = new ArrayList<>();
                    responses.fields().forEachRemaining(response -> {
                        String statusCode = response.getKey();
                        JsonNode responseNode = response.getValue();
                        String responseDesc = responseNode.path("description").asText("");
                        String contentType = "";
                        String schema = "";
                        JsonNode content = responseNode.path("content");
                        if (!content.isMissingNode() && content.fields().hasNext()) {
                            Map.Entry<String, JsonNode> firstContent = content.fields().next();
                            contentType = firstContent.getKey();
                            schema = getSchemaInfo(firstContent.getValue().path("schema"));
                        }
                        responseList.add(new ResponseInfo(statusCode, responseDesc, contentType, schema));
                    });
                    drawResponseTableWithSchema(responseList, 40);
                    yPosition -= 20; // Extra space after responses table before next endpoint
                }
            }
        }

        if (contentStream != null) {
            contentStream.close();
        }
        document.save(outputPdf);
        document.close();
    }

    private static void addNewPage() throws IOException {
        if (contentStream != null) {
            contentStream.close();
        }
        currentPage = new PDPage(PDRectangle.A4);
        document.addPage(currentPage);
        contentStream = new PDPageContentStream(document, currentPage);
        yPosition = PAGE_HEIGHT - MARGIN;
    }

    private static void checkNewPage(float requiredSpace) throws IOException {
        if (yPosition - requiredSpace < MARGIN) {
            addNewPage();
        }
    }

    private static void writeText(String text, float fontSize, boolean bold, Color color) throws IOException {
        contentStream.beginText();
        contentStream.setFont(bold ? new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD) :
                new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
        contentStream.setNonStrokingColor(color);
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(text);
        contentStream.endText();
        yPosition -= fontSize + 5;
    }

    private static void writeIndentedText(String text, float fontSize, float indent) throws IOException {
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
        contentStream.setNonStrokingColor(Color.BLACK);
        contentStream.newLineAtOffset(MARGIN + indent, yPosition);
        contentStream.showText(text);
        contentStream.endText();
        yPosition -= fontSize + 3;
    }

    private static void drawLabelValue(String label, String value, float x, Color valueColor) throws IOException {
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 11);
        contentStream.setNonStrokingColor(Color.BLACK);
        contentStream.newLineAtOffset(x, yPosition);
        contentStream.showText(label + ": ");
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 11);
        contentStream.setNonStrokingColor(valueColor);
        contentStream.newLineAtOffset(x + (label.length() * 6.5f) + 10, yPosition);
        String displayValue = value.length() > 80 ? value.substring(0, 77) + "..." : value;
        contentStream.showText(displayValue);
        contentStream.endText();
        yPosition -= 18;
    }

    private static void drawSimpleRequestBody(String contentType, boolean required, String schema, float x) throws IOException {
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
        contentStream.setNonStrokingColor(Color.BLACK);
        contentStream.newLineAtOffset(x, yPosition);
        contentStream.showText("- " + contentType + " (" + (required ? "required" : "optional") + "): " + schema);
        contentStream.endText();
        yPosition -= 18;
    }

    private static String getParamType(JsonNode param) {
        String type = param.path("schema").path("type").asText("");
        String format = param.path("schema").path("format").asText("");
        return format.isEmpty() ? type : type + " (" + format + ")";
    }

    private static Color getMethodColor(String method) {
        switch (method) {
            case "GET": return new Color(112, 173, 71);
            case "POST": return new Color(68, 114, 196);
            case "PUT": return new Color(255, 192, 0);
            case "DELETE": return new Color(192, 0, 0);
            case "PATCH": return new Color(112, 48, 160);
            default: return new Color(127, 127, 127);
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

    private static void drawTable(String[] headers, Iterable<JsonNode> rows, float indent, Function<JsonNode, String[]> rowExtractor) throws IOException {
        float tableWidth = PAGE_WIDTH - MARGIN - indent - MARGIN;
        float[] colWidths = {tableWidth * 0.20f, tableWidth * 0.10f, tableWidth * 0.13f, tableWidth * 0.18f, tableWidth * 0.45f};
        float baseRowHeight = 22;
        float cellMargin = 8;
        float fontSize = 9;
        PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

        checkNewPage(baseRowHeight * 2);

        // Draw header with dark blue background
        contentStream.setNonStrokingColor(new Color(32, 56, 100));
        contentStream.addRect(MARGIN + indent, yPosition - baseRowHeight, tableWidth, baseRowHeight);
        contentStream.fill();

        // Draw header border
        contentStream.setStrokingColor(new Color(23, 43, 77));
        contentStream.setLineWidth(1.5f);
        contentStream.addRect(MARGIN + indent, yPosition - baseRowHeight, tableWidth, baseRowHeight);
        contentStream.stroke();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), fontSize + 1);
        contentStream.setNonStrokingColor(Color.WHITE);
        float xOffset = 0;
        for (int i = 0; i < headers.length; i++) {
            contentStream.newLineAtOffset(MARGIN + indent + xOffset + cellMargin, yPosition - baseRowHeight + 8);
            contentStream.showText(headers[i]);
            contentStream.newLineAtOffset(-(MARGIN + indent + xOffset + cellMargin), -(yPosition - baseRowHeight + 8));
            xOffset += colWidths[i];
        }
        contentStream.endText();
        yPosition -= baseRowHeight;

        // Draw rows with text wrapping
        boolean alternate = false;
        for (JsonNode row : rows) {
            String[] cells = rowExtractor.apply(row);

            // Calculate required height for this row based on longest wrapped text
            float maxLines = 1;
            for (int i = 0; i < cells.length && i < headers.length; i++) {
                float availableWidth = colWidths[i] - (cellMargin * 2);
                int lineCount = calculateLineCount(cells[i], availableWidth, fontSize, font);
                maxLines = Math.max(maxLines, lineCount);
            }
            float rowHeight = Math.max(baseRowHeight, maxLines * (fontSize + 3) + (cellMargin * 2));

            checkNewPage(rowHeight);

            // Row background
            if (alternate) {
                contentStream.setNonStrokingColor(new Color(248, 249, 250));
            } else {
                contentStream.setNonStrokingColor(Color.WHITE);
            }
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.fill();

            // Row border
            contentStream.setStrokingColor(new Color(222, 226, 230));
            contentStream.setLineWidth(0.5f);
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.stroke();

            // Draw cells with wrapping
            xOffset = 0;
            for (int i = 0; i < cells.length && i < headers.length; i++) {
                float cellX = MARGIN + indent + xOffset + cellMargin;
                float cellY = yPosition - cellMargin - 2;
                float availableWidth = colWidths[i] - (cellMargin * 2);

                drawWrappedText(cells[i], cellX, cellY, availableWidth, fontSize, font, new Color(33, 37, 41));
                xOffset += colWidths[i];
            }

            yPosition -= rowHeight;
            alternate = !alternate;
        }

        yPosition -= 10;
    }

    private static void drawResponseTable(java.util.List<Map.Entry<String, JsonNode>> responses, float indent) throws IOException {
        float tableWidth = PAGE_WIDTH - MARGIN - indent - MARGIN;
        float[] colWidths = {tableWidth * 0.25f, tableWidth * 0.75f};
        float rowHeight = 22;
        float cellMargin = 8;
        float fontSize = 9;
        String[] headers = {"Status Code", "Description"};

        checkNewPage(rowHeight * 2);

        // Draw header
        contentStream.setNonStrokingColor(new Color(32, 56, 100));
        contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
        contentStream.fill();

        // Draw header border
        contentStream.setStrokingColor(new Color(23, 43, 77));
        contentStream.setLineWidth(1.5f);
        contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
        contentStream.stroke();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), fontSize + 1);
        contentStream.setNonStrokingColor(Color.WHITE);
        float xOffset = 0;
        for (int i = 0; i < headers.length; i++) {
            contentStream.newLineAtOffset(MARGIN + indent + xOffset + cellMargin, yPosition - rowHeight + 8);
            contentStream.showText(headers[i]);
            contentStream.newLineAtOffset(-(MARGIN + indent + xOffset + cellMargin), -(yPosition - rowHeight + 8));
            xOffset += colWidths[i];
        }
        contentStream.endText();
        yPosition -= rowHeight;

        // Draw rows
        boolean alternate = false;
        for (Map.Entry<String, JsonNode> response : responses) {
            checkNewPage(rowHeight);

            // Row background
            if (alternate) {
                contentStream.setNonStrokingColor(new Color(248, 249, 250));
            } else {
                contentStream.setNonStrokingColor(Color.WHITE);
            }
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.fill();

            // Row border
            contentStream.setStrokingColor(new Color(222, 226, 230));
            contentStream.setLineWidth(0.5f);
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.stroke();

            // Status code - plain text without badge
            String statusCode = response.getKey();
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
            contentStream.setNonStrokingColor(new Color(33, 37, 41));
            contentStream.newLineAtOffset(MARGIN + indent + cellMargin, yPosition - rowHeight + 8);
            contentStream.showText(statusCode);
            contentStream.endText();

            // Description
            String description = response.getValue().path("description").asText("");
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
            contentStream.setNonStrokingColor(new Color(33, 37, 41));
            contentStream.newLineAtOffset(MARGIN + indent + colWidths[0] + cellMargin, yPosition - rowHeight + 8);
            String displayDesc = description.length() > 70 ? description.substring(0, 67) + "..." : description;
            contentStream.showText(displayDesc);
            contentStream.endText();

            yPosition -= rowHeight;
            alternate = !alternate;
        }

        yPosition -= 10;
    }

    private static void drawRequestBodyTable(java.util.List<RequestBodyInfo> requestBodies, float indent) throws IOException {
        float tableWidth = PAGE_WIDTH - MARGIN - indent - MARGIN;
        float[] colWidths = {tableWidth * 0.2f, tableWidth * 0.4f, tableWidth * 0.4f};
        float baseRowHeight = 22;
        float cellMargin = 8;
        float fontSize = 9;
        String[] headers = {"Required", "Content-Type", "Schema"};
        PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

        checkNewPage(baseRowHeight * 2);

        // Draw header
        contentStream.setNonStrokingColor(new Color(32, 56, 100));
        contentStream.addRect(MARGIN + indent, yPosition - baseRowHeight, tableWidth, baseRowHeight);
        contentStream.fill();

        // Draw header border
        contentStream.setStrokingColor(new Color(23, 43, 77));
        contentStream.setLineWidth(1.5f);
        contentStream.addRect(MARGIN + indent, yPosition - baseRowHeight, tableWidth, baseRowHeight);
        contentStream.stroke();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), fontSize + 1);
        contentStream.setNonStrokingColor(Color.WHITE);
        float xOffset = 0;
        for (int i = 0; i < headers.length; i++) {
            contentStream.newLineAtOffset(MARGIN + indent + xOffset + cellMargin, yPosition - baseRowHeight + 8);
            contentStream.showText(headers[i]);
            contentStream.newLineAtOffset(-(MARGIN + indent + xOffset + cellMargin), -(yPosition - baseRowHeight + 8));
            xOffset += colWidths[i];
        }
        contentStream.endText();
        yPosition -= baseRowHeight;

        // Draw rows with text wrapping
        boolean alternate = false;
        for (RequestBodyInfo requestBody : requestBodies) {
            String[] cells = {requestBody.required, requestBody.contentType, requestBody.schema};

            // Calculate required height for this row
            float maxLines = 1;
            for (int i = 0; i < cells.length; i++) {
                float availableWidth = colWidths[i] - (cellMargin * 2);
                int charsPerLine = (int)(availableWidth / (fontSize * 0.5f));
                int lines = (int)Math.ceil((double)cells[i].length() / charsPerLine);
                maxLines = Math.max(maxLines, lines);
            }
            float rowHeight = Math.max(baseRowHeight, maxLines * (fontSize + 4));

            checkNewPage(rowHeight);

            // Row background
            if (alternate) {
                contentStream.setNonStrokingColor(new Color(248, 249, 250));
            } else {
                contentStream.setNonStrokingColor(Color.WHITE);
            }
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.fill();

            // Row border
            contentStream.setStrokingColor(new Color(222, 226, 230));
            contentStream.setLineWidth(0.5f);
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.stroke();

            // Draw cells with wrapping
            xOffset = 0;
            for (int i = 0; i < cells.length; i++) {
                float cellX = MARGIN + indent + xOffset + cellMargin;
                float cellY = yPosition - cellMargin - 2;
                float availableWidth = colWidths[i] - (cellMargin * 2);

                drawWrappedText(cells[i], cellX, cellY, availableWidth, fontSize, font, new Color(33, 37, 41));
                xOffset += colWidths[i];
            }

            yPosition -= rowHeight;
            alternate = !alternate;
        }

        yPosition -= 10;
    }

    private static void drawResponseTableWithSchema(java.util.List<ResponseInfo> responses, float indent) throws IOException {
        float tableWidth = PAGE_WIDTH - MARGIN - indent - MARGIN;
        float[] colWidths = {tableWidth * 0.15f, tableWidth * 0.35f, tableWidth * 0.25f, tableWidth * 0.25f};
        float baseRowHeight = 20;
        float cellMargin = 6;
        float fontSize = 9;
        String[] headers = {"Status Code", "Description", "Content-Type", "Schema"};
        PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

        checkNewPage(baseRowHeight * 2);

        // Draw header
        contentStream.setNonStrokingColor(new Color(32, 56, 100));
        contentStream.addRect(MARGIN + indent, yPosition - baseRowHeight, tableWidth, baseRowHeight);
        contentStream.fill();

        // Draw header border
        contentStream.setStrokingColor(new Color(23, 43, 77));
        contentStream.setLineWidth(1.5f);
        contentStream.addRect(MARGIN + indent, yPosition - baseRowHeight, tableWidth, baseRowHeight);
        contentStream.stroke();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), fontSize + 1);
        contentStream.setNonStrokingColor(Color.WHITE);
        float xOffset = 0;
        for (int i = 0; i < headers.length; i++) {
            contentStream.newLineAtOffset(MARGIN + indent + xOffset + cellMargin, yPosition - baseRowHeight + 8);
            contentStream.showText(headers[i]);
            contentStream.newLineAtOffset(-(MARGIN + indent + xOffset + cellMargin), -(yPosition - baseRowHeight + 8));
            xOffset += colWidths[i];
        }
        contentStream.endText();
        yPosition -= baseRowHeight;

        // Draw rows with text wrapping
        boolean alternate = false;
        for (ResponseInfo response : responses) {
            String[] cells = {response.statusCode, response.description, response.contentType, response.schema};

            // Calculate required height for this row based on actual text wrapping
            float maxLines = 1;
            for (int i = 0; i < cells.length; i++) {
                float availableWidth = colWidths[i] - (cellMargin * 2);
                int lineCount = calculateLineCount(cells[i], availableWidth, fontSize, font);
                maxLines = Math.max(maxLines, lineCount);
            }
            float rowHeight = Math.max(baseRowHeight, maxLines * (fontSize + 3) + (cellMargin * 2));

            checkNewPage(rowHeight);

            // Row background
            if (alternate) {
                contentStream.setNonStrokingColor(new Color(248, 249, 250));
            } else {
                contentStream.setNonStrokingColor(Color.WHITE);
            }
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.fill();

            // Row border
            contentStream.setStrokingColor(new Color(222, 226, 230));
            contentStream.setLineWidth(0.5f);
            contentStream.addRect(MARGIN + indent, yPosition - rowHeight, tableWidth, rowHeight);
            contentStream.stroke();

            // Draw cells with wrapping
            xOffset = 0;
            for (int i = 0; i < cells.length; i++) {
                float cellX = MARGIN + indent + xOffset + cellMargin;
                float cellY = yPosition - cellMargin - 2;
                float availableWidth = colWidths[i] - (cellMargin * 2);

                drawWrappedText(cells[i], cellX, cellY, availableWidth, fontSize, font, new Color(33, 37, 41));
                xOffset += colWidths[i];
            }

            yPosition -= rowHeight;
            alternate = !alternate;
        }

        yPosition -= 10;
    }

    private static Color getStatusColor(String statusCode) {
        if (statusCode.startsWith("2")) return new Color(40, 167, 69);  // Success - Green
        if (statusCode.startsWith("3")) return new Color(23, 162, 184); // Redirect - Cyan
        if (statusCode.startsWith("4")) return new Color(255, 193, 7);  // Client Error - Yellow
        if (statusCode.startsWith("5")) return new Color(220, 53, 69);  // Server Error - Red
        return new Color(108, 117, 125); // Default - Gray
    }

    private static int calculateLineCount(String text, float maxWidth, float fontSize, PDType1Font font) {
        if (text == null || text.isEmpty()) return 1;

        int lineCount = 0;
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            String testLine = currentLine.length() == 0 ? word : currentLine + " " + word;
            try {
                float testWidth = font.getStringWidth(testLine) / 1000 * fontSize;
                if (testWidth <= maxWidth) {
                    if (currentLine.length() > 0) currentLine.append(" ");
                    currentLine.append(word);
                } else {
                    if (currentLine.length() > 0) {
                        lineCount++;
                        currentLine = new StringBuilder(word);
                    } else {
                        lineCount++;
                    }
                }
            } catch (Exception e) {
                // Fallback: estimate based on character count
                float charWidth = fontSize * 0.5f;
                int charsPerLine = (int)(maxWidth / charWidth);
                return (int)Math.ceil((double)text.length() / charsPerLine);
            }
        }
        if (currentLine.length() > 0) {
            lineCount++;
        }

        return Math.max(1, lineCount);
    }

    private static void drawWrappedText(String text, float x, float y, float maxWidth, float fontSize, PDType1Font font, Color color) throws IOException {
        if (text == null || text.isEmpty()) return;

        contentStream.setFont(font, fontSize);
        contentStream.setNonStrokingColor(color);

        // Split text into lines based on actual text width
        java.util.List<String> lines = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            String testLine = currentLine.length() == 0 ? word : currentLine + " " + word;
            try {
                float testWidth = font.getStringWidth(testLine) / 1000 * fontSize;
                if (testWidth <= maxWidth) {
                    if (currentLine.length() > 0) currentLine.append(" ");
                    currentLine.append(word);
                } else {
                    if (currentLine.length() > 0) {
                        lines.add(currentLine.toString());
                        currentLine = new StringBuilder(word);
                    } else {
                        // Single word is too long, force it
                        lines.add(word);
                    }
                }
            } catch (Exception e) {
                // Fallback to character-based wrapping
                if (currentLine.length() > 0) currentLine.append(" ");
                currentLine.append(word);
            }
        }
        if (currentLine.length() > 0) {
            lines.add(currentLine.toString());
        }

        // Draw each line starting from top
        float lineY = y;
        for (String line : lines) {
            contentStream.beginText();
            contentStream.newLineAtOffset(x, lineY);
            contentStream.showText(line);
            contentStream.endText();
            lineY -= (fontSize + 3);
        }
    }
}