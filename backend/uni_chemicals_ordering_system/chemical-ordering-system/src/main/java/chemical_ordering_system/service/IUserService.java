package chemical_ordering_system.service;

import chemical_ordering_system.dto.User.LoginResponse;
import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.dto.User.UserLoginDTO;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Users;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    List<UserDTO> findUserByEmployeeNumber(String employeeNumber);
    List<Users> findUserByUsername(String userName);
    List<UserDTO> findAllUsers();
    List<UserDTO> findUserById(String id);
    ResponseEntity<ApiResponse<Users>> saveUser(UserDTO userDTO) throws BusinessException ;
    Optional<UserDTO> updateUser(String id, UserDTO userDTO);
    boolean deleteUserById(String id);

    LoginResponse login(@Valid UserLoginDTO user) throws BusinessException;
}
