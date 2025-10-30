package eu.europa.ec.leos.services.filter;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class RemoveCacheControlFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(request, new HttpServletResponseWrapper((HttpServletResponse) response) {
            @Override
            public void setHeader(String name, String value) {
                if (!"Cache-Control".equalsIgnoreCase(name)) {
                    super.setHeader(name, value);
                }
            }

            @Override
            public void addHeader(String name, String value) {
                if (!"Cache-Control".equalsIgnoreCase(name)) {
                    super.addHeader(name, value);
                }
            }
        });
    }

    @Override
    public void destroy() {

    }
}
