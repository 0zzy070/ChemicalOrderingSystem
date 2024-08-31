package chemical_ordering_system.service.impl;

import chemical_ordering_system.dto.User.LoginResponse;
import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.dto.User.UserLoginDTO;
import chemical_ordering_system.enums.ErrorEnum;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.jwt.JwtUtils;
import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Authority;
import chemical_ordering_system.model.OrganizationalUnit;
import chemical_ordering_system.model.Users;
import chemical_ordering_system.repository.AuthorityRepository;
import chemical_ordering_system.repository.UserRepository;
import chemical_ordering_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Override
    public List<Users> findUserByUsername(String userName) {
        return userRepository.findByUsername(userName);
    }

    @Override
    public List<UserDTO> findAllUsers() {
        List<Object[]> results = userRepository.findAllUsersWithAuthority();
        return results.stream()
                .map(result -> {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setUserName((String) result[1]);
                    userDTO.setPassword((String) result[2]);
                    userDTO.setAuthority((String) result[4]);
                    userDTO.setEmail((String) result[3]);
                    return userDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> findUserById(String id) {
        List<Object[]> results = userRepository.findUserByIdWithAuthority(id);
        return results.stream().map(r -> {
            UserDTO userDTO = new UserDTO();
            // Assuming r[0] is an instance of a custom object or Map containing all the fields
            userDTO.setUserName((String) r[1]);
            userDTO.setPassword((String) r[2]);
            userDTO.setAuthority((String) r[4]);
            userDTO.setEmail((String) r[3]);
            return userDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<ApiResponse<Users>> saveUser(UserDTO userDTO) throws BusinessException{
        if (userRepository.existsByUsername(userDTO.getUserName())) {
            throw new BusinessException(ErrorEnum.INVALID_INPUT, "username: " + userDTO.getUserName() + " already exists");
        }

        String id = UUID.randomUUID().toString();
        Users users = new Users();
        users.setId(id);
        users.setUsername(userDTO.getUserName());
        users.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Ensure passwords are encoded
        users.setEmail(userDTO.getEmail());
        String newEmployeeNumber = generateEmployeeNumber();
        users.setEmployeeNumber(newEmployeeNumber);
        users.setCreateTime(System.currentTimeMillis());
        users.setEnabled(true);

        // Create Authority and set the user reference
        Authority authority = new Authority();
        authority.setId(id);
        authority.setAuthority(userDTO.getAuthority());
        authority.setUsername(userDTO.getUserName());
        authority.setUser(users); // Set the bi-directional relationship

        // Set the Authority in the Users entity
        users.setAuthority(authority);

        Users savedUser = userRepository.save(users); // This will also save Authority due to cascade

        return ResponseEntity.ok(new ApiResponse<>(200, "success", savedUser));
    }

    @Override
    public Optional<UserDTO> updateUser(String id, UserDTO userDTO) {
        // 检查用户是否存在
        if (userRepository.existsById(id)) {
            // 更新 Users 表
            Users existingUser = userRepository.findById(id).orElse(null);
            if (existingUser != null) {
                existingUser.setUsername(userDTO.getUserName());
                existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                existingUser.setEmail(userDTO.getEmail());
                existingUser.setUpdateTime(System.currentTimeMillis());
                userRepository.save(existingUser);

                // 更新 Authority 表
                Authority existingAuthority = authorityRepository.findById(id).orElse(null);
                if (existingAuthority != null) {
                    existingAuthority.setAuthority(userDTO.getAuthority());
                    authorityRepository.save(existingAuthority);
                }

                // 返回更新后的 UserDTO
                UserDTO updatedUserDTO = new UserDTO();
                updatedUserDTO.setUserName(existingUser.getUsername());
                updatedUserDTO.setPassword(existingUser.getPassword());
                updatedUserDTO.setEmail(existingUser.getEmail());
                updatedUserDTO.setAuthority(existingAuthority != null ? existingAuthority.getAuthority() : null);

                return Optional.of(updatedUserDTO);
            }
        }
        return Optional.empty();
    }

    @Override
    public boolean deleteUserById(String id) {
        Optional<Users> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            authorityRepository.deleteById(user.getId()); // Delete related authority
            userRepository.deleteById(id); // Delete user
            return true;
        }
        return false;
    }

    @Override
    public LoginResponse login(UserLoginDTO user) throws BusinessException {
        Authentication authentication;
        try{
            authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(),user.getPassword()));
        }catch (AuthenticationException exception){
            throw new BusinessException(ErrorEnum.AUTHENTICATION_FAILED);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails=(UserDetails) authentication.getPrincipal();
        String jwtToken=jwtUtils.generateJwtTokenFromUsername(userDetails);
        List<String> roles=userDetails.getAuthorities().stream().map(item->item.getAuthority()).collect(Collectors.toList());

        Users users = userRepository.findByUsername(userDetails.getUsername()).get(0);
        return new LoginResponse(jwtToken,userDetails.getUsername(),roles,users.getId(),users.getEmployeeNumber());
    }

    private String generateEmployeeNumber() {
        // 获取当前最大编号
        String maxEmployeeNumber = userRepository.findMaxEmployeeNumber();

        // 将编号后缀部分转换为数字
        int maxNumber = Integer.parseInt(maxEmployeeNumber.substring(6));

        // 生成下一个编号
        int newNumber = maxNumber + 1;

        // 格式化为"empyNo"开头，三位数字的格式
        return String.format("empyNo%03d", newNumber);
    }
}

