/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */
package eu.europa.ec.leos.repository.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "PACKAGE_WORKFLOW_CONFIG")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowCollaboratorConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigDecimal id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "PACKAGE_ID", nullable = false)
    private Package pkg;

    @ManyToOne
    @JoinColumn(name = "LEOS_CLIENTS_ID", nullable = false)
    private LeosClients leosClients;

    @Column(name = "ACL_CALLBACK_URL", length = 500)
    private String aclCallbackUrl;

    @Column(name = "USER_CHECK_CALLBACK_URL", length = 500)
    private String userCheckCallbackUrl;

}
