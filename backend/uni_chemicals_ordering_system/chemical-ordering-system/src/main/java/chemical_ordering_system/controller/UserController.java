package chemical_ordering_system.controller;

import chemical_ordering_system.dto.User.LoginResponse;
import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.dto.User.UserLoginDTO;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Users;
import chemical_ordering_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody UserLoginDTO user) throws BusinessException {
        //user.setPassword(passwordEncoder.encode(user.getPassword()));
        LoginResponse response=userService.login(user);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.findAllUsers();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", users));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUserById(@PathVariable String id) {
        List<UserDTO> userDTOs = userService.findUserById(id);
        if (!userDTOs.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(200, "User(s) found", userDTOs));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "User not found", null));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Users>> createUser(@Valid @RequestBody UserDTO userDTO) throws BusinessException{
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return  userService.saveUser(userDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable String id, @Valid @RequestBody UserDTO userDTO) {
        // 调用服务层更新方法
        Optional<UserDTO> updatedUserDTO = userService.updateUser(id, userDTO);

        if (updatedUserDTO.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(200, "User updated successfully", updatedUserDTO.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "User not found", null));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        if (userService.deleteUserById(id)) {
            return ResponseEntity.ok(new ApiResponse<>(200, "User deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "User not found", null));
        }
    }
}
