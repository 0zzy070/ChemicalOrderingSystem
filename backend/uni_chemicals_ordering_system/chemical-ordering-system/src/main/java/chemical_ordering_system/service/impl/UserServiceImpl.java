package chemical_ordering_system.service.impl;

import chemical_ordering_system.dto.User.UserDTO;
import chemical_ordering_system.model.User;
import chemical_ordering_system.repository.UserRepository;
import chemical_ordering_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> findUserByUsername(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public User saveUser(User user) {
        user.setPwd(passwordEncoder.encode(user.getPwd()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> updateUser(String id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id);
            user.setPwd(passwordEncoder.encode(user.getPwd()));
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
}
