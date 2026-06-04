package eu.europa.ec.leos.repository.services;

import eu.europa.ec.leos.repository.exceptions.RepositoryException;
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

    public String resolve(String template, Locale locale, boolean requireTranslation) throws RepositoryException {

        Pattern pattern = Pattern.compile("\\{\\{(.+?)\\}\\}");
        Matcher matcher = pattern.matcher(template);

        validateAvailableTranslation(locale, matcher, requireTranslation);

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

    private void validateAvailableTranslation(Locale locale, Matcher matcher, boolean requireTranslation) throws RepositoryException {
        if (requireTranslation) {
            String resourcePath = "message_" + locale.getLanguage() + ".properties";
            if (getClass().getClassLoader().getResource(resourcePath) == null) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.TRANSLATION_NOT_FOUND, locale.getLanguage());
            }
            if (!matcher.find() && !Locale.ENGLISH.equals(locale)) {
                throw new RepositoryException(RepositoryException.RepositoryExceptionCode.TRANSLATION_NOT_FOUND, locale.getLanguage());
            }
            matcher.reset();
        }
    }

}
