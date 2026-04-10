package eu.europa.ec.digit.userdata.entities;


import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.*;

import java.lang.reflect.Member;
import java.util.EnumSet;

/**
 * A custom Hibernate Identifier Generator needed to adapt Sequence ID generation for a String ID as is the case
 * for SpecialEntity in particular.
 */
class StringSequenceIdGenerator implements BeforeExecutionGenerator, AnnotationBasedGenerator<StringSequenceId> {

    private static final String STATEMENT = "SELECT %s.nextval FROM dual";

    private String sequenceName;

    @Override
    public void initialize(StringSequenceId annotation, Member member, GeneratorCreationContext context) {
        this.sequenceName = annotation.sequence();
    }

    @Override
    public Object generate(
            final SharedSessionContractImplementor session,
            final Object owner,
            final Object currentValue,
            final EventType eventType) {

        final Long sequenceId = session
                .createNativeQuery(STATEMENT.formatted(sequenceName), Long.class)
                .getSingleResult();

        return String.valueOf(sequenceId);
    }

    @Override
    public EnumSet<EventType> getEventTypes() {
        return EventTypeSets.INSERT_ONLY;
    }
}
