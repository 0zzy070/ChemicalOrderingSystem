package chemical_ordering_system.repository;

import chemical_ordering_system.model.Chemical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChemicalRepository extends JpaRepository<Chemical, String> {}
