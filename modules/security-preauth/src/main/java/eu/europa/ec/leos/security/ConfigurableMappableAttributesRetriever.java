package eu.europa.ec.leos.security;


import org.springframework.security.core.authority.mapping.MappableAttributesRetriever;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class ConfigurableMappableAttributesRetriever implements MappableAttributesRetriever {

    private final Set<String> mappableAttributes;

    public ConfigurableMappableAttributesRetriever() {
        Set<String> attributes = new HashSet<>();
        attributes.add("**"); // Wildcard role from your original security constraint

        this.mappableAttributes = Collections.unmodifiableSet(attributes);
    }

    @Override
    public Set<String> getMappableAttributes() {
        return mappableAttributes;
    }
}