package chemical_ordering_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;
@Data
@Entity
@Table(name = "organizational_unit")
public class OrganizationalUnit {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(columnDefinition = "character varying(64)")
    private String pid;

    @Column(columnDefinition = "character varying(64)")
    private String orgName;

    @Column(columnDefinition = "smallint")
    private Integer orgType;

    @Column(columnDefinition = "bigint")
    private Long createTime;

    @Column(columnDefinition = "bigint")
    private Long updateTime;

    @Column(columnDefinition = "boolean")
    private Boolean hasSpecialEquipment;

    @Column(columnDefinition = "smallint")
    private Integer status;

    public OrganizationalUnit() {}

    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
