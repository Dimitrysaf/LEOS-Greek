package europa.edit.util;

import java.util.HashMap;
import java.util.Map;

public class ScenarioContext {

    private Map<String, Object> data = new HashMap<>();

    public void setValue(String key, Object value) {
        data.put(key, value);
    }

    public Object getValue(String key) {
        return data.get(key);
    }
}
