package chemical_ordering_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class Users {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(columnDefinition = "character varying(32) NOT NULL")
    private String username;

    @Column(columnDefinition = "character varying(128) NOT NULL")
    private String password;

    @Column(columnDefinition = "character varying(32) NOT NULL")
    private String employeeNumber;

    @Column(columnDefinition = "bigint")
    private Long createTime;

    @Column(columnDefinition = "bigint")
    private Long updateTime;

    @Column(columnDefinition = "boolean NOT NULL DEFAULT true")
    private boolean enabled;

    @Column(columnDefinition = "character varying(128) NOT NULL")
    private String email;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Authority authority;
}
