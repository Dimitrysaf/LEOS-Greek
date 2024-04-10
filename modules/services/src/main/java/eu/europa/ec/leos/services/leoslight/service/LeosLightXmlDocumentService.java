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
package eu.europa.ec.leos.services.leoslight.service;

import eu.europa.ec.leos.services.export.ExportOptions;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.util.Map;

public interface LeosLightXmlDocumentService {

    void addDocumentHtmlRendition(Map<String, Object> contentToZip, String xmlDocumentName, byte[] xmlContent, String styleSheetName);

    byte[] convert(byte[] documentContent, String fileName, String outputDescriptor, ExportOptions exportOptions) throws Exception;

    ResponseEntity<Object> sendZipFileToCallbackUrlAsync(File file, String callbackUrl) throws Exception;

}
