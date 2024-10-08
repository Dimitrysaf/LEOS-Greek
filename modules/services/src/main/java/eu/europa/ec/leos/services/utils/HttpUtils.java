package eu.europa.ec.leos.services.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import lombok.experimental.UtilityClass;

import java.util.Optional;

@UtilityClass
public class HttpUtils {
    public static final int BEARER_LENGTH = 7;
    public static final String CLAIM_SYSTEM_CLIENT_ID = "systemClientId";

    public static Optional<String> extractSystemClientIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader==null && authorizationHeader.length()<BEARER_LENGTH) {
            return Optional.empty();
        }
        String token = extractToken(authorizationHeader);

        return extractStringClaimFromToken(token, CLAIM_SYSTEM_CLIENT_ID);
    }

    public static String extractToken(String authorizationHeader) {
        return authorizationHeader.substring(BEARER_LENGTH);
    }

    public Optional<String> extractStringClaimFromToken(String token, String claimString) {
        Claim claim = JWT.decode(token).getClaim(claimString);
        if(claim.isNull()){
            return Optional.empty();
        }
        return Optional.of(claim.asString());
    }
}
