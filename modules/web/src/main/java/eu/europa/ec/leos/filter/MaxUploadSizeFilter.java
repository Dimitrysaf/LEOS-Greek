package eu.europa.ec.leos.filter;

import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

        // Verifica Content-Length ANTES do multipart parsing
        String contentType = httpRequest.getContentType();
        if (contentType != null && contentType.startsWith("multipart/form-data")) {
            long contentLength = httpRequest.getContentLengthLong();
            if (contentLength > 209715200L) { // 200MB
                httpResponse.setStatus(413);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("Invalid file");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() { }

}

