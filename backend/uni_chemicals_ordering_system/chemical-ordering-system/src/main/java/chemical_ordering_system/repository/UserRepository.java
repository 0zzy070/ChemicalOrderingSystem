package chemical_ordering_system.repository;

import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {

    List<User> findByUserName(String userName);
}
