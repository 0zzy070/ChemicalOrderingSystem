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

    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
