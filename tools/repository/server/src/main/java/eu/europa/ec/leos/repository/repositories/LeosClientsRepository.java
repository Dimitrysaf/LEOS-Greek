package eu.europa.ec.leos.repository.repositories;

import eu.europa.ec.leos.repository.entities.LeosClients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface LeosClientsRepository extends JpaRepository<LeosClients, BigDecimal> {
    Optional<LeosClients> findByName(String name);
}
