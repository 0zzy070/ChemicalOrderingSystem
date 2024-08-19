package chemical_ordering_system.dto.User;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UserLoginDTO {
    @NotBlank
    @Length(max = 64)
    private String userName;

    @NotBlank
    private String password;
}