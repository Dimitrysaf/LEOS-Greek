/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.leos.pilot.export.service.impl;

import eu.europa.ec.digit.leos.pilot.export.exception.TemplateEngineException;
import eu.europa.ec.digit.leos.pilot.export.model.LeosConvertDocumentInput;
import eu.europa.ec.digit.leos.pilot.export.service.TemplateEngineService;
import eu.europa.ec.digit.leos.pilot.export.util.ExportLW;
import eu.europa.ec.digit.leos.pilot.export.util.ExportOptions;
import eu.europa.ec.digit.leos.pilot.export.util.ExportResource;
import freemarker.ext.dom.NodeModel;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class TemplateEngineServiceImpl implements TemplateEngineService {

    @Value("${leos.freemarker.xml.to.html}")
    private String renditionTemplate;

    @Value("${leos.freemarker.ftl.export.legiswrite.pdf}")
    private String exportTemplateLW_pdf;

    @Value("${leos.freemarker.ftl.export.legiswrite.word}")
    private String exportTemplateLW_word;

    private final FreeMarkerConfigurer freemarkerConfiguration;

    private static final Logger LOG = LoggerFactory.getLogger(TemplateEngineServiceImpl.class);

    TemplateEngineServiceImpl(FreeMarkerConfigurer freemarkerConfiguration) {
        this.freemarkerConfiguration = freemarkerConfiguration;
    }

    public byte[] xmlToHtml(LeosConvertDocumentInput convertDocumentInput, String styleSheet, String coverpage) throws TemplateEngineException {
        final Template template;
        final NodeModel nodeModel;
        try {
            template = freemarkerConfiguration.getConfiguration().getTemplate(renditionTemplate);
        } catch (IOException e) {
            LOG.error("Couldn't get template", e);
            throw new TemplateEngineException("Couldn't get template", e);
        }
        try {
            nodeModel = NodeModel.parse(new InputSource(convertDocumentInput.getInputFile().getInputStream()));
        } catch (IOException e) {
            LOG.error("Couldn't load input file", e);
            throw new TemplateEngineException("Couldn't load input file", e);
        } catch (SAXException | ParserConfigurationException e) {
            LOG.error("Couldn't parse input file", e);
            throw new TemplateEngineException("Couldn't parse input file", e);
        }
        final Map<String, Object> root = new HashMap<>();
        root.put("xml_data", nodeModel);
        root.put("toc_file", null);
        root.put("styleSheetName", styleSheet);
        root.put("cover_data", coverpage);

        Writer writer = new StringWriter();
        try {
            template.process(root, writer);
        } catch (IOException | TemplateException e) {
            LOG.error("Couldn't process template", e);
            throw new TemplateEngineException("Couldn't process template", e);
        }
        return writer.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public ByteArrayOutputStream createContentFile(ExportOptions exportOptions, ExportResource exportRootNode) throws Exception {
        ByteArrayOutputStream byteOutputStream = new ByteArrayOutputStream();

        LOG.trace("Creating content file document...");
        try {
            Map<String, ExportResource> resources = new HashMap<>();
            resources.put("resource_tree", exportRootNode);
            String templateName = getTemplateName(exportOptions);
            StringWriter outputWriter = new StringWriter();
            Template template = freemarkerConfiguration.getConfiguration().getTemplate(templateName);
            template.process(resources, outputWriter);
            String result = outputWriter.getBuffer().toString();
            byteOutputStream.write(result.getBytes(UTF_8));
        } catch (Exception ex) {
            LOG.error("Error while creating content xml file {}", ex.getMessage());
            throw ex;
        }
        return byteOutputStream;
    }

    private String getTemplateName(ExportOptions exportOptions) {
        String templateName;
        if (exportOptions instanceof ExportLW) {
            templateName = getTemplate(exportOptions.getExportOutput(), exportTemplateLW_pdf, exportTemplateLW_word);
        } else {
            throw new IllegalStateException("Not possible!!!");
        }
        return templateName;
    }

    protected String getTemplate(ExportOptions.Output exportOutput, String pdfTemplate, String wordTemplate) {
        switch (exportOutput) {
            case PDF:
                return pdfTemplate;
            case WORD:
                return wordTemplate;
            default:
                throw new IllegalStateException("Not possible!!!");
        }
    }
}
