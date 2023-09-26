package eu.europa.ec.leos.rest.utils;

public interface RestUtils {

    static String extractRefOrVersionFromId(String id, boolean isVersion) {
        int countMatches = isVersion ? 1 : 0;
        String[] ids;
        if(id.indexOf(":") > 0) {
            ids = id.split(":");
        } else {
            ids = id.split(";");
        }
        return  (ids.length  > countMatches) ? ids[countMatches] : null;
    }
}
