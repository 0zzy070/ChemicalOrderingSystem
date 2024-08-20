package chemical_ordering_system.repository;

import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {

    List<Users> findByUsername(String username);

    @Query("SELECT COALESCE(MAX(u.employeeNumber), 'empyNo000') FROM Users u")
    String findMaxEmployeeNumber();

    boolean existsByUsername(String username);
}
