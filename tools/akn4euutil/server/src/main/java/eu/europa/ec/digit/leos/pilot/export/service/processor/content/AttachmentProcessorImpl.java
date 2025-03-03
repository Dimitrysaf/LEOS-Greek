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
package eu.europa.ec.digit.leos.pilot.export.service.processor.content;

import eu.europa.ec.digit.leos.pilot.export.util.XPathCatalog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttachmentProcessorImpl implements AttachmentProcessor {
    private XmlContentProcessor xmlContentProcessor;

    private static final Logger LOG = LoggerFactory.getLogger(AttachmentProcessorImpl.class);
    private XPathCatalog xPathCatalog;

    @Autowired
    public AttachmentProcessorImpl(XmlContentProcessor xmlContentProcessor, XPathCatalog xPathCatalog) {
        this.xmlContentProcessor = xmlContentProcessor;
        this.xPathCatalog = xPathCatalog;
    }

    @Override
    public Map<String, String> getAttachmentsIdFromBill(byte[] xmlContent) throws Exception {
        Map<String, String> attachmentsId = new HashMap<>();
        List<Map<String, String>> attrsElts = xmlContentProcessor.getElementsAttributesByPath(xmlContent, xPathCatalog.getXPathDocumentRef());
        attrsElts.forEach(element -> {
            if (element.containsKey("xml:id") && element.containsKey("href")) {
                String href = element.get("href").replaceAll("\\.xml$", "");
                attachmentsId.put(href, element.get("xml:id"));
            }
        });
        return attachmentsId;
    }
}
