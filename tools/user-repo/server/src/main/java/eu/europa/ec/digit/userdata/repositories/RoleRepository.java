package eu.europa.ec.digit.userdata.repositories;

import eu.europa.ec.digit.userdata.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
