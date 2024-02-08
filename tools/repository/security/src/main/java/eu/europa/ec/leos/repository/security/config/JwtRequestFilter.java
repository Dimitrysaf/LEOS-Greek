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
package eu.europa.ec.leos.repository.security.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import eu.europa.ec.leos.repository.security.service.JwtTokenService;

public class JwtRequestFilter extends OncePerRequestFilter {

	@Value("${repository.jwt.auth.enabled}")
	private boolean jwtAuthEnabled;

	@Autowired
	private JwtTokenService jwtTokenService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		if (jwtAuthEnabled) {
			final String authorization = request.getHeader("Authorization");
			if ((authorization != null) && authorization.startsWith("Bearer ")) {
				final String token = authorization.substring(7);
				if ((SecurityContextHolder.getContext().getAuthentication() == null) && jwtTokenService.validateAccessToken(token)) {
					jwtTokenService.authenticateUserWithToken(token);
				}
			}
		}

		chain.doFilter(request, response);
	}

}
