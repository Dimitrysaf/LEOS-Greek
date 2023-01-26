package eu.europa.ec.leos.ui.component.toc;

import com.google.common.eventbus.EventBus;
import com.vaadin.ui.UI;
import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.services.processor.content.XmlContentProcessor;
import eu.europa.ec.leos.services.support.XercesUtils;
import org.vaadin.dialogs.ConfirmDialog;
import org.w3c.dom.Node;

import java.util.List;
import java.util.function.BiConsumer;

import static eu.europa.ec.leos.services.support.XmlHelper.LEOS_EDITABLE_ATTR;

public class CheckDeleteLastEditingChildTypeConsumer implements BiConsumer<String, Runnable> {

    private final byte[] xmlContent;
    private final XmlContentProcessor xmlContentProcessor;
    private final MessageHelper messageHelper;
    private final EventBus eventBus;

    public CheckDeleteLastEditingChildTypeConsumer(byte[] xmlContent, XmlContentProcessor xmlContentProcessor,
                                                   MessageHelper messageHelper, EventBus eventBus) {
        this.xmlContent = xmlContent;
        this.xmlContentProcessor = xmlContentProcessor;
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
        Node itemNode = XercesUtils.getElementById(xmlContent, elementId);
        // the TableOfContentItemVO.getNode() method returns either the current element or the parent (if it is the last one).
        String nodeId = XercesUtils.getId(itemNode);
        String nodeName = itemNode.getNodeName();
        Node nodeForSearch = itemNode.getParentNode();
        List<Node> nodeList =  XercesUtils.getChildren(nodeForSearch, nodeName);
        // remove the node corresponding to elementID and also the nodes that are not editable.
        nodeList.removeIf(node -> XercesUtils.getId(node).equals(nodeId) || !XercesUtils.getAttributeValueAsSimpleBoolean(node, LEOS_EDITABLE_ATTR));
        return nodeList.isEmpty();
    }
}
