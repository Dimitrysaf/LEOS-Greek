<#ftl encoding="UTF-8"
      output_format="XML"
      auto_esc=true
      strict_syntax=true
      strip_whitespace=true
      strip_text=true
      ns_prefixes={"D":"http://docs.oasis-open.org/legaldocml/ns/akn/3.0",
                   "leos":"urn:eu:europa:ec:leos",
                    "xml":"http://www.w3.org/XML/1998/namespace"}>

<#--
    Copyright 2026 European Union

    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
    You may not use this work except in compliance with the Licence.
    You may obtain a copy of the Licence at:

        https://joinup.ec.europa.eu/software/page/eupl

    Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the Licence for the specific language governing permissions and limitations under the Licence.
-->

<#-- Hash of mapped Akoma Ntoso XML elements where:
       Key = Akoma Ntoso element name
     Value = Mapped element name
-->
<#assign aknMapped={
    'body':'aknBody',
    'title':'aknTitle',
    'p':'aknP',
    'xml:id':'id'
}>

<#assign authorialNoteList = []>

<#-- Sequence of ignored Akoma Ntoso XML elements -->
<#assign aknIgnored=[
    'meta'
]>


<#macro akomaNtoso>
<akomaNtoso id="${getLeosRef()}" xmlns="http://docs.oasis-open.org/legaldocml/ns/akn/3.0" xmlns:leos="urn:eu:europa:ec:leos">
   <#recurse/>
</akomaNtoso>
</#macro>

<#macro bill>
    <#local nodeName = .node?node_name>
    <${nodeName}<@handleAttributes/>><@coverPage/><#recurse><@printAuthorialNotes/></${nodeName}><#t>
</#macro>

<#macro doc>
    <#local nodeName = .node?node_name>
    <${nodeName}<@handleAttributes/>><@coverPage/><#recurse><@printAuthorialNotes/></${nodeName}><#t>
</#macro>

<#-----------------------------------------------------------------------------
 AKN cover page specific handlers
------------------------------------------------------------------------------>
<#macro coverPage>
    <#if .data_model.cover_data??>
    	<#if .data_model.cover_data.akomaNtoso?? && .data_model.cover_data.akomaNtoso?has_content>
    		<#assign coverPage = .data_model.cover_data.akomaNtoso.coverPage>
    	<#else>
        	<#assign coverPage = .data_model.cover_data.coverPage>
    	</#if>
        <#local idAttr = coverPage["@xml:id"][0]!''>
        <#local classAttr = coverPage["@class"][0]!''>
        <coverPage id="${idAttr}" class="${classAttr}"><#recurse coverPage></coverPage><#t>
    </#if>
</#macro>

<#macro container>
    <#local language = (.node["@name"][0]!'') == 'language'>
    <#if (language)>
        <container id="${.node["@xml:id"][0]!}" name="language" data-lang="${.node.p}"></container><#t>
    <#else>
        <#local language = (.node["@name"][0]!'') == 'mainDocLanguage'>
        <#if (language)>
            <container id="${.node["@xml:id"][0]!}" name="mainDocLanguage" data-lang="${.node.p.inline}"></container><#t>
        <#else>
            <@@element/><#t>
        </#if>
    </#if>
</#macro>
<#-----------------------------------------------------------------------------
 AKN authorial note handler 
------------------------------------------------------------------------------>
<#macro authorialNote>
	<#assign authorialNoteList = authorialNoteList + [.node]>
    <#local noteId = .node["@xml:id"][0]!''>
    <#if (noteId?length gt 0)>
        <authorialNote<@handleAttributes/> onClick="LEOS.scrollTo('endNote_${noteId}')"><#t>
        <#recurse><#t>
        </authorialNote><#t>
    <#else>
        <authorialNote<@handleAttributes/>><#recurse></authorialNote><#t>
    </#if>
</#macro>

<#-----------------------------------------------------------------------------
Cross Reference handler
------------------------------------------------------------------------------>
<#macro ref>
    <#local href = .node.@href[0]!''>
    <#local refId = href?substring(href?index_of("/") + 1)>
    <#-- For now we can navigate only through the same document.
        In the future we should read ducumentRef=href?substring(0, href?index_of("/")) for beeing able to navigate in a different document-->
    <ref<@handleAttributes/> onClick="LEOS.scrollTo('${refId}')"><#recurse></ref><#t>
</#macro>

<#-- AKN end-of-line handler -->
<#macro eol>
<br/>
</#macro>

<#-- print the footnotes in document -->
<#macro printAuthorialNotes>
    <#list authorialNoteList>
        <span id="leos-authnote-table-id" class="leos-authnote-table"><#t>
            <hr size="2"/><#t>
        <#items as authNote>
            <#local noteMarker = authNote.@marker[0]!'*'>
            <#local noteText = authNote.@@text?trim>
            <#local noteId = authNote["@xml:id"][0]!''>
            <#if (!noteId?contains("deletedX"))>
                <#if (noteId?length gt 0)>
                    <span id="endNote_${noteId}" class="leos-authnote" onClick="LEOS.scrollTo('${noteId}')"><#t>
                        <marker id="marker_${noteId}">${noteMarker}</marker><#t>
                        <text id="text_${noteId}">${noteText}</text><#t>
                    </span><#t>
                <#else>
                    <span class="leos-authnote"><#t>
                        <marker>${noteMarker}</marker><#t>
                        <text>${noteText}</text><#t>
                    </span><#t>
                </#if>
            </#if>
        </#items>
        </span><#t>
    </#list>
</#macro>

<#-----------------------------------------------------------------------------
    Default handlers for XML nodes
------------------------------------------------------------------------------>
<#-- default handler for element nodes -->
<#macro @element>
    <#local nodeName = .node?node_name>
    <#if (!aknIgnored?seq_contains(nodeName))>
        <#local nodeTag = aknMapped[nodeName]!nodeName>
        <${nodeTag}<@handleAttributes/>><#recurse></${nodeTag}><#t>
    </#if>
</#macro>

<#-- default handler for text nodes -->
<#macro @text>
    <#if .node?trim?length gt 0>
        ${.node}<#t>
    </#if>
</#macro>

<#-----------------------------------------------------------------------------
    Common function to generate updated attributes for XML nodes
------------------------------------------------------------------------------>
<#macro handleAttributes>
    <#if (.node.@@?size gt 0)>
        <#list .node.@@ as attr>
            <#local attrName = aknMapped[attr.@@qname]!attr.@@qname>
            ${attrName}="${attr}"<#rt>
        </#list>
    </#if>
</#macro>

<#function getLeosRef>
    <#assign refNode = .node["//leos:ref"]>
    <#return refNode?has_content?then(refNode.@@text, 'akomaNtoso')>
</#function>
