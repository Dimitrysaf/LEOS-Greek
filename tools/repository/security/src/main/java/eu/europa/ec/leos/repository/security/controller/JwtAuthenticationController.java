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
package eu.europa.ec.leos.repository.security.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.europa.ec.leos.repository.security.model.AuthClient;
import eu.europa.ec.leos.repository.security.model.JwtAuthenticationError;
import eu.europa.ec.leos.repository.security.model.JwtResponse;
import eu.europa.ec.leos.repository.security.service.JwtTokenService;

@RestController
@CrossOrigin
public class JwtAuthenticationController {

	private static final Logger LOG = LoggerFactory.getLogger(JwtAuthenticationController.class);

	@Value("${repository.jwt.auth.enabled}")
	private boolean jwtAuthEnabled;

	@Autowired
	private JwtTokenService jwtTokenService;

	private static final String GRANT_TYPE = "grant-type";
	private static final String BEARER_GRANT_TYPE = "jwt-bearer";
	private static final String BEARER_ASSERTION = "assertion";
	private enum GrantType { Access, Unsupported };

	@RequestMapping(value = {"/token"}, produces = {MediaType.APPLICATION_JSON_VALUE})
	public ResponseEntity<?> getToken(final HttpServletRequest request, final HttpServletResponse response) {

		response.setHeader("Cache-Control", "no-store");
		response.setHeader("Pragma", "no-cache");

		final String grantType = request.getHeader(GRANT_TYPE);
		if (!jwtAuthEnabled || !StringUtils.hasLength(grantType)) {
			return new ResponseEntity<Object>(JwtAuthenticationError.getInvalidRequestResult(), HttpStatus.BAD_REQUEST);
		}

		JwtAuthenticationError errorResult;
		final GrantType requestedGrant = getGrantType(grantType);
		switch (requestedGrant) {
			case Access:
				final String token = request.getHeader(BEARER_ASSERTION);
				AuthClient authClient = jwtTokenService.validateClientWithToken(token);
				if (authClient.isVerified()) {
					final String user = jwtTokenService.authenticateUserWithToken(token);
					LOG.debug("Created access token for the client {}", authClient.getName());
					return ResponseEntity.ok(new JwtResponse(jwtTokenService.getAccessToken(user), "jwt",
							jwtTokenService.getAccessTokenExpirationIn()));
				} else {
					return new ResponseEntity<Object>(JwtAuthenticationError.getInvalidTokenResult(), HttpStatus.UNAUTHORIZED);
				}
			case Unsupported:
			default:
				errorResult = JwtAuthenticationError.getUnsupportedGrantTypeResult();
				break;
		}

		return new ResponseEntity<Object>(errorResult, HttpStatus.BAD_REQUEST);
	}

	private GrantType getGrantType(final String grantType) {
		if (!StringUtils.hasLength(grantType)) return GrantType.Unsupported;
		if (grantType.contains(BEARER_GRANT_TYPE)) return GrantType.Access;
		return GrantType.Unsupported;
	}

}
