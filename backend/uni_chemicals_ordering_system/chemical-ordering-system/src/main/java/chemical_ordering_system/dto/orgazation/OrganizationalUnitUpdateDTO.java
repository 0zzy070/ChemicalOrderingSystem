package chemical_ordering_system.dto.orgazation;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class OrganizationalUnitUpdateDTO {

    @NotBlank
    @Length(max = 64)
    private String id;

    @NotBlank
    @Length(max = 64)
    private String orgName;

    private Boolean hasSpecialEquipment;
}
