package chemical_ordering_system.config;

import org.jasypt.encryption.StringEncryptor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String encryptedPassword;

    private final StringEncryptor encryptor;

    public DataSourceConfig(@Qualifier("encryptorBean") StringEncryptor encryptor) {
        this.encryptor = encryptor;
    }

    @Bean
    public DataSource dataSource() {
        String decryptedPassword = encryptor.decrypt(encryptedPassword);
        return DataSourceBuilder.create()
                .username(username)
                .password(decryptedPassword)
                .url(url)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
