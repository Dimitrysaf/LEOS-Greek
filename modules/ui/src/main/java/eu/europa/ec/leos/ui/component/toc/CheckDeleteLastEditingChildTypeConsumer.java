package eu.europa.ec.leos.ui.component.toc;

import com.google.common.eventbus.EventBus;
import com.vaadin.ui.UI;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.services.support.XercesUtils;
import eu.europa.ec.leos.vo.toc.TableOfContentItemVO;
import org.vaadin.dialogs.ConfirmDialog;
import org.w3c.dom.Node;

import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;

public class CheckDeleteLastEditingChildTypeConsumer implements BiConsumer<String, Runnable> {

    private final MultiSelectTreeGrid<TableOfContentItemVO> tocTree;
    private final MessageHelper messageHelper;
    private final EventBus eventBus;

    public CheckDeleteLastEditingChildTypeConsumer(MultiSelectTreeGrid<TableOfContentItemVO> tocTree, MessageHelper messageHelper, EventBus eventBus) {
        this.tocTree = tocTree;
        this.messageHelper = messageHelper;
        this.eventBus = eventBus;
    }

    @Override
    public void accept(String elementId, Runnable deletionAction) {
        if (isDeletingLastEditingChildType(elementId)) {
            ConfirmDialog confirmDialog = ConfirmDialog.getFactory().create(
                    messageHelper.getMessage("lasteditionelement.confirmation.title"),
                    messageHelper.getMessage("lasteditionelement.deny.message"),
                    messageHelper.getMessage("lasteditionelement.deny.confirm"),
                    null,
                    null);
            confirmDialog.setContentMode(ConfirmDialog.ContentMode.HTML);
            confirmDialog.getContent().setHeightUndefined();
            confirmDialog.setHeightUndefined();
            confirmDialog.getCancelButton().setVisible(false);
            confirmDialog.show(UI.getCurrent(), dialog -> {}, true);
        } else {
            deletionAction.run();
        }
    }

    private boolean isDeletingLastEditingChildType(String elementId) {
        TableOfContentItemVO item = findElementById(elementId, tocTree.getTreeData().getRootItems()).orElseThrow(() -> new IllegalArgumentException("Element not found by id: " + elementId));
        // the TableOfContentItemVO.getNode() method returns either the current element or the parent (if it is the last one).
        Node itemNode = item.getNode();
        String itemId = item.getId();
        String nodeId = XercesUtils.getId(itemNode);
        String nodeName = itemNode.getNodeName();
        Node nodeForSearch = itemNode.getParentNode();
        if(!nodeId.equals(itemId)){
            // the node is not corresponding to the item Id; maybe is the first in list
            Node rightNode =  XercesUtils.getElementById(itemNode,  itemId,  true);
            nodeName = rightNode.getNodeName();
            nodeForSearch = itemNode;
        }
        List<Node> nodeList =  XercesUtils.getChildren(nodeForSearch, nodeName);
        // remove the node corresponding to elementID and also the nodes that are not editable.
        nodeList.removeIf(node -> XercesUtils.getId(node).equals(itemId) || !XercesUtils.getAttributeValueAsSimpleBoolean(node, "leos:editable") );
        return nodeList.isEmpty();
    }
    private Optional<TableOfContentItemVO> findElementById(String elementId, List<TableOfContentItemVO> children) {
        for (TableOfContentItemVO child : children) {
            if (child.getId().equals(elementId)) {
                return Optional.of(child);
            } else {
                if (child.getChildItems().size() > 0) {
                    Optional<TableOfContentItemVO> item = findElementById(elementId, child.getChildItems());
                    if (item.isPresent()) {
                        return item;
                    }
                }
            }
        }
        return Optional.empty();
    }
}
