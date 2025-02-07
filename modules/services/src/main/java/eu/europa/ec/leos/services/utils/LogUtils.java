package eu.europa.ec.leos.services.utils;

import lombok.experimental.UtilityClass;
import org.slf4j.Logger;

import java.util.function.BiConsumer;

@UtilityClass
public class LogUtils {

    private static final BiConsumer<String, Logger> debug = (s, logger)-> {
        if (logger.isDebugEnabled()) {
            logger.debug(s);
        }
    };

    private static final BiConsumer<String, Logger> info = (s, logger)-> {
        if (logger.isInfoEnabled()) {
            logger.info(s);
        }
    };

    public static String logDebug(Logger log, String text, String ... stringArgs) {
        return log(debug, log, text, stringArgs);
    }

    public static String logInfo(Logger log, String text, String ... stringArgs) {
        return log(info, log, text, stringArgs);
    }

    private static String log(BiConsumer<String, Logger> consumer, Logger log, String text, String ... stringArgs) {
        final String s = String.format(text, stringArgs);
        consumer.accept(s, log);
        return s;
    }


}
