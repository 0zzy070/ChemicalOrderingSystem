package chemical_ordering_system.repository;

import chemical_ordering_system.model.OrganizationalUnit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationalUnitRepository extends JpaRepository<OrganizationalUnit, String> {}
