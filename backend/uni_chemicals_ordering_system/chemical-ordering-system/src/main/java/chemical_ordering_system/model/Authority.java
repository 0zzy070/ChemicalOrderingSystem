package chemical_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @OneToOne
    @JoinColumn(name = "id") // 关联的列名，与 Users 表的主键列名相同
    @JsonIgnore
    private Users user; // 指向 Users 实体

    // Optionally, you can include a default constructor if needed
    public Authority() {}

    // You can add additional constructors or methods if needed
}
