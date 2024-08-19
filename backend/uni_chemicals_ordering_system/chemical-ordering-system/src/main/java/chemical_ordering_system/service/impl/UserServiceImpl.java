package chemical_ordering_system.service.impl;

import chemical_ordering_system.dto.User.LoginResponse;
import chemical_ordering_system.dto.User.UserLoginDTO;
import chemical_ordering_system.enums.ErrorEnum;
import chemical_ordering_system.exception.BusinessException;
import chemical_ordering_system.jwt.JwtUtils;
import chemical_ordering_system.model.ApiResponse;
import chemical_ordering_system.model.Users;
import chemical_ordering_system.repository.UserRepository;
import chemical_ordering_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    @Override
    public List<Users> findUserByUsername(String userName) {
        return userRepository.findByUsername(userName);
    }

    @Override
    public List<Users> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<Users> findUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Users saveUser(Users user) {
      //  user.setPwd(passwordEncoder.encode(user.getPwd()));
        return userRepository.save(user);
    }

    @Override
    public Optional<Users> updateUser(String id, Users user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            //user.setPwd(passwordEncoder.encode(user.getPwd()));
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }

    @Override
    public boolean deleteUserById(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
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
        String userName=userDetails.getUsername();

        LoginResponse response=new LoginResponse(jwtToken,userDetails.getUsername(),roles);
        return response;

    }
}
