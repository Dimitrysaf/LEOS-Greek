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
package eu.europa.ec.leos.repository.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import eu.europa.ec.leos.repository.security.service.JwtTokenService;

public class JwtTokenServiceTest {

    @InjectMocks
    private JwtTokenService jwtTokenService = new JwtTokenService();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Disabled
    @Test
    public void test_printToken() {
        String issuer = "leosClientId";
        String secret = "leosSecret";
        String user = "demo";

        String token = jwtTokenService.generateToken(issuer, secret, user);
        String tokenUser = jwtTokenService.extractUserFromToken(token);

        System.out.println("Token => " + token);
        System.out.println("User => " + tokenUser);
    }

}
