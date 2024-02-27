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

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import eu.europa.ec.leos.test.support.LeosTest;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

public class TokenServiceTest extends LeosTest {
    
    @InjectMocks
    private TokenService tokenService = new JwtTokenService();
    
    @Test
    public void Test_getAnnotationSecurityToken() throws Exception {
        //Setup
        String issuer = "testIssuer";
        String secret = "testSecret";
        
        ReflectionTestUtils.setField(tokenService, "annotateAuthority", "annotate");
        ReflectionTestUtils.setField(tokenService, "annotateClientId", issuer);
        ReflectionTestUtils.setField(tokenService, "annotateSecret", secret);
        
        //Actual Call
        String ticket = tokenService.getAnnotateToken("login", "https://test.com/abc");
        
        //verification
        assertNotNull(ticket);
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .build();
        //FIXME: enable when python server is removed
        //assertEquals(verifier.verify(ticket).getAudience().get(0), "test.com");
        assertEquals(verifier.verify(ticket).getIssuer(), issuer);
        assertEquals(verifier.verify(ticket).getSubject(), "acct:login@annotate");
    }
    
    @Test
    public void Test_getAccessToken() {
        //Given
        String serverId = "LeosApiId";
        String serverSecret = "LeosApiSecret";
        ReflectionTestUtils.setField(tokenService, "leosApiId", serverId);
        ReflectionTestUtils.setField(tokenService, "leosApiSecret", serverSecret);
        ReflectionTestUtils.setField(tokenService, "accessTokenExpirationInMin", 1);
        String user = "demo";
        //When
        String accessToken = tokenService.getAccessToken(user);
        boolean isValid = tokenService.validateAccessToken(accessToken);
        
        //Then
        assertNotNull(accessToken);
        assertTrue(isValid);
    }
    
    @Test
    public void Test_validateJwtToken() throws Exception {
        //Given
        String serverId = "leosApiId";
        String serverSecret = "leosApiSecret";
        String clientName = "fakeClientName";
        String clientId = "fakeClientName";
        String clientSecret = "clientSecret";
        String clientSubject = "acc:jane@DEMO";
        String clientUser = "jane";
        List<AuthClient> registeredClients = Arrays.asList(new AuthClient("name1", "id1", "secret1"),
                           new AuthClient("name2", "id2", "secret2"),
                           new AuthClient(clientName, clientId, clientSecret)) ;
        ReflectionTestUtils.setField(tokenService, "leosApiId", serverId);
        ReflectionTestUtils.setField(tokenService, "leosApiSecret", serverSecret);
        ReflectionTestUtils.setField(tokenService, "registeredClients", registeredClients);
        ReflectionTestUtils.setField(tokenService, "accessTokenExpirationInMin", 1);
        
        //When
        String accessToken = generateJwtToken(clientId, clientSecret, clientSubject, clientUser); //we create token for client "fakeClientName"
        AuthClient authClient = tokenService.validateClientByJwtToken(accessToken); //the token should have been verified by the secret of the same client. Check the logs!
        
        //Then
        assertNotNull(accessToken);
        assertNotNull(authClient);
        assertTrue(authClient.isVerified());
    }

    @Test
    public void test_validate_client_context_token() throws Exception {
        String clientId = "dgtClientId";
        String clientSecret = "dgtSecret";
        String clientSubject = "acc:demo@demo";
        String clientUser = "luke";
        String clioentRole = "OWNER";
        String clientSystemName = "DGT_EDIT";

        List<AuthClient> registeredClients = Arrays.asList(new AuthClient("DGT", "dgtClientId", "dgtSecret"));
        ReflectionTestUtils.setField(tokenService, "registeredClients", registeredClients);

        String token = generateJwtTokenWithLightSecurityContext(clientId, clientSecret, clientSubject, clientUser, clioentRole, clientSystemName);

        boolean result = tokenService.validateClientContextToken(token);

        assertTrue(result);
    }
    
    private String generateJwtToken(String issuer, String secret, String subject, String user) throws UnsupportedEncodingException {
        Date now = Calendar.getInstance().getTime();
        Algorithm algorithm = Algorithm.HMAC256(secret);
        String token = com.auth0.jwt.JWT.create()
                .withIssuer(issuer)
                .withSubject(subject)
                .withIssuedAt(now)
                .withClaim("user", user)
                .sign(algorithm);
        return token;
    }

    private String generateJwtTokenWithLightSecurityContext(String issuer, String secret, String subject, String user, String role, String systemName) throws UnsupportedEncodingException {
        Date now = Calendar.getInstance().getTime();
        Algorithm algorithm = Algorithm.HMAC256(secret);
        String token = com.auth0.jwt.JWT.create()
                .withIssuer(issuer)
                .withSubject(subject)
                .withIssuedAt(now)
                .withClaim("user", user)
                .withClaim("role", role)
                .withClaim("systemName", systemName)
                .sign(algorithm);
        return token;
    }

    @Ignore
    @Test
    public void test_printTokenWithLightSecurityContext() throws Exception {
        String clientId = "dgtClientId";
        String clientSecret = "dgtSecret";
        String clientSubject = "acc:demo@demo";
        String clientUser = "luke";
        String clioentRole = "OWNER";
        String clientSystemName = "DGT_EDIT";

        String token = generateJwtTokenWithLightSecurityContext(clientId, clientSecret, clientSubject, clientUser, clioentRole, clientSystemName);
        System.out.println(token);
    }

    @Ignore
    @Test
    public void test_printToken() throws Exception {
        //LOCAL/DEV ISC
        String clientId = "dgtClientId";
        String clientSecret = "dgtSecret";
        String clientSubject = "acc:demo@demo";
        String clientUser = "admin";

        String token = generateJwtToken(clientId, clientSecret, clientSubject, clientUser);
        System.out.println(token);
    }

    @Ignore
    @Test
    public void test_printDecodedToken(){
        String token = "insert_token_here";
        DecodedJWT decodedToken = JWT.decode(token);
        System.out.println(decodedToken);
    }

}