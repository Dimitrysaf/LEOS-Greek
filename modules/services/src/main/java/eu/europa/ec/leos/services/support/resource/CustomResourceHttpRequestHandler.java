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
package eu.europa.ec.leos.services.support.resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class CustomResourceHttpRequestHandler extends ResourceHttpRequestHandler implements BeanFactoryPostProcessor {

    private static final Logger logger = LoggerFactory.getLogger(CustomResourceHttpRequestHandler.class);

    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, IOException {
        Resource resource = this.getResource(request);
        if (resource == null) {
            String path = this.processPathAndRemoveParams((String)request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE));
            String fileName = StringUtils.getFilename(path);
            String fileNameExtension = StringUtils.getFilenameExtension(path);
            logger.debug("Resource null for path {} and file extension {}", path, fileNameExtension);
            if (!StringUtils.hasText(fileNameExtension)) { // Main URL - No resource -> index.html
                request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "index.html");
            } else if (StringUtils.hasText(fileName) && !path.startsWith("assets/")) { // Resource not in assets -> root folder
                request.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, fileName);
            }
        }
        super.handleRequest(request, response);
    }

    private String processPathAndRemoveParams(String path) {
        path = path.replaceFirst("\\?.*$", "");
        return this.processPath(path);
    }

    public void postProcessBeanFactory(ConfigurableListableBeanFactory factory)
            throws BeansException {
        String[] names = factory.getBeanNamesForType(ResourceHttpRequestHandler.class);
        for (String name : names) {
            BeanDefinition bd = factory.getBeanDefinition(name);
            bd.setBeanClassName("eu.europa.ec.leos.services.support.resource.CustomResourceHttpRequestHandler");
        }
    }
}