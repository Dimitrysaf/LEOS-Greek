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
package eu.europa.ec.leos.repository.security.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.SecurityConfiguration;
import org.owasp.esapi.StringUtilities;
import org.owasp.esapi.errors.ValidationException;
import org.owasp.esapi.filters.SecurityWrapperRequest;
import org.owasp.esapi.filters.SecurityWrapperResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class XSSFilter implements Filter {

    private static final Logger LOG = LoggerFactory.getLogger(XSSFilter.class);

    public class XSSRequestWrapper extends SecurityWrapperRequest {

        public XSSRequestWrapper(HttpServletRequest request) {
            super(request);
        }

        public String getRequestedSessionId() {
            String id = ((HttpServletRequest)super.getRequest()).getRequestedSessionId();
            String clean = "";
            SecurityConfiguration sc = ESAPI.securityConfiguration();

            try {
                clean = ESAPI.validator().getValidInput("Requested cookie: " + id, id, "HTTPJSESSIONID",
                        sc.getIntProp("HttpUtilities.HTTPJSESSIONIDLENGTH"), true); // allowNull -> true to avoid jsession log error
            } catch (ValidationException var5) {
            }

            return clean;
        }

    }

    /**
     * This is the root path of what resources this filter will allow a RequestDispatcher to be dispatched to. This
     * defaults to WEB-INF as best practice dictates that dispatched requests should be done to resources that are
     * not browsable and everything behind WEB-INF is protected by the container. However, it is possible and sometimes
     * required to dispatch requests to places outside of the WEB-INF path (such as to another servlet).
     *
     * See <a href="http://code.google.com/p/owasp-esapi-java/issues/detail?id=70">http://code.google.com/p/owasp-esapi-java/issues/detail?id=70</a>
     * and <a href="https://lists.owasp.org/pipermail/owasp-esapi/2009-December/001672.html">https://lists.owasp.org/pipermail/owasp-esapi/2009-December/001672.html</a>
     * for details.
     */
    private String allowableResourcesRoot = "WEB-INF";

    /**
     * @param request
     * @param response
     * @param chain
     * @throws java.io.IOException
     * @throws javax.servlet.ServletException
     */
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (!(request instanceof HttpServletRequest)) {
            chain.doFilter(request, response);
            return;
        }

        try {
            XSSRequestWrapper secureRequest = new XSSRequestWrapper((HttpServletRequest)request);
            SecurityWrapperResponse secureResponse = new SecurityWrapperResponse((HttpServletResponse)response);

            // Set the configuration on the wrapped request
            secureRequest.setAllowableContentRoot(allowableResourcesRoot);

            ESAPI.httpUtilities().setCurrentHTTP(secureRequest, secureResponse);

            chain.doFilter(ESAPI.currentRequest(), ESAPI.currentResponse());
        } catch (Exception e) {
            LOG.error("Error in XSSFilter: " + e.getMessage(), e);
            request.setAttribute("message", e.getMessage());
        } finally {
            // VERY IMPORTANT
            // clear out the ThreadLocal variables in the authenticator
            // some containers could possibly reuse this thread without clearing the User
            // Issue 70 - http://code.google.com/p/owasp-esapi-java/issues/detail?id=70
            ESAPI.httpUtilities().clearCurrent();
        }
    }

    /**
     * @param filterConfig
     */
    public void init(FilterConfig filterConfig) {
        this.allowableResourcesRoot = StringUtilities.replaceNull(filterConfig.getInitParameter("allowableResourcesRoot"),
                allowableResourcesRoot);
    }

    /**
     *
     */
    public void destroy() {
    }

}
