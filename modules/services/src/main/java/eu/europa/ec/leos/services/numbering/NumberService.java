/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.1 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.numbering;

import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;

import java.util.List;

public interface NumberService {

    byte[] renumberArticles(byte[] xmlContent);

    byte[] renumberArticles(byte[] xmlContent, boolean renumberChildElements);

    String renumberImportedRecital(String content);

    String renumberImportedArticle(String content);

    String renumberImportedHigherSubDivision(String content, String language, String elementName);

    byte[] renumberSpecificElementChildren(byte[] xmlContent, String tagName, String elementId);

    byte[] renumberRecitals(byte[] xmlContent);

    byte[] renumberLevel(byte[] xmlContent);

    byte[] renumberParagraph(byte[] xmlContent);

    byte[] renumberDivisions(byte[] xmlContent);

    byte[] renumberHigherSubDivisions(byte[] xmlContent, List<TableOfContentItemVO> tocList);

    byte[] renumberHigherSubDivisions(byte[] xmlContent, String language, String elementName, List<TocItem> tocItems);
}
