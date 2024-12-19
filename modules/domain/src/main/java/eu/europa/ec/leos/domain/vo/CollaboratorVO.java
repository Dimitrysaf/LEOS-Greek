package eu.europa.ec.leos.domain.vo;

import lombok.Data;

@Data
public class CollaboratorVO {

    private String login;

    private String entity;

    private String role;

    private String leosClientId;

}
