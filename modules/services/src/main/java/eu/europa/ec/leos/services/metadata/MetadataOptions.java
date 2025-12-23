package eu.europa.ec.leos.services.metadata;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class MetadataOptions {
    private List<TaskNode> tasks;
    private String xmlns;
    private String date;
    private String version;
    private String requestId;

    public MetadataOptions() {
        tasks = new ArrayList();
        xmlns = "";
        date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        version = "1.0.0";
        requestId = UUID.randomUUID().toString();
    }

    public List<TaskNode> getTasks() {
        return this.tasks;
    }

    public String getXmlns() {
        return xmlns;
    }

    public void setXmlns(String xmlns) {
        this.xmlns = xmlns;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public static class DocumentNode {
        private final String sourceURL;
        private final String filename;
        private final String mimeType;
        private final String documentId;

        public DocumentNode(String sourceURL,
                            String filename,
                            String mimeType,
                            String documentId){
            this.sourceURL = sourceURL;
            this.filename = filename;
            this.mimeType = mimeType;
            this.documentId = documentId;
        }

        public String getSourceURL() {
            return sourceURL;
        }

        public String getFilename() {
            return filename;
        }

        public String getMimeType() {
            return mimeType;
        }

        public String getDocumentId() {
            return documentId;
        }

        public String toString(){
            return String.format("Document(sourceURL: %s / filename: %s / mimeType: %s / documentId %s)",
                    sourceURL, filename, mimeType, documentId);
        }
    }

    public static class FieldNode {
        private final String key;
        private final String value;

        public FieldNode(String key, String value){
            this.key = key;
            this.value = value;
        }

        public String getKey() {
            return key;
        }

        public String getValue() {
            return value;
        }

        public String toString(){
            return String.format("Field(key: %s / value: %s)", key, value);
        }
    }

    public static class ActionNode {
        private final String name;
        private final String cleanUp;
        private List<FieldNode> fields;

        public ActionNode(String name, String cleanUp) {
            this.name = name;
            this.cleanUp = cleanUp;
            this.fields = null;
        }

        public String getName() {
            return name;
        }

        public String getCleanUp() {
            return cleanUp;
        }

        public boolean isCleanUp() {
            return Boolean.parseBoolean(cleanUp);
        }

        public List<FieldNode> getFields() {
            return fields;
        }

        public ActionNode setFields(List<FieldNode> fields) {
            this.fields = fields;
            return this;
        }

        public String toString(){
            String result = String.format("Action(name: %s / cleanUp: %s / Field count: %s)\n",
                    name, cleanUp, (fields != null) ? fields.size() : 0);
            if (fields != null){
                for (FieldNode field : fields){ result += (field.toString() + "\n"); }
            }
            return result;
        }
    }

    public static class TaskNode {
        private final String taskId;
        private List<ActionNode> actions;
        private DocumentNode document;

        public TaskNode(String taskId){
            this.taskId = taskId;
            this.actions = null;
            this.document = null;
        }

        public String getTaskId() {
            return taskId;
        }

        public List<ActionNode> getActions() {
            return actions;
        }

        public TaskNode setActions(List<ActionNode> actions){
            this.actions = actions;
            return this;
        }

        public DocumentNode getDocument() {
            return this.document;
        }

        public TaskNode setDocument(DocumentNode document){
            this.document = document;
            return this;
        }

        public String toString(){
            String result = String.format("Task(taskId: %s / Action count: %s)\n",
                    taskId, (actions != null) ? actions.size() : 0);
            if (document != null){
                result += document.toString() + "\n";
            }
            if (actions != null){
                for (ActionNode action : actions){ result += action.toString() + "\n"; }
            }
            return result;
        }
    }

    public void addTask(String legFileName, XmlDocument document, List<FieldNode> fields){
        TaskNode taskNode = new TaskNode(UUID.randomUUID().toString());
        DocumentNode documentNode = new DocumentNode("zip://" + legFileName, legFileName, "application/zip", document.getId());
        ActionNode actionNode = new ActionNode("InsertData", "true");
        actionNode.setFields(fields);
        taskNode.setDocument(documentNode);
        taskNode.setActions(Arrays.asList(actionNode));
        this.tasks.add(taskNode);
    }
}
