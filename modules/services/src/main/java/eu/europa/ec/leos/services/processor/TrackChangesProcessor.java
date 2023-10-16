/*
 * Copyright 2023 European Commission
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

package eu.europa.ec.leos.services.processor;

import eu.europa.ec.leos.domain.repository.document.XmlDocument;
import eu.europa.ec.leos.model.action.TrackChangeActionType;
import org.springframework.security.access.prepost.PreAuthorize;

public interface TrackChangesProcessor<T extends XmlDocument> {
    @PreAuthorize("hasPermission(#doc, 'CAN_ACCEPT_CHANGES')")
    byte[] acceptChange(T doc, String elementId, String elementTagName, TrackChangeActionType trackChangeAction) throws Exception;

    @PreAuthorize("hasPermission(#doc, 'CAN_REJECT_CHANGES')")
    byte[] rejectChange(T doc, String elementId, String elementTagName, TrackChangeActionType trackChangeAction) throws Exception;
}
