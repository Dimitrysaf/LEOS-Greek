package eu.europa.ec.leos.services.leoslight;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;

import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.Date;

public class TestTokenGenerator {

    public static void main(String a[]) {
        TestTokenGenerator tokenGenerator = new TestTokenGenerator();
        try {
            Algorithm algorithm = Algorithm.HMAC256("dgtSecret");
            JWTCreator.Builder builder = tokenGenerator.generateTokenBuilder("demo", "dgtClientId", null, null, new Date(), new Date(), 525600);
            String token = builder.sign(algorithm);
            System.out.println("Token generated successfully");
            System.out.println(token);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    private JWTCreator.Builder generateTokenBuilder(String user, String clientId, String subject, String audience, Date issuedAt, Date notBefore,
                                                    int expireInMin) {
        JWTCreator.Builder builder = null;
        try {
            Calendar expires = Calendar.getInstance();
            expires.add(Calendar.MINUTE, expireInMin);
            Date expiresAt = expires.getTime();
            builder = JWT.create()
                    .withClaim("user", user)
                    .withIssuer(clientId)
                    .withSubject(subject)
                    .withAudience(audience)
                    .withIssuedAt(issuedAt)
                    .withNotBefore(notBefore)
                    .withExpiresAt(expiresAt);

        } catch (JWTCreationException e) {
            System.out.println("JWTCreationException "+e.getMessage());
        }
        return builder;
    }
}
