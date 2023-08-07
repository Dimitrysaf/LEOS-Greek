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
package eu.europa.ec.leos.repository.document;

import eu.europa.ec.leos.domain.common.RepositoryProfileType;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.repository.RepositoryProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

/**
 * Annex Repository implementation.
 *
 * @constructor Creates a specific Annex Repository, injected with a generic LEOS Repository.
 */
@Repository
@RepositoryProfile(RepositoryProfileType.REST)
public class RestAnnexRepositoryImpl extends AnnexRepositoryImpl {

    private static final Logger logger = LoggerFactory.getLogger(RestAnnexRepositoryImpl.class);

    @Autowired
    public RestAnnexRepositoryImpl(LeosRepository leosRepository) {
        super(leosRepository);
    }

    @Override
    public void deleteAnnex(String id) {
        logger.debug("Deleting Annex... [id=" + id + "]");
    }
}
