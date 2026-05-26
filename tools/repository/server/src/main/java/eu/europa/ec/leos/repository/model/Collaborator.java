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
package eu.europa.ec.leos.repository.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@EqualsAndHashCode(of = {"login", "entity"})
public class Collaborator {
    private String login;

    private String entity;

    private String role;

    private String leosClientId;

    private String displayName;

    public Collaborator() {
    }

    public Collaborator(String login, String role, String entity) {
        this(login, role, entity, null);
    }

    public Collaborator(String login, String role, String entity, String leosClientId) {
        this(login, role, entity, leosClientId, null);
    }

    public Collaborator(String login, String role, String entity, String leosClientId, String displayName) {
        this.login = login;
        this.role = role;
        this.entity = entity;
        this.leosClientId = leosClientId;
        this.displayName = displayName;
    }
}
