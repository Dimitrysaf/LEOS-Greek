/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.digit.leos.pilot.export.service.processor.node;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class XmlNodeConfig {
    public final String xPath;
    public final List<Attribute> attributes;
    public final boolean create;
    public final boolean delete;
    public final String xPathParent;    // xPath to the element that should be deleted (including all children)

    public XmlNodeConfig(String xpath, boolean create, List<Attribute> attributes) {
        this.xPath = xpath;
        this.attributes = Collections.unmodifiableList(attributes);
        this.create = create;
        this.delete = false;
        xPathParent = null;
    }

    public XmlNodeConfig(String xPath, boolean create, List<Attribute> attributes, boolean delete, String xPathParent) {
        this.xPath = xPath;
        this.attributes = Collections.unmodifiableList(attributes);
        this.create = create;
        this.delete = delete;
        this.xPathParent = xPathParent;
    }

    public static class Attribute {
        public final String name;
        public final String value;
        public final String parent;

        public Attribute(String name, String value, String parent) {
            this.name = name;
            this.value = value;
            this.parent = parent;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            Attribute attribute = (Attribute) o;
            return Objects.equals(name, attribute.name) &&
                    Objects.equals(value, attribute.value) &&
                    Objects.equals(parent, attribute.parent);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, value, parent);
        }
    }
}
