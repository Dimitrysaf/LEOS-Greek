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
package eu.europa.ec.leos.rest.mapping;

import eu.europa.ec.leos.repository.mapping.RepositoryProperties;
import eu.europa.ec.leos.repository.mapping.RepositoryPropertiesMapper;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static eu.europa.ec.leos.repository.mapping.RepositoryProperties.*;

@Component
@Profile(value = {"rest"})
public class RestProperties implements RepositoryPropertiesMapper {
   private Map<RepositoryProperties, String> ids = new HashMap();

    public RestProperties() {
        ids.put(DOCUMENT_CATEGORY, "category");
        ids.put(DOCUMENT_TITLE, "title");
        ids.put(DOCUMENT_TEMPLATE, "template");
        ids.put(DOCUMENT_LANGUAGE, "language");
        ids.put(METADATA_REF, "ref");
        ids.put(MILESTONE_COMMENTS, "milestoneComments");
        ids.put(INITIAL_CREATED_BY, "initialCreatedBy");
        ids.put(INITIAL_CREATION_DATE, "initialCreationDate");
        ids.put(JOB_ID, "jobId");
        ids.put(JOB_DATE, "jobDate");
        ids.put(STATUS, "status");
        ids.put(METADATA_STAGE, "docStage");
        ids.put(METADATA_TYPE, "docType");
        ids.put(METADATA_PURPOSE, "docPurpose");
        ids.put(METADATA_DOCTEMPLATE, "docTemplate");
        ids.put(METADATA_EEA_RELEVANCE, "eeaRelevance");
        ids.put(ANNEX_INDEX, "docIndex");
        ids.put(ANNEX_NUMBER, "docNumber");
        ids.put(ANNEX_TITLE, "docTitle");
        ids.put(ANNEX_CLONED_REF, "clonedRef");
        ids.put(COLLABORATORS, "collaborators");
        ids.put(VERSION_LABEL, "versionLabel");
        ids.put(VERSION_TYPE, "versionType");
        ids.put(CONTAINED_DOCUMENTS, "containedDocuments");
        ids.put(CLONED_PROPOSAL, "clonedProposal");
        ids.put(ORIGIN_REF, "originRef");
        ids.put(CLONED_FROM, "clonedFrom");
        ids.put(REVISION_STATUS, "revisionStatus");
        ids.put(CONTRIBUTION_STATUS, "contributionStatus");
        ids.put(COMMENTS, "comments");
        ids.put(CLONED_MILESTONE_ID, "clonedMilestoneId");
        ids.put(BASE_REVISION_ID, "baseRevisionId");
        ids.put(LIVE_DIFFING_REQUIRED, "liveDiffingRequired");
        ids.put(TRACK_CHANGES_ENABLED, "trackChangesEnabled");
        ids.put(CALLBACK_ADDRESS, "callbackAddress");
    }

    @Override
    public String getId(RepositoryProperties prop) {
        return ids.get(prop);
    }
}
