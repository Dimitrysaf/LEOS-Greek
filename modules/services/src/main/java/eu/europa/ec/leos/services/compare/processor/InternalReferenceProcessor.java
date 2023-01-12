package eu.europa.ec.leos.services.compare.processor;

import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class InternalReferenceProcessor {

    /**
     * Get the list of xml ids of broken internal references in a string
     * @param content
     * @return list of xml ids of broken internal references
     */
    public List<String> getBrokenInternalReferences(String content)  {

        if (StringUtils.isEmpty(content) || !content.toLowerCase().contains("</mref>")) {
            return null;
        }

        ArrayList<String> list = new ArrayList<>();
        Pattern tagPattern = Pattern.compile("<(\\S+?)(.*?)>(.*?)</\\1>", Pattern.DOTALL);
        Matcher tagMatcher = tagPattern.matcher(content);

        /*
         *   m.group(0) => tag only
         *   m.group(1) => tag name
         *   m.group(2) => tag attributes
         *   m.group(3) => tag content
         */
        while (tagMatcher.find()) {

            String tagName = tagMatcher.group(1);
            String tagAttributes = tagMatcher.group(2);
            String tagXmlId = "xml:id";
            if(tagAttributes.contains(" id")) {
                tagXmlId = "id";
            }

            if(tagName.equalsIgnoreCase("mref")) {

                Pattern xmlIdPattern = Pattern.compile("[\\s\\S]*?" + tagXmlId + "=\"(?<gXmlId>[\\s\\S]*?)\"[\\s\\S]*?", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
                Matcher xmlIdMatcher = xmlIdPattern.matcher(tagAttributes);
                xmlIdMatcher.find();
                String xmlId = xmlIdMatcher.group("gXmlId");

                Pattern brokenPattern = Pattern.compile("[\\s\\S]*?leos:broken=\"(?<gBroken>[\\s\\S]*?)\"[\\s\\S]*?", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
                Matcher brokenMatcher = brokenPattern.matcher(tagAttributes);

                String broken = "";
                if (brokenMatcher.find()) {
                    broken = brokenMatcher.group("gBroken");
                }

                if (broken.equalsIgnoreCase("true")) {
                    list.add(xmlId);
                }

            }

        }

        return list;

    }

    public String removeBrokenAttributeFromInternalReferences(String content) {
        content = content.replace(" leos:broken=\"true\"", "");
        return content;
    }

    public String addOriginalBrokenAttributeInInternalReferences(List<String> listOfBrokenInternalReferences, String content) {

        if (StringUtils.isEmpty(content) || !content.toLowerCase().contains("</mref>")) {
            return content;
        }
        for (String id : listOfBrokenInternalReferences) {
            content = content.replace("id=\"" + id + "\"", "id=\"" + id + "\" " + "leos:broken=\"true\"");
        }
        return content;

    }

}
