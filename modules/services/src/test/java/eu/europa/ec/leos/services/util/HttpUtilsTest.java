package eu.europa.ec.leos.services.util;

import eu.europa.ec.leos.services.utils.HttpUtils;
import org.junit.Assert;
import org.junit.Test;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class HttpUtilsTest {

    String mockToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsIm5iZiI6MTcyNzI2NjY1Miwic3lzdGVtTmFtZSI6Im5nTGVvcyIsImlzcyI6Ikxlb3NBcGlJZCIsImV4cCI6MTcyNzI3MDI1MiwiaWF0IjoxNzI3MjY2NjUyLCJ1c2VyIjoiZGVtbyIsInN5c3RlbUNsaWVudElkIjoibmdMZW9zQ2xpZW50SWQifQ.DuJMKA2CWr9N7uRNYTtfug3Rxz9-cELFaIyTMrEz8Fg";

    @Test
    public void test_extractSystemClientIdFromToken() {
        final Optional<String> systemClientId = HttpUtils.extractSystemClientIdFromAuthorizationHeader(mockToken);
        Assert.assertTrue(systemClientId.isPresent());
        assertThat(systemClientId.get(), is(equalTo("ngLeosClientId")));
    }
}
