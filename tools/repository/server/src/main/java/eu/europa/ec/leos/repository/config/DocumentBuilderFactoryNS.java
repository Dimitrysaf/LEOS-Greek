package eu.europa.ec.leos.repository.config;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

public class DocumentBuilderFactoryNS extends DocumentBuilderFactory {
    private final DocumentBuilderFactory delegate;

    public DocumentBuilderFactoryNS(DocumentBuilderFactory delegate) {
        this.delegate = delegate;
        this.delegate.setNamespaceAware(true);
    }

    @Override
    public DocumentBuilder newDocumentBuilder() throws ParserConfigurationException {
        return delegate.newDocumentBuilder();
    }

    @Override
    public void setAttribute(String name, Object value) throws IllegalArgumentException {
        delegate.setAttribute(name, value);
    }

    @Override
    public Object getAttribute(String name) throws IllegalArgumentException {
        return delegate.getAttribute(name);
    }

    @Override
    public void setFeature(String name, boolean value) throws ParserConfigurationException {
        delegate.setFeature(name, value);
    }

    @Override
    public boolean getFeature(String name) throws ParserConfigurationException {
        return delegate.getFeature(name);
    }

    /**
     * Always set namespace awareness to true.
     */
    @Override
    public void setNamespaceAware(boolean awareness) {
        delegate.setNamespaceAware(true);
    }

    @Override
    public void setValidating(boolean validating) {
        delegate.setValidating(validating);
    }

    @Override
    public void setIgnoringElementContentWhitespace(boolean whitespace) {
        delegate.setIgnoringElementContentWhitespace(whitespace);
    }

    @Override
    public void setExpandEntityReferences(boolean expandEntityRef) {
        delegate.setExpandEntityReferences(expandEntityRef);
    }

    @Override
    public void setIgnoringComments(boolean ignoreComments) {
        delegate.setIgnoringComments(ignoreComments);
    }

    @Override
    public void setCoalescing(boolean coalescing) {
        delegate.setCoalescing(coalescing);
    }

    @Override
    public void setXIncludeAware(boolean state) {
        delegate.setXIncludeAware(state);
    }

    @Override
    public boolean isNamespaceAware() {
        return delegate.isNamespaceAware();
    }

    @Override
    public boolean isValidating() {
        return delegate.isValidating();
    }

    @Override
    public boolean isIgnoringElementContentWhitespace() {
        return delegate.isIgnoringElementContentWhitespace();
    }

    @Override
    public boolean isExpandEntityReferences() {
        return delegate.isExpandEntityReferences();
    }

    @Override
    public boolean isIgnoringComments() {
        return delegate.isIgnoringComments();
    }

    @Override
    public boolean isCoalescing() {
        return delegate.isCoalescing();
    }

    @Override
    public boolean isXIncludeAware() {
        return delegate.isXIncludeAware();
    }

    @Override
    public void setSchema(javax.xml.validation.Schema schema) {
        delegate.setSchema(schema);
    }

    @Override
    public javax.xml.validation.Schema getSchema() {
        return delegate.getSchema();
    }
}
