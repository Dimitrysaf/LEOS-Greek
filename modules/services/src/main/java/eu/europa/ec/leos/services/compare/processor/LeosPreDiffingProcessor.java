package eu.europa.ec.leos.services.compare.processor;

public class LeosPreDiffingProcessor {

    public static String adjustTrackChanges(String content) {
        content = content.replaceAll("<(inline)", "\n<inline");
        content = content.replaceAll("<(inline)(.*)(leos:action=\\\"insert\\\")(.*)(name=\\\"trackchanges\\\")[^>]*>(.*)</\\1>", "$6");
        content = content.replaceAll("<(inline)(.*)(leos:action=\\\"delete\\\")(.*)(name=\\\"trackchanges\\\")[^>]*>(.*)</\\1>", "");
        content = content.replace("\n", "");
        return content;
    }

}
