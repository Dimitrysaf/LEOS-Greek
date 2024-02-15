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
package eu.europa.ec.leos.rest.extensions;

import eu.europa.ec.leos.domain.repository.metadata.AnnexMetadata;
import eu.europa.ec.leos.domain.repository.metadata.BillMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ExplanatoryMetadata;
import eu.europa.ec.leos.domain.repository.metadata.FinancialStatementMetadata;
import eu.europa.ec.leos.domain.repository.metadata.LeosMetadata;
import eu.europa.ec.leos.domain.repository.metadata.MemorandumMetadata;
import eu.europa.ec.leos.domain.repository.metadata.ProposalMetadata;
import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import eu.europa.ec.leos.rest.mapping.RestProperties;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toMap;
import static org.springframework.util.StringUtils.isEmpty;

public class LeosMetadataExtensions {

    private static RepositoryPropertiesMapper repositoryPropertiesMapper = new RestProperties();

    //todo: fix this generics..
    public static Map<String, ? extends Object> toLeosRepositoryProperties(LeosMetadata leosMetadata) {

        Map<String, ? extends Object> leosProperties;
        if (leosMetadata instanceof ProposalMetadata) {
            leosProperties = toLeosRepositoryProperties((ProposalMetadata) leosMetadata);
        } else if (leosMetadata instanceof MemorandumMetadata) {
            leosProperties = toLeosRepositoryProperties((MemorandumMetadata) leosMetadata);
        } else if (leosMetadata instanceof BillMetadata) {
            leosProperties = toLeosRepositoryProperties((BillMetadata) leosMetadata);
        } else if (leosMetadata instanceof AnnexMetadata) {
            leosProperties = toLeosRepositoryProperties((AnnexMetadata) leosMetadata);
        } else if (leosMetadata instanceof ExplanatoryMetadata) {
            leosProperties = toLeosRepositoryProperties((ExplanatoryMetadata) leosMetadata);
        } else if (leosMetadata instanceof FinancialStatementMetadata) {
            leosProperties = toLeosRepositoryProperties((FinancialStatementMetadata) leosMetadata);
        } else {
            throw new IllegalStateException("Unknown LEOS Metadata! [type=" + leosMetadata.getClass().getSimpleName() + ']');
        }

        return leosProperties.entrySet()
                .stream()
                .filter(mapEntry -> !isEmpty(mapEntry.getValue()))
                .collect(toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private static Map<String, ? extends Object> toLeosRepositoryProperties(ProposalMetadata proposalMetadata) {

        String title = Stream.of(proposalMetadata.getStage(), proposalMetadata.getType(), proposalMetadata.getPurpose())
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.joining(" "));

        return buildCommonProperties(proposalMetadata, title);
    }

    private static Map<String, ? extends Object> toLeosRepositoryProperties(ExplanatoryMetadata explanatoryMetadata) {
        String title = explanatoryMetadata.getTitle();

        return buildCommonProperties(explanatoryMetadata, title);
    }

    private static Map<String, ? extends Object> toLeosRepositoryProperties(MemorandumMetadata memorandumMetadata) {
        String title = memorandumMetadata.getType();

        return buildCommonProperties(memorandumMetadata, title);
    }

    private static Map<String, ? extends Object> toLeosRepositoryProperties(BillMetadata billMetadata) {
        String title = Stream.of(billMetadata.getStage(), billMetadata.getType(), billMetadata.getPurpose())
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.joining(" "));

        return buildCommonProperties(billMetadata, title);
    }

    private static Map<String, ? extends Object> toLeosRepositoryProperties(AnnexMetadata annexMetadata) {
        String title = annexMetadata.getType();

        Map<String, Object> leosProperties = new HashMap<>();

        leosProperties.putAll(buildCommonProperties(annexMetadata, title));

        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_INDEX), annexMetadata.getIndex());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_NUMBER), annexMetadata.getNumber());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_TITLE), annexMetadata.getTitle());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.ANNEX_CLONED_REF), annexMetadata.getClonedRef());

        return leosProperties;
    }

    private static Map<String, ? extends Object> toLeosRepositoryProperties(FinancialStatementMetadata financialStatementMetadata) {
        String title = financialStatementMetadata.getTitle();

        return buildCommonProperties(financialStatementMetadata, title);
    }

    private static Map<String, ? extends Object> buildCommonProperties(LeosMetadata leosMetadata, String title) {
        Map<String, Object> leosProperties = new HashMap<>();
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_STAGE), leosMetadata.getStage());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_TYPE), leosMetadata.getType());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE), leosMetadata.getPurpose());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PROCEDURE_TYPE), leosMetadata.getProcedureType());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_ACT_TYPE), leosMetadata.getActType());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_PURPOSE), leosMetadata.getPurpose());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_EEA_RELEVANCE), leosMetadata.getEeaRelevance());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TEMPLATE), leosMetadata.getTemplate());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_LANGUAGE), leosMetadata.getLanguage());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_DOCTEMPLATE), leosMetadata.getDocTemplate());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.CALLBACK_ADDRESS), leosMetadata.getCallbackAddress());
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.IMPORTED), leosMetadata.isImported());


        String ref = leosMetadata.getRef();
        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.METADATA_REF), ref != null ? ref : "");

        leosProperties.put(repositoryPropertiesMapper.getId(RepositoryProperties.DOCUMENT_TITLE), title);

        return leosProperties;
    }
}
