package eu.europa.ec.leos.api.auth;

import eu.europa.ec.leos.security.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwtAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private static final Logger LOG = LoggerFactory.getLogger(JwtAuthenticationSuccessHandler.class);

    @Value("${leos.mapping.url}")
    private String leosMappingUrl;

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
        cookie.setSecure(isSecureConnection()); // set the Secure flag to prevent network eavesdropping
        response.addCookie(cookie);
    }

    private boolean isSecureConnection() {
        // Cannot be used "request.isSecure()" to check connection because LEOS can be behind a load balancer
        // with HTTPS in front but that sends to server behind requests on HTTP and not HTTPS
        boolean isSecureConnection = leosMappingUrl.startsWith("https://");
        if (!isSecureConnection) {
            LOG.warn("Authorization cookie created is not secure. Application is under a HTTP connection!");
        }
        return isSecureConnection;
    }
}
