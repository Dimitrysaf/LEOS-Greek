/*
 * Copyright 2017 European Commission
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
package eu.europa.ec.leos.rest.extensions;

import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ExplanatoryMetadata;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.MemorandumMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.domain.repository.metadata.StructureMetaData;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.mapping.RestProperties;
import eu.europa.ec.leos.rest.support.model.LeosDocument;
import io.atlassian.fugue.Option;

import java.util.function.Function;

class LeosRepositoryMetadataExtensions {
    private static RepositoryPropertiesMapper repositoryPropertiesMapper = new RestProperties();

    private static class CommonMetadataProperties {
        String stage, type, purpose, template, language, docTemplate, ref;
        Boolean eeaRelevance;
    }

    static Option<ProposalMetadata> getProposalMetadataOption(LeosDocument leosDocument) {
        return buildMetadata(leosDocument, props -> Option.some(
                new ProposalMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    static Option<StructureMetaData> getStructureMetadataOption(LeosDocument leosDocument) {
        return buildMetadata(leosDocument, props -> Option.some(
                new StructureMetaData(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    static Option<ExplanatoryMetadata> getExplanatorydataOption(LeosDocument leosDocument) {
        String title = getExplanatoryTitle(leosDocument);
        return buildMetadata(leosDocument, props -> Option.some(
                new ExplanatoryMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, title, null, "0.1.0", props.eeaRelevance)));
    }

    static Option<MemorandumMetadata> getMemorandumMetadataOption(LeosDocument leosDocument) {
        return buildMetadata(leosDocument, props -> Option.some(
                new MemorandumMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    static Option<BillMetadata> getBillMetadataOption(LeosDocument leosDocument) {
        return buildMetadata(leosDocument, props -> Option.some(
                new BillMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    static Option<AnnexMetadata> getAnnexMetadataOption(LeosDocument leosDocument) {
        Integer index = getAnnexIndex(leosDocument);
        String number = getAnnexNumber(leosDocument);
        String title = getAnnexTitle(leosDocument);
        String annexTitle = title == null ? "" : title;
        String clonedRef = getAnnexClonedRef(leosDocument);

        return buildMetadata(leosDocument, props -> {
            return Option.some(
                    new AnnexMetadata(props.stage, props.type, props.purpose, props.template,
                            props.language, props.docTemplate, props.ref, index, number, annexTitle, null, "0.1.0", props.eeaRelevance, clonedRef));

        });
    }

    static Option<FinancialStatementMetadata> getFinancialstatementdataOption(LeosDocument leosDocument) {
        String title = getFinancialStatementTitle(leosDocument);
        return buildMetadata(leosDocument, props -> {
            Option<FinancialStatementMetadata> fin =
             Option.some(
                    new FinancialStatementMetadata(props.stage, props.type, props.purpose, props.template,
                            props.language, props.docTemplate, props.ref, title, null, "0.1.0", props.eeaRelevance));
            return fin;
        });
    }

    private static <T extends LeosMetadata> Option<T> buildMetadata(LeosDocument doc, Function<CommonMetadataProperties, Option<T>> leosMetadataBuilder) {
        CommonMetadataProperties props = new CommonMetadataProperties();
        props.stage = getMetadataStage(doc);
        props.type = getMetadataType(doc);
        props.purpose = getMetadataPurpose(doc);
        props.template = getTemplate(doc);
        props.language = getLanguage(doc);
        props.docTemplate = getMetadataDocTemplate(doc);
        props.ref = getMetadataRef(doc);
        props.eeaRelevance = getMetadataEeaRelevance(doc);

        Option<T> result;
        if (props.language != null && props.docTemplate != null) {
            result = leosMetadataBuilder.apply(props);
        } else {
            result = Option.none();
        }
        return result;
    }

    private static String getMetadataStage(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_STAGE));
    }

    private static String getMetadataType(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_TYPE));
    }

    private static String getMetadataPurpose(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE));
    }

    private static String getMetadataDocTemplate(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_DOCTEMPLATE));
    }

    private static boolean getMetadataEeaRelevance(LeosDocument leosDocument) {
        Boolean eeaRelevance = (Boolean) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_EEA_RELEVANCE));
        return eeaRelevance != null ? eeaRelevance : false;
    }

    private static Integer getAnnexIndex(LeosDocument leosDocument) {
        try {
            return Integer.parseInt(leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_INDEX)).toString());
        } catch (Exception e) {
            return 0;
        }
    }

    private static String getAnnexNumber(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_NUMBER));
    }

    private static String getAnnexTitle(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_TITLE));
    }

    private static String getAnnexClonedRef(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_CLONED_REF));
    }

    private static String getExplanatoryTitle(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE));
    }

    private static String getMetadataRef(LeosDocument leosDocument) {
        return leosDocument.getRef();
    }

    private static String getTemplate(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TEMPLATE));
    }

    private static String getLanguage(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_LANGUAGE));
    }

    private static String getFinancialStatementTitle(LeosDocument leosDocument) {
        return (String) leosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE));
    }
}
