package eu.europa.ec.leos.repository.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeosClient {
    private String name;
    private String displayName;
}
