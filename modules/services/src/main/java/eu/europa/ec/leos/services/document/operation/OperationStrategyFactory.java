package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

/**
 * Factory for retrieving operation strategy implementations.
 * Uses the Strategy pattern to delegate operation execution to specific implementations.
 */
@Component
public class OperationStrategyFactory {
    
    private final Map<Operation, OperationStrategy> strategies = new EnumMap<>(Operation.class);
    
    @Autowired
    public OperationStrategyFactory(CleanOperationStrategy cleanStrategy) {
        strategies.put(Operation.CLEAN, cleanStrategy);
    }
    
    /**
     * Retrieves the appropriate strategy for the given operation.
     * 
     * @param operation the operation type
     * @return the corresponding strategy implementation
     * @throws UnsupportedOperationException if the operation is not supported
     */
    public OperationStrategy getStrategy(Operation operation) {
        OperationStrategy strategy = strategies.get(operation);
        if (strategy == null) {
            throw new UnsupportedOperationException("Operation not supported: " + operation);
        }
        return strategy;
    }
}
