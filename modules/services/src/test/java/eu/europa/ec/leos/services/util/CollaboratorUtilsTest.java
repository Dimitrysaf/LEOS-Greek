package eu.europa.ec.leos.services.util;

import eu.europa.ec.leos.model.user.Collaborator;
import eu.europa.ec.leos.model.user.Entity;
import eu.europa.ec.leos.model.user.User;
import eu.europa.ec.leos.services.utils.CollaboratorUtils;
import eu.europa.ec.leos.services.utils.HttpUtils;
import org.junit.Assert;
import org.junit.Test;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class CollaboratorUtilsTest {

    @Test
    public void test_matchUserAndEntityAndLeosClientId() {
        assertThat("same collab properties as args prop user A, entityA, null ",checkMatchUserAndEntityAndLeosClientId("userA","entityA",null,"userA","entityA",null));
        assertThat("same collab properties as args prop null, entityA, null ",checkMatchUserAndEntityAndLeosClientId(null,"entityA",null,null,"entityA",null));
        assertThat("same collab properties as args prop null, null, systemClientId ",checkMatchUserAndEntityAndLeosClientId(null,null,"SystemClientId",null,null,"SystemClientId"));

        assertThat("distinct userLogin ",!checkMatchUserAndEntityAndLeosClientId("userA",null,"SystemClientId","userB",null,"SystemClientId"));
        assertThat("distinct entity ",!checkMatchUserAndEntityAndLeosClientId("userA","entityA","SystemClientId","userA","entityB","SystemClientId"));
        assertThat("distinct entity ",!checkMatchUserAndEntityAndLeosClientId("userA","entityA","SystemClientIdA","userA","entityA","SystemClientIdB"));
    }

    private static boolean checkMatchUserAndEntityAndLeosClientId(String collabLogin, String collabEntity, String collabSystemClientId,
                                                                  String withLogin, String withEntity, String withSystemClientId) {
        return CollaboratorUtils.matchUserAndEntityAndLeosClientId(
                getOwner(collabLogin,collabEntity,collabSystemClientId),
                getUser(withLogin),
                withEntity,
                withSystemClientId
        );
    }
    private static Collaborator getOwner(String login, String entity, String systemClientId) {
        return new Collaborator(login, "OWNER", entity, systemClientId);
    }
    private static User getUser(String login) {
        return new User(1L,login, login, null, null, null);
    }
}
