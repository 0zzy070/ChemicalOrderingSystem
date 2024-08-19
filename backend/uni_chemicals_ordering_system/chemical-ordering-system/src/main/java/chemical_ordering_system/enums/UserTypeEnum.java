package chemical_ordering_system.enums;

import lombok.Getter;

@Getter
public enum UserTypeEnum {

    ADMINISTRATION("ROLE_ADMIN"),
    RESEARCH_STAFF("ROLE_RESEARCH"),
    SUPERVISOR("ROLE_SUPERVISOR"),
    HIGHER_APPROVE("ROLE_APPROVE"),
    ORDER("ROLE_ORDER");

    private final String type;
    UserTypeEnum( String type) {
        this.type = type;
    }
}
