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

    @GetMapping
    public ResponseEntity<ApiResponse<List<Users>>> getAllUsers() {
        List<Users> users = userService.findAllUsers();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Users>> getUserById(@PathVariable String id) {
        return userService.findUserById(id)
                .map(user -> ResponseEntity.ok(new ApiResponse<>(200, "Success", user)))
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse<>(404, "User not found", null))
                );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Users>> createUser(@Valid @RequestBody UserDTO userDTO) throws BusinessException{
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return  userService.saveUser(userDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Users>> updateUser(
            @PathVariable String id, @Valid @RequestBody Users user) {
        Users existingUser = userService.findUserById(id).orElse(null);
        if (existingUser != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            Users updatedUser = userService.updateUser(id, user).orElse(null);
            if (updatedUser != null) {
                return ResponseEntity.ok(new ApiResponse<>(200, "User updated successfully", updatedUser));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(404, "User not found", null));
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(404, "User not found", null));
        }
    }

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
