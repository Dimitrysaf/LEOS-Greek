package eu.europa.ec.leos.rest.cache;

import java.lang.reflect.Method;

import eu.europa.ec.leos.rest.utils.RestUtils;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

@Component("referenceFromIdKeyGenerator")
public class ReferenceFromIdKeyGenerator implements KeyGenerator {
    public Object generate(Object target, Method method, Object... params) {
        StringBuilder sb = new StringBuilder();

        if (params != null && params.length > 0) {
            return sb.append(RestUtils.extractRefOrVersionFromId(String.valueOf(params[0]), false)).toString();
        }
        return sb.append(target.getClass().getSimpleName())
                .append("-")
                .append(method.getName())
                .toString();
    }


}
