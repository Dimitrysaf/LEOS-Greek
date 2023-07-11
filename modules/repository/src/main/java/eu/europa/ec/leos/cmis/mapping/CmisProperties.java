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
package eu.europa.ec.leos.cmis.mapping;

import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.ANNEX_CLONED_REF;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.ANNEX_INDEX;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.ANNEX_NUMBER;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.ANNEX_TITLE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.BASE_REVISION_ID;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.CALLBACK_ADDRESS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.CLONED_FROM;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.CLONED_MILESTONE_ID;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.CLONED_PROPOSAL;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.COLLABORATORS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.COMMENTS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.CONTAINED_DOCUMENTS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.CONTRIBUTION_STATUS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.DOCUMENT_CATEGORY;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.DOCUMENT_LANGUAGE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.DOCUMENT_TEMPLATE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.DOCUMENT_TITLE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.INITIAL_CREATED_BY;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.INITIAL_CREATION_DATE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.JOB_DATE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.JOB_ID;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.LIVE_DIFFING_REQUIRED;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.METADATA_DOCTEMPLATE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.METADATA_EEA_RELEVANCE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.METADATA_PURPOSE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.METADATA_REF;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.METADATA_STAGE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.METADATA_TYPE;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.MILESTONE_COMMENTS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.ORIGIN_REF;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.REVISION_STATUS;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.TRACK_CHANGES_ENABLED;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.VERSION_LABEL;
import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.VERSION_TYPE;

@Component
@Profile(value = {"default","cmis"})
public class CmisProperties implements RepositoryPropertiesMapper {
    private Map<RepositoryProperties, String> ids = new HashMap();

    public CmisProperties() {
        ids.put(DOCUMENT_CATEGORY, "leos:category");
        ids.put(DOCUMENT_TITLE, "leos:title");
        ids.put(DOCUMENT_TEMPLATE, "leos:template");
        ids.put(DOCUMENT_LANGUAGE, "leos:language");
        ids.put(METADATA_REF, "metadata:ref");
        ids.put(MILESTONE_COMMENTS, "leos:milestoneComments");
        ids.put(INITIAL_CREATED_BY, "leos:initialCreatedBy");
        ids.put(INITIAL_CREATION_DATE, "leos:initialCreationDate");
        ids.put(JOB_ID, "leos:jobId");
        ids.put(JOB_DATE, "leos:jobDate");
        ids.put(METADATA_STAGE, "metadata:docStage");
        ids.put(METADATA_TYPE, "metadata:docType");
        ids.put(METADATA_PURPOSE, "metadata:docPurpose");
        ids.put(METADATA_DOCTEMPLATE, "metadata:docTemplate");
        ids.put(METADATA_EEA_RELEVANCE, "metadata:eeaRelevance");
        ids.put(ANNEX_INDEX, "annex:docIndex");
        ids.put(ANNEX_NUMBER, "annex:docNumber");
        ids.put(ANNEX_TITLE, "annex:docTitle");
        ids.put(ANNEX_CLONED_REF, "annex:clonedRef");
        ids.put(COLLABORATORS, "leos:collaborators");
        ids.put(VERSION_LABEL, "leos:versionLabel");
        ids.put(VERSION_TYPE, "leos:versionType");
        ids.put(CONTAINED_DOCUMENTS, "leos:containedDocuments");
        ids.put(CLONED_PROPOSAL, "leos:clonedProposal");
        ids.put(ORIGIN_REF, "leos:originRef");
        ids.put(CLONED_FROM, "leos:clonedFrom");
        ids.put(REVISION_STATUS, "leos:revisionStatus");
        ids.put(CONTRIBUTION_STATUS, "leos:contributionStatus");
        ids.put(COMMENTS, "leos:comments");
        ids.put(CLONED_MILESTONE_ID, "leos:clonedMilestoneId");
        ids.put(BASE_REVISION_ID, "leos:baseRevisionId");
        ids.put(LIVE_DIFFING_REQUIRED, "leos:liveDiffingRequired");
        ids.put(TRACK_CHANGES_ENABLED, "leos:trackChangesEnabled");
        ids.put(CALLBACK_ADDRESS, "leos:callbackAddress");
    }

    @Override
    public String getId(RepositoryProperties prop) {
        return ids.get(prop);
    }
}
