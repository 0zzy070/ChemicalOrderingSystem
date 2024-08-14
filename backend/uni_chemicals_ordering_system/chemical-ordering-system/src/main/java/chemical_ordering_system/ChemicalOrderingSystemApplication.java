package chemical_ordering_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "chemical_ordering_system.repository")
@EntityScan(basePackages = "chemical_ordering_system.model")
public class ChemicalOrderingSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChemicalOrderingSystemApplication.class, args);
    }
}
