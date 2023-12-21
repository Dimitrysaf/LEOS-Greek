/*
 * Copyright 2022 European Commission
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
package eu.europa.ec.leos.web.support;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class LeosVaadinAccessFilter implements Filter {

    private static final Logger LOG = LoggerFactory.getLogger(LeosVaadinAccessFilter.class);

    private boolean isLeosVaadinEnabled = false;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOG.debug("LeosVaadinAccessFilter filter init...");
        try {
            Object applicationProperties = WebApplicationContextUtils.
                    getRequiredWebApplicationContext(filterConfig.getServletContext()).
                    getBean("applicationProperties");
            String leosVaadinEnabled = ((Properties) applicationProperties).getProperty("leos.vaadin.enabled", "false");
            isLeosVaadinEnabled = new Boolean(leosVaadinEnabled);
        } catch (Exception e) {
            LOG.error("Could not load property file 'application_leos.properties'. Error: {}", e.getMessage());
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        LOG.debug("LeosVaadinEnabled: {}", isLeosVaadinEnabled);
        if (isLeosVaadinEnabled) {
            chain.doFilter(request, response);
        } else {
            httpServletResponse.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    public void destroy() {
        // do nothing
    }

}
