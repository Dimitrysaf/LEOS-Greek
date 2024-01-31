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
package eu.europa.ec.leos.repository.security.model;

import java.util.Objects;

public class JwtAuthenticationError {

    private String error;
    private String description;

    private static final String ERROR_INVALID_REQUEST = "invalid_request";
    private static final String ERROR_DESC_INVALID_REQUEST = "invalid request given";
    private static final String ERROR_INVALID_CALL = "invalid_grant";
    private static final String ERROR_DESC_INVALID_GRANT_TYPE = "invalid/unsupported grant type given";
    private static final String ERROR_INVALID_TOKEN = "invalid_token";
    private static final String ERROR_DESC_INVALID_TOKEN = "token is not valid";

    private JwtAuthenticationError(final String error, final String description) {
        this.error = error;
        this.description = description;
    }

    public static JwtAuthenticationError getInvalidRequestResult() {
        return new JwtAuthenticationError(ERROR_INVALID_REQUEST, ERROR_DESC_INVALID_REQUEST);
    }

    public static JwtAuthenticationError getUnsupportedGrantTypeResult() {
        return new JwtAuthenticationError(ERROR_INVALID_CALL, ERROR_DESC_INVALID_GRANT_TYPE);
    }

    public static JwtAuthenticationError getInvalidTokenResult() {
        return new JwtAuthenticationError(ERROR_INVALID_TOKEN, ERROR_DESC_INVALID_TOKEN);
    }

    public String getError() {
        return this.error;
    }

    public String getDescription() {
        return this.description;
    }

    @Override
    public int hashCode() {
        return Objects.hash(error, description);
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        final JwtAuthenticationError other = (JwtAuthenticationError) obj;
        return Objects.equals(this.error, other.error) &&
                Objects.equals(this.description, other.description);
    }

}
