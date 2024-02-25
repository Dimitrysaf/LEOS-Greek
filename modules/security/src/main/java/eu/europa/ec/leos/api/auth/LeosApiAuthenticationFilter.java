package eu.europa.ec.leos.api.auth;

import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.security.SecurityUser;
import eu.europa.ec.leos.security.SecurityUserProvider;
import eu.europa.ec.leos.security.TokenService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class LeosApiAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    
    private static final Logger LOG = LoggerFactory.getLogger(LeosApiAuthenticationFilter.class);
    private static final String AUTHORIZATION = "Authorization";
    private static final String LIGHT_BEARER_PARAMETER = "Client-Context";
    private TokenService tokenService;
    private SecurityUserProvider securityUserProvider;
    
    public LeosApiAuthenticationFilter(String filterProcessorUrl, TokenService tokenService,
                                       SecurityUserProvider securityUserProvider) {
        super(filterProcessorUrl);
        this.tokenService = tokenService;
        this.securityUserProvider = securityUserProvider;
    }
    
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        PreAuthenticatedAuthenticationToken preAuthRequest;
        JwtAuthenticationToken authRequest;
        String token;
        String userLogin;
        User user;

        if (request.getHeader(AUTHORIZATION) == null || !request.getHeader(AUTHORIZATION).startsWith("Bearer ")) {
            LOG.warn("Authorization failed! Wrong Headers: '{}' is missing or contains a wrong value", AUTHORIZATION);
            throw new LeosApiAuthenticationException("Authorization failed! Wrong Headers: " +
                    "Authorization is missing or contains a wrong value");
        }

        token = request.getHeader(AUTHORIZATION).substring(7);

        if (!tokenService.validateAccessToken(token)) {
            LOG.warn("Authorization failed! Wrong accessToken");
            throw new LeosApiAuthenticationException("Authorization failed! Wrong accessToken");
        }

        userLogin = tokenService.extractUserFromToken(token);

        if(StringUtils.isEmpty(userLogin)) {
            authRequest = new JwtAuthenticationToken();
            authRequest.setAuthenticated(true);
            return getAuthenticationManager().authenticate(authRequest);
        }

        String contextToken = request.getHeader(LIGHT_BEARER_PARAMETER);
        String contextRole = null;
        if(StringUtils.isNotBlank(contextToken)) {
            if (!tokenService.validateClientContextToken(contextToken)) {
                LOG.warn("Authorization failed! Wrong contextToken");
                throw new LeosApiAuthenticationException("Authorization failed! Wrong contextToken");
            }
            if(!tokenService.validateUserFromClientContext(contextToken, token)) {
                LOG.warn("Authorization failed! User mismatch in accessToken & contextToken");
                throw new LeosApiAuthenticationException("Authorization failed! User mismatch in accessToken & contextToken");
            }
            contextRole = tokenService.extractUserRoleFromToken(contextToken);
        }

        user = securityUserProvider.getUserByLogin(userLogin);

        if(user == null) {
            throw new LeosApiAuthenticationException("The provided user login cannot be validated: user login not found");
        }

        preAuthRequest = new PreAuthenticatedAuthenticationToken(user,"", getAuthorities(user, contextRole));
        preAuthRequest.setAuthenticated(true);
        return getAuthenticationManager().authenticate(preAuthRequest);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult)
            throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
        chain.doFilter(request, response);
    }

    private Collection<GrantedAuthority> getAuthorities(User user, String role) {
        List<GrantedAuthority> allRoles = new ArrayList<>();
        if(StringUtils.isNotBlank(role)) {
            allRoles.add(new SimpleGrantedAuthority(role));
        } else if(user instanceof SecurityUser) {
            List<String> leosRoles = ((SecurityUser) user).getRoles();
            leosRoles.forEach(auth -> allRoles.add(new SimpleGrantedAuthority(auth)));
        }
        return allRoles;
    }
}