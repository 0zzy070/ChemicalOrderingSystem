package chemical_ordering_system.service;

import chemical_ordering_system.dto.User.LoginResponse;
import chemical_ordering_system.dto.User.UserLoginDTO;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.model.Users;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    List<Users> findUserByUsername(String userName);
    List<Users> findAllUsers();
    Optional<Users> findUserById(String id);
    Users saveUser(Users user);
    Optional<Users> updateUser(String id, Users user);
    boolean deleteUserById(String id);

    LoginResponse login(@Valid UserLoginDTO user) throws BusinessException;
}
