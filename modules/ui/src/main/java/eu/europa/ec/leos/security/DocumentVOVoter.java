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
package eu.europa.ec.leos.security;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import eu.europa.ec.leos.domain.vo.DocumentVO;

@Component
class DocumentVOVoter implements AccessDecisionVoter<DocumentVO> {

    @Autowired
    LeosPermissionAuthorityMap authorityMap;

    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;// accept all as string
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return DocumentVO.class.isAssignableFrom(clazz);
    }

    @Override
    public int vote(Authentication authentication, DocumentVO documentVO, Collection<ConfigAttribute> attributes) {
        String authority = retrieveAuthority(authentication, documentVO);
        LeosPermission permission = retrievePermission(attributes);

        if (authority == null || permission == null) {
            return ACCESS_DENIED;
        }

        Set<LeosPermission> authorityPermissions = authorityMap.getPermissions(authority);
        if (authorityPermissions != null && authorityPermissions.contains(permission)) {
            return ACCESS_GRANTED;
        } else {
            return ACCESS_DENIED;
        }
    }

    private String retrieveAuthority(Authentication authentication, DocumentVO documentVO) {
        AuthenticatedUser authenticatedUser = ((AuthenticatedUser) authentication.getPrincipal());
        // Normal user collaborator - has preference over entity collaborators
        List<Collaborator> userCollaborators = documentVO.getCollaborators().stream().
                filter(c -> authenticatedUser.getLogin().equals(c.getLogin())).collect(Collectors.toList());
        for (Collaborator collaborator : userCollaborators) {
            String[] collaboratorRootEntity = collaborator.getEntity().split("\\.", 2);
            for (Entity entity : authenticatedUser.getEntities()) {
                String[] userRootEntity = entity.getName().split("\\.", 2);
                if (userRootEntity[0].equals(collaboratorRootEntity[0])) {
                    return collaborator.getRole();
                }
            }
        }
        // Entity collaborators
        List<Collaborator> entityCollaborators = documentVO.getCollaborators().stream().
                filter(c -> c.getLogin().equals(c.getEntity())).
                sorted((c1, c2) -> Long.compare(c2.getEntity().chars().filter(ch -> ch == '.').count(),
                        c1.getEntity().chars().filter(ch -> ch == '.').count())).
                collect(Collectors.toList());
        for (Collaborator collaborator : entityCollaborators) {
            for (Entity entity : authenticatedUser.getEntities()) {
                if (entity.getName().startsWith(collaborator.getEntity())) {
                    return collaborator.getRole();
                }
            }
        }
        return null;
    }

    private LeosPermission retrievePermission(Collection<ConfigAttribute> attributes) {
        LeosPermission permission = null;
        if (attributes != null) {
            Iterator<ConfigAttribute> iterator = attributes.iterator();
            if (iterator.hasNext()) {// we expect only one permission check
                permission = LeosPermission.valueOf(iterator.next().getAttribute());
            }
        }
        return permission;
    }
}
