package eu.europa.ec.leos.rest.cache;

import eu.europa.ec.leos.rest.utils.RestUtils;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;
import java.lang.reflect.Method;

@Component("documentByIdKeyGenerator")
public class DocumentByIdKeyGenerator implements KeyGenerator {
    public Object generate(Object target, Method method, Object... params) {
        StringBuilder sb = new StringBuilder();

        if (params != null && params.length > 0) {
            if (params.length == 2) {
                //public <D extends LeosDocument> D findDocumentByRef  String ref, Class<? extends D> type
                return sb.append(params[0]).toString();
            } else if (params.length == 3) {
                //public <D extends LeosDocument> D findDocumentById(String id, Class<? extends D> type, boolean latest)
                if (Boolean.parseBoolean(String.valueOf(params[2]))) {
                    return sb.append(RestUtils.extractRefOrVersionFromId(String.valueOf(params[0]), false)).toString();
                }
                return sb.append(RestUtils.extractRefOrVersionFromId(String.valueOf(params[0]), true)).toString();
            }
        }
        return sb.append(target.getClass().getSimpleName())
                .append("-")
                .append(method.getName())
                .toString();
    }

}
