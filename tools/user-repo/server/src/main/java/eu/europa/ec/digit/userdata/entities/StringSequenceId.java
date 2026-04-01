package eu.europa.ec.digit.userdata.entities;

import org.hibernate.annotations.IdGeneratorType;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD, METHOD})
@Retention(RUNTIME)
@IdGeneratorType(StringSequenceIdGenerator.class)
@interface StringSequenceId {
    String sequence();
}
