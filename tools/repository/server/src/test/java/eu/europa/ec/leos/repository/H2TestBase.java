package eu.europa.ec.leos.repository;

import org.junit.jupiter.api.BeforeAll;

public abstract class H2TestBase {

    @BeforeAll
    public static void setUpH2() {
        // Hack to fix H2 version 2.x for allowing numeric comparison with boolean
        org.h2.engine.Mode mode = org.h2.engine.Mode.getInstance("Oracle");
        mode.numericWithBooleanComparison = true;
    }
}