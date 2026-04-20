package eu.europa.ec.leos.filter;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MaxUploadSizeFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException { }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String contentType = httpRequest.getContentType();
        if (contentType != null && contentType.startsWith("multipart/form-data")) {
            long contentLength = httpRequest.getContentLengthLong();
            if (contentLength > 104857600L) { // 100MB
                httpResponse.setStatus(413);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("page.collection.drafts.annex.max.size.error");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() { }

}

