package chemical_ordering_system.model;

import jakarta.persistence.*;

import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "chemical_org_unit")
public class ChemicalOrgUnit {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String experimentId;

    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String chemicalId;

    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String storageLocationId;

    @Column(columnDefinition = "bigint")
    private Long expireDate;

    public ChemicalOrgUnit() {}

    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
