package eu.europa.ec.leos.repository.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "LEOS_CLIENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeosClients implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ID", nullable = false, updatable = false, precision = 22, scale = 0)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigDecimal id;

    @Column(name = "NAME", length = 100, nullable = false)
    private String name;

    @Column(name = "DISPLAY_NAME", length = 100, nullable = false)
    private String displayName;

}
