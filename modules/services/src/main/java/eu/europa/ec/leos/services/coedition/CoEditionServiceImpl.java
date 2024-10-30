/**
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.1 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.services.coedition;

import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.coedition.handler.InfoHandler;
import eu.europa.ec.leos.vo.coedition.CoEditionActionInfo;
import eu.europa.ec.leos.vo.coedition.CoEditionVO;
import eu.europa.ec.leos.vo.coedition.InfoType;
import org.apache.commons.lang3.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoEditionServiceImpl implements CoEditionService {

    private static final String SESSION_ID_MUST_NOT_BE_NULL = "sessionId must not be null";

    @Autowired
    private InfoHandler infoHandler;

    @Override
    public CoEditionActionInfo storeUserEditInfo(String sessionId, String presenterId, User user, String documentId, String elementId, InfoType infoType) {
        Validate.notNull(sessionId, SESSION_ID_MUST_NOT_BE_NULL);
        Validate.notNull(presenterId, "presenterId must not be null");
        Validate.notNull(user, "user must not be null");
        Validate.notNull(documentId, "documentId must not be null");
        CoEditionVO coEditionVo = new CoEditionVO(sessionId, presenterId, user.getLogin(), user.getName(),
                user.getDefaultEntity() != null ? user.getDefaultEntity().getOrganizationName() : "",
                user.getEmail(), documentId, elementId, infoType, System.currentTimeMillis());
        CoEditionActionInfo actionInfo = infoHandler.checkIfInfoExists(coEditionVo);
        if (!actionInfo.sucesss()) {
            actionInfo = infoHandler.storeInfo(coEditionVo);
        }
        return actionInfo;
    }

    @Override
    public CoEditionActionInfo removeUserEditInfo(String presenterId, String documentId, String elementId, InfoType infoType) {
        Validate.notNull(presenterId, "presenterId must not be null");
        Validate.notNull(documentId, "documentId must not be null");
        CoEditionVO coEditionVo = new CoEditionVO(null, presenterId, null, null, null, null,
                documentId, elementId, infoType, null);
        CoEditionActionInfo actionInfo = infoHandler.checkIfInfoExists(coEditionVo);
        if (actionInfo.sucesss()) {
            actionInfo = infoHandler.removeInfo(actionInfo.getInfo());
        }
        return actionInfo;
    }

    @Override
    public CoEditionActionInfo removeUserEditInfo(String sessionId) {
        Validate.notNull(sessionId, SESSION_ID_MUST_NOT_BE_NULL);
        CoEditionActionInfo actionInfo = infoHandler.checkIfInfoExists(sessionId);
        if (actionInfo.sucesss()) {
            actionInfo = infoHandler.removeInfo(actionInfo.getInfo());
        }
        return actionInfo;
    }

    @Override
    public List<CoEditionVO> getCoEditionsFromSession(String sessionId) {
        Validate.notNull(sessionId, SESSION_ID_MUST_NOT_BE_NULL);
        return infoHandler.getSessionEditInfo(sessionId);
    }

    @Override
    public List<CoEditionVO> getAllEditInfo() {
        return infoHandler.getAllEditInfo();
    }

    @Override
    public List<CoEditionVO> getCurrentEditInfo(String docId) {
        Validate.notNull(docId, "The document id must not be null!");
        return infoHandler.getCurrentEditInfo(docId);
    }

}
