package eu.europa.ec.leos.services.numbering.processor;

import eu.europa.ec.leos.i18n.MessageHelper;
import eu.europa.ec.leos.security.SecurityContext;
import eu.europa.ec.leos.services.numbering.NumberProcessorHandler;
import eu.europa.ec.leos.services.numbering.config.NumberConfig;
import eu.europa.ec.leos.services.tracking.TrackChangesContext;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;

import java.util.Arrays;

import static eu.europa.ec.leos.services.support.XmlHelper.CHAPTER;
import static eu.europa.ec.leos.services.support.XmlHelper.PART;
import static eu.europa.ec.leos.services.support.XmlHelper.RECITAL;
import static eu.europa.ec.leos.services.support.XmlHelper.SECTION;
import static eu.europa.ec.leos.services.support.XmlHelper.TITLE;

@Component
public class NumberProcessorDefault extends NumberProcessorAbstract implements NumberProcessor {

    public NumberProcessorDefault(MessageHelper messageHelper, NumberProcessorHandler numberProcessorHandler, SecurityContext securityContext, TrackChangesContext trackChangesContext) {
        super(messageHelper, numberProcessorHandler, securityContext, trackChangesContext);
    }

    /**
     * Default NumberProcessor with no propagation to the children.
     * List each new element with the same behaviour like this:
     * -    Arrays.asList(RECITAL, NEW_ELEMENT1, NEW_ELEMENT2).contains(node.getNodeName())
     */
    @Override
    public boolean canRenumber(Node node) {
        return Arrays.asList(RECITAL, PART, TITLE, CHAPTER, SECTION).contains(node.getNodeName());
    }

    @Override
    public void renumber(Node node, NumberConfig numberConfig, boolean numberChildren, String language) {
        renumber(node, numberConfig, "");
        renumberChildren(node, numberChildren, language);
    }

    protected void renumberChildren(Node node, boolean numberChildren, String language) {
        // no propagation for the default implementation
    }

}
