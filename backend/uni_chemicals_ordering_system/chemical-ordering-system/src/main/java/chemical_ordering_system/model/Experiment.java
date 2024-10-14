package chemical_ordering_system.model;

import jakarta.persistence.*;

import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "experiment")
public class Experiment {

    @Id
    @Column(columnDefinition = "character varying(64) NOT NULL")
    private String id;

    @Column(columnDefinition = "character varying(128) NOT NULL")
    private String name;

    @Column(columnDefinition = "character varying(256)")
    private String riskAssessment;

    @Column(columnDefinition = "bigint")
    private Long staffSubmitTime;

    @Column(columnDefinition = "boolean")
    private Boolean supervisorApproveStatus;

    @Column(columnDefinition = "character varying(256)")
    private String supervisorComment;

    @Column(columnDefinition = "bigint")
    private Long supervisorApproveTime;

    @Column(columnDefinition = "boolean")
    private Boolean higherApproveStatus;

    @Column(columnDefinition = "character varying(256)")
    private String higherApproveComment;

    @Column(columnDefinition = "bigint")
    private Long higherApproveTime;

    @Column(columnDefinition = "smallint NOT NULL")
    private Short status;

    @Column(columnDefinition = "boolean")
    private Boolean orderApproveStatus;

    @Column(columnDefinition = "character varying(256)")
    private String orderComment;

    @Column(columnDefinition = "bigint")
    private Long orderApproveTime;

    @Column(columnDefinition = "bigint")
    private Long orderReceiveTime;

    @Column(columnDefinition = "bigint")
    private Long orderPlacedTime;

    @Column(columnDefinition = "character varying(64)")
    private String chemicalId;

    @Column(columnDefinition = "smallint")
    private Short amount;

    @Column(columnDefinition = "character(16)")
    private String unit;

    public Experiment() {}

    @PrePersist
    public void generateId() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
