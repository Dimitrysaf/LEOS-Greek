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
package eu.europa.ec.leos.repository.security.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;

import eu.europa.ec.leos.repository.security.model.AuthenticatedUser;

@Service
public class JwtUserDetailsService implements UserDetailsService {

	private static final Logger LOG = LoggerFactory.getLogger(JwtUserDetailsService.class);

	@Value("${repository.jwt.auth.user.details.url}")
	private String userDetailsUrl;

	@Autowired
	private RestOperations restTemplate;

	@Override
	public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
		LOG.debug("Searching for user: {}", username);
		try {
			Map<String, String> parameters = new HashMap<>();
			parameters.put("userId", username);
			AuthenticatedUser user = restTemplate.getForObject(userDetailsUrl, AuthenticatedUser.class, parameters);
			user.setAuthorities(user.getRoles());
			return user;
		} catch (Exception e) {
			throw new UsernameNotFoundException("User not found with username: " + username);
		}
	}
}
