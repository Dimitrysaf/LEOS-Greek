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

import java.util.Objects;

public class Collaborator {
    private String login;

    private String entity;

    private String role;

    private String leosClientId;

    public Collaborator() {
    }

    public Collaborator(String login, String role, String entity) {
        this.login = login;
        this.role = role;
        this.entity = entity;
    }

    public Collaborator(String login, String role, String entity, String leosClientId) {
        this.login = login;
        this.role = role;
        this.entity = entity;
        this.leosClientId = leosClientId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLeosClientId() {
        return leosClientId;
    }

    public void setLeosClientId(String leosClientId) {
        this.leosClientId = leosClientId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Collaborator that = (Collaborator) o;
        return Objects.equals(login, that.login) &&
                Objects.equals(entity, that.entity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, entity);
    }
}
