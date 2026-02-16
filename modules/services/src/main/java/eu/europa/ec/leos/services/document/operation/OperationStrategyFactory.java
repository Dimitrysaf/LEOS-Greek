package eu.europa.ec.leos.services.document.operation;

import eu.europa.ec.leos.services.dto.request.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class OperationStrategyFactory {
    
    private final Map<Operation, OperationStrategy> strategies = new EnumMap<>(Operation.class);
    
    @Autowired
    public OperationStrategyFactory(CleanOperationStrategy cleanStrategy) {
        strategies.put(Operation.CLEAN, cleanStrategy);
    }
    
    public OperationStrategy getStrategy(Operation operation) {
        OperationStrategy strategy = strategies.get(operation);
        if (strategy == null) {
            throw new UnsupportedOperationException("Operation not supported: " + operation);
        }
        return strategy;
    }
}
