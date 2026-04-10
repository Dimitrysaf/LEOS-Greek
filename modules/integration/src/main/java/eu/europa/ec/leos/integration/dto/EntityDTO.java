package eu.europa.ec.leos.integration.dto;

import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@EqualsAndHashCode(of = {"id"})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
public class EntityDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 7727461372817817872L;

    private String id;
    private String name;
    private String organizationName;

    public EntityDTO(String id) {
        this.id = id;
    }
}