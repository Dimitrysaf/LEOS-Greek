package eu.europa.ec.leos.rest.aop.aspect;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import eu.europa.ec.leos.rest.aop.annotation.PerformanceLogger;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Slf4j
public class LoggingAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);
    private static final String DURATION_OF_EXECUTION = "{} millis - {}.{}({})";

    @Around("@annotation(eu.europa.ec.leos.rest.aop.annotation.PerformanceLogger)")
    public Object logPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        // Get intercepted method details
        String className = methodSignature.getDeclaringType().getSimpleName();
        String methodName = methodSignature.getName();
        long startTimeNanos = System.nanoTime();

        try {
            return joinPoint.proceed();
        } finally {
            Method interfaceMethod = methodSignature.getMethod();
            Method targetMethod = joinPoint.getTarget()
                    .getClass()
                    .getMethod(interfaceMethod.getName(), interfaceMethod.getParameterTypes());

            PerformanceLogger annotation = targetMethod.getAnnotation(PerformanceLogger.class);

            long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
            if (annotation != null) {
                String level = annotation.logLevel();
                if ("INFO".equalsIgnoreCase(level) && log.isInfoEnabled()) {
                    LOGGER.info(DURATION_OF_EXECUTION, time, className, methodName, Arrays.toString(joinPoint.getArgs()));
                } else if ("WARNING".equalsIgnoreCase(level) && log.isWarnEnabled()) {
                    LOGGER.warn(DURATION_OF_EXECUTION, time, className, methodName, Arrays.toString(joinPoint.getArgs()));
                } else if ("ERROR".equalsIgnoreCase(level) && log.isErrorEnabled()) {
                    LOGGER.error(DURATION_OF_EXECUTION, time, className, methodName, Arrays.toString(joinPoint.getArgs()));
                }
            }

        }
    }
}
