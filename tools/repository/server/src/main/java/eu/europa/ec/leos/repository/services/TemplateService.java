package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.model.LeosDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TemplateService {

    private static final Logger LOG = LoggerFactory.getLogger(TemplateService.class);

    private final Environment environment;
    private final MessageSource messageSource;

    public TemplateService(Environment environment, MessageSource messageSource) {
        this.environment = environment;
        this.messageSource = messageSource;
    }

    public String resolve(String template, Locale locale) {

        Pattern pattern = Pattern.compile("\\{\\{(.+?)\\}\\}");
        Matcher matcher = pattern.matcher(template);

        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String key = matcher.group(1);
            String message = "";
            try {
                message = messageSource.getMessage(key, null, locale);
            } catch (Exception e) {
                LOG.error("Error resolving template message for key: " + key, e);
            }
            matcher.appendReplacement(result, message);
        }

        matcher.appendTail(result);

        return result.toString();

    }

}
