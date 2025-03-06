package eu.europa.ec.leos.services.label.ref;

import eu.europa.ec.leos.services.support.XercesUtils;
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
import static sun.security.x509.X509CertImpl.SIGNATURE;

@Component
public class LabelSignatureElementsOnly extends LabelHandler {
    
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
        TreeNode ref = refs.get(0); //first from the selected nodes
        String documentRef = ref.getDocumentRef();
        Map<String, LabelKey> bufferLabels = new LinkedHashMap<>(); //util buffer to group by the numbers by element

        int number = 1;
        if (refs.size() > 1) {
            number = 0;
        }

        // 1. add selected node in the buffer
        StringBuilder sb = SIGNATURE.equals(ref.getType()) ? new StringBuilder(createAnchor(refs.get(0), mrefCommonNodes, locale, withAnchor)) :
                new StringBuilder();
        bufferLabels.put(ref.getType(), new LabelKey(ref.getType(), sb.toString(), isUnnumbered(ref), documentRef));

        //2. add rest of nodes, starting from the leaf, going up to parents until it reach Signature
        while (!SIGNATURE.equals(ref.getType()) && ref.getParent()!= null) {
            ref = ref.getParent();
            processOtherNodesLabel(bufferLabels, ref, mrefCommonNodes, locale);
        }

        // 3. build the label based on the bufferLabels
        List<String> listLabels = new ArrayList<>();
        List<String> orderedKeys = new ArrayList<>(bufferLabels.keySet());
        /**
         * The order of the words unnumbered or the word "this". Ex:
         */
        String lastElementKeyOfOrderedKeys = orderedKeys.get(orderedKeys.size()-1);
        int numberForOrderedKeys = 1;
        for (String key : orderedKeys) {
            LabelKey val = bufferLabels.get(key);
            /* The number variable when has 0 is to do the plural
             *  But the plural is done only in the last word
             *  So, numberForOrderedKeys will be 0 only for the last word
             */
            if (number == 0 && key.equals(lastElementKeyOfOrderedKeys)) {
                numberForOrderedKeys = 0;
            }
            // when we are here we are sure the node is not "this" nor with an empty number string.
            addLabel(listLabels, val, numberForOrderedKeys, locale);
        }

        label.append(String.join(" of ", listLabels));
        if (capital) {
            Node node = XercesUtils.createXercesDocument(("<fakeNodeToReadTextContent>" + label + "</fakeNodeToReadTextContent>").getBytes(), false);
            String onlyText = XercesUtils.getContentByTagName(node, "fakeNodeToReadTextContent");
            String firstWord = onlyText.split(" ")[0].replaceAll(",", "");
            int firstWordPosition = label.indexOf(firstWord);
            label.setCharAt(firstWordPosition, label.substring(firstWordPosition, firstWordPosition+1).toUpperCase(Locale.ROOT).charAt(0));
        }
        if(label.length() > 1 && label.substring(label.length()-2, label.length()).equals(", ")){
            label.delete(label.length()-2, label.length());
        }
    }
    /**
     * We print first the number(in letters) then the label.
     */
    private void addLabel(List<String> listLabels, LabelKey val, int number, Locale locale) {
        listLabels.add(String.format("%s %s", val.getLabelNumber(), NumFormatter.formatPlural(val.getLabelName(), number, locale)));
    }

    private void processOtherNodesLabel(Map<String, LabelKey> buffers, TreeNode ref, List<TreeNode> mrefCommonNodes, Locale locale) {
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
