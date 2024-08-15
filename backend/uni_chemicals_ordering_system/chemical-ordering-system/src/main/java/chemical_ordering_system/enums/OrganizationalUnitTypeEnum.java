package chemical_ordering_system.enums;

import lombok.Getter;

@Getter
public enum OrganizationalUnitTypeEnum {

    INSTITUTES("Institutes", 1),
    STORAGE_LOCATIONS("Storage Locations", 2),
    RESEARCH_CENTRES("Research Centres", 3),
    LABORATORIES("Laboratories", 4);

    private final String displayName;

    private final Integer code;

    OrganizationalUnitTypeEnum(String displayName, Integer code) {
        this.displayName = displayName;
        this.code = code;
    }
}
