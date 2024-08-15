package chemical_ordering_system.model;

import jakarta.persistence.*;

import java.util.UUID;

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
    private Short orgType;

    @Column(columnDefinition = "bigint")
    private Long createTime;

    @Column(columnDefinition = "bigint")
    private Long updateTime;

    @Column(columnDefinition = "boolean")
    private Boolean hasSpecialEquipment;

    @Column(columnDefinition = "smallint")
    private Short status;

    public OrganizationalUnit() {}

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

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public Short getOrgType() {
        return orgType;
    }

    public void setOrgType(Short orgType) {
        this.orgType = orgType;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public Boolean getHasSpecialEquipment() {
        return hasSpecialEquipment;
    }

    public void setHasSpecialEquipment(Boolean hasSpecialEquipment) {
        this.hasSpecialEquipment = hasSpecialEquipment;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }
}
