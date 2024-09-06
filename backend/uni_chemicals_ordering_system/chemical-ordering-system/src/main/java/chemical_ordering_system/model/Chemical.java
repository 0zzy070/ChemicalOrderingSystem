package chemical_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "chemical")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Chemical {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(columnDefinition = "character varying(128)")
    private String commonName;

    @Column(columnDefinition = "character varying(128)")
    private String systematicName;

    @Column(columnDefinition = "smallint")
    private Short riskCategory;

    @Column(columnDefinition = "bigint")
    private Long createTime;

    @Column(columnDefinition = "bigint")
    private Long updateTime;

    @Column(columnDefinition = "smallint")
    private Short storagePeriod;

    public Chemical() {}

    // Automatically set createTime and updateTime before the entity is persisted
    @PrePersist
    protected void onCreate() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }

        long timestamp = System.currentTimeMillis();
        this.createTime = timestamp;
        this.updateTime = timestamp;
    }

    // Automatically update updateTime before the entity is updated
    @PreUpdate
    protected void onUpdate() {
        this.updateTime = System.currentTimeMillis();
    }
}
