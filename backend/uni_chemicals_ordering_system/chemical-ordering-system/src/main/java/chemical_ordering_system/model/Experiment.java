package chemical_ordering_system.model;

import jakarta.persistence.*;

import java.util.UUID;

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

    @Column(columnDefinition = "character varying(16)")
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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRiskAssessment() {
        return riskAssessment;
    }

    public void setRiskAssessment(String riskAssessment) {
        this.riskAssessment = riskAssessment;
    }

    public Long getStaffSubmitTime() {
        return staffSubmitTime;
    }

    public void setStaffSubmitTime(Long staffSubmitTime) {
        this.staffSubmitTime = staffSubmitTime;
    }

    public Boolean getSupervisorApproveStatus() {
        return supervisorApproveStatus;
    }

    public void setSupervisorApproveStatus(Boolean supervisorApproveStatus) {
        this.supervisorApproveStatus = supervisorApproveStatus;
    }

    public String getSupervisorComment() {
        return supervisorComment;
    }

    public void setSupervisorComment(String supervisorComment) {
        this.supervisorComment = supervisorComment;
    }

    public Long getSupervisorApproveTime() {
        return supervisorApproveTime;
    }

    public void setSupervisorApproveTime(Long supervisorApproveTime) {
        this.supervisorApproveTime = supervisorApproveTime;
    }

    public Boolean getHigherApproveStatus() {
        return higherApproveStatus;
    }

    public void setHigherApproveStatus(Boolean higherApproveStatus) {
        this.higherApproveStatus = higherApproveStatus;
    }

    public String getHigherApproveComment() {
        return higherApproveComment;
    }

    public void setHigherApproveComment(String higherApproveComment) {
        this.higherApproveComment = higherApproveComment;
    }

    public Long getHigherApproveTime() {
        return higherApproveTime;
    }

    public void setHigherApproveTime(Long higherApproveTime) {
        this.higherApproveTime = higherApproveTime;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public Boolean getOrderApproveStatus() {
        return orderApproveStatus;
    }

    public void setOrderApproveStatus(Boolean orderApproveStatus) {
        this.orderApproveStatus = orderApproveStatus;
    }

    public String getOrderComment() {
        return orderComment;
    }

    public void setOrderComment(String orderComment) {
        this.orderComment = orderComment;
    }

    public Long getOrderApproveTime() {
        return orderApproveTime;
    }

    public void setOrderApproveTime(Long orderApproveTime) {
        this.orderApproveTime = orderApproveTime;
    }

    public Long getOrderReceiveTime() {
        return orderReceiveTime;
    }

    public void setOrderReceiveTime(Long orderReceiveTime) {
        this.orderReceiveTime = orderReceiveTime;
    }

    public Long getOrderPlacedTime() {
        return orderPlacedTime;
    }

    public void setOrderPlacedTime(Long orderPlacedTime) {
        this.orderPlacedTime = orderPlacedTime;
    }

    public String getChemicalId() {
        return chemicalId;
    }

    public void setChemicalId(String chemicalId) {
        this.chemicalId = chemicalId;
    }

    public Short getAmount() {
        return amount;
    }

    public void setAmount(Short amount) {
        this.amount = amount;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public void updateSupervisorFields(Experiment updatedExperiment) {
        if (updatedExperiment.getSupervisorApproveStatus() != null) {
            this.supervisorApproveStatus = updatedExperiment.getSupervisorApproveStatus();
        }
        if (updatedExperiment.getSupervisorComment() != null) {
            this.supervisorComment = updatedExperiment.getSupervisorComment();
        }
        if (updatedExperiment.getSupervisorApproveTime() != null) {
            this.supervisorApproveTime = updatedExperiment.getSupervisorApproveTime();
        }
    }

    public void updateHigherApproveFields(Experiment updatedExperiment) {
        if (updatedExperiment.getHigherApproveStatus() != null) {
            this.higherApproveStatus = updatedExperiment.getHigherApproveStatus();
        }
        if (updatedExperiment.getHigherApproveComment() != null) {
            this.higherApproveComment = updatedExperiment.getHigherApproveComment();
        }
        if (updatedExperiment.getHigherApproveTime() != null) {
            this.higherApproveTime = updatedExperiment.getHigherApproveTime();
        }
    }

    public void updateOrderFields(Experiment updatedExperiment) {
        if (updatedExperiment.getOrderApproveStatus() != null) {
            this.orderApproveStatus = updatedExperiment.getOrderApproveStatus();
        }
        if (updatedExperiment.getOrderComment() != null) {
            this.orderComment = updatedExperiment.getOrderComment();
        }
        if (updatedExperiment.getOrderApproveTime() != null) {
            this.orderApproveTime = updatedExperiment.getOrderApproveTime();
        }
        if (updatedExperiment.getOrderReceiveTime() != null) {
            this.orderReceiveTime = updatedExperiment.getOrderReceiveTime();
        }
        if (updatedExperiment.getOrderPlacedTime() != null) {
            this.orderPlacedTime = updatedExperiment.getOrderPlacedTime();
        }
    }
}
