package eu.europa.ec.leos.services.util;

import eu.europa.ec.leos.services.utils.HttpUtils;
import org.junit.Assert;
import org.junit.Test;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class HttpUtilsTest {

    String mockToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTczMDIxMjE5NiwicmVtb3RlQ2xpZW50SWQiOiJuZ0xlb3NDbGllbnRJZCIsImlzcyI6Ikxlb3NBcGlJZCIsImV4cCI6MTczMDIxNTc5NiwiaWF0IjoxNzMwMjEyMTk2LCJ1c2VyIjoiZGVtbyIsInJlbW90ZUNsaWVudE5hbWUiOiJuZ0xlb3MiLCJzeXN0ZW1DbGllbnRJZCI6Ikxlb3NBcGlJZCJ9.TVnmOg9pUjYFNdWjK7wBztc6MKpassAVs_9GxxSQOgM";

    @Test
    public void test_extractSystemClientIdFromToken() {
        final Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(mockToken);
        Assert.assertTrue(systemClientId.isPresent());
        assertThat(systemClientId.get(), is(equalTo("ngLeosClientId")));
    }
}
