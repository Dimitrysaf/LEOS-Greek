package eu.europa.ec.leos.integration.dto;

import lombok.Data;

@Data
public class AccessDTO {
    private AclType aclType;
    private String userId;
    private String userFirstName;
    private String userLastName;
    private String entity;
    private String role;
    private String info;
    public enum AclType {
        USER, ENTITY;
    }
}

