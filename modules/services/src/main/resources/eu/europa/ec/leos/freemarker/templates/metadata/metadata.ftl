<#ftl encoding="UTF-8"
output_format="XML"
auto_esc=true
strict_syntax=true
strip_whitespace=true
strip_text=true
ns_prefixes={}>

<#--
    Copyright 2024 European Union

    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
    You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:

        https://joinup.ec.europa.eu/software/page/eupl

    Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and limitations under the Licence.
-->

<#-- FTL imports -->
<#-- XML variable to reference the input node model -->

<#assign root =.data_model.task_tree>

<#assign tasks = root.getTasks()>

<@compress>
    <legisWriteRequest xmlns="${root.getXmlns()}" version="${root.getVersion()}" date="${root.getDate()}" requestId="${root.getRequestId()}">
        <#list tasks as task>
            <#assign document = task.getDocument()>
            <#assign actions = task.getActions()>
            <task taskId="${task.getTaskId()}">
                <document sourceURL="${document.getSourceURL()}" fileName="${document.getFilename()}" mimeType="${document.getMimeType()}"
                          documentId="${document.getDocumentId()}">
                </document>
                <#list actions as action>
                    <#assign fields = action.getFields()>
                    <action name="${action.getName()}" cleanup="${action.getCleanUp()}">
                        <#list fields as field>
                            <field key="${field.getKey()}">${field.getValue()}</field>
                        </#list>
                    </action>
                </#list>
            </task>
        </#list>
    </legisWriteRequest>
</@compress>
