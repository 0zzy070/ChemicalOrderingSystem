package chemical_ordering_system.service.impl;

import chemical_ordering_system.model.Users;
import chemical_ordering_system.repository.UserRepository;
import chemical_ordering_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {

//    @Autowired
//    private PasswordEncoder passwordEncoder;

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
}
