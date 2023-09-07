/*
 * Copyright 2023 European Commission
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
package eu.europa.ec.leos.repository.security.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthenticatedUser implements UserDetails {

    private String login;
    private Long perId;
    private String lastName;
    private String firstName;
    private String email;
    private List<Entity> entities;
    private List<String> roles;
    private Set<GrantedAuthority> authorities;

    public AuthenticatedUser() {
    }

    public String getLogin() {
        return login;
    }

    public Long getPerId() {
        return perId;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }

    public List<Entity> getEntities() {
        return entities;
    }

    public List<String> getRoles() {
        return roles;
    }

    @Override
    public String toString() {
        return login;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AuthenticatedUser)) return false;
        if (getLogin() == null) return false;
        AuthenticatedUser user = (AuthenticatedUser) o;
        return getLogin().equals(user.getLogin());
    }

    @Override
    public int hashCode() {
        return ((getLogin() == null) ? 0 : getLogin().hashCode());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> roles) {
        authorities = new HashSet<>(roles.size());
        for (int i = 0; i < roles.size(); ++i) {
            authorities.add(new SimpleGrantedAuthority(roles.get(i)));
        }
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
