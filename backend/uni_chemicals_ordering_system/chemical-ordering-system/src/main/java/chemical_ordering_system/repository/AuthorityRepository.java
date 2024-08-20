package chemical_ordering_system.repository;

import chemical_ordering_system.model.Authority;
import chemical_ordering_system.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, String> {
    List<Authority> findByUsername(String username);

}
