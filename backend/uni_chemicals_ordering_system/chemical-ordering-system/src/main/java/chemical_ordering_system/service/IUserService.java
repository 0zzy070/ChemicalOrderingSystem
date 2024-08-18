package chemical_ordering_system.service;

import chemical_ordering_system.model.Users;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    List<Users> findUserByUsername(String userName);
    List<Users> findAllUsers();
    Optional<Users> findUserById(String id);
    Users saveUser(Users user);
    Optional<Users> updateUser(String id, Users user);
    boolean deleteUserById(String id);
}
