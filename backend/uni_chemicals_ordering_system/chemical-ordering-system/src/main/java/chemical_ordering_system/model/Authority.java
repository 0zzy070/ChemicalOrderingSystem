package chemical_ordering_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "authorities")
@Data
public class Authority {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(name = "username", columnDefinition = "character varying(64) NOT NULL")
    private String username;

    @Column(name = "authority", columnDefinition = "character varying(64) NOT NULL")
    private String authority;

    // Optionally, you can include a default constructor if needed
    public Authority() {}

    // You can add additional constructors or methods if needed
}
