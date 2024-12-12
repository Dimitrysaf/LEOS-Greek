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
package eu.europa.ec.leos.services.document;

import eu.europa.ec.leos.domain.repository.LeosCategory;
import eu.europa.ec.leos.domain.common.InstanceType;
import eu.europa.ec.leos.instance.Instance;
import eu.europa.ec.leos.security.LeosPermission;
import freemarker.template.Configuration;
import freemarker.template.TemplateHashModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
@Instance(instances = {InstanceType.COMMISSION, InstanceType.OS})
public class TransformationProposalService extends TransformationServiceImpl {

    @Autowired
    public TransformationProposalService(Configuration freemarkerConfiguration, TemplateHashModel enumModels){
        super(freemarkerConfiguration, enumModels);
    }

    @Override
    public String toEditableXml(final InputStream documentStream, String contextPath, LeosCategory category,
            List<LeosPermission> permissions, InputStream coverPageStream) {
        String template;
        switch (category){
            case ANNEX:
            case COUNCIL_EXPLANATORY:
            case MEMORANDUM:
            case BILL:
            case COVERPAGE:
            case PROPOSAL:
            case STAT_DIGIT_FINANC_LEGIS:
                template = getEditableXHtmlTemplate();
                break;
            default:
                throw new UnsupportedOperationException("No transformation supported for this category");
        }
        return transform(documentStream, template, contextPath, permissions, coverPageStream);
    }

}
