package eu.europa.ec.leos.services.label.ref;

import eu.europa.ec.leos.services.support.XmlUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static eu.europa.ec.leos.services.label.ref.NumFormatter.isUnnumbered;
import static eu.europa.ec.leos.services.support.XmlHelper.ORGANIZATION;
import static eu.europa.ec.leos.services.support.XmlHelper.PERSON;
import static eu.europa.ec.leos.services.support.XmlHelper.ROLE;

@Component
public class LabelSignatureElementsOnly extends LabelHandler {
    public static final String SIGNATURE = "signature";
    
    private static final List<String> NODES_TO_CONSIDER = Arrays.asList(SIGNATURE, ROLE, PERSON, ORGANIZATION);
    
    @Override
    public boolean canProcess(List<TreeNode> refs) {
        boolean canProcess = refs.stream()
                .allMatch(ref -> NODES_TO_CONSIDER.contains(ref.getType()));
        return canProcess;
    }
    
    
    /**
     * This label processor shows only the type name as label, without calculating any numbering.
     */
    @Override
    public void process(List<TreeNode> refs, List<TreeNode> mrefCommonNodes, TreeNode sourceNode, StringBuffer label, Locale locale, boolean withAnchor,
                        boolean capital) {
        List<String> listLabels = new ArrayList<>();
        for (TreeNode ref : refs) {
            listLabels.add(processRef(ref, mrefCommonNodes, sourceNode, locale, withAnchor, capital));
        }
        label.append(String.join(" and ", listLabels));
    }

    private String processRef(TreeNode ref, List<TreeNode> mrefCommonNodes, TreeNode sourceNode, Locale locale, boolean withAnchor,
                              boolean capital) {
        StringBuffer label = new StringBuffer();
        String documentRef = ref.getDocumentRef();
        Map<String, LabelKey> bufferLabels = new LinkedHashMap<>();
        Map<String, TreeNode> bufferRefs = new LinkedHashMap<>();

        // 1. add selected node in the buffer
        StringBuilder sb = SIGNATURE.equals(ref.getType()) ? new StringBuilder(NumFormatter.formattedNum(ref, mrefCommonNodes, locale)) :
                new StringBuilder();
        bufferLabels.put(ref.getType(), new LabelKey(ref.getType(), sb.toString(), isUnnumbered(ref), documentRef));
        bufferRefs.put(ref.getType(), ref);

        //2. add rest of nodes, starting from the leaf, going up to parents until it reach Signature
        while (!SIGNATURE.equals(ref.getType()) && ref.getParent()!= null) {
            ref = ref.getParent();
            processLabel(bufferLabels, ref, mrefCommonNodes, locale);
            bufferRefs.put(ref.getType(), ref);
        }

        // 3. build the label based on the bufferLabels
        List<String> listLabels = new ArrayList<>();
        List<String> orderedKeys = new ArrayList<>(bufferLabels.keySet());
        int index = 0;
        for (String key : orderedKeys) {
            LabelKey val = bufferLabels.get(key);
            TreeNode reference = bufferRefs.get(key);
            addLabel(listLabels, reference, val, index, 1, locale);
            index++;
        }

        label.append(String.join(" of ", listLabels));
        if (capital) {
            Node node = XmlUtils.createDocument(("<fakeNodeToReadTextContent>" + label + "</fakeNodeToReadTextContent>").getBytes(), false);
            String onlyText = XmlUtils.getContentByTagName(node, "fakeNodeToReadTextContent");
            String firstWord = onlyText.split(" ")[0].replaceAll(",", "");
            int firstWordPosition = label.indexOf(firstWord);
            label.setCharAt(firstWordPosition, label.substring(firstWordPosition, firstWordPosition+1).toUpperCase(Locale.ROOT).charAt(0));
        }
        if(label.length() > 1 && label.substring(label.length()-2, label.length()).equals(", ")){
            label.delete(label.length()-2, label.length());
        }
        return label.toString();
    }
    /**
     * We print first the number(in letters) then the label.
     */
    private void addLabel(List<String> listLabels, TreeNode ref, LabelKey val, int index, int number, Locale locale) {
        if (index == 0) {
            StringBuilder builder = new StringBuilder("<ref");
            builder.append(" href=\"").append(ref.getDocumentRef() + ".xml").append("/").append("~" + ref.getIdentifier()).append("\"");
            if (ref.getOrigin() != null) {
                builder.append(" leos:origin=\"").append(ref.getOrigin()).append("\"");
            }
            builder.append(" xml:id=\"").append(ref.getRefId()).append("\">");
            if (StringUtils.isBlank(val.getLabelNumber())) {
                builder.append(NumFormatter.formatPlural(val.getLabelName(), number, locale));
            } else {
                builder.append(val.getLabelNumber());
            }
            builder.append("</ref>");
            if (!StringUtils.isBlank(val.getLabelNumber())) {
                builder.append(String.format(" %s", NumFormatter.formatPlural(val.getLabelName(), number, locale)));
            }
            listLabels.add(builder.toString());
        } else {
            listLabels.add(StringUtils.isBlank(val.getLabelNumber()) ? NumFormatter.formatPlural(val.getLabelName(), number, locale) :
                    String.format("%s %s", val.getLabelNumber(), NumFormatter.formatPlural(val.getLabelName(),
                    number, locale)));
        }
    }

    private void processLabel(Map<String, LabelKey> buffers, TreeNode ref, List<TreeNode> mrefCommonNodes, Locale locale) {
        // keep the old value if is sameType as the child. Last iterated parent will add the element name.
        String oldnum = "";
        if (ref.getChildren().get(0).getType().equals(ref.getType())) {
            if (buffers.get(ref.getType()) != null) {
                oldnum = buffers.get(ref.getType()).getLabelNumber();
            }
        }

        String labelName = ref.getType();
        String labelNumber = NumFormatter.formattedNum(ref, mrefCommonNodes, locale) + oldnum;

        buffers.put(ref.getType(), new LabelKey(labelName, labelNumber, isUnnumbered(ref), ref.getDocumentRef()));
    }

    @Override
    public int getOrder() {
        return 6;
    }
}
