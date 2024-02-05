package eu.europa.ec.leos.api.auth;

import eu.europa.ec.leos.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwtAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Autowired
    private TokenService tokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) {
        String username = authentication.getName();
        String token = tokenService.getNgAccessToken(username);
        Cookie cookie = new Cookie("Authorization", token);
        cookie.setPath(request.getContextPath());
        cookie.setMaxAge(-1);
        cookie.setHttpOnly(true); // set the HttpOnly flag to prevent XSS attacks
        cookie.setSecure(true); // set the Secure flag to prevent network eavesdropping
        response.addCookie(cookie);
    }
}
