package chemical_ordering_system.controller;

import chemical_ordering_system.dto.User.LoginResponse;
import chemical_ordering_system.dto.User.UserLoginDTO;
import chemical_ordering_system.jwt.JwtUtils;
import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.User;
import chemical_ordering_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private IUserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> createUser(@Valid @RequestBody UserLoginDTO user) {
        Authentication authentication;
        try{
            authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(),user.getPassword()));
        }catch (AuthenticationException exception){
            return ResponseEntity.ok(new ApiResponse<>(403, "Authentication failed", null));
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails=(UserDetails) authentication.getPrincipal();
        String jwtToken=jwtUtils.generateJwtTokenFromUsername(userDetails);
        List<String> roles=userDetails.getAuthorities().stream().map(item->item.getAuthority()).collect(Collectors.toList());
        LoginResponse response=new LoginResponse(jwtToken,userDetails.getUsername(),roles);
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", response));
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
        return userService.findUserById(id)
                .map(user -> ResponseEntity.ok(new ApiResponse<>(200, "Success", user)))
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ApiResponse<>(404, "User not found", null))
                );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "User created successfully", savedUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable String id, @Valid @RequestBody User user) {
        User existingUser = userService.findUserById(id).orElse(null);
        if (existingUser != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User updatedUser = userService.updateUser(id, user).orElse(null);
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
