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
package eu.europa.ec.leos.services.metadata;

import eu.europa.ec.leos.services.export.ExportResource;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.apache.commons.lang3.Validate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

@Component
public class MetadataHelper {
    private static final Logger LOG = LoggerFactory.getLogger(MetadataHelper.class);

    private final Configuration freemarkerConfiguration;

    @Value("${leos.freemarker.ftl.metadata}")
    private String templateMetadata;

    @Autowired
    public MetadataHelper(Configuration freemarkerConfiguration) {
        this.freemarkerConfiguration = freemarkerConfiguration;
    }

    public ByteArrayOutputStream createContentFile(MetadataOptions metadataOptions, ExportResource exportRootNode) throws Exception {
        Validate.notNull(metadataOptions);
        Validate.notNull(exportRootNode);
        ByteArrayOutputStream byteOutputStream = new ByteArrayOutputStream();

        LOG.trace("Creating content file document...");
        try {

            Map<String, MetadataOptions> tasks = new HashMap<>();
            tasks.put("task_tree", metadataOptions);
            String templateName = getTemplateName(metadataOptions);
            StringWriter outputWriter = new StringWriter();
            Template template = freemarkerConfiguration.getTemplate(templateName);
            template.process(tasks, outputWriter);
            String result = outputWriter.getBuffer().toString();
            byteOutputStream.write(result.getBytes(UTF_8));
        } catch (Exception ex) {
            LOG.error("Error while creating content xml file {}", ex.getMessage());
            throw ex;
        }
        return byteOutputStream;
    }

    private String getTemplateName(MetadataOptions metadataOptions) {
        return templateMetadata;
    }
}