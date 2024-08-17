package chemical_ordering_system.config;


import chemical_ordering_system.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import chemical_ordering_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserPwdAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserPwdAuthenticationProvider.class);

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String pwd = (String) authentication.getCredentials();

        List<User> users = userRepository.findByUserName(username);
        if (users.size() > 0) {
            if(passwordEncoder.matches(pwd, users.get(0).getPwd())){
                List<GrantedAuthority> authorities = new ArrayList<>();
                switch (users.get(0).getUserType()) {
                    case 1:
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                        logger.info("成功");
                        break;
                    case 2:
                        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                        logger.info("成功");
                        break;
                    // Add more cases as needed
                    default:
                        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                        break;
                }
                return new UsernamePasswordAuthenticationToken(username, pwd, authorities);
            }else {
                throw new BadCredentialsException("Invalid password");
            }
        }else {
            throw new BadCredentialsException("Invalid Username");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }
}