package eu.europa.ec.leos.rest.aop.aspect;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
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
            long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
            if (LOGGER.isInfoEnabled()) {
                LOGGER.info(DURATION_OF_EXECUTION, time, className, methodName, Arrays.toString(joinPoint.getArgs()));
            }
        }
    }
}