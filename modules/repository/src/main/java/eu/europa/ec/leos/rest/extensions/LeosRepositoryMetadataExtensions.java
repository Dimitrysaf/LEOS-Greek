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

import java.math.BigInteger;
import java.util.function.Function;

class LeosRepositoryMetadataExtensions {
    private static RepositoryPropertiesMapper repositoryPropertiesMapper = new RestProperties();

    private static class CommonMetadataProperties {
        String stage, type, purpose, template, language, docTemplate, ref;
        Boolean eeaRelevance;
    }

    // FIXME add check for leos:proposal secondary type???
    static Option<ProposalMetadata> getProposalMetadataOption(LeosDocument LeosDocument) {
        return buildMetadata(LeosDocument, props -> Option.some(
                new ProposalMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    static Option<StructureMetaData> getStructureMetadataOption(LeosDocument LeosDocument) {
        return buildMetadata(LeosDocument, props -> Option.some(
                new StructureMetaData(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    // FIXME add check for leos:memorandum secondary type???
    static Option<ExplanatoryMetadata> getExplanatorydataOption(LeosDocument LeosDocument) {
        String title = getExplanatoryTitle(LeosDocument);
        return buildMetadata(LeosDocument, props -> Option.some(
                new ExplanatoryMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, title, null, "0.1.0", props.eeaRelevance)));
    }

    // FIXME add check for leos:memorandum secondary type???
    static Option<MemorandumMetadata> getMemorandumMetadataOption(LeosDocument LeosDocument) {
        return buildMetadata(LeosDocument, props -> Option.some(
                new MemorandumMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    // FIXME add check for leos:bill secondary type???
    static Option<BillMetadata> getBillMetadataOption(LeosDocument LeosDocument) {
        return buildMetadata(LeosDocument, props -> Option.some(
                new BillMetadata(props.stage, props.type, props.purpose, props.template,
                        props.language, props.docTemplate, props.ref, null, "0.1.0", props.eeaRelevance)));
    }

    // FIXME add check for leos:annex secondary type???
    static Option<AnnexMetadata> getAnnexMetadataOption(LeosDocument LeosDocument) {
        Integer index = getAnnexIndex(LeosDocument);
        String number = getAnnexNumber(LeosDocument);
        String title = getAnnexTitle(LeosDocument);
        String annexTitle = title == null ? "" : title;
        String clonedRef = getAnnexClonedRef(LeosDocument);

        return buildMetadata(LeosDocument, props -> {
            if (index != null && number != null) {
                return Option.some(
                        new AnnexMetadata(props.stage, props.type, props.purpose, props.template,
                                props.language, props.docTemplate, props.ref, index, number, annexTitle, null, "0.1.0", props.eeaRelevance, clonedRef));
            } else {
                return Option.none();
            }

        });
    }

    static Option<FinancialStatementMetadata> getFinancialstatementdataOption(LeosDocument LeosDocument) {
        String title = getFinancialStatementTitle(LeosDocument);
        return buildMetadata(LeosDocument, props -> {
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
        if (props.stage != null && props.type != null && props.purpose != null && props.template != null && props.language != null && props.docTemplate != null) {
            result = leosMetadataBuilder.apply(props);
        } else {
            result = Option.none();
        }
        return result;
    }

    // FIXME make this property mandatory???
    private static String getMetadataStage(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_STAGE));
    }

    // FIXME make this property mandatory???
    private static String getMetadataType(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_TYPE));
    }

    // FIXME make this property mandatory???
    private static String getMetadataPurpose(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE));
    }

    // FIXME make this property mandatory???
    private static String getMetadataDocTemplate(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_DOCTEMPLATE));
    }

    private static boolean getMetadataEeaRelevance(LeosDocument LeosDocument) {
        Boolean eeaRelevance = (Boolean) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_EEA_RELEVANCE));
        return eeaRelevance != null ? (boolean) eeaRelevance : false;
    }

    // FIXME make this property mandatory???
    private static Integer getAnnexIndex(LeosDocument LeosDocument) {
        BigInteger value = (BigInteger) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_INDEX));
        return value != null ? value.intValueExact() : null;
    }

    // FIXME make this property mandatory???
    private static String getAnnexNumber(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_NUMBER));
    }

    // FIXME make this property mandatory???
    private static String getAnnexTitle(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_TITLE));
    }

    private static String getAnnexClonedRef(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_CLONED_REF));
    }

    // FIXME make this property mandatory???
    private static String getExplanatoryTitle(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE));
    }

    // FIXME make this property mandatory???
    private static String getMetadataRef(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_REF));
    }

    private static String getTemplate(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TEMPLATE));
    }

    private static String getLanguage(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_LANGUAGE));
    }

    private static String getFinancialStatementTitle(LeosDocument LeosDocument) {
        return (String) LeosDocument.getMetadata().get(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE));
    }
}
