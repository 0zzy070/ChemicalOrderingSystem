package chemical_ordering_system.dto.orgazation;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class OrganizationalUnitAddDTO {

    @NotBlank
    @Length(max = 64)
    private String pid;

    @NotBlank
    @Length(max = 64)
    private String orgName;

    @Max(4)
    @Min(2)
    private Integer orgType;

    private Boolean hasSpecialEquipment;
}
