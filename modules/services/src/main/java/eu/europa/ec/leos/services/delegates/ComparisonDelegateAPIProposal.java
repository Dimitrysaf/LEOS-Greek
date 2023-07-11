/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.services.delegates;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.compare.ContentComparatorContext;
import eu.europa.ec.leos.services.compare.ContentComparatorService;
import eu.europa.ec.leos.services.document.DocumentContentService;
import eu.europa.ec.leos.services.document.TransformationService;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import static eu.europa.ec.leos.services.compare.ContentComparatorService.ATTR_NAME;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_ADDED_CLASS;
import static eu.europa.ec.leos.services.compare.ContentComparatorService.CONTENT_REMOVED_CLASS;

@Component
@Scope("prototype")
@Instance(instances = {InstanceType.OS, InstanceType.COMMISSION})
public class ComparisonDelegateAPIProposal<T extends XmlDocument> extends ComparisonDelegateAPI<T> {

    public ComparisonDelegateAPIProposal(TransformationService transformerService, ContentComparatorService compareService,
                                         SecurityContext securityContext, XmlContentProcessor xmlContentProcessor, DocumentContentService documentContentService) {
        super(transformerService, compareService, securityContext, xmlContentProcessor, documentContentService);
    }

    @Override
    protected String getComparedContent(T oldVersion, T newVersion) {
        return getComparedContent(oldVersion, newVersion, false);
    }

    @Override
    protected String getComparedContent(T oldVersion, T newVersion, boolean includeCoverPage) {
        final String contextPath = "";
        final String firstItemHtml = documentContentService.getDocumentAsHtml(oldVersion, contextPath, securityContext.getPermissions(oldVersion),
                includeCoverPage);
        final String secondItemHtml = documentContentService.getDocumentAsHtml(newVersion, contextPath, securityContext.getPermissions(newVersion),
                includeCoverPage);
        return compareService.compareContents(new ContentComparatorContext.Builder(firstItemHtml, secondItemHtml)
                .withAttrName(ATTR_NAME)
                .withRemovedValue(CONTENT_REMOVED_CLASS)
                .withAddedValue(CONTENT_ADDED_CLASS)
                .withDisplayRemovedContentAsReadOnly(Boolean.TRUE)
                .build());
    }
}
