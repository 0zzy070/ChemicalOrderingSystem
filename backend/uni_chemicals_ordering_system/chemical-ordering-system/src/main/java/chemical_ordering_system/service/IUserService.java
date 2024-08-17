package chemical_ordering_system.service;

import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.model.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    List<User> findUserByUsername(String userName);
    List<User> findAllUsers();
    Optional<User> findUserById(String id);
    User saveUser(User user);
    Optional<User> updateUser(String id, User user);
    boolean deleteUserById(String id);
}
