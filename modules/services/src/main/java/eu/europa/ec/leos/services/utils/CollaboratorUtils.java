package eu.europa.ec.leos.services.utils;

import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.User;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CollaboratorUtils {

    public static boolean matchUserAndEntityAndLeosClientId(Collaborator c, User user, String selectedEntity, String systemClientId) {
        return c == null
                || c.getLogin() == null
                || (c.getLogin().equals(user.getLogin())
                && (   c.getEntity() == null
                || selectedEntity == null
                || c.getEntity().equals(selectedEntity))
                && matchLeosClientId(c, systemClientId)
        );
    }

    public static boolean matchLeosClientId(Collaborator collaborator, String leosClientId) {
        if (leosClientId==null && collaborator.getLeosClientId()==null) {
            return true;
        } else if (leosClientId!=null && collaborator.getLeosClientId()!=null) {
            return leosClientId.equals(collaborator.getLeosClientId());
        }
        return false;
    }

}
