package chemical_ordering_system.config;

import chemical_ordering_system.jwt.AuthEntryPointJwt;
import chemical_ordering_system.jwt.AuthTokenFilter;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired DataSource dataSource;

    @Autowired private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(
                (requests) -> {
                    requests.requestMatchers("api/users/login")
                            .permitAll()
                            .anyRequest()
                            .authenticated();
                });
        http.sessionManagement(
                session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.cors(
                corsCustomizer ->
                        corsCustomizer.configurationSource(
                                new CorsConfigurationSource() {
                                    @Override
                                    public CorsConfiguration getCorsConfiguration(
                                            HttpServletRequest request) {
                                        CorsConfiguration config = new CorsConfiguration();
                                        // config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://10.14.28.151:3000")); // 允许所有来源
                                        //
                                        // config.setAllowedOriginPatterns(Collections.singletonList("http://*:3000"));
                                        config.setAllowedOriginPatterns(
                                                Arrays.asList("http://*:3000", "http://*:4000"));
                                        config.setAllowedMethods(
                                                Collections.singletonList("*")); // 允许所有方法
                                        config.setAllowCredentials(true); // 允许发送凭证（如 Cookies）
                                        config.setAllowedHeaders(
                                                Collections.singletonList("*")); // 允许所有请求头
                                        config.setMaxAge(3600L); // 预检请求的最大缓存时间
                                        return config;
                                    }
                                }));
        http.exceptionHandling(
                exception -> exception.authenticationEntryPoint(unauthorizedHandler));
        http.headers(headers -> headers.frameOptions(frameoptions -> frameoptions.sameOrigin()));
        http.csrf(csrf -> csrf.disable());
        http.addFilterBefore(
                authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        //        http.logout(logout -> logout
//                .logoutUrl("/api/users/logout") // 设置登出 URL
//                .logoutSuccessUrl("/api/users/login") // 登出成功后重定向的 URL
//                .invalidateHttpSession(true) // 使会话失效
//                .deleteCookies("JSESSIONID") // 删除会话 cookie
//                .permitAll() // 允许所有用户访问登出端点
//        );
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // UserDetails user1=
        // User.withUsername("user1").password(passwordEncoder().encode("password1")).roles("USER").build();
        // userDetailsManager.createUser(user1);
        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);
        return userDetailsManager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration builder)
            throws Exception {
        return builder.getAuthenticationManager();
    }
}
