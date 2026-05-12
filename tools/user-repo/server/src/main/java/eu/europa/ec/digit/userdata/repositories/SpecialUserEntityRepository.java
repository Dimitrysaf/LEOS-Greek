package eu.europa.ec.digit.userdata.repositories;

import eu.europa.ec.digit.userdata.entities.SpecialUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SpecialUserEntityRepository extends JpaRepository<SpecialUserEntity, SpecialUserEntity.UserEntityId> {

    List<SpecialUserEntity> findByIdIn(Collection<SpecialUserEntity.UserEntityId> ids);

}
