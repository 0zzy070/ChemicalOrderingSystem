package chemical_ordering_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Data
@Entity
@Table(name = "\"user\"")

public class User {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(columnDefinition = "character varying(32) NOT NULL")
    private String userName;

    @Column(columnDefinition = "character varying(128) NOT NULL")
    private String pwd;

    @Column(columnDefinition = "character varying(32) NOT NULL")
    private String employeeNumber;

    @Column(columnDefinition = "smallint")
    private Integer userType;

    @Column(columnDefinition = "bigint")
    private Long createTime;

    @Column(columnDefinition = "bigint")
    private Long updateTime;

    public User() {}

    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
