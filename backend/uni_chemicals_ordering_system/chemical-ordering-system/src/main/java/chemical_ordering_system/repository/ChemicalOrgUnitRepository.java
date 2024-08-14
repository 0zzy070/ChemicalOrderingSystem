package chemical_ordering_system.repository;

import chemical_ordering_system.model.ChemicalOrgUnit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChemicalOrgUnitRepository extends JpaRepository<ChemicalOrgUnit, String> {}
