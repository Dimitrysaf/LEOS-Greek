package eu.europa.ec.leos.services.utils;

import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.User;
import lombok.experimental.UtilityClass;
import java.util.Objects;

@UtilityClass
public class CollaboratorUtils {

    public static boolean matchUserAndEntityAndLeosClientId(Collaborator c, User user, String selectedEntity, String systemClientId) {
        return c == null
                || c.getLogin() == null
                || (c.getLogin().equals(user.getLogin())
                && (c.getEntity() == null
                || selectedEntity == null
                || c.getEntity().equals(selectedEntity))
                && matchLeosClientId(c, systemClientId)
        );
    }

    public static boolean matchLeosClientId(Collaborator collaborator, String leosClientId) {
        return Objects.equals(collaborator.getLeosClientId(), leosClientId);
    }

}
