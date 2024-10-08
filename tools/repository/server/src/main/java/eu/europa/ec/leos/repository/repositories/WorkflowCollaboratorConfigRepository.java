package eu.europa.ec.leos.repository.repositories;

import eu.europa.ec.leos.repository.entities.WorkflowCollaboratorConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface WorkflowCollaboratorConfigRepository extends JpaRepository<WorkflowCollaboratorConfig, BigDecimal> {

    @Query(value="SELECT wfc FROM WorkflowCollaboratorConfig wfc " +
            "WHERE (:clientName is null OR wfc.leosClients.name = :clientName) " +
            "AND wfc.pkg.name = :packageName ")
    List<WorkflowCollaboratorConfig> findByPackageNameAndClientName(@Param("packageName") String packageName, @Param("clientName") String clientName);

}
