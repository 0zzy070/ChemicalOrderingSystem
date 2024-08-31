package chemical_ordering_system.dto.User;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UserDTO {

    @Length(max = 64)
    private String id;

    @NotBlank
    @Length(max = 64)
    private String userName;

    @NotBlank
    private String password;

    @NotBlank
    @Length(max = 64)
    private String authority;

    @NotBlank
    @Length(max = 64)
    private String email;
}