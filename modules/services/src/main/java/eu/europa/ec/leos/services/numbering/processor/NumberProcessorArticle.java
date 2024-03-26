package eu.europa.ec.leos.services.numbering.processor;

import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandler;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;

import static eu.europa.ec.leos.services.support.XmlHelper.ARTICLE;
import static eu.europa.ec.leos.services.support.XmlHelper.PARAGRAPH;

@Component
public class NumberProcessorArticle extends NumberProcessorDefault {

    @Autowired
    public NumberProcessorArticle(MessageHelper messageHelper, NumberProcessorHandler numberProcessorHandler, SecurityContext securityContext, TrackChangesContext trackChangesContext) {
        super(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);
    }

    @Override
    public boolean canRenumber(Node node) {
        return ARTICLE.equals(node.getNodeName());
    }

    protected void renumberChildren(Node node, boolean numberChildren, String language) {
        if (numberChildren) {
            numberProcessorHandler.renumberElement(node, PARAGRAPH, numberChildren, language);
        }
    }

}
