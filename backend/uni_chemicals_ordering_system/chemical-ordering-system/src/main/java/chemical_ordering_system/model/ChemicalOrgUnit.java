package chemical_ordering_system.model;

import jakarta.persistence.*;

import java.util.UUID;

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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getExperimentId() {
        return experimentId;
    }

    public void setExperimentId(String experimentId) {
        this.experimentId = experimentId;
    }

    public String getChemicalId() {
        return chemicalId;
    }

    public void setChemicalId(String chemicalId) {
        this.chemicalId = chemicalId;
    }

    public String getStorageLocationId() {
        return storageLocationId;
    }

    public void setStorageLocationId(String storageLocationId) {
        this.storageLocationId = storageLocationId;
    }

    public Long getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(Long expireDate) {
        this.expireDate = expireDate;
    }
}
