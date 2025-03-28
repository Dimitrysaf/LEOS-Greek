package eu.europa.ec.leos.services.label.ref;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.function.Function;

import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;

abstract public class LabelHandler {
    protected final String THIS_REF = "this";
    protected final String ANNEX_FILE_PREFIX = "annex";
    
    abstract public boolean canProcess(List<TreeNode> refs);
    
    abstract public void process(List<TreeNode> refs, List<TreeNode> mrefCommonNodes, TreeNode sourceNode, StringBuffer label, Locale locale, boolean withAnchor,
                                 boolean capital);

    abstract public int getOrder();

    protected String createAnchor(TreeNode ref, List<TreeNode> mrefCommonNodes, Locale locale, boolean withAnchor) {
        final String rv;
        if(withAnchor) {
            StringBuilder builder = new StringBuilder("<ref");
            builder.append(" href=\"").append(ref.getDocumentRef()+".xml").append("/").append("~"+ref.getIdentifier()).append("\"");
            if (ref.getOrigin() != null) {
                builder.append(" leos:origin=\"").append(ref.getOrigin()).append("\"");
            }
            builder.append(" xml:id=\"").append(ref.getRefId()).append("\">");
            builder.append(NumFormatter.formattedNum(ref, mrefCommonNodes, locale));
            builder.append("</ref>");
            rv = builder.toString();
        } else {
            rv = NumFormatter.formattedNum(ref, mrefCommonNodes, locale);
        }
        return rv;
    }
    protected final boolean contains(List<TreeNode> node, Function<TreeNode, Object> valueGetter, Object value) {
        for (TreeNode treeNode : node) {
            if (value.equals(valueGetter.apply(treeNode))) {
                return true;
            }
        }
        return false;
    }
    protected final List<TreeNode> seperateNodesOfMaxDepth(List<TreeNode> pendingNodes) {
        List<TreeNode> nodes = new ArrayList<>();
        if (pendingNodes.size() > 0) {
            TreeNode maxDepthNode = pendingNodes.get(0);
            for (TreeNode node : pendingNodes) {
                if (node.getDepth() > maxDepthNode.getDepth()) {
                    maxDepthNode = node;
                }
            }
            for (TreeNode node : pendingNodes) {
                if (node.getDepth() == maxDepthNode.getDepth()) {
                    nodes.add(node);
                }
            }
        }
        return nodes;
    }
    
    protected boolean inThisArticle(List<TreeNode> mrefCommonNodes) {
        return mrefCommonNodes.size() > 0 && ARTICLE.equals(mrefCommonNodes.get(0).getType());
    }

    public void addPreffix(StringBuffer label, String docType, List<TreeNode> refs) {
    }

    public void addSuffix(StringBuffer label, String docType, List<TreeNode> refs) {
        TreeNode firstReference = refs.stream()
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Selected Internal References cannot be empty"));
        if (firstReference.getDocumentRef() != null
                && firstReference.getDocumentRef().toLowerCase().startsWith(ANNEX_FILE_PREFIX)
                && !StringUtils.isEmpty(docType)) {
            label.append(", of ");
            label.append(docType);
        }
    }

}
