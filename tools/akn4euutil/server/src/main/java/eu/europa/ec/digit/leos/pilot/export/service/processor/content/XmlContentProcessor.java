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

import eu.europa.ec.digit.leos.pilot.export.model.LeosCategory;

import java.util.List;
import java.util.Map;

public interface XmlContentProcessor {

    String getAttributeValueByXpath(byte[] xmlContent, String xPath, String attrName) throws Exception;

    LeosCategory identifyCategory(String docName, byte[] xmlContent) throws Exception;

    byte[] removeElements(byte[] xmlContent, String xpath, int parentsToRemove) throws Exception;

    List<Map<String, String>> getElementsAttributesByPath(byte[] xmlContent, String xPath) throws Exception;

    String getElementValue(byte[] xmlContent, String xPath) throws Exception;
}
