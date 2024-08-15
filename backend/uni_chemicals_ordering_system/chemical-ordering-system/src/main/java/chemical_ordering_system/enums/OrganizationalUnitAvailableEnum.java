package chemical_ordering_system.enums;

import lombok.Getter;

@Getter
public enum OrganizationalUnitAvailableEnum {

    AVAILABLE(1),
    UNAVAILABLE(0),
    OTHER(-1);

    private final Integer code;

    OrganizationalUnitAvailableEnum(Integer code) {
        this.code = code;
    }
}
