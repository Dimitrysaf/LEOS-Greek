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

import javax.servlet.http.Cookie;
import java.util.List;
import java.util.Map;

public interface TokenService {
    String getAnnotateToken(String userLogin, String url);

    String getDgtToken(String user);

    String getAccessToken(String user);

    String getNgAccessToken(String user);

    Cookie getNgAccessCookie(String user, String contextPath);

    String getClientContextToken(String clientId, String user, String role, String systemName);

    AuthClient getAuthClient(String clientId);

    AuthClient validateClientByJwtToken(String token);
    
    boolean validateAccessToken(String token);

    boolean validateClientContextToken(String token);

    boolean validateUserFromClientContext(String contextToken, String accessToken);

    String extractUserRoleFromToken(String token);

    String extractUserSystemNameFromToken(String token);

    String extractUserFromToken(String token);

    List<String> getAccessTokenList();

    void setAccessTokenInList(String token);

    void cleanAccessTokenInList();

    Map<String, String> getAccessTokenSessionMap();

    void setAccessTokenMap(String token, String jSessionID);

    void cleanAccessTokenSessionMap();
}