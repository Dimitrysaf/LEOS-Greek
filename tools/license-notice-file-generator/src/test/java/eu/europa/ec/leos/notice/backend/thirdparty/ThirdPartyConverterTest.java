package eu.europa.ec.leos.notice.backend.thirdparty;

import eu.europa.ec.leos.notice.BaseTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ThirdPartyConverterTest extends BaseTest {

    @Test
    void loadOneThirdPartyLibrary_hp() {
        String line = "(Public Domain) AOP alliance (aopalliance:aopalliance:1.0 - http://aopalliance.sourceforge.net)";
        ThirdPartyConverter thirdPartyConverter = new ThirdPartyConverter();
        ThirdPartyLibrary output = thirdPartyConverter.convertLine(line);
        System.out.println("output: " + output);

        assertNotNull(output);
        assertEquals("AOP alliance", output.getName());
        assertEquals("aopalliance", output.getGroupId());
        assertEquals("aopalliance", output.getArtifactId());
        assertEquals("1.0", output.getVersion());
        assertEquals("http://aopalliance.sourceforge.net", output.getProjectUrl());
        assertEquals(1, output.getLicenseAliases().size());
        assertEquals("Public Domain", first(output.getLicenseAliases()));
    }

    @Test
    void loadOneThirdPartyLibrary_hp2() {
        String line = "(Revised BSD License) JSONLD Java :: Core (com.github.jsonld-java:jsonld-java:0.9.0 - http://github.com/jsonld-java/jsonld-java/jsonld-java/)";
        ThirdPartyConverter thirdPartyConverter = new ThirdPartyConverter();
        ThirdPartyLibrary output = thirdPartyConverter.convertLine(line);
        System.out.println("output: " + output);

        assertNotNull(output);
        assertEquals("JSONLD Java :: Core", output.getName());
        assertEquals("com.github.jsonld-java", output.getGroupId());
        assertEquals("jsonld-java", output.getArtifactId());
        assertEquals("0.9.0", output.getVersion());
        assertEquals("http://github.com/jsonld-java/jsonld-java/jsonld-java/", output.getProjectUrl());
        assertEquals(1, output.getLicenseAliases().size());
        assertEquals("Revised BSD License", first(output.getLicenseAliases()));
    }

    @Test
    void loadThirdPartyLibrary_twoLicenses() {
        String line = "(The MIT License (MIT)) java jwt (com.auth0:java-jwt:3.2.0 - http://www.jwt.io)";
        ThirdPartyConverter thirdPartyConverter = new ThirdPartyConverter();
        ThirdPartyLibrary output = thirdPartyConverter.convertLine(line);
        System.out.println("output: " + output);

        assertNotNull(output);
        assertEquals("java jwt", output.getName());
        assertEquals("com.auth0", output.getGroupId());
        assertEquals("java-jwt", output.getArtifactId());
        assertEquals("3.2.0", output.getVersion());
        assertEquals("http://www.jwt.io", output.getProjectUrl());
        assertEquals(1, output.getLicenseAliases().size());
        assertEquals("The MIT License (MIT)", first(output.getLicenseAliases()));
    }

    @Test
    void thirdParty_2Licenses() {
        String line = "(Eclipse Public License - v 1.0) (GNU Lesser General Public License) Logback Classic Module (ch.qos.logback:logback-classic:1.2.11 - http://logback.qos.ch/logback-classic)";
        ThirdPartyConverter thirdPartyConverter = new ThirdPartyConverter();
        ThirdPartyLibrary output = thirdPartyConverter.convertLine(line);
        System.out.println("output: " + output);
        assertNotNull(output);
        assertEquals("Logback Classic Module", output.getName());
        assertEquals("ch.qos.logback", output.getGroupId());
        assertEquals("logback-classic", output.getArtifactId());
        assertEquals("1.2.11", output.getVersion());
        assertEquals("http://logback.qos.ch/logback-classic", output.getProjectUrl());
        assertEquals(2, output.getLicenseAliases().size());
        assertEquals("Eclipse Public License - v 1.0", first(output.getLicenseAliases()));
        assertEquals("GNU Lesser General Public License", second(output.getLicenseAliases()));
    }

    @Test
    void thirdParty_3Licenses() {
        String line = "(Apache License 2.0) (LGPL 2.1) (MPL 1.1) Javassist (org.javassist:javassist:3.21.0-GA - http://www.javassist.org/)";
        ThirdPartyConverter thirdPartyConverter = new ThirdPartyConverter();
        ThirdPartyLibrary output = thirdPartyConverter.convertLine(line);
        System.out.println("output: " + output);
        assertNotNull(output);
        assertEquals("Byte Buddy (without dependencies", output.getName());
        assertEquals("net.bytebuddy", output.getGroupId());
        assertEquals("byte-buddy", output.getArtifactId());
        assertEquals("1.6.11", output.getVersion());
        assertEquals("http://logback.qos.ch/logback-classic", output.getProjectUrl());
        assertEquals(1, output.getLicenseAliases().size());
        assertEquals("The Apache Software License, Version 2.0", first(output.getLicenseAliases()));
    }

    //    (The Apache Software License, Version 2.0) Byte Buddy (without dependencies) (net.bytebuddy:byte-buddy:1.6.11 - http://bytebuddy.net/byte-buddy)
    @Test
    void load() {
        String line = "(The Apache Software License, Version 2.0) Byte Buddy (without dependencies) (net.bytebuddy:byte-buddy:1.6.11 - http://bytebuddy.net/byte-buddy)";
        ThirdPartyConverter thirdPartyConverter = new ThirdPartyConverter();
        ThirdPartyLibrary output = thirdPartyConverter.convertLine(line);
        System.out.println("output: " + output);
        assertNotNull(output);
        assertEquals("Byte Buddy (without dependencies", output.getName());
        assertEquals("net.bytebuddy", output.getGroupId());
        assertEquals("byte-buddy", output.getArtifactId());
        assertEquals("1.6.11", output.getVersion());
        assertEquals("http://logback.qos.ch/logback-classic", output.getProjectUrl());
        assertEquals(1, output.getLicenseAliases().size());
        assertEquals("The Apache Software License, Version 2.0", first(output.getLicenseAliases()));
    }




}
