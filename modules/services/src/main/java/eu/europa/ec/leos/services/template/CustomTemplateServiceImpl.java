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
package eu.europa.ec.leos.services.template;

import eu.europa.ec.leos.domain.repository.LeosPackage;
import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.repository.LeosRepository;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.store.PackageService;
import eu.europa.ec.leos.services.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
class CustomTemplateServiceImpl implements CustomTemplateService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomTemplateServiceImpl.class);
    
    private final LeosRepository leosRepository;
    private final UserService userService;
    private final SecurityContext securityContext;


    @Override
    public void publishTemplate(String proposalRef, String legDocumentName, String templateName, List<String> dgCodes) {
        // Get all valid organizations from user repository for validation
        List<String> validOrganizations = userService.getAllOrganizations();
        Set<String> validOrgSet = new HashSet<>(validOrganizations);

        // Validate authenticated user exists
        User user = securityContext.getUser();
        if (user == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        
        // Add user's entity organizations to DG codes if not already present
        List<String> finalDgCodes = new ArrayList<>(dgCodes);
        if (user.getEntities() != null) {
            for (Entity entity : user.getEntities()) {
                String orgName = entity.getOrganizationName();
                if (orgName != null && !finalDgCodes.contains(orgName)) {
                    finalDgCodes.add(orgName);
                }
            }
        }
        
        // Validate all DG codes against valid organizations
        for (String dgCode : finalDgCodes) {
            if (!validOrgSet.contains(dgCode)) {
                throw new IllegalArgumentException("Invalid organization: " + dgCode);
            }
        }
        
        // Publish template with validated DG codes
        leosRepository.publishCustomTemplate(proposalRef, legDocumentName, templateName, finalDgCodes, user.getLogin());
    }
}