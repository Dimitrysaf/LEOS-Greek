package eu.europa.ec.leos.rest.aop.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Aspect
public class LoggingAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger("performance.logger");
    private static final String DURATION_OF_EXECUTION = "Duration of {} execution was {} milliseconds";

    @Around("@annotation(eu.europa.ec.leos.rest.aop.annotation.PerformanceLogger)")
    public Object logPerformance(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        long startTimeNanos = System.nanoTime();
        try {
            return proceedingJoinPoint.proceed();
        } finally {
            long time = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTimeNanos);
            LOGGER.info(DURATION_OF_EXECUTION, proceedingJoinPoint.getSignature(), time);
        }
    }
}