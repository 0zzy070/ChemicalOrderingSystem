package chemical_ordering_system.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chemical")
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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCommonName() {
        return commonName;
    }

    public void setCommonName(String commonName) {
        this.commonName = commonName;
    }

    public String getSystematicName() {
        return systematicName;
    }

    public void setSystematicName(String systematicName) {
        this.systematicName = systematicName;
    }

    public Short getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(Short riskCategory) {
        this.riskCategory = riskCategory;
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

    public Short getStoragePeriod() {
        return storagePeriod;
    }

    public void setStoragePeriod(Short storagePeriod) {
        this.storagePeriod = storagePeriod;
    }
}
