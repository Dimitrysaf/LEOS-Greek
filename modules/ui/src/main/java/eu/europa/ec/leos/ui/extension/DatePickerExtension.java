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
package eu.europa.ec.leos.ui.extension;

import com.google.common.eventbus.EventBus;
import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractField;
import com.vaadin.ui.JavaScriptFunction;
import elemental.json.JsonArray;
import elemental.json.JsonObject;
import eu.europa.ec.leos.web.event.NotificationEvent;
import eu.europa.ec.leos.web.event.view.document.SaveElementRequestEvent;
import eu.europa.ec.leos.web.support.LeosCacheToken;
import org.apache.commons.lang3.Validate;

@StyleSheet({"vaadin://../assets/css/leos-datepicker.css"+ LeosCacheToken.TOKEN,
        "vaadin://../lib/jquery-ui-1.13.2/jquery-ui.css" + LeosCacheToken.TOKEN,
        "vaadin://../lib/jquery-ui-1.13.2/jquery-ui.structure.css"+ LeosCacheToken.TOKEN,
        "vaadin://../lib/jquery-ui-1.13.2/jquery-ui.theme.css"+ LeosCacheToken.TOKEN})
@JavaScript({"vaadin://../js/ui/extension/datePickerConnector.js"+ LeosCacheToken.TOKEN })
public class DatePickerExtension<T extends AbstractField<V>, V> extends LeosJavaScriptExtension {

    private static final long serialVersionUID = 1L;

    private EventBus eventBus;

    public DatePickerExtension(T target, EventBus eventBus) {
        super();
        this.eventBus = eventBus;
        extend(target);
        registerServerSideAPI();
    }

    protected void extend(T target) {
        super.extend(target);
        // handle target's value change
        target.addValueChangeListener(event -> {
            LOG.trace("Target's value changed...");
            // Mark that this connector's state might have changed.
            // There is no need to send new data to the client-side,
            // since we just want to trigger a state change event...
            forceDirty();
        });
    }

    private void registerServerSideAPI() {
        addFunction("saveDocument", new JavaScriptFunction() {
            @Override
            public void call(JsonArray arguments) {
                try {
                    JsonObject data = arguments.get(0);
                    String elementId = data.getString("elementId");
                    String elementType = data.getString("elementType");
                    String elementFragment = data.getString("elementFragment");
                    elementFragment = elementFragment.replaceAll("id", "xml:id");
                    Validate.isTrue(elementFragment.contains(elementType), String.format("Element must be of type %s", elementType));
                    eventBus.post(new SaveElementRequestEvent(elementId, elementType, elementFragment, false));
                } catch (IllegalArgumentException e) {
                    LOG.error("Exception occurred while saving element: ", e);
                    eventBus.post(new NotificationEvent(NotificationEvent.Type.ERROR, "document.content.save.error", e.getMessage()));
                }
            }
        });
    }
}
